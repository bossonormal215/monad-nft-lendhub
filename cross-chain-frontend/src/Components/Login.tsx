'use client'

import { usePrivy, useActiveWallet } from "@privy-io/react-auth";
import { act, useEffect, useState } from "react";
import { theme } from "@/styles/theme";

export default function Login() {
  const { ready, login, logout, user, authenticated } = usePrivy();
  const [wallet, setWallet] = useState<string | null>(null);
  // const activeWallet = useActiveWallet();

  // const provider =  activeWallet.getEthereumProvider()
  

  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    if (user && user.wallet) {
      setWallet(user.wallet.address);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] shadow-xl">
      {authenticated ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-300">
              <span className="ml-2 font-mono text-sm bg-gray-800 px-3 py-1 rounded">
                {wallet?.slice(0, 6)}...{wallet?.slice(-4)}
              </span>
            </p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          disabled={disableLogin}
          onClick={login}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg
                   hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Login With Privy
        </button>
      )}
    </div>
  );
}
