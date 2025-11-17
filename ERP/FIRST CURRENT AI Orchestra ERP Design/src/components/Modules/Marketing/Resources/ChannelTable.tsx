import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Channel, getStatusColor } from "./resourcesData";

interface ChannelTableProps {
  channels: Channel[];
  onRowClick: (channel: Channel) => void;
}

export function ChannelTable({ channels, onRowClick }: ChannelTableProps) {
  return (
    <Card className="border-glass-border bg-glass-bg/30 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Reach</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channels.map((channel) => (
            <TableRow
              key={channel.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onRowClick(channel)}
            >
              <TableCell>{channel.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{channel.type}</Badge>
              </TableCell>
              <TableCell className="opacity-60">{channel.platform}</TableCell>
              <TableCell>{(channel.reach / 1000).toFixed(0)}K</TableCell>
              <TableCell>{channel.engagement}%</TableCell>
              <TableCell>${channel.budget?.toLocaleString() || "—"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(channel.status)}>
                  {channel.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
