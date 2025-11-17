import { Diamond, Gemstone } from "@/sampledata";

export interface DiamondTableModuleProps {
  diamonds: Diamond[];
  selectedDiamond: Diamond | null;
  onDiamondClick: (diamond: Diamond) => void;
}

export interface GemstoneTableModuleProps {
  gemstones: Gemstone[];
  selectedGemstone: Gemstone | null;
  onGemstoneClick: (gemstone: Gemstone) => void;
}

export type { Diamond, Gemstone };
