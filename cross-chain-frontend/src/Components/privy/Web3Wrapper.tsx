import PrivyWrapper from "../PrivyWrapper";
import { SwapProvider } from "@/Components/privy/providers/swap-provider";


export default function Web3Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyWrapper>
      <SwapProvider>
        {children}
      </SwapProvider>
    </PrivyWrapper>
  )
}