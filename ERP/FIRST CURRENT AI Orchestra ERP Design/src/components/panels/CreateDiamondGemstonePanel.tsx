import { motion, AnimatePresence } from "motion/react";
import { X, Save, Gem, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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

interface CreateDiamondGemstonePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (stone: any) => void;
  mode?: "diamond" | "gemstone";
}

export function CreateDiamondGemstonePanel({
  isOpen,
  onClose,
  onSave,
  mode = "diamond",
}: CreateDiamondGemstonePanelProps) {
  const getInitialFormData = () => ({
    sku: "",
    type: mode,
    name: "",
    shape: "",
    carat: "",
    color: "",
    clarity: "",
    cut: "",
    origin: "",
    certification: "",
    certNumber: "",
    unitPrice: "",
    quantity: "",
    location: "",
    description: "",
    status: "available",
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(getInitialFormData());
      setIsDirty(false);
    }
  }, [isOpen, mode]);

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
    if (!formData.sku || !formData.name) {
      toast.error("Please fill in required fields");
      return;
    }

    onSave?.(formData);
    toast.success(`${formData.type === 'diamond' ? 'Diamond' : 'Gemstone'} created successfully`);
    setIsDirty(false);
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="diamond-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="diamond-panel-content"
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
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Gem className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0">Create New {formData.type === 'diamond' ? 'Diamond' : 'Gemstone'}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-0">
                      Add a new precious stone to inventory
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
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Stone
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent px-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="certification">Certification</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Stone Type *</Label>
                      <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diamond">Diamond</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="sapphire">Sapphire</SelectItem>
                          <SelectItem value="emerald">Emerald</SelectItem>
                          <SelectItem value="other">Other Gemstone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>SKU *</Label>
                      <Input
                        placeholder="e.g., DIA-001-RD"
                        value={formData.sku}
                        onChange={(e) => updateField("sku", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Stone Name *</Label>
                      <Input
                        placeholder="e.g., 1.5ct Round Brilliant Diamond"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Shape/Cut</Label>
                      <Select value={formData.shape} onValueChange={(v) => updateField("shape", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round">Round</SelectItem>
                          <SelectItem value="princess">Princess</SelectItem>
                          <SelectItem value="cushion">Cushion</SelectItem>
                          <SelectItem value="emerald">Emerald Cut</SelectItem>
                          <SelectItem value="oval">Oval</SelectItem>
                          <SelectItem value="pear">Pear</SelectItem>
                          <SelectItem value="marquise">Marquise</SelectItem>
                          <SelectItem value="heart">Heart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Carat Weight</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.carat}
                        onChange={(e) => updateField("carat", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity Available</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={formData.quantity}
                        onChange={(e) => updateField("quantity", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Storage Location</Label>
                      <Select value={formData.location} onValueChange={(v) => updateField("location", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vault-vn">Vault - Vietnam</SelectItem>
                          <SelectItem value="vault-us">Vault - US</SelectItem>
                          <SelectItem value="display">Display Case</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* Specifications Tab */}
                  <TabsContent value="specs" className="p-6 space-y-4">
                    {formData.type === 'diamond' && (
                      <>
                        <div className="space-y-2">
                          <Label>Color Grade</Label>
                          <Select value={formData.color} onValueChange={(v) => updateField("color", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="D">D (Colorless)</SelectItem>
                              <SelectItem value="E">E (Colorless)</SelectItem>
                              <SelectItem value="F">F (Colorless)</SelectItem>
                              <SelectItem value="G">G (Near Colorless)</SelectItem>
                              <SelectItem value="H">H (Near Colorless)</SelectItem>
                              <SelectItem value="I">I (Near Colorless)</SelectItem>
                              <SelectItem value="J">J (Near Colorless)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Clarity Grade</Label>
                          <Select value={formData.clarity} onValueChange={(v) => updateField("clarity", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select clarity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FL">FL (Flawless)</SelectItem>
                              <SelectItem value="IF">IF (Internally Flawless)</SelectItem>
                              <SelectItem value="VVS1">VVS1</SelectItem>
                              <SelectItem value="VVS2">VVS2</SelectItem>
                              <SelectItem value="VS1">VS1</SelectItem>
                              <SelectItem value="VS2">VS2</SelectItem>
                              <SelectItem value="SI1">SI1</SelectItem>
                              <SelectItem value="SI2">SI2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Cut Grade</Label>
                          <Select value={formData.cut} onValueChange={(v) => updateField("cut", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="very-good">Very Good</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label>Origin</Label>
                      <Input
                        placeholder="e.g., South Africa, Colombia"
                        value={formData.origin}
                        onChange={(e) => updateField("origin", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unit Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.unitPrice}
                        onChange={(e) => updateField("unitPrice", e.target.value)}
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Value</span>
                        <span className="font-medium">
                          ${(parseFloat(formData.unitPrice) || 0) * (parseInt(formData.quantity) || 0)}
                        </span>
                      </div>
                      {formData.carat && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price per Carat</span>
                          <span className="font-medium">
                            ${((parseFloat(formData.unitPrice) || 0) / (parseFloat(formData.carat) || 1)).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Enter additional details..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  {/* Certification Tab */}
                  <TabsContent value="certification" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Certification Lab</Label>
                      <Select value={formData.certification} onValueChange={(v) => updateField("certification", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lab" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GIA">GIA (Gemological Institute of America)</SelectItem>
                          <SelectItem value="AGS">AGS (American Gem Society)</SelectItem>
                          <SelectItem value="IGI">IGI (International Gemological Institute)</SelectItem>
                          <SelectItem value="EGL">EGL (European Gemological Laboratory)</SelectItem>
                          <SelectItem value="HRD">HRD (Hoge Raad voor Diamant)</SelectItem>
                          <SelectItem value="none">No Certification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Number</Label>
                      <Input
                        placeholder="e.g., 2141438171"
                        value={formData.certNumber}
                        onChange={(e) => updateField("certNumber", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Document</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload certificate PDF or image
                        </p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="consignment">On Consignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Unsaved Changes Warning */}
      <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close this panel? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceClose} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
}
