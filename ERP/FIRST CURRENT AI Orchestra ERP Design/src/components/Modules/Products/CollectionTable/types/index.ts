import { Collection } from "@/sampledata";

export interface CollectionTableModuleProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onCollectionClick: (collection: Collection) => void;
}

export type { Collection };
