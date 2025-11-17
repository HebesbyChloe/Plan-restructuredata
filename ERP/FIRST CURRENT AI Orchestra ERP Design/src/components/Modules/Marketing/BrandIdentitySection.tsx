import { Card } from "../../ui/card";
import { BookOpen, Eye, Target, Sparkles, Edit2, Save } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";

interface BrandIdentityData {
  story: string;
  slogan: string;
  tagline: string;
  vision: string;
  mission: string;
}

interface BrandIdentitySectionProps {
  brandIdentity: BrandIdentityData;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (data: BrandIdentityData) => void;
}

export function BrandIdentitySection({
  brandIdentity,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: BrandIdentitySectionProps) {
  return (
    <div className="space-y-6">
      {/* Edit/Save Button */}
      <div className="flex justify-end">
        {!isEditing ? (
          <Button 
            onClick={onEdit}
            className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]"
          >
            <Edit2 className="w-4 h-4" />
            Edit Brand Identity
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

      {/* Brand Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="mb-0">Brand Story</h3>
          </div>
          {isEditing ? (
            <Textarea
              value={brandIdentity.story}
              onChange={(e) => onChange({ ...brandIdentity, story: e.target.value })}
              className="min-h-[200px] bg-white dark:bg-card border-[#E5E5E5] focus:border-[#4B6BFB]"
              placeholder="Tell your brand's story..."
            />
          ) : (
            <p className="opacity-80 whitespace-pre-line">{brandIdentity.story}</p>
          )}
        </Card>
      </motion.div>

      {/* Slogan & Tagline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm h-full">
            <h3 className="mb-4">Slogan</h3>
            {isEditing ? (
              <Input
                value={brandIdentity.slogan}
                onChange={(e) => onChange({ ...brandIdentity, slogan: e.target.value })}
                className="bg-white dark:bg-card border-[#E5E5E5] focus:border-[#4B6BFB]"
                placeholder="Enter brand slogan..."
              />
            ) : (
              <div className="text-center p-6 bg-gradient-to-r from-[#4B6BFB]/10 to-[#6B8AFF]/10 rounded-lg">
                <p className="text-xl mb-0" style={{ fontWeight: '600' }}>
                  "{brandIdentity.slogan}"
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm h-full">
            <h3 className="mb-4">Tagline</h3>
            {isEditing ? (
              <Input
                value={brandIdentity.tagline}
                onChange={(e) => onChange({ ...brandIdentity, tagline: e.target.value })}
                className="bg-white dark:bg-card border-[#E5E5E5] focus:border-[#4B6BFB]"
                placeholder="Enter brand tagline..."
              />
            ) : (
              <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <p className="text-lg mb-0 opacity-80">
                  {brandIdentity.tagline}
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Vision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h3 className="mb-0">Vision</h3>
          </div>
          {isEditing ? (
            <Textarea
              value={brandIdentity.vision}
              onChange={(e) => onChange({ ...brandIdentity, vision: e.target.value })}
              className="min-h-[120px] bg-white dark:bg-card border-[#E5E5E5] focus:border-[#4B6BFB]"
              placeholder="Describe your vision..."
            />
          ) : (
            <p className="opacity-80">{brandIdentity.vision}</p>
          )}
        </Card>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="mb-0">Mission</h3>
          </div>
          {isEditing ? (
            <Textarea
              value={brandIdentity.mission}
              onChange={(e) => onChange({ ...brandIdentity, mission: e.target.value })}
              className="min-h-[120px] bg-white dark:bg-card border-[#E5E5E5] focus:border-[#4B6BFB]"
              placeholder="Describe your mission..."
            />
          ) : (
            <p className="opacity-80">{brandIdentity.mission}</p>
          )}
        </Card>
      </motion.div>

      {/* Quick Reference Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-[#4B6BFB]/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-white dark:bg-card">
            <Sparkles className="w-6 h-6 text-[#4B6BFB]" />
          </div>
          <div>
            <h3 className="mb-2">AI-Generated Brand Insights</h3>
            <p className="opacity-80 mb-4">
              Your brand identity is clear and compelling. The messaging resonates with modern businesses seeking innovation and efficiency. Consider emphasizing the "adaptive intelligence" aspect across marketing materials.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white dark:bg-card">
                ✓ Consistent messaging
              </Badge>
              <Badge variant="outline" className="bg-white dark:bg-card">
                ✓ Clear value proposition
              </Badge>
              <Badge variant="outline" className="bg-white dark:bg-card">
                ✓ Strong differentiation
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
