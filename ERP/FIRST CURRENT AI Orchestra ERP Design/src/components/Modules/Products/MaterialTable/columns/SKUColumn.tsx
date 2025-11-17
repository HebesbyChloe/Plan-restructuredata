import { Material } from "../types";

interface SKUColumnProps {
  material: Material;
}

export function SKUColumn({ material }: SKUColumnProps) {
  return (
    <div className="font-mono text-sm text-muted-foreground">
      {material.sku}
    </div>
  );
}
