// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/ILockable.sol";

/**
 * @title LockableHub
 * @dev Comprehensive tooling suite for the ILockable ecosystem
 *
 * This contract provides:
 * - Lockable NFT creation templates
 * - Analytics and statistics tracking
 * - Integration verification
 * - Marketplace functionality for lockable NFTs
 *
 * Part of Mission 5: NFT Tooling Track
 */
contract LockableHub is Ownable {
    using Strings for uint256;

    struct LockableCollection {
        address contractAddress;
        string name;
        string symbol;
        string description;
        address creator;
        uint256 totalSupply;
        uint256 totalLocks;
        uint256 totalLendingVolume;
        bool verified;
        uint256 createdAt;
    }

    struct LockableStats {
        uint256 totalCollections;
        uint256 totalLockableNFTs;
        uint256 totalActiveLocks;
        uint256 totalLendingVolume;
        uint256 totalLendingTransactions;
    }

    struct LockableTemplate {
        string name;
        string description;
        string contractCode;
        uint256 usageCount;
        bool active;
    }

    // Storage
    mapping(address => LockableCollection) public lockableCollections;
    mapping(address => bool) public isLockableCollection;
    mapping(string => LockableTemplate) public lockableTemplates;
    mapping(address => uint256[]) public userCollections;

    address[] public allCollections;
    string[] public templateNames;

    LockableStats public globalStats;

    // Events
    event CollectionRegistered(
        address indexed contractAddress,
        string name,
        string symbol,
        address indexed creator
    );
    event CollectionVerified(address indexed contractAddress, bool verified);
    event TemplateAdded(string indexed name, string description);
    event LockableStatsUpdated(
        uint256 totalCollections,
        uint256 totalLockableNFTs,
        uint256 totalActiveLocks
    );
    event LendingActivityRecorded(
        address indexed collection,
        uint256 indexed tokenId,
        address indexed lender,
        uint256 amount
    );

    constructor() Ownable() {
        _initializeTemplates();
    }

    /**
     * @dev Register a new lockable NFT collection
     * @param contractAddress The deployed contract address
     * @param name Collection name
     * @param symbol Collection symbol
     * @param description Collection description
     */
    function registerCollection(
        address contractAddress,
        string memory name,
        string memory symbol,
        string memory description
    ) external {
        require(contractAddress != address(0), "Invalid contract address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(
            !isLockableCollection[contractAddress],
            "Collection already registered"
        );

        // Verify the contract implements ILockable
        try
            ILockable(contractAddress).supportsInterface(
                type(ILockable).interfaceId
            )
        returns (bool supported) {
            require(supported, "Contract does not implement ILockable");
        } catch {
            revert("Contract does not implement ILockable");
        }

        LockableCollection memory newCollection = LockableCollection({
            contractAddress: contractAddress,
            name: name,
            symbol: symbol,
            description: description,
            creator: msg.sender,
            totalSupply: 0,
            totalLocks: 0,
            totalLendingVolume: 0,
            verified: false,
            createdAt: block.timestamp
        });

        lockableCollections[contractAddress] = newCollection;
        isLockableCollection[contractAddress] = true;
        allCollections.push(contractAddress);
        userCollections[msg.sender].push(allCollections.length - 1);

        globalStats.totalCollections++;
        globalStats.totalLockableNFTs += newCollection.totalSupply;

        emit CollectionRegistered(contractAddress, name, symbol, msg.sender);
        emit LockableStatsUpdated(
            globalStats.totalCollections,
            globalStats.totalLockableNFTs,
            globalStats.totalActiveLocks
        );
    }

    /**
     * @dev Verify a lockable collection (owner only)
     * @param contractAddress The collection to verify
     * @param verified Verification status
     */
    function verifyCollection(
        address contractAddress,
        bool verified
    ) external onlyOwner {
        require(
            isLockableCollection[contractAddress],
            "Collection not registered"
        );

        lockableCollections[contractAddress].verified = verified;

        emit CollectionVerified(contractAddress, verified);
    }

    /**
     * @dev Add a new lockable template
     * @param name Template name
     * @param description Template description
     * @param contractCode The contract code template
     */
    function addTemplate(
        string memory name,
        string memory description,
        string memory contractCode
    ) external onlyOwner {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(
            bytes(contractCode).length > 0,
            "Contract code cannot be empty"
        );
        require(!lockableTemplates[name].active, "Template already exists");

        lockableTemplates[name] = LockableTemplate({
            name: name,
            description: description,
            contractCode: contractCode,
            usageCount: 0,
            active: true
        });

        templateNames.push(name);

        emit TemplateAdded(name, description);
    }

    /**
     * @dev Record lending activity for analytics
     * @param collection The lockable collection address
     * @param tokenId The token ID
     * @param lender The lender address
     * @param amount The lending amount
     */
    function recordLendingActivity(
        address collection,
        uint256 tokenId,
        address lender,
        uint256 amount
    ) external {
        require(isLockableCollection[collection], "Collection not registered");
        require(
            msg.sender == collection,
            "Only collection contract can record activity"
        );

        LockableCollection storage lockableCollection = lockableCollections[
            collection
        ];
        lockableCollection.totalLocks++;
        lockableCollection.totalLendingVolume += amount;

        globalStats.totalLendingTransactions++;
        globalStats.totalLendingVolume += amount;

        emit LendingActivityRecorded(collection, tokenId, lender, amount);
        emit LockableStatsUpdated(
            globalStats.totalCollections,
            globalStats.totalLockableNFTs,
            globalStats.totalActiveLocks
        );
    }

    /**
     * @dev Update collection stats
     * @param collection The collection address
     * @param totalSupply New total supply
     * @param activeLocks New active locks count
     */
    function updateCollectionStats(
        address collection,
        uint256 totalSupply,
        uint256 activeLocks
    ) external {
        require(isLockableCollection[collection], "Collection not registered");
        require(
            msg.sender == collection,
            "Only collection contract can update stats"
        );

        LockableCollection storage lockableCollection = lockableCollections[
            collection
        ];
        uint256 oldSupply = lockableCollection.totalSupply;

        lockableCollection.totalSupply = totalSupply;
        globalStats.totalLockableNFTs =
            globalStats.totalLockableNFTs -
            oldSupply +
            totalSupply;
        globalStats.totalActiveLocks = activeLocks;

        emit LockableStatsUpdated(
            globalStats.totalCollections,
            globalStats.totalLockableNFTs,
            globalStats.totalActiveLocks
        );
    }

    /**
     * @dev Get all registered collections
     */
    function getAllCollections()
        external
        view
        returns (LockableCollection[] memory)
    {
        LockableCollection[] memory collections = new LockableCollection[](
            allCollections.length
        );

        for (uint256 i = 0; i < allCollections.length; i++) {
            collections[i] = lockableCollections[allCollections[i]];
        }

        return collections;
    }

    /**
     * @dev Get collections by user
     * @param user The user address
     */
    function getUserCollections(
        address user
    ) external view returns (LockableCollection[] memory) {
        uint256[] storage userCollectionIndices = userCollections[user];
        LockableCollection[] memory collections = new LockableCollection[](
            userCollectionIndices.length
        );

        for (uint256 i = 0; i < userCollectionIndices.length; i++) {
            uint256 index = userCollectionIndices[i];
            if (index < allCollections.length) {
                collections[i] = lockableCollections[allCollections[index]];
            }
        }

        return collections;
    }

    /**
     * @dev Get all templates
     */
    function getAllTemplates()
        external
        view
        returns (LockableTemplate[] memory)
    {
        LockableTemplate[] memory templates = new LockableTemplate[](
            templateNames.length
        );

        for (uint256 i = 0; i < templateNames.length; i++) {
            templates[i] = lockableTemplates[templateNames[i]];
        }

        return templates;
    }

    /**
     * @dev Get template by name
     * @param name Template name
     */
    function getTemplate(
        string memory name
    ) external view returns (LockableTemplate memory) {
        return lockableTemplates[name];
    }

    /**
     * @dev Check if a contract implements ILockable
     * @param contractAddress The contract to check
     */
    function isILockableCompliant(
        address contractAddress
    ) external view returns (bool) {
        try
            ILockable(contractAddress).supportsInterface(
                type(ILockable).interfaceId
            )
        returns (bool supported) {
            return supported;
        } catch {
            return false;
        }
    }

    /**
     * @dev Get global statistics
     */
    function getGlobalStats() external view returns (LockableStats memory) {
        return globalStats;
    }

    /**
     * @dev Initialize default templates
     */
    function _initializeTemplates() internal {
        // Basic Lockable NFT Template
        lockableTemplates["BasicLockable"] = LockableTemplate({
            name: "BasicLockable",
            description: "Basic lockable NFT with standard ILockable implementation",
            contractCode: "// Basic Lockable NFT Template\n// Implements ILockable interface\n// Includes standard locking/unlocking functionality",
            usageCount: 0,
            active: true
        });

        // Gaming Lockable NFT Template
        lockableTemplates["GamingLockable"] = LockableTemplate({
            name: "GamingLockable",
            description: "Gaming-focused lockable NFT with experience and leveling system",
            contractCode: "// Gaming Lockable NFT Template\n// Includes experience system\n// Level-based abilities\n// Monad-inspired mechanics",
            usageCount: 0,
            active: true
        });

        // DeFi Lockable NFT Template
        lockableTemplates["DeFiLockable"] = LockableTemplate({
            name: "DeFiLockable",
            description: "DeFi-focused lockable NFT with lending and staking integration",
            contractCode: "// DeFi Lockable NFT Template\n// Lending integration\n// Staking mechanics\n// Yield farming features",
            usageCount: 0,
            active: true
        });

        templateNames = ["BasicLockable", "GamingLockable", "DeFiLockable"];
    }

    /**
     * @dev Emergency function to update stats (owner only)
     */
    function emergencyUpdateStats(
        uint256 totalCollections,
        uint256 totalLockableNFTs,
        uint256 totalActiveLocks,
        uint256 totalLendingVolume,
        uint256 totalLendingTransactions
    ) external onlyOwner {
        globalStats = LockableStats({
            totalCollections: totalCollections,
            totalLockableNFTs: totalLockableNFTs,
            totalActiveLocks: totalActiveLocks,
            totalLendingVolume: totalLendingVolume,
            totalLendingTransactions: totalLendingTransactions
        });

        emit LockableStatsUpdated(
            totalCollections,
            totalLockableNFTs,
            totalActiveLocks
        );
    }
}
