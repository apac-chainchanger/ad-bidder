"use client";

import Image from "next/image";
import Link from "next/link";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import type { NextPage } from "next";
import {
  ArrowPathIcon,
  CurrencyDollarIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { primaryWallet } = useDynamicContext();
  const connectedAddress = primaryWallet?.address;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="hero bg-gradient-to-b from-base-200 to-base-300 py-20">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <div className="flex justify-center mb-8">
              <Image src="/logo.svg" alt="AdBidder Logo" width={100} height={100} />
            </div>
            <h1 className="text-5xl font-bold mb-8">Welcome to AdBidder</h1>
            <p className="text-xl mb-8">The Next Generation Web3 Advertising Platform on Scroll Network</p>
            {connectedAddress ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">Connected Wallet:</span>
                  <Address address={connectedAddress as `0x${string}`} />
                </div>
                <div className="flex gap-4">
                  <Link href="/bid-center" className="btn btn-primary">
                    Start Bidding
                  </Link>
                  <Link href="/dashboard" className="btn btn-secondary">
                    View Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg mb-4">Connect your wallet to start bidding on ad slots</p>
                <DynamicWidget buttonClassName="btn btn-primary btn-lg" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AdBidder?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Scroll Benefits */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <div className="card-body items-center text-center">
                <ArrowPathIcon className="h-12 w-12 text-primary" />
                <h3 className="card-title">Powered by Scroll</h3>
                <p>
                  Experience lightning-fast transactions and minimal gas fees with Scroll&apos;s Layer 2 scaling
                  solution
                </p>
              </div>
            </div>

            {/* Dynamic Auth */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <div className="card-body items-center text-center">
                <ShieldCheckIcon className="h-12 w-12 text-primary" />
                <h3 className="card-title">Secure Authentication</h3>
                <p>Seamless wallet connection and authentication powered by Dynamic</p>
              </div>
            </div>

            {/* Bidding System */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <div className="card-body items-center text-center">
                <CurrencyDollarIcon className="h-12 w-12 text-primary" />
                <h3 className="card-title">Fair Bidding System</h3>
                <p>Transparent fee structure with 90% refund for outbid participants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-base-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <div className="bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <Square3Stack3DIcon className="h-6 w-6" />
                1. Place Your Bid
              </h3>
              <p className="space-y-2">
                <span className="block">• Select an available ad slot and place your bid with ETH</span>
                <span className="block">• Upload your ad image for AI verification</span>
                <span className="block">• Higher bids secure better ad placement visibility</span>
              </p>
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <CurrencyDollarIcon className="h-6 w-6" />
                2. Transparent Fee & Refund System
              </h3>
              <p className="space-y-2">
                <span className="block">• Platform takes only 10% fee from winning bids</span>
                <span className="block">• If someone places a higher bid, you automatically receive 90% refund</span>
                <span className="block">• All bid transitions and refunds are handled by secure smart contracts</span>
              </p>
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <PresentationChartLineIcon className="h-6 w-6" />
                3. AI-Powered Image Verification
              </h3>
              <p className="space-y-2">
                <span className="block">• Instant AI verification of ad image content</span>
                <span className="block">• Ensures compliance with platform standards</span>
                <span className="block">• Protects users from inappropriate or harmful content</span>
              </p>
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="h-6 w-6" />
                4. Secure & Automated
              </h3>
              <p className="space-y-2">
                <span className="block">• Smart contracts automatically handle bid transitions</span>
                <span className="block">• Instant refunds when higher bids are placed</span>
                <span className="block">• All transactions verified on Scroll&apos;s secure L2 network</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 text-center bg-base-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <p className="mb-8 text-lg">Join the future of decentralized advertising today</p>
          <div className="flex justify-center gap-4">
            <Link href="/bid-center" className="btn btn-primary btn-lg">
              View Ad Slots
            </Link>
            <Link href="/slot-creator" className="btn btn-secondary btn-lg">
              Create Ad Slot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
