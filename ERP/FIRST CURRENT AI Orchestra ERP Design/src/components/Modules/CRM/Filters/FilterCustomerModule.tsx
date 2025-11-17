import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Search, Filter, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  CUSTOMER_STATUSES,
  CUSTOMER_STAGES,
  CUSTOMER_RANKS,
  EMOTION_GROUPS,
  SALES_REPS,
  CONTACT_METHODS,
  DATE_FILTERS,
} from "../../../../lib/config";

interface FilterCustomerModuleProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  stageFilter: string;
  setStageFilter: (value: string) => void;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  repFilter: string;
  setRepFilter: (value: string) => void;
  contactFilter: string;
  setContactFilter: (value: string) => void;
  rankFilter: string;
  setRankFilter: (value: string) => void;
  emotionFilter: string;
  setEmotionFilter: (value: string) => void;
  createdDateFilter: string;
  setCreatedDateFilter: (value: string) => void;
}

export function FilterCustomerModule({
  statusFilter,
  setStatusFilter,
  stageFilter,
  setStageFilter,
  timeFilter,
  setTimeFilter,
  searchQuery,
  setSearchQuery,
  showAdvancedFilters,
  setShowAdvancedFilters,
  repFilter,
  setRepFilter,
  contactFilter,
  setContactFilter,
  rankFilter,
  setRankFilter,
  emotionFilter,
  setEmotionFilter,
  createdDateFilter,
  setCreatedDateFilter,
}: FilterCustomerModuleProps) {
  return (
    <Card className="p-4 backdrop-blur-sm bg-glass-bg border-glass-border">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 opacity-60" />
            <p className="opacity-60 mb-0">Filters</p>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {CUSTOMER_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {CUSTOMER_STAGES.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FILTERS.map((date) => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            Advanced
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </Button>
          <Button variant="ghost">Clear</Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border pt-4"
          >
            <p className="opacity-60 mb-3">Advanced Filters</p>
            <div className="flex flex-wrap gap-3">
              <Select value={repFilter} onValueChange={setRepFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Reps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reps</SelectItem>
                  {SALES_REPS.map((rep) => (
                    <SelectItem key={rep.value} value={rep.value}>
                      {rep.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={contactFilter} onValueChange={setContactFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Contacts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contact Methods</SelectItem>
                  {CONTACT_METHODS.map((contact) => (
                    <SelectItem key={contact.value} value={contact.value}>
                      {contact.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Ranks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  {CUSTOMER_RANKS.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={emotionFilter} onValueChange={setEmotionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Emotions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Emotions</SelectItem>
                  {EMOTION_GROUPS.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label} ({group.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={createdDateFilter} onValueChange={setCreatedDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Created Date" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FILTERS.map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
