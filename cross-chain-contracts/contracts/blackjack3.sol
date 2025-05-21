// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract Blackjack3 is IEntropyConsumer {
    IEntropy public entropy;
    address public provider;
    address public owner;

    uint256 public constant MIN_BET = 1 ether;
    uint256 public constant MAX_BET = 5 ether;
    uint256 public constant MAX_CARDS = 10;
    uint256 public constant CHIP_REWARD = 100;
    uint256 public constant BLACKJACK_CHIP_BOOST = 120; // 20% more
    uint256 public constant MAX_DAILY_CHIPS = 1000;

    enum RequestType {
        StartGame,
        DrawCard
    }
    struct Request {
        address player;
        RequestType requestType;
    }
    mapping(uint64 => Request) public requests;

    struct Game {
        uint8[] cards;
        uint8 sum;
        bool isAlive;
        bool hasBlackjack;
        uint256 betAmount;
    }
    mapping(address => Game) public games;

    struct PlayerStats {
        uint256 wins;
        uint256 gamesPlayed;
        uint256 totalChips;
    }
    mapping(address => PlayerStats) public leaderboard;
    address[] public players;

    mapping(address => uint256) public chips;
    mapping(address => uint256) public chipsEarnedToday;
    mapping(address => uint256) public lastChipClaim;

    event GameStarted(address indexed player);
    event CardDrawn(address indexed player, uint8 card);
    event ChipsTransferred(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event ChipsSpent(address indexed player, uint256 amount);
    event RevenueWithdrawn(address indexed to, uint256 amount);
    event NFTMinted(address indexed player);

    constructor(address _entropy, address _provider) {
        entropy = IEntropy(_entropy);
        provider = _provider;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function getFee() external view returns (uint128) {
        return entropy.getFee(provider);
    }

    function setProvider(address _provider) external onlyOwner {
        provider = _provider;
    }

    function setEntropy(address _entropy) external onlyOwner {
        entropy = IEntropy(_entropy);
    }

    function getEntropyAddress() external view returns (address) {
        return address(entropy);
    }

    function startGame(bytes32 userRandomNumber) external payable {
        Game storage game = games[msg.sender];
        // require(!game.isAlive, "Game in progress");

        uint128 fee = entropy.getFee(provider);
        require(msg.value >= fee + MIN_BET, "Insufficient fee+bet");
        require(msg.value <= MAX_BET + fee, "Bet too high");

        game.cards = new uint8[](0);
        game.sum = 0;
        game.isAlive = true;
        game.hasBlackjack = false;
        game.betAmount = msg.value - fee;

        uint64 seq = entropy.requestWithCallback{value: fee}(
            provider,
            userRandomNumber
        );
        requests[seq] = Request(msg.sender, RequestType.StartGame);

        emit GameStarted(msg.sender);
    }

    function drawCard(bytes32 userRandomNumber) external payable {
        Game storage game = games[msg.sender];
        require(game.isAlive, "No active game");
        require(!game.hasBlackjack, "Blackjack already");

        uint128 fee = entropy.getFee(provider);
        require(msg.value >= fee, "Insufficient fee");

        uint64 seq = entropy.requestWithCallback{value: fee}(
            provider,
            userRandomNumber
        );
        requests[seq] = Request(msg.sender, RequestType.DrawCard);
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address,
        bytes32 randomNumber
    ) internal override {
        Request memory req = requests[sequenceNumber];
        Game storage game = games[req.player];

        if (req.requestType == RequestType.StartGame) {
            uint8 card1 = uint8((uint256(randomNumber) % 13) + 1);
            uint8 card2 = uint8(((uint256(randomNumber) / 100) % 13) + 1);
            card1 = card1 > 10 ? 10 : (card1 == 1 ? 11 : card1);
            card2 = card2 > 10 ? 10 : (card2 == 1 ? 11 : card2);

            game.cards.push(card1);
            game.cards.push(card2);
            game.sum = card1 + card2;

            leaderboard[req.player].gamesPlayed++;
            _trackPlayer(req.player);

            if (game.sum == 21) {
                game.hasBlackjack = true;
                _rewardPlayer(req.player, game.betAmount);
            } else {
                _grantDailyChips(req.player, CHIP_REWARD);
            }
        } else if (req.requestType == RequestType.DrawCard) {
            uint8 card = uint8((uint256(randomNumber) % 13) + 1);
            card = card > 10 ? 10 : (card == 1 ? 11 : card);
            game.cards.push(card);
            game.sum += card;

            if (game.sum == 21) {
                game.hasBlackjack = true;
                _rewardPlayer(req.player, game.betAmount);
            } else if (game.sum > 21) {
                game.isAlive = false;
                _grantDailyChips(req.player, CHIP_REWARD);
            }

            emit CardDrawn(req.player, card);
        }

        delete requests[sequenceNumber];
    }

    function _rewardPlayer(address player, uint256 betAmount) internal {
        uint256 reward = betAmount + (betAmount / 10); // 10%
        require(
            address(this).balance >= reward,
            "Insufficient contract balance"
        );
        payable(player).transfer(reward);
        leaderboard[player].wins++;
        _grantDailyChips(player, (CHIP_REWARD * BLACKJACK_CHIP_BOOST) / 100);
    }

    function _grantDailyChips(address player, uint256 amount) internal {
        if (block.timestamp > lastChipClaim[player] + 1 days) {
            chipsEarnedToday[player] = 0;
            lastChipClaim[player] = block.timestamp;
        }
        if (chipsEarnedToday[player] + amount > MAX_DAILY_CHIPS) {
            amount = MAX_DAILY_CHIPS - chipsEarnedToday[player];
        }
        chips[player] += amount;
        chipsEarnedToday[player] += amount;
        leaderboard[player].totalChips += amount;
    }

    function _trackPlayer(address player) internal {
        if (leaderboard[player].gamesPlayed == 1) {
            players.push(player);
        }
    }

    function resetGame() external {
        Game storage game = games[msg.sender];
        require(
            !game.isAlive || game.hasBlackjack || game.sum > 21,
            "Game still active"
        );
        delete games[msg.sender];
    }

    function transferChips(address to, uint256 amount) external {
        require(chips[msg.sender] >= amount, "Insufficient chips");
        chips[msg.sender] -= amount;
        chips[to] += amount;
        emit ChipsTransferred(msg.sender, to, amount);
    }

    function spendChips(uint256 amount) external {
        require(chips[msg.sender] >= amount, "Insufficient chips");
        // To do some ingame logic
        chips[msg.sender] -= amount;
        emit ChipsSpent(msg.sender, amount);
    }

    function withdrawRevenue(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        to.transfer(balance);
        emit RevenueWithdrawn(to, balance);
    }

    function mintNFT() external {
        require(chips[msg.sender] >= 10000, "Not enough chips for NFT");
        // TODO: Integrate NFT minting contract call here
        emit NFTMinted(msg.sender);
    }

    function getTopPlayers(
        uint256 limit
    ) external view returns (address[] memory top, uint256[] memory scores) {
        uint256 len = players.length < limit ? players.length : limit;
        top = new address[](len);
        scores = new uint256[](len);
        for (uint256 i = 0; i < players.length; i++) {
            address p = players[i];
            uint256 score = leaderboard[p].totalChips;
            for (uint256 j = 0; j < len; j++) {
                if (score > scores[j]) {
                    for (uint256 k = len - 1; k > j; k--) {
                        scores[k] = scores[k - 1];
                        top[k] = top[k - 1];
                    }
                    scores[j] = score;
                    top[j] = p;
                    break;
                }
            }
        }
    }

    function getGameState(
        address player
    ) external view returns (uint8[] memory, uint8, bool, bool, uint256) {
        Game storage game = games[player];
        return (
            game.cards,
            game.sum,
            game.isAlive,
            game.hasBlackjack,
            game.betAmount
        );
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
}
