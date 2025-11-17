import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { CalendarIcon, CalendarOff, Heart, Repeat, Clock, Calendar as CalendarIcon2, MessageSquare, X } from "lucide-react";
import { format } from "date-fns";
import { GeneralRequestType, RequestOffType, requestTypeOptions, generalRequestTypeOptions } from "../../../sampledata/requestOffData";
import { toast } from "sonner";

interface GeneralRequestPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: GeneralRequestType;
}

const iconMap = {
  CalendarOff,
  Heart,
  Repeat,
  Clock,
  Calendar: CalendarIcon2,
  MessageSquare,
};

export function GeneralRequestPanel({
  open,
  onOpenChange,
  defaultType = "day-off",
}: GeneralRequestPanelProps) {
  const [requestType, setRequestType] = useState<GeneralRequestType>(defaultType);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [dayOffType, setDayOffType] = useState<RequestOffType>("holiday");
  const [reason, setReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const selectedRequestConfig = generalRequestTypeOptions.find(opt => opt.value === requestType);
  const requiresDateRange = selectedRequestConfig?.requiresDateRange || false;

  const handleSubmit = () => {
    if (requestType === "day-off" && (!startDate || !endDate || !dayOffType)) {
      toast.error("Please fill in all required fields for day off request");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for your request");
      return;
    }

    // In a real app, this would send to backend
    toast.success(`${selectedRequestConfig?.label} submitted successfully!`);
    
    // Reset form
    setRequestType("day-off");
    setStartDate(undefined);
    setEndDate(undefined);
    setDayOffType("holiday");
    setReason("");
    setAdditionalDetails("");
    onOpenChange(false);
  };

  const isFormValid = 
    reason.trim().length > 0 && 
    (requestType !== "day-off" || (startDate && endDate && dayOffType));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Submit Request</SheetTitle>
          <SheetDescription>
            Submit a workplace request for review and approval
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Request Type Selection */}
          <div className="space-y-3">
            <Label>Request Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generalRequestTypeOptions.map((option) => {
                const Icon = iconMap[option.icon as keyof typeof iconMap];
                const isSelected = requestType === option.value;
                
                return (
                  <Card
                    key={option.value}
                    className={`p-4 cursor-pointer transition-all hover:border-ai-blue/50 ${
                      isSelected 
                        ? "border-ai-blue bg-ai-blue/5 shadow-md" 
                        : "border-border hover:shadow-sm"
                    }`}
                    onClick={() => setRequestType(option.value as GeneralRequestType)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-ai-blue text-white" : "bg-muted"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{option.label}</p>
                          {isSelected && (
                            <Badge variant="default" className="bg-ai-blue text-xs px-1.5 py-0">
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Day Off Specific Fields */}
          {requestType === "day-off" && (
            <>
              {/* Day Off Type */}
              <div className="space-y-2">
                <Label>Leave Type *</Label>
                <Select value={dayOffType} onValueChange={(value: RequestOffType) => setDayOffType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => {
                          if (!startDate) return date < new Date();
                          return date < startDate;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          )}

          {/* Shift Change/Swap Fields */}
          {requestType === "shift-change" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Shift Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Preferred New Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Time Adjustment Fields */}
          {requestType === "time-adjustment" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Adjustment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Requested Hours (Optional)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Reason/Description */}
          <div className="space-y-2">
            <Label>Reason / Details *</Label>
            <Textarea
              placeholder="Please provide detailed information about your request..."
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mb-0">
              {reason.length} / 500 characters
            </p>
          </div>
        </div>

        {/* Footer with Actions */}
        <SheetFooter className="px-6 py-4 border-t bg-muted/30 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 h-11 bg-ai-blue hover:bg-ai-blue/90"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Submit Request
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
