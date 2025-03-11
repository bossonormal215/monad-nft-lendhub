// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "./MockUSDT.sol";

contract DmonNFT is ERC721Enumerable, Ownable, ReentrancyGuard, IERC2981 {
    using Strings for uint256;
    MockUSDT public MockUSDTContract; // Reference to the ERC20 contract
    mapping(address => bool) public hasMinted; // Tracks who has minted an NFT
    mapping(address => bool) public whitelist; // Whitelist for NFT minting

    // Minting states
    enum MintingState {
        TeamMint,
        WhitelistMint,
        PublicMint
    }

    uint256 public constant MAX_SUPPLY = 555;
    uint256 public constant TEAM_SUPPLY = 55;
    uint256 public constant MAX_MINT_PER_TX = 5;

    //set Mint prices in USD
    uint256 internal TeamMintPrice = 0; // Free Mint for the team
    uint256 public constant WhitelistMintPrice = 2 * 10 ** 15; // 0.002 ETH in wei;
    uint256 public constant PublicMintPrice = 4 * 10 ** 15; // 0.004 ETH in wei

    bool public isRevealed = false;
    string private baseURI;
    string private notRevealedUri;
    mapping(uint256 => string) private _tokenMetadataHashes;
    uint256[] private availableTokenIds;

    // Royalty information
    address private _royaltyRecipient;
    uint96 private _royaltyPercentage; // In basis points (e.g., 100 = 1%)

    // Presale configuration
    // mapping(address => bool) public whitelist;
    bool public isPresaleActive = false;
    bool public isPublicSaleActive = false;
    bool public paused = false;

    // Events
    event NFTMinted(address indexed minter, uint256 tokenId);
    event RevealStateChanged(bool isRevealed);
    event BaseURIChanged(string newBaseURI);
    event RoyaltiesSet(address indexed recipient, uint96 percentage);
    event SaleStateChanged(string saleType, bool state);

    // constructor() ERC721("DMONNFT", "DMON") /*Ownable(msg.sender)*/ {

    constructor(address _MockUSDTAddress) ERC721("DMONNFT", "DMON") {
        MockUSDTContract = MockUSDT(_MockUSDTAddress);

        _transferOwnership(msg.sender);
        // Initialize available token IDs
        for (uint256 i = 1; i <= MAX_SUPPLY; i++) {
            availableTokenIds.push(i);
        }

        // Set default royalty recipient and percentage
        _royaltyRecipient = msg.sender; // Deployer as the royalty recipient
        _royaltyPercentage = 1000; // 10% in basis points (1000 basis points = 10%)
    }

    // Function to set royalties
    function setRoyalties(
        address recipient,
        uint96 percentage
    ) external onlyOwner {
        require(percentage <= 10000, "Royalty percentage too high"); // Max 100%
        _royaltyRecipient = recipient;
        _royaltyPercentage = percentage;
        emit RoyaltiesSet(recipient, percentage);
    }

    // Implementing royaltyInfo from IERC2981
    function royaltyInfo(
        uint256 /*tokenId*/,
        uint256 salePrice
    ) public view override returns (address receiver, uint256 royaltyAmount) {
        return (_royaltyRecipient, (salePrice * _royaltyPercentage) / 10000);
    }

    // Team mint function
    function TeamOGMint(uint256 quantity) external onlyOwner {
        require(quantity > 0, "Must mint at least one token");
        require(quantity <= TEAM_SUPPLY, "Exceeds max mint for team supply");
        require(
            totalSupply() + quantity <= MAX_SUPPLY,
            "Would exceed max supply"
        );
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(msg.sender, tokenId);
            emit NFTMinted(msg.sender, tokenId);
        }
    }

    function removeTokenIds(uint256 start, uint256 end) external onlyOwner {
        require(start > 0 && end >= start, "Invalid range");
        require(end <= MAX_SUPPLY, "Range exceeds max supply");

        for (uint256 tokenId = start; tokenId <= end; tokenId++) {
            for (uint256 i = 0; i < availableTokenIds.length; i++) {
                if (availableTokenIds[i] == tokenId) {
                    // Replace the found token ID with the last ID in the array
                    availableTokenIds[i] = availableTokenIds[
                        availableTokenIds.length - 1
                    ];
                    // Remove the last element
                    availableTokenIds.pop();
                    break;
                }
            }
        }
    }

    // Team Random Public Mint Free
    function TeamMint(
        uint256 quantity
    ) public payable nonReentrant whenNotPaused {
        require(isPublicSaleActive, "Public sale is not active");
        require(quantity > 0, "Must mint at least one token");

        require(
            totalSupply() + quantity <= MAX_SUPPLY,
            "Would exceed max supply"
        );

        // Select a random index
        for (uint256 i = 0; i < quantity; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % availableTokenIds.length;
            uint256 tokenId = availableTokenIds[randomIndex];

            // Remove the selected token ID from the available list
            availableTokenIds[randomIndex] = availableTokenIds[
                availableTokenIds.length - 1
            ];
            availableTokenIds.pop();

            _safeMint(msg.sender, tokenId);
            emit NFTMinted(msg.sender, tokenId);
        }
    }

    // Public mint function
    function mint(uint256 quantity) public payable nonReentrant whenNotPaused {
        uint256 totalMintPrice = PublicMintPrice * quantity;

        require(isPublicSaleActive, "Public sale is not active");
        require(quantity > 0, "Must mint at least one token");
        require(
            quantity <= MAX_MINT_PER_TX,
            "Exceeds max mint per transaction"
        );
        require(
            totalSupply() + quantity <= MAX_SUPPLY,
            "Would exceed max supply"
        );

        require(msg.value >= totalMintPrice, "Insufficient payment");

        // Select a random index
        for (uint256 i = 0; i < quantity; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % availableTokenIds.length;
            uint256 tokenId = availableTokenIds[randomIndex];

            // Remove the selected token ID from the available list
            availableTokenIds[randomIndex] = availableTokenIds[
                availableTokenIds.length - 1
            ];
            availableTokenIds.pop();

            _safeMint(msg.sender, tokenId);
            emit NFTMinted(msg.sender, tokenId);
        }
    }

    // Whitelist mint function
    function whitelistMint(
        uint256 quantity
    ) external payable nonReentrant whenNotPaused {
        uint256 totalMintPriceInWei = WhitelistMintPrice * quantity;

        require(isPresaleActive, "Presale is not active");
        require(
            whitelist[msg.sender],
            "You are not whitelisted to mint an NFT"
        );
        require(!hasMinted[msg.sender], "You have already minted an NFT");
        require(quantity > 0, "Must mint at least one token");
        require(
            quantity <= MAX_MINT_PER_TX,
            "Exceeds max mint per transaction"
        );
        require(
            totalSupply() + quantity <= MAX_SUPPLY,
            "Would exceed max supply"
        );

        require(
            msg.value >= totalMintPriceInWei,
            "Insufficient payment: Send Enough ETH"
        );

        // Select a random index
        for (uint256 i = 0; i < quantity; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % availableTokenIds.length;
            uint256 tokenId = availableTokenIds[randomIndex];

            // Remove the selected token ID from the available list
            availableTokenIds[randomIndex] = availableTokenIds[
                availableTokenIds.length - 1
            ];
            availableTokenIds.pop();

            _safeMint(msg.sender, tokenId);
            hasMinted[msg.sender] = true;
            whitelist[msg.sender] = false; // Remove from whitelist after minting
            MockUSDTContract.whitelistUser(msg.sender, 20000 * 10 ** 18); // Adjust for decimals
            emit NFTMinted(msg.sender, tokenId);
        }
    }

    // Admin functions
    function addToWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
        }
    }

    function togglePresale() external onlyOwner {
        isPresaleActive = !isPresaleActive;
        emit SaleStateChanged("Presale", isPresaleActive);
    }

    function togglePublicSale() external onlyOwner {
        isPublicSaleActive = !isPublicSaleActive;
        emit SaleStateChanged("Public", isPublicSaleActive);
    }

    function reveal() external onlyOwner {
        isRevealed = true;
        emit RevealStateChanged(true);
    }

    function unreveal() external onlyOwner {
        isRevealed = false;
        emit RevealStateChanged(false);
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BaseURIChanged(_newBaseURI);
    }

    function setTokenMetadataHash(
        uint256 tokenId,
        string memory hash
    ) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _tokenMetadataHashes[tokenId] = hash;
    }

    function setNotRevealedURI(
        string memory _notRevealedURI
    ) external onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    // View functions
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        if (!isRevealed) {
            return notRevealedUri;
        }

        string memory hash = _tokenMetadataHashes[tokenId];
        require(bytes(hash).length > 0, "Metadata hash not set");

        return string(abi.encodePacked(baseURI, hash));

        return "";
    }

    // Withdrawal function
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function togglePaused() external onlyOwner {
        paused = !paused;
    }
}
