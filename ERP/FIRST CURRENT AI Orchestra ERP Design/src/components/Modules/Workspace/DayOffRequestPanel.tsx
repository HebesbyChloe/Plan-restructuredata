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
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { RequestOffType, requestTypeOptions } from "../../../sampledata/requestOffData";

interface DayOffRequestPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    startDate: Date;
    endDate: Date;
    reason: string;
    requestType: RequestOffType;
  }) => void;
}

export function DayOffRequestPanel({
  open,
  onOpenChange,
  onSubmit,
}: DayOffRequestPanelProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [requestType, setRequestType] = useState<RequestOffType>("holiday");

  const handleSubmit = () => {
    if (startDate && endDate && reason && requestType) {
      onSubmit({ startDate, endDate, reason, requestType });
      // Reset form
      setStartDate(undefined);
      setEndDate(undefined);
      setReason("");
      setRequestType("holiday");
      onOpenChange(false);
    }
  };

  const isFormValid = startDate && endDate && reason.trim() && requestType;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className="w-full sm:max-w-[540px] flex flex-col p-0"
        side="right"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Request Day Off</SheetTitle>
          <SheetDescription>
            Submit a request for time off. Your manager will review and approve your request.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Info Alert */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-ai-blue/5 border border-ai-blue/20">
              <AlertCircle className="w-5 h-5 text-ai-blue mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-0">
                  Please submit your request at least 3 days in advance for non-emergency leave.
                </p>
              </div>
            </div>

            {/* Request Type */}
            <div className="space-y-3">
              <Label htmlFor="request-type" className="text-base">
                Request Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={requestType}
                onValueChange={(value) => setRequestType(value as RequestOffType)}
              >
                <SelectTrigger id="request-type" className="h-11">
                  <SelectValue placeholder="Select request type" />
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

            {/* Date Range Section */}
            <div className="space-y-6">
              {/* Start Date */}
              <div className="space-y-3">
                <Label htmlFor="start-date" className="text-base">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className="w-full justify-start text-left h-11"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <Label htmlFor="end-date" className="text-base">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant="outline"
                      className="w-full justify-start text-left h-11"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-3">
              <Label htmlFor="reason" className="text-base">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for your time off request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mb-0">
                {reason.length} / 500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <SheetFooter className="px-6 py-4 border-t bg-muted/30 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 h-11 bg-ai-blue hover:bg-ai-blue/90"
          >
            Submit Request
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
