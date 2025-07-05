"use client";

import { ZeroXSwap } from "@/components/0x/0xSwap";
import { Toaster } from "@/Components/privy/ui/toaster";

export default function SwapPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Token Swap
                    </h1>
                    <p className="text-muted-foreground">
                        Swap tokens using Privy and 0x Protocol
                    </p>
                </div>

                <ZeroXSwap />

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Powered by{" "}
                        <a
                            href="https://0x.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            0x Protocol
                        </a>
                        {" "}and{" "}
                        <a
                            href="https://privy.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Privy
                        </a>
                    </p>
                </div>
            </div>

            <Toaster />
        </div>
    );
}
