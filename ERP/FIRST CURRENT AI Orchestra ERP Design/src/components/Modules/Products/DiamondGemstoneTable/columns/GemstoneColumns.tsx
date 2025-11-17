import { Badge } from "../../../../ui/badge";
import { Gemstone } from "../types";
import { getGemstoneStatusColor, formatCurrency } from "../utils/helpers";

export function GemstoneSKUColumn({ gemstone }: { gemstone: Gemstone }) {
  return <div className="font-mono text-sm text-muted-foreground">{gemstone.sku}</div>;
}

export function GemstoneNameColumn({ gemstone }: { gemstone: Gemstone }) {
  return (
    <div>
      <p className="mb-0">{gemstone.name}</p>
      <p className="text-xs text-muted-foreground mb-0">{gemstone.color}</p>
    </div>
  );
}

export function GemstoneVarietyColumn({ gemstone }: { gemstone: Gemstone }) {
  return (
    <div className="text-sm">
      <div>{gemstone.variety}</div>
      <Badge variant="outline" className="text-xs mt-1 capitalize">
        {gemstone.stoneType}
      </Badge>
    </div>
  );
}

export function GemstoneOriginColumn({ gemstone }: { gemstone: Gemstone }) {
  return <span className="text-sm">{gemstone.origin}</span>;
}

export function GemstoneSpecsColumn({ gemstone }: { gemstone: Gemstone }) {
  return (
    <div className="text-sm">
      <div className="flex gap-1">
        <Badge variant="outline" className="text-xs">{gemstone.carat}ct</Badge>
        <Badge variant="outline" className="text-xs capitalize">{gemstone.shape}</Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1 mb-0">{gemstone.treatment}</p>
    </div>
  );
}

export function GemstonePriceColumn({ gemstone }: { gemstone: Gemstone }) {
  return (
    <div className="text-right">
      <div className="text-sm">{formatCurrency(gemstone.retailPrice)}</div>
      <div className="text-xs text-muted-foreground">{formatCurrency(gemstone.unitCost)}</div>
    </div>
  );
}

export function GemstoneStockColumn({ gemstone }: { gemstone: Gemstone }) {
  return (
    <div className="text-right text-sm">
      {gemstone.quantityInStock}
    </div>
  );
}

export function GemstoneStatusColumn({ gemstone }: { gemstone: Gemstone }) {
  return (
    <Badge className={`text-xs capitalize ${getGemstoneStatusColor(gemstone.status)}`}>
      {gemstone.status}
    </Badge>
  );
}

export function GemstoneLocationColumn({ gemstone }: { gemstone: Gemstone }) {
  return (
    <Badge variant="outline" className="text-xs">
      {gemstone.location}
    </Badge>
  );
}
