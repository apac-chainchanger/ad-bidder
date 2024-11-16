// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IAdSlot.sol";

/// @title AdSlot Implementation
/// @notice Implements advertisement slot functionality with bidding and fee management
/// @dev Controlled by AdSlotController contract
contract AdSlot is IAdSlot {
    // ============ State Variables ============

    address payable public override _owner;
    address payable public immutable override i_controllerContract;
    BidInfo public override _currentBid;
    uint256 public override _feeBalance;
    uint256 public immutable override i_deploymentBlock;

    // ============ Errors ============

    error OnlyController();
    error ZeroAddress();
    error SameOwner();
    error LowBid();
    error NoFees();
    error RefundFailed();
    error FeeTransferFailed();
    error WithdrawalFailed();

    // ============ Modifiers ============

    modifier onlyController() {
        if (msg.sender != i_controllerContract) revert OnlyController();
        _;
    }

    // ============ Constructor ============

    /// @dev Initializes contract with owner and controller addresses, and records deployment block
    constructor(address payable owner, address payable controllerContract) {
        _owner = owner;
        i_controllerContract = controllerContract;
        i_deploymentBlock = block.number;
        emit OwnershipTransferred(address(0), owner);
    }

    // ============ Administrative Functions ============

    /// @dev Processes ownership transfer with validation checks
    function transferOwnership(address payable newOwner) external override onlyController {
        if (newOwner == address(0)) revert ZeroAddress();
        if (newOwner == _owner) revert SameOwner();
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    // ============ Bidding Functions ============

    /// @dev Processes new bid with fee distribution and previous bid refund
    function placeBid(address bidder, string calldata adImageCID) external payable override onlyController {
        if (msg.value <= _currentBid.amount) revert LowBid();

        uint256 totalFee = msg.value / 10;
        uint256 ownerFee = (totalFee * 7) / 10;
        uint256 controllerFee = totalFee - ownerFee;

        BidInfo memory previousBid = _currentBid;
        if (previousBid.bidder != address(0)) {
            uint refundAmount = previousBid.amount - (previousBid.amount / 10);
            (bool refundSuccess,) = payable(previousBid.bidder).call{value: refundAmount}("");
            if (!refundSuccess) revert RefundFailed();
            emit BidRefunded(previousBid.bidder, refundAmount);
        }

        _feeBalance += ownerFee;
        (bool success,) = i_controllerContract.call{value: controllerFee}("");
        if (!success) revert FeeTransferFailed();
        emit ControllerFeeTransferred(controllerFee);

        _currentBid = BidInfo({
            bidder: bidder,
            amount: msg.value,
            adImageCID: adImageCID,
            timestamp: block.timestamp
        });
        emit NewBid(bidder, msg.value, adImageCID);
    }

    // ============ Fee Management Functions ============

    /// @dev Processes fee withdrawal to slot owner
    function withdrawFees() external override onlyController {
        if (_feeBalance == 0) revert NoFees();

        uint256 amount = _feeBalance;
        _feeBalance = 0;
        (bool success,) = _owner.call{value: amount}("");
        if (!success) revert WithdrawalFailed();
        emit FeeWithdrawn(_owner, amount);
    }
}
