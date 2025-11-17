/**
 * Activities Tab Component
 * Displays activity timeline with status tracking
 */

import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../ui/table";
import { Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";
// Removed mock data import - using real data from props
import { getActivityStatusColor } from "../utils/helpers";

interface ActivitiesTabProps {
  activities?: Array<{date: string; activity: string; status: string}>;
  loading?: boolean;
}

export function ActivitiesTab({ activities = [], loading = false }: ActivitiesTabProps) {
  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B6BFB] mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading activities...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-4">
      {/* View Calendar Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 bg-gradient-to-r from-[#4B6BFB]/5 to-[#6B8AFF]/5 hover:from-[#4B6BFB]/10 hover:to-[#6B8AFF]/10 border-[#4B6BFB]/20 text-[#4B6BFB] hover:text-[#4B6BFB]"
        onClick={() => {
          toast.success("Opening project calendar in new tab...");
        }}
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>View Project Calendar</span>
        <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
      </Button>
      
      {/* Activities Table */}
      <div className="rounded-lg border border-[#E5E5E5] dark:border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8F8F8] dark:bg-muted/30">
              <TableHead>Date</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-8">
                  No activities found
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity, index) => (
              <TableRow key={index} className="hover:bg-accent/50">
                <TableCell className="text-sm text-muted-foreground">
                  {activity.date}
                </TableCell>
                <TableCell>{activity.activity}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getActivityStatusColor(activity.status)}
                  >
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
