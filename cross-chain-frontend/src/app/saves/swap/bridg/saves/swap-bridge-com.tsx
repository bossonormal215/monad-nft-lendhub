{/* Swap Section */}
<div>
<h2 className="text-xl font-semibold mb-4 text-[#F5F6FC]">Token Swap</h2>
{/* <div className="bg-[#0F172A] rounded-[24px] border border-[#1C2839] p-1"> */}
<div className="bg-[#0F172A] rounded-[24px] border border-[#1C2839] p-6">
  <div className="space-y-4">
  <Swap />
  </div>
</div>
</div>

{/* Bridge Section */}
<div>
<h2 className="text-xl font-semibold mb-4 text-[#F5F6FC]">Cross-Chain Bridge</h2>
<div className="bg-[#0F172A] rounded-[24px] border border-[#1C2839] p-6">
  <div className="space-y-4">
    <div>
      <label className="text-sm text-[#98A1C0] mb-2 block">Recipient Address</label>
      <input
        type="text"
        placeholder="Enter Monad address"
        className="w-full px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                 text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]
                 transition-colors"
        onChange={(e) => setRecipient(e.target.value)}
      />
    </div>
    <div>
      <label className="text-sm text-[#98A1C0] mb-2 block">Amount</label>
      <input
        type="number"
        placeholder="0.0"
        className="w-full px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                 text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]
                 transition-colors"
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
    <button
      onClick={handleTip}
      disabled={isLoading || disableTipping}
      className={`w-full py-4 rounded-[20px] font-semibold text-[16px] transition-colors
                 ${isLoading || disableTipping
          ? 'bg-[#222C3B] text-[#5D6785] cursor-not-allowed'
          : 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white hover:opacity-90'
        }`}
    >
      {isLoading ? "Processing..." : "Bridge Now"}
    </button>
  </div>
</div>
</div>