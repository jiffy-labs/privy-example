import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import {
  createWalletClient,
  custom,
  createPublicClient,
  http,
} from "viem";
import { createSmartAccountClient, walletClientToSmartAccountSigner } from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { fuse } from "viem/chains";
import { useRouter } from "next/navigation";

const usePrivySmartAccount = () => {
  const pimlicoApiKey = process.env.PIMLICO_API_KEY;
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const [embeddedWallet, setEmbeddedWallet] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<string>("");

  useEffect(() => {
    if (!ready) return;
    setUp();
  }, [ready, wallets]);

  const setUp = async () => {
    try {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );

      if (embeddedWallet) {
        const provider = await embeddedWallet.getEthereumProvider();

        await provider.request({ method: "eth_requestAccounts" });

        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(122).toString(16)}` }],
        });

        const ethProvider = new ethers.providers.Web3Provider(provider);
        const walletBalance = await ethProvider.getBalance(embeddedWallet.address);
        const ethStringAmount = ethers.utils.formatEther(walletBalance);

        setEmbeddedWallet(embeddedWallet);
        setWalletBalance(ethStringAmount);

        const privyClient = createWalletClient({
          account: embeddedWallet.address,
          chain: fuse,
          transport: custom(provider),
        });

        const customSigner = walletClientToSmartAccountSigner(privyClient);

        const publicClient = createPublicClient({
          chain: fuse,
          transport: http(),
        });

        const simpleSmartAccount = await signerToSimpleSmartAccount(publicClient, {
          entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
          signer: customSigner,
          factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
        });

        const pimlicoPaymaster = createPimlicoPaymasterClient({
          transport: http(`https://api.pimlico.io/v2/fuse/rpc?apikey=${pimlicoApiKey}`),
          entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        });

        const smartAccountClient = createSmartAccountClient({
          account: simpleSmartAccount,
          chain: fuse,
          transport: http(`https://api.pimlico.io/v1/fuse/rpc?apikey=${pimlicoApiKey}`),
          sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation,
        });

        setEmbeddedWallet({ ...embeddedWallet, smartAccountClient });
      } else {
        console.error("Embedded wallet not found");
      }
    } catch (error) {
      console.error("Error setting up embedded wallet", error);
    }
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated]);

  return { ready, authenticated, user, embeddedWallet, walletBalance, wallets };
};

export default usePrivySmartAccount;
