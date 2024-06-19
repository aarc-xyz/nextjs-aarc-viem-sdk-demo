// components/Button.js
"use client";

import { AarcCore } from "@aarc-xyz/core-viem";
import { useState } from "react";
import toast from "react-hot-toast";
import { createWalletClient, custom, http } from "viem";
import { mainnet, polygon } from "viem/chains";

let aarcSDK = new AarcCore("bcb520c6-c1f5-4304-a8ef-82458e7dbdc8");

export default function ClientButton() {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      // Retrieve Account from an EIP-1193 Provider.
      //@ts-ignore
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletClient = createWalletClient({
        chain: polygon,
        account,

        //@ts-ignore
        transport: custom(window.ethereum!),
      });

      const [address] = await walletClient.requestAddresses();

      console.log("Address: ", address);

      const formattedAddress = `${address.slice(0, 7)}...${address.slice(-4)}`;
      toast.success(`Account: ${formattedAddress}`);

      if (!address) toast.error("Account not found");

      const chainId = walletClient.chain.id;
      toast.success(`Chain ID: ${chainId}`);
      console.log("Chain ID: ", chainId, walletClient.chain);

      const response = await aarcSDK.performDeposit({
        senderSigner: walletClient,
        fromChainId: 137, // Polygon Mainnet
        fromTokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
        toChainId: 42161, // Arbitrum One Mainnet
        toTokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC
        fromAmount: "2000000",
        userAddress: address,
        recipient: "0xeDa8Dec60B6C2055B61939dDA41E9173Bab372b2",

        //@ts-ignore
        account: address,
      });

      console.log("Response: ", response);
      toast.success("Deposit sign successfuly");
    } catch (e) {
      console.log(e);
      toast.error("Failed to sign deposit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => {
        onClick();
      }}
      className="z-10 flex items-center justify-center px-8 py-4 text-white bg-gradient-to-br from-sky-500 to-blue-500 rounded-full shadow-lg backdrop-blur-lg dark:from-sky-900 dark:to-blue-900 dark:shadow-2xl"
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.09a4.001 4.001 0 00-4 4.001H6zm5.373 0h3.254a4.001 4.001 0 00-3.254 3.254V17z"
          ></path>
        </svg>
      )}
      Connect and Deposit
    </button>
  );
}
