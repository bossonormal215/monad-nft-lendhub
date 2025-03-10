"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();

  return (
    <nav className="bg-monadDark text-monadLight px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-monadBlue">
        <Link href="/nftlendhub">NFT LendHub</Link>
      </h1>

      <div className="flex items-center space-x-6">
        <Link href="/nftlendhub/list-nft" className="text-monadBlue font-semibold">
          List NFT
        </Link>
        </div>

      {authenticated ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm">{user?.wallet?.address}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-monadPurple text-white rounded-lg hover:bg-opacity-80"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="px-4 py-2 bg-monadBlue text-white rounded-lg hover:bg-opacity-80"
        >
          Connect Wallet
        </button>
      )}
    </nav>
    
  );
}
