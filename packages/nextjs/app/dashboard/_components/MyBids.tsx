import { useEffect, useState } from "react";
import { useScaffoldContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

interface BidInfo {
  bidder: string;
  amount: bigint;
  adImageCID: string;
  timestamp: number;
}

interface AdSlotInfo {
  adSlotAddress: `0x${string}`;
  adSlotName: string;
  domainName: string;
  adSlotWidth: number;
  adSlotHeight: number;
}

interface BidWithSlotInfo {
  bidInfo: BidInfo;
  slotInfo: AdSlotInfo;
  isCurrentBidder: boolean;
}

interface MyBidsProps {
  address: `0x${string}` | undefined;
}

export const MyBids = ({ address }: MyBidsProps) => {
  const [bidsWithInfo, setBidsWithInfo] = useState<BidWithSlotInfo[]>([]);
  const [initialized, setInitialized] = useState(false);

  const { data: bidEvents } = useScaffoldEventHistory({
    contractName: "AdSlotController",
    eventName: "BidPlaced",
    fromBlock: BigInt(0),
    filters: { bidder: address },
    blockData: true,
    watch: false,
  });

  const { data: adSlotController } = useScaffoldContract({
    contractName: "AdSlotController",
  });

  useEffect(() => {
    const loadBids = async () => {
      if (!bidEvents || !address || !adSlotController || initialized) return;

      try {
        // Get unique ad slot addresses
        const uniqueSlotAddresses = [...new Set(bidEvents.map(event => event.args.adSlotAddress))];

        // Fetch current information for each ad slot
        const currentBidsWithInfo = await Promise.all(
          uniqueSlotAddresses.map(async slotAddress => {
            try {
              // Get slot information
              const slotInfo = await adSlotController.read.getAdSlotInfo([slotAddress as `0x${string}`]);

              // Get current bid information
              const currentBid = await adSlotController.read.getCurrentBidInfo([slotAddress as `0x${string}`]);

              return {
                bidInfo: {
                  bidder: currentBid[0],
                  amount: currentBid[1],
                  adImageCID: currentBid[2],
                  timestamp: Number(currentBid[3]),
                },
                slotInfo: {
                  adSlotAddress: slotAddress as `0x${string}`,
                  adSlotName: slotInfo.adSlotName,
                  domainName: slotInfo.domainName,
                  adSlotWidth: Number(slotInfo.adSlotWidth),
                  adSlotHeight: Number(slotInfo.adSlotHeight),
                },
                isCurrentBidder: currentBid[0].toLowerCase() === address.toLowerCase(),
              } as BidWithSlotInfo;
            } catch (error) {
              console.error("Error fetching slot info:", error);
              return null;
            }
          }),
        );

        setBidsWithInfo(currentBidsWithInfo.filter((bid): bid is BidWithSlotInfo => bid !== null));
        setInitialized(true);
      } catch (error) {
        console.error("Error loading bids:", error);
      }
    };

    loadBids();
  }, [bidEvents, address, adSlotController]);

  return (
    <div className="space-y-6">
      {/* Active Bids Section */}
      <div className="bg-base-100 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">My Current Bids</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Ad Slot Name</th>
                <th>Domain</th>
                <th>Size</th>
                <th>Current Bid (ETH)</th>
                <th>Ad Image</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bidsWithInfo.map((bid, index) => (
                <tr key={index}>
                  <td>{bid.slotInfo.adSlotName}</td>
                  <td>{bid.slotInfo.domainName}</td>
                  <td>
                    {bid.slotInfo.adSlotWidth}x{bid.slotInfo.adSlotHeight}
                  </td>
                  <td>{(Number(bid.bidInfo.amount) / 1e18).toFixed(4)}</td>
                  <td>
                    <a
                      href={`https://ipfs.io/ipfs/${bid.bidInfo.adImageCID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary"
                    >
                      View Image
                    </a>
                  </td>
                  <td>
                    {bid.isCurrentBidder ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-error">Outbid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bid History Section */}
      <div className="bg-base-100 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Bid History</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Ad Slot</th>
                <th>Bid Amount (ETH)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bidEvents?.map((event, index) => (
                <tr key={index}>
                  <td className="font-mono">{event.args.adSlotAddress}</td>
                  <td>{(Number(event.args.amount) / 1e18).toFixed(4)}</td>
                  <td>{new Date(Number(event.block?.timestamp) * 1000).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
