// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, Ownable {
    uint8 private _decimals = 6;
    mapping(address => uint256) public mintAllowance; // How many tokens a user can mint
    mapping(address => bool) public hasMintedTokens; // Tracks who has minted tokens
    address public nftContract; // Address of MyNFT contract

    // Custom modifier to allow owner or MyNFT contract
    modifier onlyOwnerOrNFT() {
        require(
            msg.sender == owner() || msg.sender == nftContract,
            "Caller is not owner or NFT contract"
        );
        _;
    }

    constructor() ERC20("Mock USDT", "USDT") {
        _mint(msg.sender, 1000000 * 10 ** 18); // Mint 1,000,000 mUSDT to deployer for testing
    }

    // Set the NFT contract address (called by owner after deployment)
    function setNFTContract(address _nftContract) external onlyOwner {
        require(_nftContract != address(0), "Invalid address");
        nftContract = _nftContract;
    }

    // Whitelist a user for token minting (callable by owner or MyNFT)
    function whitelistUser(
        address _user,
        uint256 _amount
    ) external onlyOwnerOrNFT {
        require(!hasMintedTokens[_user], "User has already minted tokens");
        mintAllowance[_user] = _amount;
    }

    // User mints their allowed tokens
    function mintTokens() external {
        uint256 allowance = mintAllowance[msg.sender];
        require(allowance > 0, "You have no tokens to mint");
        require(!hasMintedTokens[msg.sender], "You have already minted tokens");

        _mint(msg.sender, allowance);
        mintAllowance[msg.sender] = 0;
        hasMintedTokens[msg.sender] = true;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
