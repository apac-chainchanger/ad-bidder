import { ChangeEvent } from "react";

export interface FormData {
  domainName: string;
  slotName: string;
  slotWidth: string;
  slotHeight: string;
}

export interface StepProps {
  formData: FormData;
  handleInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  transactionHash?: string;
}
