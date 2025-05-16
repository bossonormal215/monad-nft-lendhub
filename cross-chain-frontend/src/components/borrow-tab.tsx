"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/privy/ui/card";
import { Input } from "@/Components/privy/ui/input";
import { Label } from "@/Components/privy/ui/label";
import { Button } from "@/Components/privy/ui/button";
import { useAccount, useWriteContract } from "wagmi";
import { createPublicClient, http } from "viem";
import {
  ERC721_ABI,
  // NFT_LENDHUB_ABI,
  NFT_LENDHUB_ABI_V2,
} from "./lib/constants";
import {
  NFT_ADDRESS,
  // NFT_LENDHUB_ADDRESS,
  WMON_ADDRESS,
  NFT_LENDHUB_ADDRESS_V2,
} from "./lib/constants";
import { useToast } from "@/Components/privy/ui/use-toast";
import { usePrivy } from "@privy-io/react-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/privy/ui/select";
import { parseAmount } from "./lib/utils";
import { Loader2 } from "lucide-react";
import { SelectNFTModal, NFT } from "./SelectNFTModal";
import { AuthWrapper } from "@/Components/privy/auth-wrapper";
import { monadTestnet } from "viem/chains";

const BorrowTab = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const { authenticated, login } = usePrivy();

  const { writeContractAsync: approveNft } = useWriteContract();
  const { writeContractAsync: listNft } = useWriteContract();

  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(
      process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC ||
        "https://testnet-rpc.monad.xyz"
    ),
  });

  const [nftId, setNftId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5");
  const [loanDuration, setLoanDuration] = useState("7");
  const [loanToken, setLoanToken] = useState(WMON_ADDRESS);

  const [isApproving, setIsApproving] = useState(false);
  const [isListing, setIsListing] = useState(false);

  const [nftAddress, setNftAddress] = useState(NFT_ADDRESS);

  // ✅ Handle NFT Approval
  const handleApproveNft = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!nftId) {
      toast({
        title: "Error",
        description: "Please enter a valid NFT ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsApproving(true);
      console.log("🔹 Approving NFT:", nftAddress, nftId);

      // Simulate the transaction
      try {
        await client.simulateContract({
          address: nftAddress as `0x${string}`,
          abi: ERC721_ABI,
          functionName: "approve",
          args: [NFT_LENDHUB_ADDRESS_V2, BigInt(nftId)], // version 2
          account: address,
        });
      } catch (error: any) {
        console.log("❌ Simulation Error:", error);
        toast({
          title: "NFT Approval Error",
          description: error?.message || "This transaction will fail.",
          variant: "destructive",
        });
        return;
      }

      await approveNft({
        address: nftAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "approve",
        // args: [NFT_LENDHUB_ADDRESS, BigInt(nftId)], // version 1
        args: [NFT_LENDHUB_ADDRESS_V2, BigInt(nftId)], // version 2
      });

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 4000));

      toast({ title: "Success", description: "NFT approved for lending" });
    } catch (error) {
      console.error("❌ Error approving NFT:", error);
      toast({
        title: "Error",
        description: "Failed to approve NFT",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  // ✅ Handle Listing NFT for Loan
  const handleListNft = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!nftId || !loanAmount || !interestRate || !loanDuration) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsListing(true);
      console.log("🔹 Listing NFT for Loan:", nftAddress, nftId);

      // Simulate the transaction
      try {
        await client.simulateContract({
          address: NFT_LENDHUB_ADDRESS_V2,
          abi: NFT_LENDHUB_ABI_V2,
          functionName: "listNFTForLoan",
          args: [
            nftAddress,
            BigInt(nftId),
            parseAmount(loanAmount),
            BigInt(interestRate),
            BigInt(Number.parseInt(loanDuration) * 86400), // Convert days to seconds
            loanToken,
          ],
          account: address,
        });
      } catch (error: any) {
        console.log("❌ Simulation Error:", error);
        toast({
          title: "Listing Error",
          description: error?.message || "This transaction will fail.",
          variant: "destructive",
        });
        // ✅ Reset form
        setNftId("");
        setLoanAmount("");
        setInterestRate("5");
        setLoanDuration("7");
        setLoanToken(WMON_ADDRESS);
        return;
      }

      await listNft({
        // address: NFT_LENDHUB_ADDRESS, // version 1
        address: NFT_LENDHUB_ADDRESS_V2, // version 2
        // abi: NFT_LENDHUB_ABI, // version 1
        abi: NFT_LENDHUB_ABI_V2, // version 2
        functionName: "listNFTForLoan",
        args: [
          nftAddress,
          BigInt(nftId),
          parseAmount(loanAmount),
          BigInt(interestRate),
          BigInt(Number.parseInt(loanDuration) * 86400), // Convert days to seconds
          loanToken,
        ],
      });

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 4000));

      toast({ title: "Success", description: "NFT listed for loan" });

      // ✅ Reset form
      setNftId("");
      setLoanAmount("");
      setInterestRate("5");
      setLoanDuration("7");
      setLoanToken(WMON_ADDRESS);
    } catch (error) {
      console.error("❌ Error listing NFT:", error);
      toast({
        title: "Error",
        description: "Failed to list NFT for loan",
        variant: "destructive",
      });
    } finally {
      setIsListing(false);
    }
  };

  const handleNFTSelect = (nft: NFT) => {
    setNftAddress(nft.contractAddress);
    setNftId(nft.tokenId);
  };

  return (
    <AuthWrapper>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-monad-border bg-card">
          <CardHeader className="bg-gradient-to-r from-card to-card/90 py-3 px-4">
            <CardTitle className="text-base text-foreground">
              NFT Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your NFT details
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 pt-3 px-4">
            <div className="space-y-1">
              <Label className="text-xs text-foreground">
                Select NFT From Wallet
              </Label>
              <SelectNFTModal onSelect={handleNFTSelect} />
            </div>

            {nftId && nftAddress && (
              <div className="flex gap-4 items-center p-2 mt-2 rounded-md border border-monad-border bg-muted">
                <div className="flex-1 space-y-1 text-xs">
                  <p className="font-semibold text-foreground">
                    NFT ID: {nftId}
                  </p>
                  <p className="text-muted-foreground break-all text-[10px]">
                    Address: {nftAddress}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-monad-border pt-3 px-4 pb-4">
            <Button
              disabled={isApproving || isListing}
              onClick={handleApproveNft}
              className="w-full bg-monad-500 hover:bg-monad-600 text-white disabled:bg-muted disabled:text-muted-foreground h-8 text-sm"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve NFT"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-monad-border bg-card">
          <CardHeader className="bg-gradient-to-r from-card to-card/90 py-3 px-4">
            <CardTitle className="text-base text-foreground">
              Loan Terms
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Specify your loan requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-3 px-4">
            <div className="space-y-1">
              <Label htmlFor="loan-amount" className="text-xs text-foreground">
                Loan Amount
              </Label>
              <Input
                id="loan-amount"
                placeholder="Enter loan amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="bg-muted border-monad-border focus:border-monad-500 focus:ring-monad-500/20 h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="interest-rate"
                className="text-xs text-foreground"
              >
                Interest Rate (%)
              </Label>
              <div className="grid grid-cols-4 gap-1">
                {["5", "10", "15", "20"].map((rate) => (
                  <Button
                    key={rate}
                    type="button"
                    variant={interestRate === rate ? "default" : "outline"}
                    className={`h-7 text-xs px-1 ${
                      interestRate === rate
                        ? "bg-monad-500 hover:bg-monad-600 text-white"
                        : "border-monad-border hover:border-monad-500 hover:text-monad-500"
                    }`}
                    onClick={() => setInterestRate(rate)}
                  >
                    {rate}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="loan-duration"
                className="text-xs text-foreground"
              >
                Loan Duration
              </Label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { value: "7", label: "7d" },
                  { value: "14", label: "14d" },
                  { value: "30", label: "30d" },
                  { value: "60", label: "60d" },
                ].map((duration) => (
                  <Button
                    key={duration.value}
                    type="button"
                    variant={
                      loanDuration === duration.value ? "default" : "outline"
                    }
                    className={`h-7 text-xs px-1 ${
                      loanDuration === duration.value
                        ? "bg-monad-500 hover:bg-monad-600 text-white"
                        : "border-monad-border hover:border-monad-500 hover:text-monad-500"
                    }`}
                    onClick={() => setLoanDuration(duration.value)}
                  >
                    {duration.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground">Loan Token</Label>
              <Select value={loanToken} onValueChange={setLoanToken}>
                <SelectTrigger className="bg-muted border-monad-border focus:ring-monad-500/20 h-8 text-sm">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-card border-monad-border">
                  <SelectItem value={WMON_ADDRESS}>WMON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="border-t border-monad-border pt-3 px-4 pb-4">
            <Button
              disabled={isApproving || isListing}
              onClick={handleListNft}
              className="w-full bg-monad-500 hover:bg-monad-600 text-white disabled:bg-muted disabled:text-muted-foreground h-8 text-sm"
            >
              {isListing ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Listing...
                </>
              ) : (
                "List NFT for Loan"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2 border border-monad-border bg-card">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base text-foreground">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
              <li>Enter your NFT ID and approve the NFT for listing</li>
              <li>
                Specify your desired loan amount, interest rate, and duration
              </li>
              <li>List your NFT as collateral</li>
              <li>
                Once a lender funds your loan, you can claim the loan amount
              </li>
              <li>
                Repay the loan (principal + interest) before the due date to get
                your NFT back
              </li>
              <li>
                If you don't repay, the lender can claim your NFT after the
                grace period
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
};

export default BorrowTab;
