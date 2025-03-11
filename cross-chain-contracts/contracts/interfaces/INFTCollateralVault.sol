// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface INFTCollateralVault {
    struct Collateral {
        address nftAddress;
        uint256 tokenId;
        address owner;
        uint256 maxLoanAmount;
        uint256 currentLoanAmount;
        bool isActive;
    }

    function transferCollateral(
        uint256 collateralId,
        address newOwner
    ) external;

    function getCollateralDetails(
        uint256 collateralId
    )
        external
        view
        returns (
            address nftAddress,
            uint256 tokenId,
            address owner,
            uint256 maxLoanAmount,
            uint256 currentLoanAmount,
            bool isActive
        );

    function updateLoanAmount(
        uint256 collateralId,
        uint256 newLoanAmount
    ) external;

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
        );
}
