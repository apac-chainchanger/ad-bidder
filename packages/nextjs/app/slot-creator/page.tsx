"use client";

import React, { useState } from "react";
import { ProgressIndicator } from "./_components/ProgressIndicator";
import { SlotCreatorForm } from "./_components/SlotCreatorForm";
import { SlotCreatorHeader } from "./_components/SlotCreatorHeader";
import { FormData } from "./_components/types";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const SlotCreator = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [formData, setFormData] = useState<FormData>({
    domainName: "",
    slotName: "",
    slotWidth: "",
    slotHeight: "",
  });

  const { writeContractAsync: writeAdSlotControllerAsync, isPending: isPendingAdSlotController } =
    useScaffoldWriteContract("AdSlotController");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 2) {
      try {
        await writeAdSlotControllerAsync(
          {
            functionName: "createAdSlot",
            args: [formData.slotName, formData.domainName, BigInt(formData.slotWidth), BigInt(formData.slotHeight)],
          },
          {
            onBlockConfirmation: txnReceipt => {
              console.log("📦 Transaction blockHash", txnReceipt.blockHash);
              setTransactionHash(txnReceipt.transactionHash);
              setCurrentStep(3);
            },
          },
        );
      } catch (e: any) {
        console.error("Detailed error:", {
          message: e.message,
          details: e.details,
          cause: e.cause,
          data: e.data,
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepOneComplete = (): boolean => {
    return Boolean(formData.domainName && formData.slotName && formData.slotWidth && formData.slotHeight);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col">
          <SlotCreatorHeader />
          <div className="flex gap-8">
            <SlotCreatorForm
              currentStep={currentStep}
              formData={formData}
              handleInputChange={handleInputChange}
              handleNext={handleNext}
              handleBack={handleBack}
              isStepOneComplete={isStepOneComplete}
              isPending={isPendingAdSlotController}
              transactionHash={transactionHash}
            />
            <ProgressIndicator currentStep={currentStep} isPending={isPendingAdSlotController} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotCreator;
