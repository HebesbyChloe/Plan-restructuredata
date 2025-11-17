import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Flag, Settings } from "lucide-react";

interface GoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoalsDialog({ open, onOpenChange }: GoalsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-purple-600" />
            Set Target Goals
          </DialogTitle>
          <DialogDescription>
            Define performance targets for your team members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="revenueGoal">Daily Revenue Goal ($)</Label>
            <Input id="revenueGoal" type="number" placeholder="10000" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="leadsGoal">Daily New Leads Goal</Label>
            <Input id="leadsGoal" type="number" placeholder="30" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="contactedGoal">Daily Contacted Goal</Label>
            <Input id="contactedGoal" type="number" placeholder="50" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="messagesGoal">Daily Messages Goal</Label>
            <Input id="messagesGoal" type="number" placeholder="150" className="mt-1" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            <Settings className="w-4 h-4 mr-2" />
            Save Goals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
