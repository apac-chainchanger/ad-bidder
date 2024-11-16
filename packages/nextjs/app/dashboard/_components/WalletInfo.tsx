interface WalletInfoProps {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export const WalletInfo = ({ address, isConnected }: WalletInfoProps) => {
  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-base-content/70">Status:</span>
          <span className={`${isConnected ? "text-success" : "text-error"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        {address && (
          <div className="flex items-center gap-2">
            <span className="text-base-content/70">Address:</span>
            <span className="font-mono">{shortenAddress(address)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
