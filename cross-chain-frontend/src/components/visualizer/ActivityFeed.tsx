"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface Activity {
    id: string;
    type: "listed" | "funded" | "repaid" | "claimed";
    loanId: string;
    amount: string;
    timestamp: number;
    collection: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    const getActivityIcon = (type: Activity["type"]) => {
        switch (type) {
            case "listed":
                return "📝";
            case "funded":
                return "💰";
            case "repaid":
                return "✅";
            case "claimed":
                return "🎯";
            default:
                return "📌";
        }
    };

    const getActivityColor = (type: Activity["type"]) => {
        switch (type) {
            case "listed":
                return "bg-blue-100 text-blue-800";
            case "funded":
                return "bg-green-100 text-green-800";
            case "repaid":
                return "bg-purple-100 text-purple-800";
            case "claimed":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {activities.map((activity) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-lg ${getActivityColor(activity.type)}`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">
                                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                        </p>
                                        <p className="text-sm opacity-75">
                                            Loan #{activity.loanId}
                                        </p>
                                    </div>
                                    <span className="text-sm opacity-75">
                                        {formatDistanceToNow(new Date(activity.timestamp * 1000), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm">
                                        Amount: {activity.amount} MON
                                    </p>
                                    <p className="text-sm opacity-75">
                                        Collection: {activity.collection}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
} 