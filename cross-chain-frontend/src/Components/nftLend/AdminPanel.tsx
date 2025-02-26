import { useState } from 'react';
import { ethers } from 'ethers';

interface AdminPanelProps {
    isAdmin: boolean;
    onAddWhitelist: (address: string) => Promise<void>;
    onTogglePublicSale: () => Promise<void>;
}

export function AdminPanel({ isAdmin, onAddWhitelist, onTogglePublicSale }: AdminPanelProps) {
    const [whitelistAddress, setWhitelistAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [AdminError, setAdminError] = useState('');
    const [status, setStatus] = useState('');

    if (!isAdmin) return null;

    const handleAddToWhitelist = async () => {
        try {
            setAdminError('');
            setStatus('');
            setIsLoading(true);

            // Validate and format the address
            const formattedAddress = ethers.utils.getAddress(whitelistAddress.trim());
            await onAddWhitelist(formattedAddress);

            setStatus('Address added to whitelist successfully');
            setWhitelistAddress(''); // Clear input after success
        } catch (err: any) {
            console.error('Whitelist error:', err);
            setAdminError(err.message || 'Invalid address format');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-[#131A2A] rounded-[20px] p-6 mb-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#F5F6FC]">Admin Panel</h2>
                    <span className="px-3 py-1 text-sm bg-[#4C82FB] text-white rounded-full">Admin</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#98A1C0] mb-2">Add to Whitelist</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={whitelistAddress}
                                onChange={(e) => {
                                    setWhitelistAddress(e.target.value);
                                    setAdminError('');
                                    setStatus('');
                                }}
                                placeholder="Enter address"
                                className="flex-1 px-4 py-3 bg-[#0D111C] border border-[#1C2839] rounded-[20px]
                                         text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]"
                            />
                            <button
                                onClick={handleAddToWhitelist}
                                disabled={!whitelistAddress.trim() || isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-[20px]
                                         text-white font-medium hover:opacity-90 disabled:opacity-50 
                                         disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                        {AdminError && <p className="mt-2 text-sm text-red-500">{AdminError}</p>}
                        {status && <p className="mt-2 text-sm text-green-500">{status}</p>}
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#98A1C0]">Public Sale Status</span>
                        <button
                            onClick={onTogglePublicSale}
                            disabled={isLoading}
                            className="px-6 py-3 bg-[#222C3B] text-[#F5F6FC] rounded-[20px] 
                                     hover:bg-[#2C3545] transition-colors"
                        >
                            Toggle Public Sale
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
} 