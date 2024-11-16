// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IAdSlot.sol";
import "./interfaces/IAdSlotController.sol";
import "./AdSlot.sol";

/// @title AdSlotController Implementation
/// @notice Implements centralized management of multiple advertisement slots
/// @dev Main contract for creating and managing AdSlot contracts
contract AdSlotController is IAdSlotController {
    // ============ State Variables ============

    address payable public override _owner;
    mapping(address => AdSlotInfo) public override _adSlots;
    uint256 public immutable override i_deploymentBlock;

    // ============ Errors ============

    error OnlyOwner();
    error ZeroAddress();
    error SameOwner();
    error OnlySlotOwner();
    error LowBid();
    error NoBalance();
    error TransferFailed();

    // ============ Modifiers ============

    modifier onlyOwner() {
        if (msg.sender != _owner) revert OnlyOwner();
        _;
    }

    // ============ Constructor ============

    /// @dev Initializes contract with deployer as owner and records deployment block
    constructor() {
        _owner = payable(msg.sender);
        i_deploymentBlock = block.number;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // ============ Receive & Fallback ============

    /// @dev Processes direct ETH transfers
    receive() external payable {
        emit FeeReceived(msg.sender, msg.value);
    }

    /// @dev Processes unknown function calls with ETH
    fallback() external payable {
        emit FeeReceived(msg.sender, msg.value);
    }

    // ============ Administrative Functions ============

    /// @dev Processes controller ownership transfer with validation
    function transferOwnership(address payable newOwner) external override onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        if (newOwner == _owner) revert SameOwner();
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /// @dev Processes ad slot ownership transfer
    function transferAdSlotOwnership(address adSlotAddress, address payable newOwner) external override {
        IAdSlot adSlot = IAdSlot(adSlotAddress);
        if (msg.sender != adSlot._owner()) revert OnlySlotOwner();
        adSlot.transferOwnership(newOwner);
    }

    /// @dev Processes controller fee withdrawal
    function withdraw() external override onlyOwner {
        uint amount = address(this).balance;
        if (amount == 0) revert NoBalance();

        (bool success,) = _owner.call{value: amount}("");
        if (!success) revert TransferFailed();
        emit Withdrawal(_owner, amount);
    }

    // ============ Ad Slot Management Functions ============

    /// @dev Processes new ad slot creation
    function createAdSlot(
        string calldata adSlotName,
        string calldata domainName,
        uint adSlotWidth,
        uint adSlotHeight
    ) external override {
        AdSlot newAdSlot = new AdSlot(payable(msg.sender), payable(address(this)));
        address adSlotAddress = address(newAdSlot);

        _adSlots[adSlotAddress] = AdSlotInfo({
            adSlotAddress: adSlotAddress,
            adSlotName: adSlotName,
            domainName: domainName,
            adSlotWidth: adSlotWidth,
            adSlotHeight: adSlotHeight
        });

        emit AdSlotCreated(
            adSlotAddress,
            adSlotName,
            domainName,
            adSlotWidth,
            adSlotHeight
        );
    }

    // ============ Bidding Functions ============

    /// @dev Processes new bid placement with validation
    function placeBid(address adSlotAddress, string calldata adImageCID) external payable override {
        IAdSlot adSlot = IAdSlot(adSlotAddress);
        (, uint256 currentBidAmount, ,) = adSlot._currentBid();

        if (msg.value <= currentBidAmount) revert LowBid();

        adSlot.placeBid{value: msg.value}(msg.sender, adImageCID);
        emit BidPlaced(adSlotAddress, msg.sender, msg.value);
    }

    // ============ Fee Management Functions ============

    /// @dev Processes fee withdrawal from ad slot
    function withdrawAdSlotFees(address adSlotAddress) external override {
        IAdSlot adSlot = IAdSlot(adSlotAddress);
        if (msg.sender != adSlot._owner()) revert OnlySlotOwner();
        adSlot.withdrawFees();
    }

    /// @dev Processes fee withdrawal from multiple ad slots
    function batchWithdrawAdSlotFees(address[] calldata adSlotAddresses) external override {
        uint256 length = adSlotAddresses.length;
        for(uint i = 0; i < length; i++) {
            IAdSlot adSlot = IAdSlot(adSlotAddresses[i]);
            if (msg.sender != adSlot._owner()) revert OnlySlotOwner();
            adSlot.withdrawFees();
        }
    }

    // ============ View Functions ============

    /// @dev Returns information about current bid on specified ad slot
    function getCurrentBidInfo(address adSlotAddress) external view override
        returns (address bidder, uint256 amount, string memory adImageCID, uint256 timestamp) {
        return IAdSlot(adSlotAddress)._currentBid();
    }

    /// @dev Returns information about specified ad slot
    function getAdSlotInfo(address adSlotAddress) external view override returns (AdSlotInfo memory) {
        return _adSlots[adSlotAddress];
    }
}
