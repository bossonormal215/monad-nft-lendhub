// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract Blackjack is IEntropyConsumer {
    IEntropy public entropy;
    address public provider;

    uint256 public constant MIN_BET = 1 ether;
    uint256 public constant MAX_BET = 5 ether;
    uint256 public constant MAX_CARDS = 10;

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
        uint256 chips;
    }
    mapping(address => Game) public games;

    event GameStarted(address indexed player);
    event CardDrawn(address indexed player, uint8 card);

    constructor(address _entropy, address _provider) {
        entropy = IEntropy(_entropy);
        provider = _provider;
    }

    function getFee() external view returns (uint128) {
        return entropy.getFee(provider);
    }

    function setProvider(address _provider) external {
        provider = _provider;
    }

    function setEntropy(address _entropy) external {
        entropy = IEntropy(_entropy);
    }

    function getEntropyAddress() external view returns (address) {
        return address(entropy);
    }

    function startGame(bytes32 userRandomNumber) external payable {
        Game storage game = games[msg.sender];
        require(!game.isAlive, "Game already in progress");
        game.cards = new uint8[](0);
        game.sum = 0;
        game.isAlive = true;
        game.hasBlackjack = false;
        game.chips = 200;
        uint128 fee = entropy.getFee(provider);
        require(msg.value >= fee + MIN_BET, "Not enough fee");
        require(msg.value <= MAX_BET, "Bet exceeds maximum");
        require(game.cards.length < MAX_CARDS, "Max cards reached");
        game.chips += msg.value - fee;
        require(game.chips <= MAX_BET, "Bet exceeds maximum");
        require(game.chips >= MIN_BET, "Bet below minimum");
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
        require(!game.hasBlackjack, "Already have Blackjack");
        uint128 fee = entropy.getFee(provider);
        require(msg.value >= fee, "Not enough fee");
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
            if (game.sum == 21) {
                game.hasBlackjack = true;
            }
        } else if (req.requestType == RequestType.DrawCard) {
            uint8 card = uint8((uint256(randomNumber) % 13) + 1);
            card = card > 10 ? 10 : (card == 1 ? 11 : card);
            game.cards.push(card);
            game.sum += card;
            if (game.sum == 21) {
                game.hasBlackjack = true;
            } else if (game.sum > 21) {
                game.isAlive = false;
            }
            emit CardDrawn(req.player, card);
        }
        delete requests[sequenceNumber];
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
            game.chips
        );
    }

    function resetGame() external {
        Game storage game = games[msg.sender];
        require(
            !game.isAlive || game.hasBlackjack || game.sum > 21,
            "Game still active"
        );
        delete games[msg.sender];
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
}
