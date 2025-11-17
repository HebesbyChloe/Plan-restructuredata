import { motion, AnimatePresence } from "motion/react";
import { X, Save, Tag, Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CreateAttributeVariantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (attribute: any) => void;
  mode?: "attribute" | "variant";
}

export function CreateAttributeVariantPanel({
  isOpen,
  onClose,
  onSave,
  mode = "attribute",
}: CreateAttributeVariantPanelProps) {
  const initialFormData = {
    name: "",
    type: "single",
    values: [""],
    applyTo: "all",
    required: false,
    visibleOnStore: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setIsDirty(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isDirty) {
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  const handleForceClose = () => {
    setShowCloseWarning(false);
    setIsDirty(false);
    onClose();
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Please enter attribute name");
      return;
    }

    const validValues = formData.values.filter((v) => v.trim() !== "");
    if (validValues.length === 0) {
      toast.error("Please add at least one value");
      return;
    }

    onSave?.({ ...formData, values: validValues });
    toast.success(`${mode === 'attribute' ? 'Attribute' : 'Variant'} created successfully`);
    setIsDirty(false);
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const addValue = () => {
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, ""],
    }));
    setIsDirty(true);
  };

  const removeValue = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  };

  const updateValue = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.map((v, i) => (i === index ? value : v)),
    }));
    setIsDirty(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="attribute-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="attribute-panel-content"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[90vw] md:w-[500px] lg:w-[600px] z-50"
          >
            <div className="h-full bg-white dark:bg-card border-l border-border shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border bg-muted/30 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0">Create New {mode === 'attribute' ? 'Attribute' : 'Variant'}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-0">
                      {mode === 'attribute' ? 'Define a new product attribute' : 'Create a new product variant'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create {mode === 'attribute' ? 'Attribute' : 'Variant'}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                  <Label>{mode === 'attribute' ? 'Attribute' : 'Variant'} Name *</Label>
                  <Input
                    placeholder={mode === 'attribute' ? "e.g., Size, Color, Material" : "e.g., Size-Color Variant"}
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Selection</SelectItem>
                      <SelectItem value="multiple">Multiple Selection</SelectItem>
                      <SelectItem value="text">Text Input</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {formData.type === 'single' && 'Customer can select one option'}
                    {formData.type === 'multiple' && 'Customer can select multiple options'}
                    {formData.type === 'text' && 'Customer can enter custom text'}
                  </p>
                </div>

                {formData.type !== 'text' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Values</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addValue}
                        className="h-7 gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Value
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.values.map((value, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Value ${index + 1}`}
                            value={value}
                            onChange={(e) => updateValue(index, e.target.value)}
                          />
                          {formData.values.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeValue(index)}
                              className="h-10 w-10 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {formData.values.filter((v) => v.trim() !== "").length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50">
                        {formData.values
                          .filter((v) => v.trim() !== "")
                          .map((value, index) => (
                            <Badge key={index} variant="outline">
                              {value}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <Label>Apply To</Label>
                  <Select value={formData.applyTo} onValueChange={(v) => updateField("applyTo", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="rings">Rings Only</SelectItem>
                      <SelectItem value="necklaces">Necklaces Only</SelectItem>
                      <SelectItem value="bracelets">Bracelets Only</SelectItem>
                      <SelectItem value="earrings">Earrings Only</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm mb-1">Required Field</p>
                      <p className="text-xs text-muted-foreground mb-0">
                        Customers must select this attribute
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.required}
                        onChange={(e) => updateField("required", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm mb-1">Visible on Storefront</p>
                      <p className="text-xs text-muted-foreground mb-0">
                        Show this attribute on product pages
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.visibleOnStore}
                        onChange={(e) => updateField("visibleOnStore", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100 mb-0">
                    💡 {mode === 'attribute' ? 'Attributes help customers filter and find products that match their needs.' : 'Variants create different versions of the same product with unique SKUs and pricing.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Unsaved Changes Warning */}
          <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes. Are you sure you want to close without saving?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                <AlertDialogAction onClick={handleForceClose}>
                  Discard Changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </AnimatePresence>
  );
}
