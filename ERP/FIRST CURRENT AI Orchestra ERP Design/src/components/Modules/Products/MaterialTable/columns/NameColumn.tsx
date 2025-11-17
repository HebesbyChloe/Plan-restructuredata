import { Material } from "../types";

interface NameColumnProps {
  material: Material;
}

export function NameColumn({ material }: NameColumnProps) {
  return (
    <div>
      <p className="mb-0">{material.name}</p>
      {material.color && material.size && (
        <p className="text-xs text-muted-foreground mb-0">
          {material.color} • {material.size}
        </p>
      )}
    </div>
  );
}
