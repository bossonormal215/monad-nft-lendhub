/*pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFTCollateralVault.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract LiquidationManager {
    IERC20 public usdt;
    NFTCollateralVault public vault;
    IPyth public pythOracle;
    uint256 public liquidationThreshold = 80; // 80% LTV

    event Liquidated(
        uint256 indexed collateralId,
        address liquidator,
        uint256 discountPrice
    );

    constructor(address _usdt, address _vault, address _pythOracle) {
        usdt = IERC20(_usdt);
        vault = NFTCollateralVault(_vault);
        pythOracle = IPyth(_pythOracle);
    }

    function liquidate(uint256 collateralId) external {
        (, int256 price, , , ) = pythOracle.getPrice(
            collaterals[collateralId].nftAddress
        );
        uint256 discountPrice = (uint256(price) * 80) / 100; // 20% discount

        usdt.transferFrom(msg.sender, address(this), discountPrice);
        vault.withdrawNFT(collateralId);
        emit Liquidated(collateralId, msg.sender, discountPrice);
    }
}
*/

////////////////////////////////////////
/*
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFTCollateralVault.sol";
import "./USDTLiquidityPool.sol";

contract LiquidationManager {
    IERC20 public usdt;
    NFTCollateralVault public vault;
    USDTLiquidityPool public liquidityPool;
    uint256 public liquidationThreshold = 80; // 80% LTV

    event Liquidated(uint256 indexed collateralId, address liquidator, uint256 discountPrice);

    constructor(address _usdt, address _vault, address _liquidityPool) {
        usdt = IERC20(_usdt);
        vault = NFTCollateralVault(_vault);
        liquidityPool = USDTLiquidityPool(_liquidityPool);
    }

    function liquidate(uint256 collateralId) external {
        (address nftAddress, uint256 tokenId, address owner, uint256 loanAmount, bool isActive) = vault.collaterals(collateralId);
        require(isActive, "Collateral not active");

        uint256 discountPrice = (loanAmount * 80) / 100; // Liquidation at 80% of loan
        require(usdt.balanceOf(msg.sender) >= discountPrice, "Insufficient USDT");

        usdt.transferFrom(msg.sender, address(this), discountPrice);
        vault.withdrawNFT(collateralId);
        liquidityPool.deposit(discountPrice); // Return liquidated funds to pool

        emit Liquidated(collateralId, msg.sender, discountPrice);
    }
}
*/
////////////////////////////////////
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/INFTCollateralVault.sol";
import "./interfaces/ILoanManager.sol";
import "./interfaces/IUSDTLiquidityPool.sol";

contract LiquidationManager is Ownable {
    INFTCollateralVault public nftVault;
    ILoanManager public loanManager;
    IUSDTLiquidityPool public liquidityPool;

    event CollateralLiquidated(
        uint256 indexed collateralId,
        address indexed liquidator,
        uint256 debtAmount
    );

    constructor(
        address _nftVault,
        address _loanManager,
        address _liquidityPool
    ) {
        nftVault = INFTCollateralVault(_nftVault);
        loanManager = ILoanManager(_loanManager);
        liquidityPool = IUSDTLiquidityPool(_liquidityPool);
    }

    function liquidate(uint256 collateralId) external {
        require(
            loanManager.isLoanLiquidatable(collateralId),
            "Loan not liquidatable"
        );

        // Get collateral details
        (
            address nftAddress,
            uint256 tokenId, // owner // maxLoanAmount
            ,
            ,
            uint256 currentLoanAmount,
            bool isActive
        ) = nftVault.getCollateralDetails(collateralId);

        require(isActive, "Collateral not active");
        require(currentLoanAmount > 0, "No active loan");

        // Transfer NFT to liquidator
        IERC721(nftAddress).transferFrom(
            address(nftVault),
            msg.sender,
            tokenId
        );

        // Update vault state
        nftVault.updateLoanAmount(collateralId, 0);

        emit CollateralLiquidated(collateralId, msg.sender, currentLoanAmount);
    }
}
