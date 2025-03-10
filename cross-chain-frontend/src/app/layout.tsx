
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Web3Wrapper from "../Components/Web3Wrapper"; // This for thirdweb
import Web3Wrapper from "@/Components/privy/Web3Wrapper"; // tis for privy
import { Toaster } from "@/Components/privy/ui/toaster";
import { WagmiConfig } from "@/providers/wagmi-provider";

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monad DeFi Hub",
  description: "NFT Lending on Monad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-900">
          <Web3Wrapper>
          <WagmiConfig>
            {children}
            <Toaster />
            </WagmiConfig>
          </Web3Wrapper>

        </main>
      </body>
    </html>
  );
}



// import type { Metadata } from "next";
// import { Inter } from 'next/font/google';
// import "./globals.css";
// import { PrivyProvider } from "@privy-io/react-auth";
// import { WagmiConfig } from "@/providers/wagmi-provider";
// // import { ThemeProvider } from "@/omponents/theme-provider";
// import { monadTestnet } from "viem/chains";
// import { Toaster } from "@/Components/privy/ui/toaster";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "NFT LendHub - P2P NFT Lending on Monad",
//   description: "Peer-to-peer NFT lending platform built on Monad",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//       <WagmiConfig>
//         <PrivyProvider
//           appId={process.env.NEXT_PUBLIC_PRIVY_API_KEY as string}
//           config={
//             {
//               // Customize Privy's appearance in your app
//               appearance: {
//                 theme: 'dark',
//                 accentColor: '#676FFF',
//                 logo: 'https://your-logo-url',
//               },
//               // Create embedded wallets for users who don't have a wallet
//               embeddedWallets: {
//                 createOnLogin: 'users-without-wallets',
//               },
//               defaultChain: monadTestnet,
//               supportedChains: [monadTestnet]
//             }}
//         >
          
            
//               {children}
//               <Toaster />
//         </PrivyProvider>
//         </WagmiConfig>
//       </body>
//     </html>
//   );
// }
