import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface AdSlot {
  adSlotAddress: `0x${string}`;
  adSlotName: string;
  domainName: string;
  adSlotWidth: bigint;
  adSlotHeight: bigint;
}

export const MySlots = () => {
  // TODO: Contract needs to be updated to include getMySlots() function
  // Current getAllAdSlots() returns all slots instead of user-specific slots
  // Should filter slots based on connected wallet address
  const { data: slots = [], isLoading: isLoadingSlots } = useScaffoldReadContract({
    contractName: "AdSlotController",
    functionName: "getAllAdSlots",
    watch: true,
  });

  // Temporary solution: showing all active slots
  // Will be replaced with wallet-specific slots after contract update
  const activeSlots = slots.map((slot: AdSlot) => ({
    adSlotAddress: slot.adSlotAddress,
    adSlotName: slot.adSlotName,
    domainName: slot.domainName,
    adSlotWidth: BigInt(slot.adSlotWidth),
    adSlotHeight: BigInt(slot.adSlotHeight),
  }));

  if (isLoadingSlots) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!activeSlots.length) {
    return (
      <div className="bg-base-100 rounded-xl shadow-md p-6">
        <p className="text-center text-base-content/70">No ad slots found. Create your first ad slot to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-base-100 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Ad Slots</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Domain</th>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSlots.map((slot, index) => (
                <tr key={`${slot.adSlotAddress}-${index}`}>
                  <td>{slot.adSlotName}</td>
                  <td>{slot.domainName}</td>
                  <td>{`${slot.adSlotWidth.toString()}x${slot.adSlotHeight.toString()}`}</td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => notification.info("Fetching bid information...")}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MySlots;
