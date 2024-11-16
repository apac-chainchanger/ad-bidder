import { AdSlotProps } from "./types";

export const AdSlot = ({ item, onClick }: { item: AdSlotProps; onClick: () => void }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="p-6 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{item.adSlotName}</h2>
            <p className="text-sm text-gray-500">ID: {item.adSlotAddress.slice(0, 8)}...</p>
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Active</div>
        </div>

        {/* Domain Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Domain</h3>
          <p className="text-gray-700">{item.domainName}</p>
        </div>

        {/* Size Specifications */}
        <div className="flex space-x-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Width</h3>
            <p className="text-gray-700">{item.adSlotWidth.toString()} px</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Height</h3>
            <p className="text-gray-700">{item.adSlotHeight.toString()} px</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClick}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                   transition-colors duration-200 focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
        >
          <span>Place Bid</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
