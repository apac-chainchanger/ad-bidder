"use client";

import { useState } from "react";
import { AdSlot } from "./_components/AdSlot";
import { AdSlotModal } from "./_components/AdSlotModal";
import { BidCenterHeader } from "./_components/BidCenterHeader";
import { AdSlotProps } from "./_components/types";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const BidCenter = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AdSlotProps | null>(null);

  const { data: deploymentBlock } = useScaffoldReadContract({
    contractName: "AdSlotController",
    functionName: "i_deploymentBlock",
  });

  const { data: eventData } = useScaffoldEventHistory({
    contractName: "AdSlotController",
    eventName: "AdSlotCreated",
    fromBlock: deploymentBlock ? BigInt(deploymentBlock.toString()) : BigInt(0),
  });

  const adSlots: Array<AdSlotProps> = (eventData || []).map(event => ({
    adSlotAddress: event.args.adSlotAddress as `0x${string}`,
    adSlotName: event.args.adSlotName as string,
    domainName: event.args.domainName as string,
    adSlotWidth: BigInt(event.args.adSlotWidth as unknown as string),
    adSlotHeight: BigInt(event.args.adSlotHeight as unknown as string),
  }));

  const handleSlotClick = (slot: AdSlotProps) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <BidCenterHeader />
        <div className="flex-1 bg-white rounded-lg shadow-lg">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold text-gray-800">Available Ad Slots</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adSlots.map(item => (
                <AdSlot key={item.adSlotAddress} item={item} onClick={() => handleSlotClick(item)} />
              ))}
            </div>
          </div>
        </div>
        <AdSlotModal isOpen={isModalOpen} callback={handleClose} slot={selectedSlot} />
      </div>
    </div>
  );
};

export default BidCenter;
