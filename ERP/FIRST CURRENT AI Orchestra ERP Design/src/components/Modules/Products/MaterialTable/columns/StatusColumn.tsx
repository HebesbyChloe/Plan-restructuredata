import { Badge } from "../../../../ui/badge";
import { Material } from "../types";
import { getStatusColor } from "../utils/materialTableHelpers";

interface StatusColumnProps {
  material: Material;
}

export function StatusColumn({ material }: StatusColumnProps) {
  const statusText = material.status.replace('_', ' ');
  
  return (
    <Badge className={`text-xs capitalize ${getStatusColor(material.status)}`}>
      {statusText}
    </Badge>
  );
}
