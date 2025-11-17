import { motion } from "motion/react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Trophy, Award, Users, Zap } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "individual" | "team";
  targetValue: number;
  currentValue: number;
  reward: number;
  startDate: Date;
  endDate: Date;
  participants: number;
  status: "active" | "completed" | "expired";
}

interface ActiveChallengesCardProps {
  challenges: Challenge[];
  showAll: boolean;
  onToggleShowAll: () => void;
}

export function ActiveChallengesCard({
  challenges,
  showAll,
  onToggleShowAll,
}: ActiveChallengesCardProps) {
  const activeChallenges = challenges.filter((c) => c.status === "active");
  const displayedChallenges = showAll ? activeChallenges : activeChallenges.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl mb-0 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            Active Challenges
          </h2>
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-500/30">
            {activeChallenges.length} Active
          </Badge>
        </div>

        <div className="space-y-3">
          {displayedChallenges.map((challenge, index) => {
            const progress = (challenge.currentValue / challenge.targetValue) * 100;
            const circumference = 2 * Math.PI * 36; // radius of 36
            const strokeDashoffset = circumference - (progress / 100) * circumference;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              >
                <Card className="p-4 bg-background/50 hover:bg-background/80 transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {/* Circular Progress */}
                    <div className="relative flex-shrink-0">
                      <svg className="w-20 h-20 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          className="text-border"
                        />
                        {/* Progress circle */}
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="url(#gradient)"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.05 }}
                          style={{
                            strokeDasharray: circumference,
                          }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4B6BFB" />
                            <stop offset="100%" stopColor="#9B51E0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Percentage text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-ai-blue">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>

                    {/* Challenge Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold mb-0">{challenge.title}</h3>
                            <Badge
                              className={`${
                                challenge.type === "team"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {challenge.type === "team" ? <Users className="w-3 h-3 mr-1" /> : null}
                              {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                        </div>
                        <div className="text-right ml-2">
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Award className="w-4 h-4" />
                            <span className="font-semibold">{challenge.reward}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-0">points</p>
                        </div>
                      </div>

                      {/* Progress Text */}
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-0">
                          {challenge.currentValue.toLocaleString()} /{" "}
                          {challenge.targetValue.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {challenge.participants} participants
                        </span>
                        <span>
                          Ends{" "}
                          {challenge.endDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={onToggleShowAll}>
          <Zap className="w-4 h-4 mr-2" />
          {showAll ? "Show Less" : "View More Challenges"}
        </Button>
      </Card>
    </motion.div>
  );
}
