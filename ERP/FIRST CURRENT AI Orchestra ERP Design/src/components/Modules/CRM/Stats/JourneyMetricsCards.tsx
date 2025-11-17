import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";

export function JourneyMetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="mb-4">Time to First Purchase</h3>
        <p className="text-4xl mb-2">8.5 days</p>
        <p className="text-sm text-muted-foreground">
          Average time from first visit to purchase
        </p>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fastest</span>
            <span>2 hours</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Median</span>
            <span>5 days</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Slowest</span>
            <span>45 days</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="mb-4">Customer Journey Touchpoints</h3>
        <p className="text-4xl mb-2">4.2</p>
        <p className="text-sm text-muted-foreground">
          Average touchpoints before purchase
        </p>
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Email</span>
            <Badge variant="secondary">68%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Social Media</span>
            <Badge variant="secondary">52%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Website</span>
            <Badge variant="secondary">89%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Mobile App</span>
            <Badge variant="secondary">43%</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
