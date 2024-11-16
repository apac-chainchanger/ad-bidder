import React from "react";
import { StepProps } from "./types";

export const InformationStep: React.FC<StepProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="domainName" className="block text-sm font-medium text-gray-700">
          Domain Name
        </label>
        <input
          id="domainName"
          name="domainName"
          type="text"
          value={formData.domainName}
          onChange={handleInputChange}
          placeholder="Enter domain name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="slotName" className="block text-sm font-medium text-gray-700">
          Slot Name
        </label>
        <input
          id="slotName"
          name="slotName"
          type="text"
          value={formData.slotName}
          onChange={handleInputChange}
          placeholder="Enter slot name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="slotWidth" className="block text-sm font-medium text-gray-700">
            Width
          </label>
          <input
            id="slotWidth"
            name="slotWidth"
            type="number"
            value={formData.slotWidth}
            onChange={handleInputChange}
            placeholder="Enter width"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="slotHeight" className="block text-sm font-medium text-gray-700">
            Height
          </label>
          <input
            id="slotHeight"
            name="slotHeight"
            type="number"
            value={formData.slotHeight}
            onChange={handleInputChange}
            placeholder="Enter height"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
