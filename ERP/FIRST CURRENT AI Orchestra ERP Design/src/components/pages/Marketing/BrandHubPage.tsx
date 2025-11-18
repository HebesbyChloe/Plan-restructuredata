"use client";

import { Download, Eye, Palette, Type, Image, Check, BookOpen, Plus } from "lucide-react";
import { motion } from "motion/react";
import { TabsContent } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AINotificationCard } from "../../Modules/Global/AINotificationCard";
import { TabBar } from "../../layout";
import { BrandIdentitySection } from "../../Modules/Marketing/BrandIdentitySection";
import { ColorPaletteSection } from "../../Modules/Marketing/ColorPaletteSection";
import { TypographySection } from "../../Modules/Marketing/TypographySection";
import { LogoSection } from "../../Modules/Marketing/LogoSection";
import { AssetsSection } from "../../Modules/Marketing/AssetsSection";
import { GuidelinesSection } from "../../Modules/Marketing/GuidelinesSection";
import {
  getBrands,
  createBrand,
  getBrandSettings,
  upsertBrandSettings,
  getBrandColors,
  upsertBrandColors,
  getBrandTypography,
  upsertBrandTypography,
  getBrandLogos,
  upsertBrandLogos,
  getBrandGuidelines,
  upsertBrandGuidelines,
  type Brand,
  type BrandSettings,
  type BrandColor,
  type BrandTypography,
  type BrandLogo,
  type BrandGuideline,
} from "../../../lib/supabase/marketing/brands";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useTenantContext } from "../../../contexts/TenantContext";

export default function BrandHubPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingColors, setIsEditingColors] = useState(false);
  const [isEditingTypography, setIsEditingTypography] = useState(false);
  const [isEditingLogos, setIsEditingLogos] = useState(false);
  const [isEditingGuidelines, setIsEditingGuidelines] = useState(false);
  
  // Brand selection
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get tenant from context
  const { currentTenantId } = useTenantContext();
  
  // Brand data states
  const [brandIdentity, setBrandIdentity] = useState<BrandSettings>({
    story: "",
    slogan: "",
    tagline: "",
    vision: "",
    mission: "",
  });
  const [brandColors, setBrandColors] = useState<{ primary: BrandColor[]; secondary: BrandColor[]; neutral: BrandColor[] }>({
    primary: [],
    secondary: [],
    neutral: [],
  });
  const [typography, setTypography] = useState<{ headings: BrandTypography[]; body: BrandTypography[] }>({
    headings: [],
    body: [],
  });
  const [logoVariations, setLogoVariations] = useState<Array<{ name: string; bg: string; description: string; isDark?: boolean; logoUrl?: string; thumbnailUrl?: string | null }>>([]);
  const [brandLogos, setBrandLogos] = useState<BrandLogo[]>([]);
  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuideline[]>([]);
  const [fontStack, setFontStack] = useState<string>("-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif");
  const [logoSpecs, setLogoSpecs] = useState<{ clearSpace: string; minimumSize: string; fileFormats: string }>({
    clearSpace: "Maintain minimum clear space of 0.5x the logo height on all sides",
    minimumSize: "Digital: 24px height | Print: 0.5 inches height",
    fileFormats: "SVG for web, PNG for raster, PDF for print",
  });
  
  // Mock data for assets (not in database yet)
  const brandAssets = [
    { category: "Social Media Template", count: 48, updated: "2 days ago" },
    { category: "Email Templates", count: 24, updated: "1 week ago" },
    { category: "Presentation Decks", count: 12, updated: "3 days ago" },
    { category: "Marketing Collateral", count: 36, updated: "5 days ago" },
    { category: "Image & Video Guide", count: 156, updated: "1 day ago" },
    { category: "Icons & Illustrations", count: 84, updated: "1 week ago" },
  ];

  // Load brands and brand data
  useEffect(() => {
    if (!currentTenantId) return;
    
    const loadBrands = async () => {
      setLoading(true);
      try {
        const { data, error } = await getBrands(currentTenantId);
        if (error) {
          console.error('Error loading brands:', error);
          toast.error('Failed to load brands');
        } else {
          setBrands(data || []);
          // Select first brand or null
          if (data && data.length > 0) {
            setSelectedBrandId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Unexpected error loading brands:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, [currentTenantId]);

  // Load brand data when brand is selected
  useEffect(() => {
    if (selectedBrandId === null || !currentTenantId) return;
    
    const loadBrandData = async () => {
      try {
        // Load all brand data in parallel
        const [settingsResult, colorsResult, typographyResult, logosResult, guidelinesResult] = await Promise.all([
          getBrandSettings(currentTenantId, selectedBrandId),
          getBrandColors(currentTenantId, selectedBrandId),
          getBrandTypography(currentTenantId, selectedBrandId),
          getBrandLogos(currentTenantId, selectedBrandId),
          getBrandGuidelines(currentTenantId, selectedBrandId),
        ]);

        if (settingsResult.data) {
          setBrandIdentity(settingsResult.data);
        }
        if (colorsResult.data) {
          // Group colors by category
          const grouped = {
            primary: colorsResult.data.filter(c => c.category === 'primary'),
            secondary: colorsResult.data.filter(c => c.category === 'secondary'),
            neutral: colorsResult.data.filter(c => c.category === 'neutral'),
          };
          setBrandColors(grouped);
        }
        if (typographyResult.data) {
          // Group typography by category
          const grouped = {
            headings: typographyResult.data.filter(t => t.category === 'headings'),
            body: typographyResult.data.filter(t => t.category === 'body'),
          };
          setTypography(grouped);
        }
        if (logosResult.data) {
          setBrandLogos(logosResult.data);
          setLogoVariations(logosResult.data.map(logo => ({
            name: logo.name,
            bg: logo.backgroundColor || "#FFFFFF",
            description: logo.description || "",
            isDark: logo.isDark,
            logoUrl: logo.logoUrl,
            thumbnailUrl: logo.thumbnailUrl,
          })));
        }
        if (guidelinesResult.data) {
          setBrandGuidelines(guidelinesResult.data);
        }
      } catch (err) {
        console.error('Error loading brand data:', err);
      }
    };
    
    loadBrandData();
  }, [selectedBrandId, currentTenantId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleSaveIdentity = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      const { error } = await upsertBrandSettings(currentTenantId, {
        ...brandIdentity,
        brandId: selectedBrandId,
      });
      if (error) {
        toast.error(`Failed to save: ${error.message}`);
        return;
      }
      setIsEditingIdentity(false);
      toast.success("Brand identity updated successfully");
    } catch (err) {
      toast.error("Failed to save brand identity");
    }
  };
  
  const handleCreateBrand = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    const brandName = prompt("Enter brand name:");
    if (!brandName) return;
    
    const brandCode = brandName.toUpperCase().replace(/\s+/g, '-').substring(0, 20);
    try {
      const { data, error } = await createBrand(currentTenantId, {
        code: brandCode,
        name: brandName,
        status: "active",
      });
      if (error) {
        toast.error(`Failed to create brand: ${error.message}`);
        return;
      }
      if (data) {
        setBrands([...brands, data]);
        setSelectedBrandId(data.id);
        toast.success("Brand created successfully");
      }
    } catch (err) {
      toast.error("Failed to create brand");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingIdentity(false);
  };

  // Save handlers for each section
  const handleSaveColors = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      // Flatten colors array
      const allColors: Omit<BrandColor, 'id'>[] = [
        ...brandColors.primary.map(c => ({ ...c, category: 'primary' as const })),
        ...brandColors.secondary.map(c => ({ ...c, category: 'secondary' as const })),
        ...brandColors.neutral.map(c => ({ ...c, category: 'neutral' as const })),
      ];
      
      const { error } = await upsertBrandColors(currentTenantId, allColors, selectedBrandId);
      if (error) {
        toast.error(`Failed to save: ${error.message}`);
        return;
      }
      setIsEditingColors(false);
      toast.success("Brand colors updated successfully");
    } catch (err) {
      toast.error("Failed to save brand colors");
    }
  };

  const handleSaveTypography = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      // Flatten typography array
      const allTypography: Omit<BrandTypography, 'id'>[] = [
        ...typography.headings.map(t => ({ ...t, category: 'headings' as const })),
        ...typography.body.map(t => ({ ...t, category: 'body' as const })),
      ];
      
      const { error } = await upsertBrandTypography(currentTenantId, allTypography, selectedBrandId);
      if (error) {
        toast.error(`Failed to save: ${error.message}`);
        return;
      }
      setIsEditingTypography(false);
      toast.success("Brand typography updated successfully");
    } catch (err) {
      toast.error("Failed to save brand typography");
    }
  };

  const handleSaveLogos = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      // Convert logoVariations back to BrandLogo format
      // Match existing logos by name to preserve logoUrl if available
      const logos: Omit<BrandLogo, 'id'>[] = logoVariations.map((logo, index) => {
        const existingLogo = brandLogos.find(l => l.name === logo.name);
        return {
          name: logo.name,
          variationType: logo.name.includes("Dark") ? "dark" as const : 
                        logo.name.includes("Icon") ? "icon_only" as const :
                        logo.name.includes("Mono") ? "monochrome" as const : "primary" as const,
          logoUrl: logo.logoUrl || existingLogo?.logoUrl || "https://via.placeholder.com/400x200?text=Logo+Placeholder", // Use logoUrl from form, existing, or placeholder
          thumbnailUrl: logo.thumbnailUrl || existingLogo?.thumbnailUrl || null,
          backgroundColor: logo.bg,
          isDark: logo.isDark || false,
          description: logo.description || null,
          sortOrder: index,
        };
      });
      
      const { error } = await upsertBrandLogos(currentTenantId, logos, selectedBrandId);
      if (error) {
        toast.error(`Failed to save: ${error.message}`);
        return;
      }
      setIsEditingLogos(false);
      toast.success("Brand logos updated successfully");
      // Reload logos to get updated data
      if (selectedBrandId !== null) {
        const { data } = await getBrandLogos(currentTenantId, selectedBrandId);
        if (data) {
          setBrandLogos(data);
          setLogoVariations(data.map(logo => ({
            name: logo.name,
            bg: logo.backgroundColor || "#FFFFFF",
            description: logo.description || "",
            isDark: logo.isDark,
            logoUrl: logo.logoUrl,
            thumbnailUrl: logo.thumbnailUrl,
          })));
        }
      }
    } catch (err) {
      toast.error("Failed to save brand logos");
    }
  };

  const handleSaveGuidelines = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      const guidelines: Omit<BrandGuideline, 'id'>[] = brandGuidelines.map((g, index) => ({
        title: g.title,
        category: g.category,
        items: g.items,
        sortOrder: g.sortOrder || index,
      }));
      
      const { error } = await upsertBrandGuidelines(currentTenantId, guidelines, selectedBrandId);
      if (error) {
        toast.error(`Failed to save: ${error.message}`);
        return;
      }
      setIsEditingGuidelines(false);
      toast.success("Brand guidelines updated successfully");
    } catch (err) {
      toast.error("Failed to save brand guidelines");
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Brand Hub</h1>
            <p className="text-sm sm:text-base opacity-60">Your complete brand identity system and assets library</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Brand Selector */}
            <Select
              value={selectedBrandId?.toString() || "none"}
              onValueChange={(value) => {
                if (value === "none") {
                  setSelectedBrandId(null);
                } else {
                  setSelectedBrandId(Number(value));
                }
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="none">No Brand Selected</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={handleCreateBrand}>
              <Plus className="w-4 h-4" />
              New Brand
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]">
              <Download className="w-4 h-4" />
              Download Brand Kit
            </Button>
          </div>
        </div>
      </motion.div>

      {/* AI Brand Consistency Checker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AINotificationCard
          title="AI Brand Consistency Monitor"
          message="Our AI continuously monitors all marketing materials to ensure brand consistency across channels."
          actionLabel="View Details →"
          onAction={() => toast.success("Opening brand consistency details...")}
          animated={false}
          details={
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Brand Score: 94%</span>
              </div>
              <div className="opacity-60 text-sm">Last checked: 2 hours ago</div>
            </div>
          }
        />
      </motion.div>

      <TabBar
        defaultValue="identity"
        tabs={[
          { value: "identity", label: "Brand Identity", icon: BookOpen },
          { value: "colors", label: "Colors", icon: Palette },
          { value: "typography", label: "Typography", icon: Type },
          { value: "logos", label: "Logos", icon: Image },
          { value: "assets", label: "Assets", icon: Download },
          { value: "guidelines", label: "Guidelines", icon: Check },
        ]}
      >
        {/* Brand Identity Tab */}
        <TabsContent value="identity">
          <BrandIdentitySection
            brandIdentity={brandIdentity}
            isEditing={isEditingIdentity}
            onEdit={() => setIsEditingIdentity(true)}
            onSave={handleSaveIdentity}
            onCancel={handleCancelEdit}
            onChange={setBrandIdentity}
          />
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <ColorPaletteSection
            brandColors={brandColors}
            copiedColor={copiedColor}
            onCopyColor={copyToClipboard}
            isEditing={isEditingColors}
            onEdit={() => setIsEditingColors(true)}
            onSave={handleSaveColors}
            onCancel={() => setIsEditingColors(false)}
            onChange={setBrandColors}
          />
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          <TypographySection
            typography={typography}
            fontStack={fontStack}
            isEditing={isEditingTypography}
            onEdit={() => setIsEditingTypography(true)}
            onSave={handleSaveTypography}
            onCancel={() => setIsEditingTypography(false)}
            onChange={setTypography}
            onFontStackChange={(newFontStack) => {
              setFontStack(newFontStack);
              toast.success("Font stack updated");
            }}
          />
        </TabsContent>

        {/* Logos Tab */}
        <TabsContent value="logos">
          <LogoSection
            logoVariations={logoVariations}
            brandLogos={brandLogos}
            brandName={brands.find(b => b.id === selectedBrandId)?.name || "Brand"}
            logoSpecs={logoSpecs}
            isEditing={isEditingLogos}
            onEdit={() => setIsEditingLogos(true)}
            onSave={handleSaveLogos}
            onCancel={() => setIsEditingLogos(false)}
            onChange={setLogoVariations}
            onSpecsChange={(newSpecs) => {
              setLogoSpecs(newSpecs);
              toast.success("Logo specifications updated");
            }}
          />
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets">
          <AssetsSection brandAssets={brandAssets} />
        </TabsContent>

        {/* Guidelines Tab */}
        <TabsContent value="guidelines">
          <GuidelinesSection
            brandGuidelines={brandGuidelines}
            isEditing={isEditingGuidelines}
            onEdit={() => setIsEditingGuidelines(true)}
            onSave={handleSaveGuidelines}
            onCancel={() => setIsEditingGuidelines(false)}
            onChange={setBrandGuidelines}
          />
        </TabsContent>
      </TabBar>
    </div>
  );
}
