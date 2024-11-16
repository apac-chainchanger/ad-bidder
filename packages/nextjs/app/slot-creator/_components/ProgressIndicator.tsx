import React from "react";

interface ProgressIndicatorProps {
  currentStep: number;
  isPending: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, isPending }) => {
  const getStepThreeStatus = () => {
    if (currentStep === 3) return { text: "Created Successfully", subtext: "Slot has been created" };
    if (isPending && currentStep === 2) return { text: "Creating Slot", subtext: "Processing transaction..." };
    return { text: "Create Slot", subtext: "Finalize creation" };
  };

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="w-80">
      <div className="bg-white rounded-lg shadow-lg sticky top-8">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Progress</h2>
        </div>
        <div className="px-6 py-8">
          <div className="flex flex-col justify-center min-h-[240px]">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5
                  ${
                    currentStep === 3
                      ? "bg-green-500 text-white"
                      : currentStep === 1
                      ? "bg-blue-500 text-white ring-4 ring-blue-100"
                      : currentStep > 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep > 1 || currentStep === 3 ? <CheckIcon /> : "1"}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm ${
                      currentStep === 3
                        ? "text-green-500"
                        : currentStep === 1
                        ? "font-semibold text-blue-500"
                        : currentStep > 1
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    Enter Information
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Please enter slot information</span>
                </div>
              </div>

              <div className="w-px h-12 bg-gray-200 ml-5" />

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5
                  ${
                    currentStep === 3
                      ? "bg-green-500 text-white"
                      : currentStep === 2
                      ? "bg-blue-500 text-white ring-4 ring-blue-100"
                      : currentStep > 2
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep > 2 || currentStep === 3 ? <CheckIcon /> : "2"}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm ${
                      currentStep === 3
                        ? "text-green-500"
                        : currentStep === 2
                        ? "font-semibold text-blue-500"
                        : currentStep > 2
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    Confirm Information
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Please confirm your information</span>
                </div>
              </div>

              <div className="w-px h-12 bg-gray-200 ml-5" />

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5
                  ${
                    currentStep === 3
                      ? "bg-green-500 text-white"
                      : isPending && currentStep === 2
                      ? "bg-yellow-500 text-white animate-pulse"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep === 3 ? <CheckIcon /> : "3"}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm ${
                      currentStep === 3
                        ? "font-semibold text-green-500"
                        : isPending && currentStep === 2
                        ? "text-yellow-500"
                        : "text-gray-500"
                    }`}
                  >
                    {getStepThreeStatus().text}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">{getStepThreeStatus().subtext}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
