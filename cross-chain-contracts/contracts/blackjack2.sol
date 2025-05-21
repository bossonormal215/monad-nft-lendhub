// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract Blackjack2 is IEntropyConsumer {
    IEntropy public entropy;
    address public provider;
    address public owner;

    uint256 public constant MIN_BET = 1 ether;
    uint256 public constant MAX_BET = 5 ether;
    uint256 public constant MAX_CARDS = 10;

    uint256 public baseChipReward = 50;
    uint256 public blackjackBonusPercent = 20;

    struct Game {
        uint8[] cards;
        uint8 sum;
        bool isAlive;
        bool hasBlackjack;
        uint256 chips; // Stores the MON bet amount
    }

    enum RequestType {
        StartGame,
        DrawCard
    }

    struct Request {
        address player;
        RequestType requestType;
    }

    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 gamesWon;
        uint256 totalChipsEarned;
    }

    struct LeaderboardPeriod {
        uint256 startTime;
        uint256 endTime;
        mapping(address => PlayerStats) stats;
        address[] rankedPlayers; // Sorted by gamesWon, then totalChipsEarned
    }

    mapping(uint64 => Request) public requests;
    mapping(address => Game) public games;
    mapping(address => uint256) public chipBalances;
    mapping(uint256 => LeaderboardPeriod) public leaderboardPeriods;
    uint256 public currentPeriod;
    address[] public allPlayers;

    uint256 public contractBalance;
    mapping(address => uint256) public pendingRewards; // For leaderboard bonuses

    event GameStarted(address indexed player);
    event CardDrawn(address indexed player, uint8 card);
    event Payout(address indexed player, uint256 amount);
    event ChipsAwarded(address indexed player, uint256 amount);
    event LeaderboardUpdated(
        uint256 indexed period,
        address indexed player,
        uint256 gamesWon,
        uint256 totalChipsEarned
    );
    event LeaderboardReset(
        uint256 indexed period,
        uint256 startTime,
        uint256 endTime
    );
    event LeaderboardRewardsDistributed(
        uint256 indexed period,
        address[] winners,
        uint256[] amounts
    );

    constructor(address _entropy, address _provider) {
        entropy = IEntropy(_entropy);
        provider = _provider;
        owner = msg.sender;
        // Initialize first leaderboard period
        currentPeriod = 1;
        leaderboardPeriods[currentPeriod].startTime = block.timestamp;
        leaderboardPeriods[currentPeriod].endTime = block.timestamp + 30 days; // Monthly reset
        emit LeaderboardReset(
            currentPeriod,
            block.timestamp,
            block.timestamp + 30 days
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
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
        require(!game.isAlive, "Game in progress");

        uint128 fee = entropy.getFee(provider);
        require(
            msg.value >= fee + MIN_BET && msg.value <= MAX_BET + fee,
            "Invalid bet"
        );

        game.cards = new uint8[](0);
        game.sum = 0;
        game.isAlive = true;
        game.hasBlackjack = false;
        game.chips = msg.value - fee;

        contractBalance += msg.value - fee;

        uint64 seq = entropy.requestWithCallback{value: fee}(
            provider,
            userRandomNumber
        );
        requests[seq] = Request(msg.sender, RequestType.StartGame);

        // Update leaderboard stats
        LeaderboardPeriod storage period = leaderboardPeriods[currentPeriod];
        period.stats[msg.sender].gamesPlayed++;
        if (period.stats[msg.sender].gamesPlayed == 1) {
            allPlayers.push(msg.sender);
            period.rankedPlayers.push(msg.sender);
        }

        emit GameStarted(msg.sender);
    }

    function drawCard(bytes32 userRandomNumber) external payable {
        Game storage game = games[msg.sender];
        require(game.isAlive, "No active game");

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
        LeaderboardPeriod storage period = leaderboardPeriods[currentPeriod];

        if (req.requestType == RequestType.StartGame) {
            uint8 card1 = uint8((uint256(randomNumber) % 13) + 1);
            uint8 card2 = uint8(((uint256(randomNumber) / 100) % 13) + 1);
            card1 = card1 > 10 ? 10 : (card1 == 1 ? 11 : card1);
            card2 = card2 > 10 ? 10 : (card2 == 1 ? 11 : card2);
            game.cards.push(card1);
            game.cards.push(card2);
            game.sum = card1 + card2;

            if (game.sum == 21) {
                game.hasBlackjack = true;
                uint256 payout = game.chips + (game.chips / 10); // 10% bonus
                require(
                    address(this).balance >= payout,
                    "Insufficient balance"
                );
                contractBalance -= payout;
                payable(req.player).transfer(payout);
                emit Payout(req.player, payout);

                period.stats[req.player].gamesWon++;
                period.stats[req.player].totalChipsEarned += payout;
                updateLeaderboard(req.player);

                uint256 chipReward = baseChipReward +
                    (baseChipReward * blackjackBonusPercent) /
                    100;
                chipBalances[req.player] += chipReward;
                emit ChipsAwarded(req.player, chipReward);
            } else {
                chipBalances[req.player] += baseChipReward;
                emit ChipsAwarded(req.player, baseChipReward);
            }
        } else if (req.requestType == RequestType.DrawCard) {
            uint8 card = uint8((uint256(randomNumber) % 13) + 1);
            card = card > 10 ? 10 : (card == 1 ? 11 : card);
            game.cards.push(card);
            game.sum += card;

            if (game.sum == 21) {
                game.hasBlackjack = true;
                uint256 payout = game.chips + (game.chips / 10);
                require(
                    address(this).balance >= payout,
                    "Insufficient balance"
                );
                contractBalance -= payout;
                payable(req.player).transfer(payout);
                emit Payout(req.player, payout);

                period.stats[req.player].gamesWon++;
                period.stats[req.player].totalChipsEarned += payout;
                updateLeaderboard(req.player);

                uint256 chipReward = baseChipReward +
                    (baseChipReward * blackjackBonusPercent) /
                    100;
                chipBalances[req.player] += chipReward;
                emit ChipsAwarded(req.player, chipReward);
            } else if (game.sum > 21) {
                game.isAlive = false;
                chipBalances[req.player] += baseChipReward;
                emit ChipsAwarded(req.player, baseChipReward);
            } else {
                chipBalances[req.player] += baseChipReward;
                emit ChipsAwarded(req.player, baseChipReward);
            }
            emit CardDrawn(req.player, card);
        }
        delete requests[sequenceNumber];
    }

    function resetGame() external {
        Game storage game = games[msg.sender];
        require(
            !game.isAlive || game.sum > 21 || game.hasBlackjack,
            "Game active"
        );
        delete games[msg.sender];
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
            chipBalances[player]
        );
    }

    // Enhanced Leaderboard Functions
    function updateLeaderboard(address player) internal {
        LeaderboardPeriod storage period = leaderboardPeriods[currentPeriod];
        // Bubble sort for simplicity (optimize for gas in production)
        for (uint256 i = 0; i < period.rankedPlayers.length; i++) {
            if (period.rankedPlayers[i] == player) {
                // Move player up if they have more wins or same wins but more chips
                for (uint256 j = i; j > 0; j--) {
                    address prevPlayer = period.rankedPlayers[j - 1];
                    if (
                        period.stats[player].gamesWon >
                        period.stats[prevPlayer].gamesWon ||
                        (period.stats[player].gamesWon ==
                            period.stats[prevPlayer].gamesWon &&
                            period.stats[player].totalChipsEarned >
                            period.stats[prevPlayer].totalChipsEarned)
                    ) {
                        // Swap
                        period.rankedPlayers[j] = prevPlayer;
                        period.rankedPlayers[j - 1] = player;
                    } else {
                        break;
                    }
                }
                break;
            }
        }
        emit LeaderboardUpdated(
            currentPeriod,
            player,
            period.stats[player].gamesWon,
            period.stats[player].totalChipsEarned
        );
    }

    function resetLeaderboard() external onlyOwner {
        require(
            block.timestamp >= leaderboardPeriods[currentPeriod].endTime,
            "Period not ended"
        );
        // Distribute rewards to top 3 players
        address[] memory winners = new address[](3);
        uint256[] memory amounts = new uint256[](3);
        LeaderboardPeriod storage period = leaderboardPeriods[currentPeriod];
        for (uint256 i = 0; i < 3 && i < period.rankedPlayers.length; i++) {
            winners[i] = period.rankedPlayers[i];
            amounts[i] = i == 0 ? 0.5 ether : i == 1 ? 0.3 ether : 0.2 ether; // Example rewards
            if (winners[i] != address(0)) {
                pendingRewards[winners[i]] += amounts[i];
            }
        }
        emit LeaderboardRewardsDistributed(currentPeriod, winners, amounts);

        // Start new period
        currentPeriod++;
        leaderboardPeriods[currentPeriod].startTime = block.timestamp;
        leaderboardPeriods[currentPeriod].endTime = block.timestamp + 30 days;
        // Copy players to new period
        for (uint256 i = 0; i < allPlayers.length; i++) {
            leaderboardPeriods[currentPeriod].rankedPlayers.push(allPlayers[i]);
        }
        emit LeaderboardReset(
            currentPeriod,
            block.timestamp,
            block.timestamp + 30 days
        );
    }

    function getTopPlayers(
        uint256 count
    ) external view returns (address[] memory, PlayerStats[] memory) {
        LeaderboardPeriod storage period = leaderboardPeriods[currentPeriod];
        uint256 n = period.rankedPlayers.length < count
            ? period.rankedPlayers.length
            : count;
        address[] memory topPlayers = new address[](n);
        PlayerStats[] memory stats = new PlayerStats[](n);
        for (uint256 i = 0; i < n; i++) {
            topPlayers[i] = period.rankedPlayers[i];
            stats[i] = period.stats[topPlayers[i]];
        }
        return (topPlayers, stats);
    }

    function getPlayerStats(
        address player,
        uint256 period
    ) external view returns (PlayerStats memory) {
        return leaderboardPeriods[period].stats[player];
    }

    function claimLeaderboardRewards() external {
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        require(address(this).balance >= amount, "Insufficient balance");
        pendingRewards[msg.sender] = 0;
        contractBalance -= amount;
        payable(msg.sender).transfer(amount);
        emit Payout(msg.sender, amount);
    }

    function withdrawRevenue(
        address payable to,
        uint256 amount
    ) external onlyOwner {
        require(amount <= contractBalance, "Exceeds contract balance");
        contractBalance -= amount;
        to.transfer(amount);
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    receive() external payable {
        contractBalance += msg.value;
    }
}
