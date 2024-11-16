import React from "react";
import { StepProps } from "./types";

export const TransactionStep: React.FC<StepProps> = ({ formData, transactionHash }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Slot has been created</h3>
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-sm font-medium text-gray-500">Transaction Hash</span>
          <a
            href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {transactionHash?.slice(0, 6)}...{transactionHash?.slice(-4)}
          </a>
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-sm font-medium text-gray-500">Domain Name</span>
          <span className="text-sm text-gray-900">{formData.domainName}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-sm font-medium text-gray-500">Slot Name</span>
          <span className="text-sm text-gray-900">{formData.slotName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Size</span>
          <span className="text-sm text-gray-900">
            {formData.slotWidth} × {formData.slotHeight}
          </span>
        </div>
      </div>
    </div>
  );
};
