"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { fuse, sepolia } from "viem/chains";

const handleLogin = (user: any) => {
  console.log(`User ${user.id} logged in!`);
};

function PrivyProviderB({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      onSuccess={handleLogin}
      config={{
        loginMethods: [
          "wallet",
          "email",
          "google",
          "twitter",
          "apple",
          "discord",
          "github",
        ],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          noPromptOnSignature:true,
        },
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://jiffyscan-frontend.vercel.app/images/Frame%2021.svg",
        },
        supportedChains: [fuse,sepolia
          // Add any other supported chains here
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default PrivyProviderB;