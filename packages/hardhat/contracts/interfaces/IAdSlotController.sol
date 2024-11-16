// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IAdSlotController
/// @notice Interface defining core functionality for managing multiple ad slots
/// @dev Provides centralized management of ad slot creation and operations
interface IAdSlotController {
    // ============ Type Declarations ============
    
    struct AdSlotInfo {
        address adSlotAddress;
        string adSlotName;
        string domainName;
        uint adSlotWidth;
        uint adSlotHeight;
    }

    // ============ State Variables ============

    /// @notice Required state variables:
    /// address payable public _owner;
    /// mapping(address => AdSlotInfo) public _adSlots;
    /// uint256 public immutable i_deploymentBlock;

    // ============ Events ============

    event AdSlotCreated(
        address indexed adSlotAddress,
        string adSlotName,
        string domainName,
        uint adSlotWidth,
        uint adSlotHeight
    );
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event BidPlaced(address indexed adSlotAddress, address indexed bidder, uint amount);
    event Withdrawal(address indexed owner, uint amount);
    event FeeReceived(address indexed from, uint amount);

    // ============ Functions ============

    /// @notice Returns the controller owner address
    function _owner() external view returns (address payable);

    /// @notice Returns information about the specified ad slot
    function _adSlots(address) external view returns (
        address adSlotAddress,
        string memory adSlotName,
        string memory domainName,
        uint adSlotWidth,
        uint adSlotHeight
    );

    /// @notice Returns the contract deployment block number
    function i_deploymentBlock() external view returns (uint256);

    /// @notice Transfers ownership of the controller
    function transferOwnership(address payable newOwner) external;

    /// @notice Transfers ownership of the specified ad slot
    function transferAdSlotOwnership(address adSlotAddress, address payable newOwner) external;

    /// @notice Withdraws fees from the controller
    function withdraw() external;

    /// @notice Creates a new ad slot
    function createAdSlot(
        string calldata adSlotName,
        string calldata domainName,
        uint adSlotWidth,
        uint adSlotHeight
    ) external;

    /// @notice Places bid on the specified ad slot
    function placeBid(address adSlotAddress, string calldata adImageCID) external payable;

    /// @notice Withdraws fees from the specified ad slot
    function withdrawAdSlotFees(address adSlotAddress) external;

    /// @notice Withdraws fees from multiple ad slots
    function batchWithdrawAdSlotFees(address[] calldata adSlotAddresses) external;

    /// @notice Returns information about the current bid on the specified ad slot
    function getCurrentBidInfo(address adSlotAddress) external view 
        returns (address bidder, uint256 amount, string memory adImageCID, uint256 timestamp);

    /// @notice Returns information about the specified ad slot
    function getAdSlotInfo(address adSlotAddress) external view returns (AdSlotInfo memory);
}
