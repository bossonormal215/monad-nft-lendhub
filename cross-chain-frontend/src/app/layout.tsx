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


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Web3Wrapper from "../Components/Web3Wrapper"; // This for thirdweb
import Web3Wrapper from "@/Components/privy/Web3Wrapper"; // this for privy
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

export default function RootLayout({ children,}: { children: React.ReactNode;}) {

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


