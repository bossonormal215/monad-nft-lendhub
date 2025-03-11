// "use client"

// import type { ReactNode } from "react"
// import { PrivyProvider } from "@privy-io/react-auth"
// import { createConfig, http } from "wagmi";
// import { monadTestnet } from "wagmi/chains";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { WagmiProvider } from "wagmi";

// const queryClient = new QueryClient();

// const config = createConfig({
//   chains: [monadTestnet],
//   transports: {
//     [monadTestnet.id]: http(),
//   },
// });

// // Privy configuration
// const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string

// interface Web3WrapperProps {
//   children: ReactNode
// }

// export default function Web3Wrapper({ children }: Web3WrapperProps) {
//   return (
//     <WagmiProvider config={config}>
    
//       <PrivyProvider
//         appId={privyAppId}
//         config={{
//             supportedChains: [monadTestnet],
//             defaultChain: monadTestnet,
//           loginMethods: ["wallet", "email", "google", "twitter"],
//           appearance: {
//             theme: "dark",
//             accentColor: "#6366F1",
//           },
//           embeddedWallets: {
//             createOnLogin: "users-without-wallets",
//           },
//         }}
//       >
//         <QueryClientProvider client={queryClient}>
//                 {children}
//               </QueryClientProvider>
//       </PrivyProvider>
  
//     </WagmiProvider>
//   )
// }

