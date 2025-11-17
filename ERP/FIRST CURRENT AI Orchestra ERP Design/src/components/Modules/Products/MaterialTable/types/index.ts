import { Material } from "@/sampledata";

export interface MaterialTableModuleProps {
  materials: Material[];
  selectedMaterial: Material | null;
  onMaterialClick: (material: Material) => void;
  searchTerm?: string;
}

export type { Material };
