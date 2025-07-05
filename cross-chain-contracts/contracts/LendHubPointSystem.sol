// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Import the NFTLendHub contract to use its Loan struct
import "./NftLendhubWithPoint.sol";

interface INFTLendHub {
    function getAllLoans() external view returns (LendHub_v2.Loan[] memory);

    function getUserLoans(
        address user
    ) external view returns (LendHub_v2.Loan[] memory);

    function getLenderLoans(
        address lender
    ) external view returns (LendHub_v2.Loan[] memory);

    function getCompletedLoans()
        external
        view
        returns (LendHub_v2.Loan[] memory);
}

contract LendHubPointSystem is Ownable, ReentrancyGuard {
    // Point values for different actions
    uint256 public constant POINTS_FOR_LISTING = 10;
    uint256 public constant POINTS_FOR_FUNDING = 20;
    uint256 public constant POINTS_FOR_REPAYMENT = 30;
    uint256 public constant POINTS_FOR_COMPLETION = 40;
    uint256 public constant POINTS_FOR_CANCELLATION = 5;

    // Reference to the main lending contract
    address public immutable lendHubContract;

    // User points mapping
    mapping(address => uint256) public userPoints;

    // User level mapping (based on total points)
    mapping(address => uint256) public userLevel;

    // Points history for each user
    struct PointsHistory {
        uint256 timestamp;
        uint256 points;
        string action;
        bool isDeduction;
    }

    mapping(address => PointsHistory[]) public userPointsHistory;

    // Events
    event PointsAwarded(address indexed user, uint256 points, string action);
    event PointsDeducted(address indexed user, uint256 points, string action);
    event LevelUp(address indexed user, uint256 newLevel);

    constructor(address _lendHubContract) {
        lendHubContract = _lendHubContract;
    }

    // Modifier to ensure only the lending contract can call certain functions
    modifier onlyLendHub() {
        require(
            msg.sender == lendHubContract,
            "Only LendHub can call this function"
        );
        _;
    }

    // Function to award points for listing an NFT
    function awardPointsForListing(address user) external onlyLendHub {
        _awardPoints(user, POINTS_FOR_LISTING, "NFT Listed");
    }

    // Function to award points for funding a loan
    function awardPointsForFunding(address user) external onlyLendHub {
        _awardPoints(user, POINTS_FOR_FUNDING, "Loan Funded");
    }

    // Function to award points for repayment
    function awardPointsForRepayment(address user) external onlyLendHub {
        _awardPoints(user, POINTS_FOR_REPAYMENT, "Loan Repaid");
    }

    // Function to award points for completion
    function awardPointsForCompletion(address user) external onlyLendHub {
        _awardPoints(user, POINTS_FOR_COMPLETION, "Loan Completed");
    }

    // Function to deduct points for cancellation
    function deductPointsForCancellation(address user) external onlyLendHub {
        _deductPoints(user, POINTS_FOR_CANCELLATION, "Loan Cancelled");
    }

    // Internal function to award points
    function _awardPoints(
        address user,
        uint256 points,
        string memory action
    ) internal {
        userPoints[user] += points;
        userPointsHistory[user].push(
            PointsHistory({
                timestamp: block.timestamp,
                points: points,
                action: action,
                isDeduction: false
            })
        );

        // Check for level up
        uint256 newLevel = userPoints[user] / 100; // Level up every 100 points
        if (newLevel > userLevel[user]) {
            userLevel[user] = newLevel;
            emit LevelUp(user, newLevel);
        }

        emit PointsAwarded(user, points, action);
    }

    // Internal function to deduct points
    function _deductPoints(
        address user,
        uint256 points,
        string memory action
    ) internal {
        if (userPoints[user] >= points) {
            userPoints[user] -= points;
            userPointsHistory[user].push(
                PointsHistory({
                    timestamp: block.timestamp,
                    points: points,
                    action: action,
                    isDeduction: true
                })
            );

            emit PointsDeducted(user, points, action);
        }
    }

    // View function to get user's points history
    function getUserPointsHistory(
        address user
    ) external view returns (PointsHistory[] memory) {
        return userPointsHistory[user];
    }

    // View function to get user's total points
    function getUserPoints(address user) external view returns (uint256) {
        return userPoints[user];
    }

    // View function to get user's level
    function getUserLevel(address user) external view returns (uint256) {
        return userLevel[user];
    }

    // Function to get top users by points (limited to top 10)
    function getTopUsers()
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        address[] memory topUsers = new address[](10);
        uint256[] memory topPoints = new uint256[](10);

        // This is a simplified version. In a production environment,
        // you might want to use a more efficient data structure
        // or implement pagination
        uint256 count = 0;
        for (uint256 i = 0; i < 10; i++) {
            address topUser;
            uint256 maxPoints = 0;

            // Find the user with the highest points not already in the list
            for (uint256 j = 0; j < count; j++) {
                if (userPoints[topUsers[j]] > maxPoints) {
                    bool alreadyInList = false;
                    for (uint256 k = 0; k < count; k++) {
                        if (topUsers[k] == topUsers[j]) {
                            alreadyInList = true;
                            break;
                        }
                    }
                    if (!alreadyInList) {
                        maxPoints = userPoints[topUsers[j]];
                        topUser = topUsers[j];
                    }
                }
            }

            if (maxPoints > 0) {
                topUsers[count] = topUser;
                topPoints[count] = maxPoints;
                count++;
            }
        }

        return (topUsers, topPoints);
    }
}
