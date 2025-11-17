import { motion } from "motion/react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ProductCategory {
  category: string;
  sales: number;
  growth: number;
}

interface TopProductCategoriesCardProps {
  categories: ProductCategory[];
}

export function TopProductCategoriesCard({ categories }: TopProductCategoriesCardProps) {
  const maxSales = Math.max(...categories.map((c) => c.sales));

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="mb-6">Top Product Categories</h3>
      <div className="space-y-4">
        {categories.map((item, index) => (
          <div key={item.category} className="flex items-center gap-4">
            <div className="w-8 text-center">
              <span className="text-sm opacity-60">#{index + 1}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span>{item.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {item.sales} sales
                  </span>
                  <Badge
                    className={
                      item.growth > 0
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }
                  >
                    {item.growth > 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(item.growth)}%
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-ai-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.sales / maxSales) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
