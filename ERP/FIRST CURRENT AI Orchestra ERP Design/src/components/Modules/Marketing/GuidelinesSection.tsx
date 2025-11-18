import { Card } from "../../ui/card";
import { Check, Edit2, Save, Plus, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import type { BrandGuideline } from "../../../lib/supabase/marketing/brands";

interface GuidelinesSectionProps {
  brandGuidelines: BrandGuideline[];
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onChange?: (guidelines: BrandGuideline[]) => void;
}

export function GuidelinesSection({
  brandGuidelines,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: GuidelinesSectionProps) {
  const addGuideline = () => {
    if (!onChange) return;
    onChange([
      ...brandGuidelines,
      {
        id: Date.now(),
        title: "New Guideline",
        category: "logo_usage",
        items: [],
        sortOrder: brandGuidelines.length,
      },
    ]);
  };

  const removeGuideline = (index: number) => {
    if (!onChange) return;
    onChange(brandGuidelines.filter((_, i) => i !== index));
  };

  const updateGuideline = (index: number, updates: Partial<BrandGuideline>) => {
    if (!onChange) return;
    const updated = [...brandGuidelines];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const addGuidelineItem = (index: number) => {
    if (!onChange) return;
    const updated = [...brandGuidelines];
    updated[index] = {
      ...updated[index],
      items: [...updated[index].items, ""],
    };
    onChange(updated);
  };

  const removeGuidelineItem = (guidelineIndex: number, itemIndex: number) => {
    if (!onChange) return;
    const updated = [...brandGuidelines];
    updated[guidelineIndex] = {
      ...updated[guidelineIndex],
      items: updated[guidelineIndex].items.filter((_, i) => i !== itemIndex),
    };
    onChange(updated);
  };

  const updateGuidelineItem = (guidelineIndex: number, itemIndex: number, value: string) => {
    if (!onChange) return;
    const updated = [...brandGuidelines];
    const items = [...updated[guidelineIndex].items];
    items[itemIndex] = value;
    updated[guidelineIndex] = {
      ...updated[guidelineIndex],
      items,
    };
    onChange(updated);
  };

  const renderGuidelineCard = (guideline: BrandGuideline, index: number) => {
    if (isEditing) {
      return (
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm h-full">
          <div className="space-y-4">
            <div>
              <Label className="text-xs opacity-60">Title</Label>
              <Input
                value={guideline.title}
                onChange={(e) => updateGuideline(index, { title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs opacity-60">Category</Label>
              <Select
                value={guideline.category}
                onValueChange={(value: BrandGuideline['category']) => updateGuideline(index, { category: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="logo_usage">Logo Usage</SelectItem>
                  <SelectItem value="typography_rules">Typography Rules</SelectItem>
                  <SelectItem value="color_application">Color Application</SelectItem>
                  <SelectItem value="voice_tone">Voice & Tone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs opacity-60">Items</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addGuidelineItem(index)}
                  className="h-6 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {guideline.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateGuidelineItem(index, itemIndex, e.target.value)}
                      placeholder="Enter guideline item..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuidelineItem(index, itemIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {guideline.items.length === 0 && (
                  <p className="text-xs opacity-60 text-center py-2">No items yet. Click "Add Item" to add one.</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeGuideline(index)}
              className="w-full text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Guideline
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <motion.div
        key={guideline.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm h-full">
          <h3 className="mb-4">{guideline.title}</h3>
          <div className="space-y-3">
            {guideline.items.length === 0 ? (
              <p className="opacity-60 text-sm">No guidelines defined</p>
            ) : (
              guideline.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="opacity-80">{item}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div>
      {/* Edit/Save Button */}
      {onEdit && onSave && onCancel && (
        <div className="flex justify-end mb-6">
          {!isEditing ? (
            <Button 
              onClick={onEdit}
              className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]"
            >
              <Edit2 className="w-4 h-4" />
              Edit Guidelines
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
        {brandGuidelines.length === 0 && !isEditing ? (
          <div className="col-span-2">
            <Card className="p-12 border-glass-border bg-glass-bg/30 backdrop-blur-sm text-center">
              <p className="opacity-60">No brand guidelines defined</p>
            </Card>
          </div>
        ) : (
          <>
            {brandGuidelines.map((guideline, index) => renderGuidelineCard(guideline, index))}
            {isEditing && (
              <Card className="border-2 border-dashed border-glass-border bg-glass-bg/30 backdrop-blur-sm flex items-center justify-center min-h-[300px]">
                <Button
                  variant="ghost"
                  onClick={addGuideline}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Guideline
                </Button>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Brand Voice Principles */}
      {!isEditing && (
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm mt-6">
          <h3 className="mb-4">Brand Voice Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Clear", "Confident", "Helpful", "Innovative"].map((principle, index) => (
              <div key={principle} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#4B6BFB]/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">
                    {index === 0 ? "💬" : index === 1 ? "💪" : index === 2 ? "🤝" : "✨"}
                  </span>
                </div>
                <h4>{principle}</h4>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
