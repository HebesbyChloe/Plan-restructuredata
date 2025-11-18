import { Card } from "../../ui/card";
import { Download, Sparkles, Edit2, Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useState, useEffect } from "react";
import type { BrandLogo } from "../../../lib/supabase/marketing/brands";

interface LogoVariation {
  name: string;
  bg: string;
  description: string;
  isDark?: boolean;
  logoUrl?: string;
  thumbnailUrl?: string | null;
}

interface LogoSpecifications {
  clearSpace: string;
  minimumSize: string;
  fileFormats: string;
}

interface LogoSectionProps {
  logoVariations: LogoVariation[];
  brandLogos?: BrandLogo[];
  brandName?: string;
  logoSpecs?: LogoSpecifications;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onChange?: (logos: LogoVariation[]) => void;
  onSpecsChange?: (specs: LogoSpecifications) => void;
}

export function LogoSection({
  logoVariations,
  brandLogos = [],
  brandName = "Brand",
  logoSpecs = {
    clearSpace: "Maintain minimum clear space of 0.5x the logo height on all sides",
    minimumSize: "Digital: 24px height | Print: 0.5 inches height",
    fileFormats: "SVG for web, PNG for raster, PDF for print",
  },
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onChange,
  onSpecsChange,
}: LogoSectionProps) {
  const [localSpecs, setLocalSpecs] = useState(logoSpecs);
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);

  useEffect(() => {
    setLocalSpecs(logoSpecs);
  }, [logoSpecs]);

  const addLogo = () => {
    if (!onChange) return;
    onChange([
      ...logoVariations,
      {
        name: "New Logo Variation",
        bg: "#FFFFFF",
        description: "",
        isDark: false,
        logoUrl: "",
      },
    ]);
  };

  const removeLogo = (index: number) => {
    if (!onChange) return;
    onChange(logoVariations.filter((_, i) => i !== index));
  };

  const updateLogo = (index: number, updates: Partial<LogoVariation>) => {
    if (!onChange) return;
    const updated = [...logoVariations];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const getLogoUrl = (logo: LogoVariation): string | null => {
    // First check if logoVariation has logoUrl
    if (logo.logoUrl) {
      return logo.logoUrl;
    }
    
    // Then check brandLogos by matching name
    const brandLogo = brandLogos.find(bl => bl.name === logo.name);
    if (brandLogo?.logoUrl) {
      return brandLogo.logoUrl;
    }
    
    return null;
  };

  const renderLogoCard = (logo: LogoVariation, index: number) => {
    const logoUrl = getLogoUrl(logo);
    const isIconOnly = logo.name.toLowerCase().includes("icon");

    if (isEditing) {
      return (
        <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <div
            className="h-48 flex items-center justify-center p-8 relative"
            style={{ backgroundColor: logo.bg }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logo.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                {!isIconOnly && (
                  <span
                    className={`text-2xl ${logo.isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontWeight: '600' }}
                  >
                    {brandName}
                  </span>
                )}
              </div>
            )}
            {logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors hidden">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 text-white" />
                  </div>
                  {!isIconOnly && (
                    <span
                      className={`text-2xl ${logo.isDark ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontWeight: '600' }}
                    >
                      {brandName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <Label className="text-xs opacity-60">Name</Label>
              <Input
                value={logo.name}
                onChange={(e) => updateLogo(index, { name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs opacity-60">Logo URL</Label>
              <Input
                value={logo.logoUrl || ""}
                onChange={(e) => updateLogo(index, { logoUrl: e.target.value })}
                className="mt-1"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs opacity-50 mt-1">
                Enter the URL of the logo image
              </p>
            </div>
            <div>
              <Label className="text-xs opacity-60">Background Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={logo.bg}
                  onChange={(e) => updateLogo(index, { bg: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={logo.bg}
                  onChange={(e) => updateLogo(index, { bg: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs opacity-60">Description</Label>
              <Textarea
                value={logo.description}
                onChange={(e) => updateLogo(index, { description: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`isDark-${index}`}
                checked={logo.isDark || false}
                onChange={(e) => updateLogo(index, { isDark: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor={`isDark-${index}`} className="text-xs opacity-60 cursor-pointer">
                Dark background
              </Label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeLogo(index)}
              className="w-full text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <div
            className="h-48 flex items-center justify-center p-8 relative group"
            style={{ backgroundColor: logo.bg }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logo.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                {!isIconOnly && (
                  <span
                    className={`text-2xl ${logo.isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontWeight: '600' }}
                  >
                    {brandName}
                  </span>
                )}
              </div>
            )}
            {/* Fallback that shows on error */}
            {logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors hidden">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 text-white" />
                  </div>
                  {!isIconOnly && (
                    <span
                      className={`text-2xl ${logo.isDark ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontWeight: '600' }}
                    >
                      {brandName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4>{logo.name}</h4>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            {logo.description && <p className="opacity-60">{logo.description}</p>}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Edit/Save Button */}
      {onEdit && onSave && onCancel && (
        <div className="flex justify-end">
          {!isEditing ? (
            <Button 
              onClick={onEdit}
              className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]"
            >
              <Edit2 className="w-4 h-4" />
              Edit Logos
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                onClick={onSave}
                className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logoVariations.length === 0 && !isEditing ? (
          <div className="col-span-2">
            <Card className="p-12 border-glass-border bg-glass-bg/30 backdrop-blur-sm text-center">
              <p className="opacity-60">No logo variations defined</p>
            </Card>
          </div>
        ) : (
          <>
            {logoVariations.map((logo, index) => renderLogoCard(logo, index))}
            {isEditing && (
              <Card className="border-2 border-dashed border-glass-border bg-glass-bg/30 backdrop-blur-sm flex items-center justify-center min-h-[300px]">
                <Button
                  variant="ghost"
                  onClick={addLogo}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Logo Variation
                </Button>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Logo Specifications */}
      <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3>Logo Specifications</h3>
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingSpecs(!isEditingSpecs)}
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {isEditingSpecs ? "Done" : "Edit"}
            </Button>
          )}
        </div>
        {isEditing && isEditingSpecs ? (
          <div className="space-y-4">
            <div>
              <Label className="text-xs opacity-60">Clear Space</Label>
              <Textarea
                value={localSpecs.clearSpace}
                onChange={(e) => setLocalSpecs({ ...localSpecs, clearSpace: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs opacity-60">Minimum Size</Label>
              <Textarea
                value={localSpecs.minimumSize}
                onChange={(e) => setLocalSpecs({ ...localSpecs, minimumSize: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs opacity-60">File Formats</Label>
              <Textarea
                value={localSpecs.fileFormats}
                onChange={(e) => setLocalSpecs({ ...localSpecs, fileFormats: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalSpecs(logoSpecs);
                  setIsEditingSpecs(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (onSpecsChange) {
                    onSpecsChange(localSpecs);
                  }
                  setIsEditingSpecs(false);
                }}
                className="bg-[#4B6BFB] hover:bg-[#3A5BEB]"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-accent/30">
              <h4 className="mb-2">Clear Space</h4>
              <p className="opacity-60">{localSpecs.clearSpace}</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/30">
              <h4 className="mb-2">Minimum Size</h4>
              <p className="opacity-60">{localSpecs.minimumSize}</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/30">
              <h4 className="mb-2">File Formats</h4>
              <p className="opacity-60">{localSpecs.fileFormats}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
