import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AdSlotModalProps } from "./types";
import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

const StatusModal = ({ status }: { status: string }) => {
  if (!status) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <h3 className="text-lg font-medium text-gray-900">{status}</h3>
          <p className="text-sm text-gray-500 text-center">Please wait while we process your request...</p>
        </div>
      </div>
    </div>
  );
};

const FileUploadButton = ({
  onChange,
  file,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <input type="file" ref={inputRef} onChange={onChange} accept="image/*" className="hidden" />
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Select Image
      </button>
      {file && <span className="text-sm text-gray-600 truncate">{file.name}</span>}
    </div>
  );
};

export const AdSlotModal: React.FC<AdSlotModalProps> = ({ isOpen, callback, slot }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [currentBidInfo, setCurrentBidInfo] = useState<{
    bidder: string;
    amount: bigint;
    adImageCID: string;
    timestamp: bigint;
  } | null>(null);

  const { writeContractAsync: writeAdSlotControllerAsync } = useScaffoldWriteContract("AdSlotController");
  const { data: bidInfo, isLoading: isBidLoading } = useScaffoldReadContract({
    contractName: "AdSlotController",
    functionName: "getCurrentBidInfo",
    args: [slot?.adSlotAddress as `0x${string}`],
  });

  useEffect(() => {
    if (bidInfo) {
      setCurrentBidInfo({
        bidder: bidInfo[0],
        amount: bidInfo[1],
        adImageCID: bidInfo[2],
        timestamp: bidInfo[3],
      });
    }
  }, [bidInfo]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsChecked(false);
    setBidAmount("");
    setIsLoading(false);
    setStep(1);
    setFile(null);
    setPreview(null);
    setUploadStatus("");
    callback();
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const calculateFees = (amount: string) => {
    const value = parseFloat(amount) || 0;
    const totalFee = value * 0.1; // 10% total fee
    const ownerFee = totalFee * 0.7; // 7% to owner
    const platformFee = totalFee * 0.3; // 3% to platform
    const refundAmount = value - totalFee; // Amount after fees
    return { totalFee, ownerFee, platformFee, refundAmount };
  };

  const isValidBidAmount = () => {
    if (!currentBidInfo || !bidAmount) return false;
    const currentBidEth = parseFloat(formatEther(currentBidInfo.amount));
    const newBidEth = parseFloat(bidAmount);
    return newBidEth > currentBidEth;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("");
    }
  };

  const uploadToIPFS = async (): Promise<string | null> => {
    if (!file) return null;

    setUploadStatus("Analyzing image content with AI...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI check

    setUploadStatus("Uploading to IPFS storage...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY || "",
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || "",
        },
        body: formData,
      });

      const data: PinataResponse = await response.json();
      setUploadStatus("Successfully stored in IPFS!");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Show success message briefly
      setUploadStatus("");
      return data.IpfsHash;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      setUploadStatus("Failed to upload to IPFS");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Show error message longer
      setUploadStatus("");
      return null;
    }
  };

  const handlePlaceBid = async () => {
    if (!slot?.adSlotAddress || !bidAmount || !file) {
      alert("Invalid slot address, bid amount, or image file");
      return;
    }
    setIsLoading(true);
    try {
      const cid = await uploadToIPFS();
      if (!cid) {
        throw new Error("Failed to upload image to IPFS");
      }

      const valueInWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18));
      await writeAdSlotControllerAsync(
        {
          functionName: "placeBid",
          args: [slot.adSlotAddress as `0x${string}`, cid],
          value: valueInWei,
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
            handleClose();
          },
        },
      );
    } catch (e: any) {
      console.error("Error placing bid:", e);
      alert("Failed to place bid: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentBid = () => {
    if (isBidLoading) {
      return (
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <span className="text-gray-400">Loading...</span>
        </div>
      );
    }
    if (!currentBidInfo || currentBidInfo.amount === BigInt(0)) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">No Bids Yet</span>
          <span className="text-xs text-gray-500">Be the first to bid!</span>
        </div>
      );
    }
    const bidTime = new Date(Number(currentBidInfo.timestamp) * 1000);
    const shortAddress = `${currentBidInfo.bidder.slice(0, 6)}...${currentBidInfo.bidder.slice(-4)}`;
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-blue-600">{formatEther(currentBidInfo.amount)} ETH</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          <span>by {shortAddress}</span>
          <span>•</span>
          <span>{bidTime.toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  const renderBidInfo = () => {
    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Your Bid Amount</p>
            <p className="text-lg font-semibold text-blue-600">{bidAmount} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Highest Bid</p>
            <div className="mt-1">{renderCurrentBid()}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          {/* Ad Slot Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ad Slot Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contract Address</p>
                <p className="text-sm font-medium text-gray-900">{slot?.adSlotAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Domain</p>
                <p className="text-sm font-medium text-gray-900">{slot?.domainName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Size</p>
                <p className="text-sm font-medium text-gray-900">
                  {slot?.adSlotWidth.toString()} × {slot?.adSlotHeight.toString()} px
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Highest Bid</p>
                <div className="mt-1">{renderCurrentBid()}</div>
              </div>
            </div>
          </div>

          {/* Bid Input */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Place Your Bid</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount in ETH"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2
                           focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>
              <span className="text-gray-500">ETH</span>
            </div>

            {bidAmount && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee (3%)</span>
                  <span>-{calculateFees(bidAmount).platformFee.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Owner Fee (7%)</span>
                  <span>-{calculateFees(bidAmount).ownerFee.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900 border-t pt-2">
                  <span>Refund Amount</span>
                  <span>{calculateFees(bidAmount).refundAmount.toFixed(4)} ETH</span>
                </div>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Terms and Conditions</h3>
            <div className="prose prose-sm text-gray-600">
              <p className="text-sm leading-relaxed">
                When placing a bid, 10% of your bid amount will be collected as fees. If you are outbid, 90% of your
                original bid will be automatically refunded. The highest bidder&apos;s advertisement will be displayed
                in the ad slot. Bids cannot be withdrawn or canceled once placed. By bidding, you agree to display
                appropriate advertisement content that complies with our platform&apos;s guidelines.
              </p>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="legalAgreement"
                checked={isChecked}
                onChange={e => setIsChecked(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500
                         focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="legalAgreement" className="text-sm text-gray-700 font-medium cursor-pointer">
                I have read and agree to the terms and conditions
              </label>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {renderBidInfo()}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Advertisement Image</h3>
            <p className="text-sm text-gray-500 mb-4">
              Select an image file that meets the required dimensions: {slot?.adSlotWidth.toString()} ×{" "}
              {slot?.adSlotHeight.toString()} px
            </p>
            <FileUploadButton onChange={handleFileChange} file={file} />
          </div>

          {preview && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h4>
              <div className="border rounded-lg p-2">
                <div className="relative w-full h-[200px]">
                  <Image src={preview} alt="Advertisement preview" fill className="object-contain rounded" />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderFooterButtons = () => {
    if (step === 1) {
      return (
        <div className="flex justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!isValidBidAmount()) {
                alert("Your bid must be higher than the current highest bid");
                return;
              }
              setStep(2);
            }}
            disabled={!isChecked || !bidAmount || parseFloat(bidAmount) <= 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-600"
          >
            Continue to Upload
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-between">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handlePlaceBid}
            disabled={!file || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-600"
          >
            {isLoading ? "Processing..." : "Place Bid"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <StatusModal status={uploadStatus} />
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleBackgroundClick}
      >
        <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-gray-500">Ad Slot: </span>
              <span className="text-blue-600">{slot?.adSlotName}</span>
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto px-6 py-4">{renderStepContent()}</div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">{renderFooterButtons()}</div>
        </div>
      </div>
    </>
  );
};
