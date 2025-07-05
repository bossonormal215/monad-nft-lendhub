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
import { useEffect } from "react";

export function AuthWrapper({
  children,
  message = "Connect your wallet to manage your NFT loans and lending activities"
}: {
  children: React.ReactNode;
  message?: string;
}) {
  const { login, authenticated, ready } = usePrivy();
  const { address } = useAccount();


  if (!ready) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Show connect message if user is not connected (either not authenticated or no address)
  if (!ready || !authenticated || !address) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            {message}
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
