"use client";

import { useState } from "react";
import { MyBids } from "./_components/MyBids";
import { MySlots } from "./_components/MySlots";
import { WalletInfo } from "./_components/WalletInfo";
import { useAccount } from "wagmi";

const Dashboard = () => {
  const { address, isConnected, status } = useAccount();
  const [activeTab, setActiveTab] = useState<"bids" | "slots">("bids");

  if (status === "connecting") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Connecting...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Please connect your wallet</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-7xl mx-auto">
        <WalletInfo address={address} isConnected={isConnected} />

        <div className="mt-8">
          <div className="flex gap-4 border-b border-base-300">
            <button
              onClick={() => setActiveTab("bids")}
              className={`px-4 py-2 font-medium ${
                activeTab === "bids" ? "text-primary border-b-2 border-primary" : "text-base-content hover:text-primary"
              }`}
            >
              My Active Ads & History
            </button>
            <button
              onClick={() => setActiveTab("slots")}
              className={`px-4 py-2 font-medium ${
                activeTab === "slots"
                  ? "text-primary border-b-2 border-primary"
                  : "text-base-content hover:text-primary"
              }`}
            >
              My Ad Slots
            </button>
          </div>

          <div className="mt-8">{activeTab === "bids" ? <MyBids address={address} /> : <MySlots />}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
