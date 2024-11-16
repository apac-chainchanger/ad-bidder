import React from "react";
import { StepProps } from "./types";

export const ConfirmationStep: React.FC<StepProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Please confirm your slot information</h3>
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
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
