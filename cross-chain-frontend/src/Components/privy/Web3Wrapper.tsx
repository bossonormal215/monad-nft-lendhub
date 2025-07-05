import PrivyWrapper from "../PrivyWrapper";


export default function Web3Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyWrapper>

      {children}

    </PrivyWrapper>
  )
}