import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrivyProviderB from "./providers/PrivyProviderB";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Privy Demo",
  description: "Demo using Privy for authentication giving users the option to login in with web2 social accounts",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PrivyProviderB>
      <body className={inter.className}>{children}</body>
      </PrivyProviderB>
    </html>
  );
}
