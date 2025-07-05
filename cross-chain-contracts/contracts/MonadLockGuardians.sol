// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/ILockable.sol";

/**
 * @title MonadLock Guardians
 * @dev Novel NFT collection implementing ILockable with Monad-inspired mechanics
 *
 * MonadLock Guardians are digital protectors of Monad's parallel processing capabilities.
 * Each Guardian has unique abilities that evolve based on their lending and locking history.
 *
 * Features:
 * - Dynamic visual states based on lock status
 * - Experience system tied to lending activities
 * - Special abilities that unlock through participation
 * - Monad lore integration
 */
contract MonadLockGuardians is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    ILockable
{
    using Strings for uint256;

    struct LockInfo {
        bool active;
        address manager;
        uint256 lockTimestamp;
        uint256 duration;
    }

    struct GuardianStats {
        uint256 experience; // XP gained from lending activities
        uint256 totalLocks; // Total times locked
        uint256 totalLendingTime; // Total time spent in lending
        uint256 lastLendingActivity; // Last lending activity timestamp
        uint8 guardianLevel; // Guardian level (1-10)
        bool hasParallelAbility; // Unlocked parallel processing ability
        bool hasLockMastery; // Unlocked lock mastery ability
    }

    mapping(uint256 => LockInfo) private locks;
    mapping(uint256 => GuardianStats) public guardianStats;

    uint256 public nextTokenId;
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant MINT_PRICE = 0.01 ether;

    // Experience thresholds for leveling up
    uint256 public constant XP_PER_LOCK = 10;
    uint256 public constant XP_PER_DAY_LOCKED = 5;
    uint256 public constant XP_LEVEL_THRESHOLD = 100;

    // Metadata
    string public baseTokenURI;
    string public lockedTokenURI;
    string public unlockedTokenURI;

    // Events
    event GuardianLocked(
        uint256 indexed tokenId,
        address indexed manager,
        uint256 duration,
        uint256 experience
    );
    event EmergencyUnlocked(uint256 indexed tokenId, address indexed manager);
    event GuardianUnlocked(uint256 indexed tokenId, uint256 experience);
    event GuardianLevelUp(uint256 indexed tokenId, uint8 newLevel);
    event AbilityUnlocked(uint256 indexed tokenId, string ability);
    event ExperienceGained(
        uint256 indexed tokenId,
        uint256 amount,
        string reason
    );

    constructor() ERC721("MonadLock Guardians", "MLG") Ownable() {
        baseTokenURI = "https://api.monadlock.com/metadata/";
        lockedTokenURI = "https://api.monadlock.com/locked/";
        unlockedTokenURI = "https://api.monadlock.com/unlocked/";
    }

    /**
     * @dev Mint a new Guardian
     * @param to Address to mint to
     */
    function mintGuardian(address to) external payable returns (uint256) {
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(to != address(0), "Invalid address");

        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);

        // Initialize Guardian stats
        guardianStats[tokenId] = GuardianStats({
            experience: 0,
            totalLocks: 0,
            totalLendingTime: 0,
            lastLendingActivity: 0,
            guardianLevel: 1,
            hasParallelAbility: false,
            hasLockMastery: false
        });

        nextTokenId++;
        return tokenId;
    }

    /**
     * @dev Lock a Guardian for lending purposes
     * @param tokenId The Guardian to lock
     * @param manager The lending contract or manager
     * @param durationInSeconds Lock duration
     */
    function lock(
        uint256 tokenId,
        address manager,
        uint256 durationInSeconds
    ) external override {
        require(durationInSeconds > 0, "Duration must be greater than 0");
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Not owner nor approved"
        );
        require(!locks[tokenId].active, "Already locked");
        require(manager != address(0), "Invalid manager address");

        locks[tokenId] = LockInfo({
            active: true,
            manager: manager,
            lockTimestamp: block.timestamp,
            duration: durationInSeconds
        });

        // Update Guardian stats
        GuardianStats storage stats = guardianStats[tokenId];
        stats.totalLocks++;
        stats.lastLendingActivity = block.timestamp;

        // Award experience for locking
        _awardExperience(tokenId, XP_PER_LOCK, "Locking Guardian");

        emit GuardianLocked(
            tokenId,
            manager,
            durationInSeconds,
            stats.experience
        );
    }

    /**
     * @dev Unlock a Guardian
     * @param tokenId The Guardian to unlock
     */
    function unlock(uint256 tokenId) external override {
        LockInfo storage lockInfo = locks[tokenId];
        require(lockInfo.active, "Not locked");
        require(msg.sender == lockInfo.manager, "Not authorized manager");

        // Calculate lending time and award experience
        uint256 lendingTime = block.timestamp - lockInfo.lockTimestamp;
        uint256 daysLocked = lendingTime / 1 days;

        GuardianStats storage stats = guardianStats[tokenId];
        stats.totalLendingTime += lendingTime;

        // Award experience for time spent locked
        if (daysLocked > 0) {
            _awardExperience(
                tokenId,
                daysLocked * XP_PER_DAY_LOCKED,
                "Lending Duration"
            );
        }

        // Clear lock info
        lockInfo.active = false;
        lockInfo.manager = address(0);
        lockInfo.lockTimestamp = 0;
        lockInfo.duration = 0;

        emit GuardianUnlocked(tokenId, stats.experience);
    }

    /**
     * @dev Unlock and transfer Guardian (for lending liquidation)
     * @param to Recipient address
     * @param tokenId Guardian to transfer
     */
    function unlockAndTransfer(address to, uint256 tokenId) external override {
        require(isLocked(tokenId), "Guardian not locked");
        require(msg.sender == locks[tokenId].manager, "Not authorized manager");

        // Clear lock info
        locks[tokenId].active = false;
        locks[tokenId].manager = address(0);
        locks[tokenId].lockTimestamp = 0;
        locks[tokenId].duration = 0;

        _transfer(ownerOf(tokenId), to, tokenId);

        // Award experience for successful lending completion
        _awardExperience(tokenId, XP_PER_LOCK * 2, "Lending Completion");
    }

    /**
     * @dev Emergency unlock after 365 days
     * @param tokenId Guardian to emergency unlock
     */
    function emergencyUnlock(uint256 tokenId) external override {
        LockInfo storage lockInfo = locks[tokenId];
        require(lockInfo.active, "Not locked");
        require(
            block.timestamp >= lockInfo.lockTimestamp + 365 days,
            "Emergency unlock not allowed yet"
        );

        lockInfo.active = false;
        lockInfo.manager = address(0);
        lockInfo.lockTimestamp = 0;
        lockInfo.duration = 0;

        emit EmergencyUnlocked(tokenId, msg.sender);
    }

    /**
     * @dev Check if Guardian is locked
     * @param tokenId Guardian to check
     */
    function isLocked(uint256 tokenId) public view override returns (bool) {
        return locks[tokenId].active;
    }

    /**
     * @dev Get lock information
     * @param tokenId Guardian to get info for
     */
    function getLockInfo(
        uint256 tokenId
    )
        external
        view
        override
        returns (
            bool locked,
            address manager,
            uint256 lockTimestamp,
            uint256 duration
        )
    {
        LockInfo storage info = locks[tokenId];
        return (info.active, info.manager, info.lockTimestamp, info.duration);
    }

    /**
     * @dev Get Guardian's current stats
     * @param tokenId Guardian to get stats for
     */
    function getGuardianStats(
        uint256 tokenId
    ) external view returns (GuardianStats memory) {
        return guardianStats[tokenId];
    }

    /**
     * @dev Award experience to a Guardian
     * @param tokenId Guardian to award XP to
     * @param amount Amount of XP to award
     * @param reason Reason for XP award
     */
    function _awardExperience(
        uint256 tokenId,
        uint256 amount,
        string memory reason
    ) internal {
        GuardianStats storage stats = guardianStats[tokenId];
        stats.experience += amount;

        // Check for level up
        uint8 newLevel = uint8((stats.experience / XP_LEVEL_THRESHOLD) + 1);
        if (newLevel > stats.guardianLevel) {
            stats.guardianLevel = newLevel;
            emit GuardianLevelUp(tokenId, newLevel);

            // Unlock abilities at certain levels
            if (newLevel >= 5 && !stats.hasParallelAbility) {
                stats.hasParallelAbility = true;
                emit AbilityUnlocked(tokenId, "Parallel Processing");
            }

            if (newLevel >= 8 && !stats.hasLockMastery) {
                stats.hasLockMastery = true;
                emit AbilityUnlocked(tokenId, "Lock Mastery");
            }
        }

        emit ExperienceGained(tokenId, amount, reason);
    }

    /**
     * @dev Get token URI based on lock status and Guardian stats
     * @param tokenId Guardian to get URI for
     */
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId), "Guardian does not exist");

        GuardianStats memory stats = guardianStats[tokenId];
        bool isCurrentlyLocked = isLocked(tokenId);

        // Dynamic URI based on lock status and level
        if (isCurrentlyLocked) {
            return
                string(
                    abi.encodePacked(
                        lockedTokenURI,
                        tokenId.toString(),
                        "?level=",
                        uint256(stats.guardianLevel).toString(),
                        "&locked=true"
                    )
                );
        } else {
            return
                string(
                    abi.encodePacked(
                        unlockedTokenURI,
                        tokenId.toString(),
                        "?level=",
                        uint256(stats.guardianLevel).toString(),
                        "&locked=false"
                    )
                );
        }
    }

    /**
     * @dev Override transfer functions to prevent locked Guardian transfers
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        // Check if the token is locked (only for transfers, not minting)
        if (from != address(0) && to != address(0)) {
            require(!isLocked(firstTokenId), "Guardian is locked");
        }
    }

    function _burn(
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev Prevent approval of locked Guardians
     */
    function approve(
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        require(!isLocked(tokenId), "Guardian is locked");
        super.approve(to, tokenId);
    }

    /**
     * @dev Support for ILockable interface
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721, ERC721Enumerable, ERC721URIStorage, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(ILockable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Required override for ERC721Enumerable
     */
    function totalSupply()
        public
        view
        virtual
        override(ERC721Enumerable)
        returns (uint256)
    {
        return super.totalSupply();
    }

    /**
     * @dev Update base URI (owner only)
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
    }

    /**
     * @dev Update locked URI (owner only)
     */
    function setLockedURI(string memory newLockedURI) external onlyOwner {
        lockedTokenURI = newLockedURI;
    }

    /**
     * @dev Update unlocked URI (owner only)
     */
    function setUnlockedURI(string memory newUnlockedURI) external onlyOwner {
        unlockedTokenURI = newUnlockedURI;
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Helper function to check if caller is approved or owner
     */
    function _isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) internal view virtual override returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }
}
