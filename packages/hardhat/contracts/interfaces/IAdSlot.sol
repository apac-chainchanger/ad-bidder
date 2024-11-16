// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IAdSlot
/// @notice Interface defining core functionality for advertisement slot management
/// @dev All function implementations should be provided by the implementing contract
interface IAdSlot {
    // ============ Type Declarations ============

    struct BidInfo {
        address bidder;
        uint256 amount;
        string adImageCID;
        uint256 timestamp;
    }

    // ============ State Variables ============

    /// @notice Required state variables:
    /// address payable public _owner;
    /// address payable public immutable i_controllerContract;
    /// BidInfo public _currentBid;
    /// uint256 public _feeBalance;
    /// uint256 public immutable i_deploymentBlock;

    // ============ Events ============

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event NewBid(address indexed bidder, uint256 bidAmount, string adImageCID);
    event BidRefunded(address indexed bidder, uint256 amount);
    event FeeWithdrawn(address indexed owner, uint256 amount);
    event ControllerFeeTransferred(uint256 amount);

    // ============ Functions ============

    /// @notice Returns the current owner of the ad slot
    function _owner() external view returns (address payable);

    /// @notice Returns the controller contract address
    function i_controllerContract() external view returns (address payable);

    /// @notice Returns information about the current bid
    function _currentBid() external view returns (
        address bidder,
        uint256 amount,
        string memory adImageCID,
        uint256 timestamp
    );

    /// @notice Returns the accumulated fee balance
    function _feeBalance() external view returns (uint256);

    /// @notice Returns the contract deployment block number
    function i_deploymentBlock() external view returns (uint256);

    /// @notice Transfers ownership of the ad slot
    /// @param newOwner The address of the new owner
    function transferOwnership(address payable newOwner) external;

    /// @notice Places bid on the ad slot
    /// @param bidder The address of the bidder
    /// @param adImageCID The IPFS CID of the advertisement image
    function placeBid(address bidder, string calldata adImageCID) external payable;

    /// @notice Withdraws fees from the ad slot
    function withdrawFees() external;
}
