// SPDX-License-Identifier: MIT
/* pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollateralVault is Ownable {
    struct Collateral {
        address nftAddress;
        uint256 tokenId;
        address owner;
        uint256 loanAmount;
        bool isActive;
    }

    mapping(uint256 => Collateral) public collaterals;
    uint256 public collateralCounter;

    event NFTDeposited(
        address indexed user,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 loanAmount
    );
    event NFTWithdrawn(address indexed user, uint256 indexed collateralId);

    function depositNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 loanAmount
    ) external {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        collateralCounter++;

        collaterals[collateralCounter] = Collateral({
            nftAddress: nftAddress,
            tokenId: tokenId,
            owner: msg.sender,
            loanAmount: loanAmount,
            isActive: true
        });

        emit NFTDeposited(msg.sender, nftAddress, tokenId, loanAmount);
    }

    function withdrawNFT(uint256 collateralId) external {
        require(collaterals[collateralId].owner == msg.sender, "Not NFT owner");
        require(collaterals[collateralId].isActive, "Collateral inactive");

        IERC721(collaterals[collateralId].nftAddress).transferFrom(
            address(this),
            msg.sender,
            collaterals[collateralId].tokenId
        );
        collaterals[collateralId].isActive = false;

        emit NFTWithdrawn(msg.sender, collateralId);
    }
}
*/
///////////////////////////////////////////
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollateralVault is Ownable {
    struct Collateral {
        address nftAddress;
        uint256 tokenId;
        address owner;
        uint256 maxLoanAmount; // Maximum amount that can be borrowed
        uint256 currentLoanAmount; // Current borrowed amount
        bool isActive;
    }

    // State variables
    mapping(uint256 => Collateral) public collaterals;
    mapping(address => uint256[]) public userCollaterals;
    mapping(address => bool) public whitelistedNFTs;
    uint256 public collateralCounter;

    // Events
    event NFTDeposited(
        address indexed user,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 maxLoanAmount,
        uint256 indexed collateralId
    );
    event NFTWithdrawn(address indexed user, uint256 indexed collateralId);
    event NFTWhitelisted(address indexed nftAddress);
    event NFTBlacklisted(address indexed nftAddress);

    // Modifiers
    modifier onlyCollateralOwner(uint256 collateralId) {
        require(collaterals[collateralId].owner == msg.sender, "Not NFT owner");
        _;
    }

    modifier collateralExists(uint256 collateralId) {
        require(
            collateralId > 0 && collateralId <= collateralCounter,
            "Invalid collateral ID"
        );
        _;
    }

    modifier collateralActive(uint256 collateralId) {
        require(collaterals[collateralId].isActive, "Collateral inactive");
        _;
    }

    // NFT Whitelist management
    function whitelistNFT(address nftAddress) external onlyOwner {
        require(nftAddress != address(0), "Invalid NFT address");
        whitelistedNFTs[nftAddress] = true;
        emit NFTWhitelisted(nftAddress);
    }

    function removeNFTFromWhitelist(address nftAddress) external onlyOwner {
        whitelistedNFTs[nftAddress] = false;
        emit NFTBlacklisted(nftAddress);
    }

    // Main functions
    function depositNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 maxLoanAmount
    ) external {
        require(whitelistedNFTs[nftAddress], "NFT not whitelisted");
        require(maxLoanAmount > 0, "Invalid loan amount");

        // Transfer NFT to vault
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        // Increment counter
        collateralCounter++;

        // Create new collateral
        collaterals[collateralCounter] = Collateral({
            nftAddress: nftAddress,
            tokenId: tokenId,
            owner: msg.sender,
            maxLoanAmount: maxLoanAmount,
            currentLoanAmount: 0,
            isActive: true
        });

        // Add to user's collaterals
        userCollaterals[msg.sender].push(collateralCounter);

        emit NFTDeposited(
            msg.sender,
            nftAddress,
            tokenId,
            maxLoanAmount,
            collateralCounter
        );
    }

    function withdrawNFT(
        uint256 collateralId
    )
        external
        collateralExists(collateralId)
        onlyCollateralOwner(collateralId)
        collateralActive(collateralId)
    {
        require(
            collaterals[collateralId].currentLoanAmount == 0,
            "Loan not repaid"
        );

        Collateral storage collateral = collaterals[collateralId];

        // Transfer NFT back to owner
        IERC721(collateral.nftAddress).transferFrom(
            address(this),
            msg.sender,
            collateral.tokenId
        );

        collateral.isActive = false;

        emit NFTWithdrawn(msg.sender, collateralId);
    }

    // View functions
    function getUserCollaterals(
        address user
    )
        external
        view
        returns (
            uint256[] memory collateralIds,
            address[] memory nftAddresses,
            uint256[] memory tokenIds,
            uint256[] memory maxLoanAmounts,
            uint256[] memory currentLoanAmounts,
            bool[] memory activeStates
        )
    {
        uint256[] storage userCollateralIds = userCollaterals[user];
        uint256 length = userCollateralIds.length;

        collateralIds = new uint256[](length);
        nftAddresses = new address[](length);
        tokenIds = new uint256[](length);
        maxLoanAmounts = new uint256[](length);
        currentLoanAmounts = new uint256[](length);
        activeStates = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 id = userCollateralIds[i];
            Collateral storage collateral = collaterals[id];

            collateralIds[i] = id;
            nftAddresses[i] = collateral.nftAddress;
            tokenIds[i] = collateral.tokenId;
            maxLoanAmounts[i] = collateral.maxLoanAmount;
            currentLoanAmounts[i] = collateral.currentLoanAmount;
            activeStates[i] = collateral.isActive;
        }
    }

    function getCollateralDetails(
        uint256 collateralId
    ) external view collateralExists(collateralId) returns (Collateral memory) {
        return collaterals[collateralId];
    }

    function isNFTWhitelisted(address nftAddress) external view returns (bool) {
        return whitelistedNFTs[nftAddress];
    }

    // Internal functions for loan management (to be called by LoanManager)
    function updateLoanAmount(
        uint256 collateralId,
        uint256 newLoanAmount
    ) external {
        // TODO: Add access control for LoanManager
        require(collaterals[collateralId].isActive, "Collateral inactive");
        require(
            newLoanAmount <= collaterals[collateralId].maxLoanAmount,
            "Exceeds max loan"
        );
        collaterals[collateralId].currentLoanAmount = newLoanAmount;
    }
}
