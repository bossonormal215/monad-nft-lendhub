"use client";

import type React from "react";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/Components/privy/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/privy/ui/card";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { login, authenticated, ready } = usePrivy();
  const address = useAccount();

  if (!ready) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!authenticated && ready && address) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to manage your NFT loans and lending activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full lg" onClick={login}>
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
