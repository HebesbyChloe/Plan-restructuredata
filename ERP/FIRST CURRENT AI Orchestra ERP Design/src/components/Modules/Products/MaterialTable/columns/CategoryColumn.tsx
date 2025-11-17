import { Badge } from "../../../../ui/badge";
import { Material } from "../types";
import { getCategoryColor } from "../utils/materialTableHelpers";

interface CategoryColumnProps {
  material: Material;
}

export function CategoryColumn({ material }: CategoryColumnProps) {
  return (
    <Badge className={`text-xs capitalize ${getCategoryColor(material.category)}`}>
      {material.category}
    </Badge>
  );
}
