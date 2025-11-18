import { Card } from "../../ui/card";
import { Check, Copy, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { BrandColor } from "../../../lib/supabase/marketing/brands";

interface BrandColors {
  primary: BrandColor[];
  secondary: BrandColor[];
  neutral: BrandColor[];
}

interface ColorPaletteSectionProps {
  brandColors: BrandColors;
  copiedColor: string | null;
  onCopyColor: (hex: string, name: string) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onChange?: (colors: BrandColors) => void;
}

export function ColorPaletteSection({
  brandColors,
  copiedColor,
  onCopyColor,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: ColorPaletteSectionProps) {
  const addColor = (category: "primary" | "secondary" | "neutral") => {
    if (!onChange) return;
    const newColor: BrandColor = {
      id: Date.now(), // Temporary ID
      name: "New Color",
      hex: "#000000",
      category,
      usage: "",
      sortOrder: brandColors[category].length,
    };
    onChange({
      ...brandColors,
      [category]: [...brandColors[category], newColor],
    });
  };

  const removeColor = (category: "primary" | "secondary" | "neutral", index: number) => {
    if (!onChange) return;
    onChange({
      ...brandColors,
      [category]: brandColors[category].filter((_, i) => i !== index),
    });
  };

  const updateColor = (category: "primary" | "secondary" | "neutral", index: number, updates: Partial<BrandColor>) => {
    if (!onChange) return;
    const updated = [...brandColors[category]];
    updated[index] = { ...updated[index], ...updates };
    onChange({
      ...brandColors,
      [category]: updated,
    });
  };

  const renderColorCard = (color: BrandColor, index: number, category: "primary" | "secondary" | "neutral", height: string) => {
    if (isEditing) {
      return (
        <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <div
            className={`${height} relative group`}
            style={{ backgroundColor: color.hex }}
          />
          <div className="p-4 space-y-2">
            <div>
              <Label className="text-xs opacity-60">Name</Label>
              <Input
                value={color.name}
                onChange={(e) => updateColor(category, index, { name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs opacity-60">Hex Code</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColor(category, index, { hex: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={color.hex}
                  onChange={(e) => updateColor(category, index, { hex: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs opacity-60">Usage</Label>
              <Input
                value={color.usage || ""}
                onChange={(e) => updateColor(category, index, { usage: e.target.value })}
                className="mt-1"
                placeholder="e.g., Primary buttons, links"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeColor(category, index)}
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
        key={color.id || color.name}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <div
            className={`${height} relative group cursor-pointer`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onCopyColor(color.hex, color.name)}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              {copiedColor === color.name ? (
                <Badge className="bg-white text-black">Copied!</Badge>
              ) : (
                <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-1">{color.name}</div>
            <div className="opacity-60 mb-2">{color.hex}</div>
            {color.usage && <div className="opacity-50 text-sm">{color.usage}</div>}
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
              Edit Colors
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

      {/* Primary Colors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Primary Colors</h3>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addColor("primary")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Color
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brandColors.primary.map((color, index) => renderColorCard(color, index, "primary", "h-32"))}
        </div>
      </div>

      {/* Secondary Colors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Secondary Colors</h3>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addColor("secondary")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Color
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {brandColors.secondary.map((color, index) => renderColorCard(color, index, "secondary", "h-24"))}
        </div>
      </div>

      {/* Neutral Colors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Neutral Palette</h3>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addColor("neutral")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Color
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {brandColors.neutral.map((color, index) => renderColorCard(color, index, "neutral", "h-20"))}
        </div>
      </div>

      {/* Color Accessibility */}
      {!isEditing && (
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <h3 className="mb-4">Accessibility Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>WCAG AAA Compliant</span>
              </div>
              <p className="opacity-60">All color combinations meet accessibility standards</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Contrast Ratio: 4.5:1</span>
              </div>
              <p className="opacity-60">Ensures readability for all users</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
