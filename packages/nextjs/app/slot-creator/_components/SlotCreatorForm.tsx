import React from "react";
import { ConfirmationStep } from "./ConfirmationStep";
import { InformationStep } from "./InformationStep";
import { TransactionStep } from "./TransactionStep";
import { FormData } from "./types";

interface SlotCreatorFormProps {
  currentStep: number;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  handleBack: () => void;
  isStepOneComplete: () => boolean;
  isPending: boolean;
  transactionHash?: string;
}

export const SlotCreatorForm: React.FC<SlotCreatorFormProps> = ({
  currentStep,
  formData,
  handleInputChange,
  handleNext,
  handleBack,
  isStepOneComplete,
  isPending,
  transactionHash,
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <InformationStep formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <ConfirmationStep formData={formData} />;
      case 3:
        return <TransactionStep formData={formData} transactionHash={transactionHash} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg">
      <div className="border-b p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {currentStep === 1
            ? "Enter Slot Information"
            : currentStep === 2
            ? "Confirm Slot Information"
            : "Created Successfully"}
        </h2>
      </div>
      <div className="p-6">
        {renderStepContent()}

        <div className="flex justify-between mt-8 pt-4 border-t">
          {currentStep > 1 && currentStep < 3 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-50"
              disabled={isPending}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          {currentStep < 3 && (
            <button
              className={`ml-auto px-4 py-2 rounded-md text-white flex items-center gap-2
                ${
                  (currentStep === 1 && !isStepOneComplete()) || isPending
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              onClick={handleNext}
              disabled={(currentStep === 1 && !isStepOneComplete()) || isPending}
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : currentStep === 1 ? (
                <>
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                "Create"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
