import { motion } from "motion/react";
import { Trophy, Medal } from "lucide-react";

interface TeamMember {
  name: string;
  revenue: number;
  goal: number;
}

interface TeamLeaderboardProps {
  members: TeamMember[];
}

export function TeamLeaderboard({ members }: TeamLeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Medal className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {members.map((member, index) => {
        const percentage = (member.revenue / member.goal) * 100;
        return (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-2.5 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {getRankIcon(index)}
                <p className="mb-0 text-sm truncate">{member.name}</p>
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400">
                ${member.revenue.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.05 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {percentage.toFixed(0)}% of goal
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
