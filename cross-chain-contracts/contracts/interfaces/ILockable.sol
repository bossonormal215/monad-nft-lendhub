// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @title ILockable
 * @dev Standard interface for lockable NFTs with manager control and emergency unlock.
 */
interface ILockable is IERC165 {
    function lock(
        uint256 tokenId,
        address manager,
        uint256 durationInSeconds
    ) external;

    function unlock(uint256 tokenId) external;

    function unlockAndTransfer(address to, uint256 tokenId) external;

    function emergencyUnlock(uint256 tokenId) external;

    function isLocked(uint256 tokenId) external view returns (bool);

    function getLockInfo(
        uint256 tokenId
    )
        external
        view
        returns (
            bool locked,
            address manager,
            uint256 lockTimestamp,
            uint256 duration
        );
}
