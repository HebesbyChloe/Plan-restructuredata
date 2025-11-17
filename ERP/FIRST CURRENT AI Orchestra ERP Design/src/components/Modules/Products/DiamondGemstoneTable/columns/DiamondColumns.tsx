import { Badge } from "../../../../ui/badge";
import { Diamond } from "../types";
import { getDiamondStatusColor, formatCurrency } from "../utils/helpers";

export function DiamondSKUColumn({ diamond }: { diamond: Diamond }) {
  return <div className="font-mono text-sm text-muted-foreground">{diamond.sku}</div>;
}

export function DiamondNameColumn({ diamond }: { diamond: Diamond }) {
  return (
    <div>
      <p className="mb-0">{diamond.name}</p>
      <p className="text-xs text-muted-foreground mb-0 capitalize">{diamond.type}</p>
    </div>
  );
}

export function DiamondSpecsColumn({ diamond }: { diamond: Diamond }) {
  return (
    <div className="text-sm">
      <div className="flex gap-1">
        <Badge variant="outline" className="text-xs">{diamond.carat}ct</Badge>
        <Badge variant="outline" className="text-xs">{diamond.color}</Badge>
        <Badge variant="outline" className="text-xs">{diamond.clarity}</Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1 mb-0">{diamond.cut}</p>
    </div>
  );
}

export function DiamondShapeColumn({ diamond }: { diamond: Diamond }) {
  return <span className="text-sm capitalize">{diamond.shape}</span>;
}

export function DiamondCertColumn({ diamond }: { diamond: Diamond }) {
  return (
    <Badge variant="outline" className="text-xs">
      {diamond.certificationLab}
    </Badge>
  );
}

export function DiamondPriceColumn({ diamond }: { diamond: Diamond }) {
  return (
    <div className="text-right">
      <div className="text-sm">{formatCurrency(diamond.retailPrice)}</div>
      <div className="text-xs text-muted-foreground">{formatCurrency(diamond.unitCost)}</div>
    </div>
  );
}

export function DiamondStockColumn({ diamond }: { diamond: Diamond }) {
  return (
    <div className="text-right text-sm">
      {diamond.quantityInStock}
    </div>
  );
}

export function DiamondStatusColumn({ diamond }: { diamond: Diamond }) {
  return (
    <Badge className={`text-xs capitalize ${getDiamondStatusColor(diamond.status)}`}>
      {diamond.status}
    </Badge>
  );
}

export function DiamondLocationColumn({ diamond }: { diamond: Diamond }) {
  return (
    <Badge variant="outline" className="text-xs">
      {diamond.location}
    </Badge>
  );
}
