import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface ShiftReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftForm: {
    name: string;
    shift: string;
    revenue: string;
    firstOrders: string;
    cartSent: string;
    potential: string;
    newLeads: string;
    contacted: string;
    messages: string;
    note: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export function ShiftReportDialog({
  open,
  onOpenChange,
  shiftForm,
  onFormChange,
  onSubmit,
}: ShiftReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            Submit End of Shift Report
          </DialogTitle>
          <DialogDescription>
            Complete your shift report with today's performance metrics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Auto-filled info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <Label>Name</Label>
              <Input value={shiftForm.name} disabled className="mt-1" />
            </div>
            <div>
              <Label>Shift</Label>
              <Input value={shiftForm.shift} disabled className="mt-1" />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="0"
                value={shiftForm.revenue}
                onChange={(e) => onFormChange("revenue", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="firstOrders">First Orders</Label>
              <Input
                id="firstOrders"
                type="number"
                placeholder="0"
                value={shiftForm.firstOrders}
                onChange={(e) => onFormChange("firstOrders", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cartSent">Cart Sent</Label>
              <Input
                id="cartSent"
                type="number"
                placeholder="0"
                value={shiftForm.cartSent}
                onChange={(e) => onFormChange("cartSent", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="potential">Potential Leads</Label>
              <Input
                id="potential"
                type="number"
                placeholder="0"
                value={shiftForm.potential}
                onChange={(e) => onFormChange("potential", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newLeads">New Leads</Label>
              <Input
                id="newLeads"
                type="number"
                placeholder="0"
                value={shiftForm.newLeads}
                onChange={(e) => onFormChange("newLeads", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contacted">Contacted</Label>
              <Input
                id="contacted"
                type="number"
                placeholder="0"
                value={shiftForm.contacted}
                onChange={(e) => onFormChange("contacted", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="messages">Messages Sent</Label>
              <Input
                id="messages"
                type="number"
                placeholder="0"
                value={shiftForm.messages}
                onChange={(e) => onFormChange("messages", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="note">Additional Notes (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Any highlights, challenges, or observations from your shift..."
              value={shiftForm.note}
              onChange={(e) => onFormChange("note", e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
