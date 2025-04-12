"use client";

import { useEffect, useState } from "react";
// import { Header } from "@/components/header"
import { Button } from "@/Components/privy/ui/button";
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
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/Components/privy/ui/use-toast";
import { useReadContract, useWriteContract } from "wagmi";
import { useAccount, useWalletClient } from "wagmi";
import {
  NFT_LENDHUB_ADDRESS,
  NFT_LENDHUB_ABI,
  ERC721_ABI,
  WMON_ADDRESS,
} from "@/components/lib/constants";
import { parseAmount } from "@/components/lib/utils";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/Components/privy/ui/toaster";
import { WagmiConfig } from "@/providers/wagmi-provider";
import { SelectNFTModal, NFT } from "@/components/SelectNFTModal";

export default function BorrowPage() {
  const { user, authenticated, login } = usePrivy();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const [nftId, setNftId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5");
  const [loanDuration, setLoanDuration] = useState("7");
  const [isApproving, setIsApproving] = useState(false);
  const [txMessage, setTxMessage] = useState("");
  const [isListing, setIsListing] = useState(false);
  const [nftAddress, setNftAddress] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
    setNftAddress(nft.contractAddress);
    setNftId(nft.tokenId);
    console.log("Selected NFT floor price:", nft.floorPrice);
  };

  const { data: nftOwner, isSuccess: nftOwnerSuccess } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "ownerOf",
    args: [BigInt(nftId || "0")],
  });

  const isOwner =
    address && nftOwner && nftOwnerSuccess && address === nftOwner;

  useEffect(() => {
    if (nftOwner && !isOwner && nftOwnerSuccess) {
      console.log("Contract returned owner:", nftOwner);
      console.log("Contract returned owner:", isOwner);
      if (address) {
        console.log("Your address:", address);
      } else if (!address) {
        console.log("NO address");
        login();
      } else {
        console.log("Your address: not yet available");
      }
    }
  }, [nftOwner, isOwner, nftOwnerSuccess, address]);

  const { data: approvedAddress, refetch: refetchApproval } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "getApproved",
    args: [BigInt(nftId || "0")],
    query: {
      enabled: !!nftAddress && !!nftId,
    },
  });

  const { writeContractAsync: approveNft } = useWriteContract();
  const { writeContractAsync: listNft } = useWriteContract();

  const handleActionClick = async () => {
    // if (!authenticated) return login();
    // if (
    //   !nftId ||
    //   !nftAddress ||
    //   !loanAmount ||
    //   !interestRate ||
    //   !loanDuration
    // ) {
    //   toast({
    //     title: "Error",
    //     description: "Missing required fields",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    if (!authenticated) {
      login();
      return;
    }

    if (!isConnected || !walletClient) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before approving.",
        variant: "destructive",
      });
      return;
    }

    if (!nftAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid NFT collection address",
        variant: "destructive",
      });
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

    if (!nftAddress || !selectedNFT) {
      toast({
        title: "Error",
        description: "No NFT selected",
        variant: "destructive",
      });
      return;
    }

    if (!isOwner) {
      console.log("nft owner: ", nftOwner);
      console.log("connected address: ", address);
      toast({
        title: "Error",
        description: "You don't own this NFT",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(loanAmount);
    const floor = selectedNFT.floorPrice ?? 0;

    // ✅ Enforcing floor price check
    if (amount > floor) {
      toast({
        title: "Invalid Loan Amount",
        description: `Loan amount (${amount} wMON) exceeds floor price (${floor} wMON).`,
        variant: "destructive",
      });
      return;
    }
    if (!amount) {
      toast({
        title: "Invalid Loan Amount",
        description: `Loan Amount cant be empty`,
        variant: "destructive",
      });
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

    const isAlreadyApproved = approvedAddress === NFT_LENDHUB_ADDRESS;

    try {
      if (!isAlreadyApproved) {
        setIsApproving(true);
        setTxMessage("Approving NFT for Listing ...");
        await approveNft({
          address: nftAddress as `0x${string}`,
          abi: ERC721_ABI,
          functionName: "approve",
          args: [NFT_LENDHUB_ADDRESS, BigInt(nftId)],
        });
        await refetchApproval(); // ✅ Re-check approval after tx
        toast({
          title: "Approved!",
          description: "NFT is approved for lending",
        });
      }

      setIsListing(true);
      setTxMessage("Listing NFT For Loan ...");
      await listNft({
        address: NFT_LENDHUB_ADDRESS,
        abi: NFT_LENDHUB_ABI,
        functionName: "listNFTForLoan",
        args: [
          nftAddress,
          BigInt(nftId),
          parseAmount(loanAmount),
          BigInt(interestRate),
          BigInt(Number.parseInt(loanDuration) * 86400),
          WMON_ADDRESS,
        ],
      });

      toast({ title: "Success", description: "NFT listed for loan" });
      // Reset
      setNftId("");
      setLoanAmount("");
      setInterestRate("5");
      setLoanDuration("7");
    } catch (err) {
      console.error("❌ Action failed:", err);
      toast({
        title: "Error",
        description: "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
      setIsListing(false);
    }
  };

  const handleApproveNft = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!isConnected || !walletClient) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before approving.",
        variant: "destructive",
      });
      return;
    }

    if (!nftAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid NFT collection address",
        variant: "destructive",
      });
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

    if (!nftAddress || !selectedNFT) {
      toast({
        title: "Error",
        description: "No NFT selected",
        variant: "destructive",
      });
      return;
    }

    if (!isOwner) {
      console.log("nft owner: ", nftOwner);
      console.log("connected address: ", address);
      toast({
        title: "Error",
        description: "You don't own this NFT",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(loanAmount);
    const floor = selectedNFT.floorPrice ?? 0;

    // ✅ Enforcing floor price check
    if (amount > floor) {
      toast({
        title: "Invalid Loan Amount",
        description: `Loan amount (${amount} wMON) exceeds floor price (${floor} wMON).`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsApproving(true);
      await approveNft({
        address: nftAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "approve",
        args: [NFT_LENDHUB_ADDRESS, BigInt(nftId)],
      });

      toast({
        title: "Success",
        description: "NFT approved for listing",
      });
    } catch (error) {
      console.error("Error approving NFT:", error);
      toast({
        title: "Error",
        description: "Failed to approve NFT",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

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

    if (!nftAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid NFT collection address",
        variant: "destructive",
      });
      return;
    }

    if (!isOwner) {
      toast({
        title: "Error",
        description: "You don't own this NFT",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsListing(true);
      await listNft({
        address: NFT_LENDHUB_ADDRESS,
        abi: NFT_LENDHUB_ABI,
        functionName: "listNFTForLoan",
        args: [
          nftAddress,
          BigInt(nftId),
          parseAmount(loanAmount),
          BigInt(interestRate),
          BigInt(Number.parseInt(loanDuration) * 86400), // Convert days to seconds
          WMON_ADDRESS,
        ],
      });

      toast({
        title: "Success",
        description: "NFT listed for loan",
      });

      // Reset form
      setNftId("");
      setLoanAmount("");
      setInterestRate("5");
      setLoanDuration("7");
    } catch (error) {
      console.error("Error listing NFT:", error);
      toast({
        title: "Error",
        description: "Failed to list NFT for loan",
        variant: "destructive",
      });
    } finally {
      setIsListing(false);
    }
  };

  return (
    <WagmiConfig>
      <div className="flex min-h-screen flex-col">
        {/* <Header /> */}
        <main className="flex-1 container py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-foreground">
                Borrow Against Your NFT
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                List your NFT as collateral and get a loan in wMON
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border border-monad-border bg-card">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-foreground">
                    NFT Information
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Enter the details of the NFT you want to use as collateral
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4">
                  {/* <div className="space-y-1">
                    <Label htmlFor="nft-address" className="text-xs text-foreground">
                      NFT Collection Address
                    </Label>
                    <Input
                      id="nft-address"
                      placeholder="Enter NFT collection address"
                      value={nftAddress}
                      onChange={(e) => setNftAddress(e.target.value)}
                      className="h-8 text-sm bg-muted border-monad-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="nft-id" className="text-xs text-foreground">
                      NFT ID
                    </Label>
                    <Input
                      id="nft-id"
                      placeholder="Enter your NFT ID"
                      value={nftId}
                      onChange={(e) => setNftId(e.target.value)}
                      className="h-8 text-sm bg-muted border-monad-border"
                    />
                  </div> */}

                  <div className="space-y-1">
                    <Label className="text-xs text-foreground">
                      Select NFT From Wallet
                    </Label>
                    <SelectNFTModal onSelect={handleNFTSelect} />
                  </div>

                  {selectedNFT && (
                    <div className="flex gap-4 items-center p-2 mt-2 rounded-md border border-monad-border bg-muted">
                      <div className="flex-1 space-y-1 text-xs">
                        <p className="font-semibold text-foreground">
                          NFT ID: {selectedNFT.tokenId}
                        </p>
                        <p className="text-muted-foreground break-all text-[10px]">
                          Address: {selectedNFT.contractAddress}
                        </p>
                      </div>
                    </div>
                  )}

                  {nftId && nftAddress && nftOwner !== undefined && (
                    <div className="pt-1">
                      <p className="text-xs text-foreground">
                        Owner:{" "}
                        <span
                          className={
                            isOwner ? "text-green-500" : "text-red-500"
                          }
                        >
                          {isOwner
                            ? "You own this NFT"
                            : "You don't own this NFT"}
                        </span>
                      </p>
                      {/* {isOwner && ( */}
                      <p className="text-xs text-foreground">
                        Floor price:{" "}
                        <span className="text-green-500">
                          {selectedNFT?.floorPrice !== undefined &&
                          selectedNFT.floorPrice !== null
                            ? `${selectedNFT.floorPrice} wMON`
                            : "Loading..."}
                        </span>
                      </p>
                      {/* )} */}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-2">
                  {/* <Button
                    onClick={handleApproveNft}
                    disabled={!isOwner || isApproving}
                    className="w-full bg-monad-500 hover:bg-monad-600 text-white h-8 text-sm disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      "Approve NFT"
                    )}
                  </Button> */}

                  {/* <Button
                    onClick={handleActionClick}
                    disabled={!isOwner || isApproving || isListing}
                    className="w-full bg-monad-500 hover:bg-monad-600 text-white h-8 text-sm disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Approving...
                      </>
                    ) : isListing ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Listing...
                      </>
                    ) : (
                      "List NFT for Loan"
                    )}
                  </Button> */}
                </CardFooter>
              </Card>

              {/* <Card className="border border-monad-border bg-card">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-foreground">Loan Terms</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Specify the terms for your loan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4">
                  <div className="space-y-1">
                    <Label htmlFor="loan-amount" className="text-xs text-foreground">
                      Loan Amount (wMON)
                    </Label>
                    <Input
                      id="loan-amount"
                      placeholder="e.g. 1.5"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="h-8 text-sm bg-muted border-monad-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="interest-rate" className="text-xs text-foreground">
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
                    <Label htmlFor="loan-duration" className="text-xs text-foreground">
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
                          variant={loanDuration === duration.value ? "default" : "outline"}
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
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-2">
                  <Button
                    onClick={handleListNft}
                    disabled={!isOwner || isListing}
                    className="w-full bg-monad-500 hover:bg-monad-600 text-white h-8 text-sm disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {isListing ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Listing NFT...
                      </>
                    ) : (
                      "List NFT for Loan"
                    )}
                  </Button>
                </CardFooter>
              </Card> */}

              <Card className="border border-monad-border bg-card">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-foreground">
                    Loan Terms
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Specify the terms for your loan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 px-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="loan-amount"
                      className="text-xs text-foreground"
                    >
                      Loan Amount (wMON)
                    </Label>
                    <Input
                      id="loan-amount"
                      placeholder="e.g. 1.5"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="h-8 text-sm bg-muted border-monad-border"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="interest-rate"
                      className="text-xs text-foreground"
                    >
                      Interest Rate: {interestRate}%
                    </Label>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full accent-monad-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="loan-duration"
                      className="text-xs text-foreground"
                    >
                      Loan Duration: {loanDuration} days
                    </Label>
                    <input
                      type="range"
                      min={1}
                      max={90}
                      value={loanDuration}
                      onChange={(e) => setLoanDuration(e.target.value)}
                      className="w-full accent-monad-500"
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-2">
                  {/* <Button
                    onClick={handleListNft}
                    disabled={!isOwner || isListing}
                    className="w-full bg-monad-500 hover:bg-monad-600 text-white h-8 text-sm disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {isListing ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Listing NFT...
                      </>
                    ) : (
                      "List NFT for Loan"
                    )}
                  </Button> */}
                  <Button
                    onClick={handleActionClick}
                    disabled={!isOwner || isApproving || isListing}
                    className="w-full bg-monad-500 hover:bg-monad-600 text-white h-8 text-sm disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Approving NFT for Listing ...
                      </>
                    ) : isListing ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Listing NFT For Loan ...
                      </>
                    ) : (
                      "List NFT for Loan"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-6">
              <Card className="border border-monad-border bg-card">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-foreground">
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                    <li>Enter your NFT ID and approve the NFT for listing</li>
                    <li>
                      Specify your desired loan amount, interest rate, and
                      duration
                    </li>
                    <li>List your NFT as collateral</li>
                    <li>
                      Once a lender funds your loan, you can claim the loan
                      amount
                    </li>
                    <li>
                      Repay the loan (principal + interest) before the due date
                      to get your NFT back
                    </li>
                    <li>
                      If you don't repay, the lender can claim your NFT after
                      the grace period
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-4 w-full shrink-0 items-center px-4 md:px-6 border-t border-monad-border">
          <p className="text-xs text-muted-foreground">
            © 2024 NFT LendHub. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </a>
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </a>
          </nav>
        </footer>
      </div>
      <Toaster />
    </WagmiConfig>
  );
}
