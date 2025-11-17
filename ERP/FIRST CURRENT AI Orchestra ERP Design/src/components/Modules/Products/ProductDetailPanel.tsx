import { motion, AnimatePresence } from "motion/react";
import { X, Save, Package, Gem } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ReactNode } from "react";

interface Tab {
  value: string;
  label: string;
  content: ReactNode;
}

interface ProductDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  subtitle?: string;
  tabs: Tab[];
  defaultTab?: string;
  headerActions?: ReactNode;
  productType?: "material" | "diamond" | "product" | "custom" | "bundle";
}

export function ProductDetailPanel({
  isOpen,
  onClose,
  onSave,
  title,
  subtitle,
  tabs,
  defaultTab = "overview",
  headerActions,
  productType = "product",
}: ProductDetailPanelProps) {
  const getIcon = () => {
    switch (productType) {
      case "material":
        return Package;
      case "diamond":
        return Gem;
      default:
        return Package;
    }
  };

  const Icon = getIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[90vw] md:w-[500px] lg:w-[600px] z-50"
          >
            <div className="h-full bg-white dark:bg-card border-l border-[#E5E5E5] dark:border-border shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-[#E5E5E5] dark:border-border bg-[#F8F8F8] dark:bg-muted/30 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0 truncate">{title}</h3>
                    </div>
                    {subtitle && (
                      <p className="text-sm text-muted-foreground mb-0 truncate">{subtitle}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0 ml-2"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions */}
                {(onSave || headerActions) && (
                  <div className="flex gap-2">
                    {onSave && (
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] to-[#B89763] text-white"
                        onClick={onSave}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    )}
                    {headerActions}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue={defaultTab} className="w-full h-full flex flex-col">
                  <TabsList className="w-full justify-start border-b border-[#E5E5E5] dark:border-border rounded-none bg-transparent px-6 flex-shrink-0">
                    {tabs.map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="p-6 space-y-6 flex-1 overflow-y-auto"
                    >
                      {tab.content}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper components for common content patterns
interface InfoCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function InfoCard({ label, value, className = "" }: InfoCardProps) {
  return (
    <div className={`p-3 rounded-lg bg-[#F8F8F8] dark:bg-muted/50 ${className}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm mb-0">{value}</p>
    </div>
  );
}

interface StockCardProps {
  label: string;
  value: string | number;
  isLow?: boolean;
}

export function StockCard({ label, value, isLow = false }: StockCardProps) {
  return (
    <div className="p-3 rounded-lg bg-[#F8F8F8] dark:bg-muted/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={`text-lg mb-0 ${
          isLow ? "text-red-600 dark:text-red-400" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm">{label}</label>
      {children}
    </div>
  );
}
