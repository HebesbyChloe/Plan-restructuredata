"use client";

import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Settings2, Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateAttributeVariantPanel } from "../../panels";
import { AttributeTableModule, VariantTableModule } from "../../Modules/Products";
import { Attribute, Variant } from "../../Modules/Products/AttributeVariantTable/types";
import { mockAttributes } from "../../../sampledata/attributes";
import { mockVariants } from "../../../sampledata/variants";
import { ProductDetailPanel } from "../../Modules/Products/ProductDetailPanel";

export function AttributesVariantsPage() {
  // Use sample data
  const [attributes] = useState<Attribute[]>(mockAttributes);
  const [variants] = useState<Variant[]>(mockVariants);

  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isAttributePanelOpen, setIsAttributePanelOpen] = useState(false);
  const [isVariantPanelOpen, setIsVariantPanelOpen] = useState(false);
  const [isCreateAttributePanelOpen, setIsCreateAttributePanelOpen] = useState(false);
  const [isCreateVariantPanelOpen, setIsCreateVariantPanelOpen] = useState(false);

  const handleAttributeClick = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setIsAttributePanelOpen(true);
  };

  const handleVariantClick = (variant: Variant) => {
    setSelectedVariant(variant);
    setIsVariantPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center shadow-lg">
            <Settings2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Attributes & Variants</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Manage product attributes and variant combinations
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-0">Total Attributes</p>
            <p className="mb-0">{attributes.length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-0">Active Attributes</p>
            <p className="mb-0">{attributes.filter((a) => a.required).length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-0">Total Variants</p>
            <p className="mb-0">{variants.length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-0">Active Variants</p>
            <p className="mb-0">{variants.filter((v) => v.isActive).length}</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="attributes" className="space-y-6">
        <TabsList className="bg-[#F8F8F8] dark:bg-muted">
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        {/* Attributes Tab */}
        <TabsContent value="attributes" className="space-y-6">
          {/* Create Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setIsCreateAttributePanelOpen(true)}
              className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Attribute
            </Button>
          </div>

          {/* Attributes Table - Using Module */}
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <AttributeTableModule
              attributes={attributes}
              selectedAttribute={selectedAttribute}
              onAttributeClick={handleAttributeClick}
            />
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-6">
          {/* Create Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setIsCreateVariantPanelOpen(true)}
              className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Variant
            </Button>
          </div>

          {/* Variants Table - Using Module */}
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <VariantTableModule
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantClick={handleVariantClick}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Attribute Panel */}
      <CreateAttributeVariantPanel
        isOpen={isCreateAttributePanelOpen}
        onClose={() => setIsCreateAttributePanelOpen(false)}
        mode="attribute"
        onSave={(attribute) => {
          console.log("New attribute:", attribute);
          toast.success("Attribute created successfully!");
        }}
      />

      {/* Create Variant Panel */}
      <CreateAttributeVariantPanel
        isOpen={isCreateVariantPanelOpen}
        onClose={() => setIsCreateVariantPanelOpen(false)}
        mode="variant"
        onSave={(variant) => {
          console.log("New variant:", variant);
          toast.success("Variant created successfully!");
        }}
      />

      {/* Attribute Detail Panel */}
      {selectedAttribute && (
        <ProductDetailPanel
          isOpen={isAttributePanelOpen}
          onClose={() => {
            setIsAttributePanelOpen(false);
            setSelectedAttribute(null);
          }}
          title={selectedAttribute.name}
          subtitle={selectedAttribute.description ?? ''}
          productType="product"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="mb-0 capitalize">{selectedAttribute.type ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Required</p>
                      <p className="mb-0">{selectedAttribute.required ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  {selectedAttribute.values && selectedAttribute.values.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Values</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAttribute.values.map((value, idx) => (
                          <span key={idx} className="px-2 py-1 bg-muted/30 rounded text-xs">{value}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Variant Detail Panel */}
      {selectedVariant && (
        <ProductDetailPanel
          isOpen={isVariantPanelOpen}
          onClose={() => {
            setIsVariantPanelOpen(false);
            setSelectedVariant(null);
          }}
          title={selectedVariant.name}
          subtitle={`SKU: ${selectedVariant.sku}`}
          productType="product"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="mb-0">${selectedVariant.price?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Stock</p>
                      <p className="mb-0">{selectedVariant.stock ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Weight</p>
                      <p className="mb-0">{selectedVariant.weight ? `${selectedVariant.weight}g` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className="mb-0 capitalize">{selectedVariant.status ?? 'active'}</p>
                    </div>
                  </div>
                  {selectedVariant.options && Object.keys(selectedVariant.options).length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Options</p>
                      <div className="space-y-2">
                        {Object.entries(selectedVariant.options).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-muted/30 rounded">
                            <span className="text-sm capitalize">{key}:</span>
                            <span className="text-sm">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
