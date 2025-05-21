// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Web3Wrapper from "../Components/Web3Wrapper"; // This for thirdweb
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// // const queryClient = new QueryClient();

// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Monad DeFi Hub",
//   description: "NFT Lending on Monad",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
//       <body className={inter.className}>
//         <main className="min-h-screen bg-gray-900">
//           <Web3Wrapper>
//             {children}
//           </Web3Wrapper>
//         </main>
//       </body>
//     </html>
//   );
// }

//////////////////////--------------------------PRIVY PROVIDER------------------------//////////////////////////////////////////

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Web3Wrapper from "../Components/Web3Wrapper"; // This for thirdweb
import Web3Wrapper from "@/Components/privy/Web3Wrapper"; // this for privy
import { Toaster } from "@/Components/privy/ui/toaster";
import { WagmiConfig } from "@/providers/wagmi-provider";
import { Header } from "@/components/header";
import FeedbackModal from "@/components/feedback/feedback";
import ThemeToggle from "@/components/ThemeToggle";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LendHub",
  description: "Peer-2-Peer NFT Lending on Monad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      {/* <body className={inter.className}> */}
      <body className={inter.className + ' bg-white dark:bg-gray-900'}>
        {/* <main className="min-h-screen bg-gray-900"> */}
        <main className="min-h-screen bg-white dark:bg-gray-900">

          <Web3Wrapper>
            <WagmiConfig>
              <Header />
              {children}
              <Toaster />
            </WagmiConfig>
          </Web3Wrapper>
        </main>
        {/* Feedback Button Fixed Bottom-Right */}
        <div className="fixed bottom-6 right-6 z-50">
          <FeedbackModal />
        </div>
        {/* Dark/Light Mode Toggle Fixed Bottom-Left */}
        <ThemeToggle />
      </body>
    </html>
  );
}

/////////////////-----------------ALCHEMY SMART WALLET--------------///////////////////
/*
import { config } from "../../config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./provider";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monad LendHub",
  description: "P2P NFT Lending on Monad",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    config,
    (await headers()).get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
*/
