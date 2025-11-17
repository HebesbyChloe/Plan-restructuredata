import { Bundle } from "@/sampledata";

export interface BundleTableModuleProps {
  bundles: Bundle[];
  selectedBundle: Bundle | null;
  onBundleClick: (bundle: Bundle) => void;
}

export type { Bundle };
