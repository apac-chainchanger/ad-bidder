export interface AdSlotProps {
  adSlotAddress: string;
  adSlotName: string;
  domainName: string;
  adSlotWidth: bigint;
  adSlotHeight: bigint;
}

export interface AdSlotModalProps {
  isOpen: boolean;
  callback: () => void;
  slot: AdSlotProps | null;
}
