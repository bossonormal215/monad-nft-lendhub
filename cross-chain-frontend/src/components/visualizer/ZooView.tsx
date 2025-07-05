"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Monanimal {
    id: string;
    name: string;
    color: string;
    size: number;
    happiness: number;
    x: number;
    y: number;
    loanAmount: number;
    interestRate: number;
}

interface ZooViewProps {
    monanimals: Monanimal[];
    selectedCollection: string;
    zooPadding?: number;
}

export function ZooView({ monanimals, selectedCollection, zooPadding = 15 }: ZooViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Animation variants for monanimals
    const monanimalVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: (monanimal: Monanimal) => ({
            scale: monanimal.size,
            opacity: 1,
            x: ((zooPadding + (monanimal.x - zooPadding) * ((100 - 2 * zooPadding) / 100)) / 100) * (containerRef.current?.offsetWidth || 1),
            y: ((zooPadding + (monanimal.y - zooPadding) * ((100 - 2 * zooPadding) / 100)) / 100) * (containerRef.current?.offsetHeight || 1),
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        }),
        hover: {
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
    };

    // Calculate metrics for tooltip
    const getMonanimalMetrics = (monanimal: Monanimal) => {
        return {
            loanAmount: `${monanimal.loanAmount.toFixed(2)} MON`,
            interestRate: `${monanimal.interestRate}%`,
            happiness: `${Math.round(monanimal.happiness * 100)}%`,
        };
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-gradient-to-br from-white/10 to-[#f0f0ff]/10 rounded-lg overflow-hidden"
        >
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/zoo-bg.png')] bg-cover opacity-10" />

            {/* Monanimals */}
            {monanimals.map((monanimal) => (
                <motion.div
                    key={monanimal.id}
                    custom={monanimal}
                    variants={monanimalVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    className="absolute cursor-pointer shadow-lg"
                    style={{
                        width: `${monanimal.size * 60}px`,
                        height: `${monanimal.size * 60}px`,
                        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.18))',
                    }}
                >
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: monanimal.color,
                            opacity: 0.85,
                        }}
                    >
                        <div className="text-white text-xs font-bold text-center px-1">
                            {monanimal.name}
                        </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs">
                            <p>Loan: {getMonanimalMetrics(monanimal).loanAmount}</p>
                            <p>Interest: {getMonanimalMetrics(monanimal).interestRate}</p>
                            <p>Happiness: {getMonanimalMetrics(monanimal).happiness}</p>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-lg text-xs">
                <p>Size = Loan Amount</p>
                <p>Color = Collection</p>
                <p>Happiness = Interest Rate</p>
            </div>
        </div>
    );
} 