import { useState, useRef } from "react";
import { X, Upload, Settings, Sparkles, FileText, Send } from "lucide-react";
import { Sheet, SheetContent } from "../../../ui/sheet";
import { Button } from "../../../ui/button";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Textarea } from "../../../ui/textarea";
import { Separator } from "../../../ui/separator";

interface PromotionCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAiGenerate?: (mode: "upload" | "chat", data: any) => void;
  onManualCreate?: () => void;
}

export function PromotionCreateDialog({
  isOpen,
  onClose,
  onAiGenerate,
  onManualCreate,
}: PromotionCreateDialogProps) {
  const [aiDescription, setAiDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...uploadedFiles, ...files];
      setUploadedFiles(newFiles);
      
      // Add file info to description
      const fileNames = files.map(f => f.name).join(", ");
      const fileContext = `\n\n[Uploaded files: ${fileNames}]`;
      setAiDescription(prev => prev + fileContext);
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    
    // Remove file reference from description
    const fileRef = `[Uploaded files: ${fileToRemove.name}`;
    setAiDescription(prev => prev.replace(new RegExp(`\\n*\\[Uploaded files:.*${fileToRemove.name}.*\\]`, 'g'), ''));
  };

  const handleAiGenerateClick = () => {
    if (onAiGenerate) {
      onAiGenerate("chat", { 
        description: aiDescription,
        files: uploadedFiles 
      });
    }
    // Reset and close
    setAiDescription("");
    setUploadedFiles([]);
    onClose();
  };

  const handleManualSetup = () => {
    if (onManualCreate) {
      onManualCreate();
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4B6BFB]/20 to-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#4B6BFB]" />
              </div>
              <div>
                <h2 className="mb-1">AI PromoSetup</h2>
                <p className="text-sm opacity-60 mb-0">
                  Describe your promotion or upload documents
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* AI Description Info Card */}
            <Card className="p-4 bg-gradient-to-br from-[#4B6BFB]/10 to-purple-500/10 border-[#4B6BFB]/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#4B6BFB] mt-0.5" />
                <div>
                  <h4 className="mb-1 text-[#4B6BFB]">AI-Powered Setup</h4>
                  <p className="text-sm opacity-80 mb-0">
                    Describe your promotion in natural language or upload documents. AI will extract and configure all the details automatically.
                  </p>
                </div>
              </div>
            </Card>

            {/* Main Input Area */}
            <div className="space-y-3">
              <label className="text-sm opacity-80">
                Describe your promotion or upload documents
              </label>
              <Textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder="Example: Create a Buy 2 Get 1 Free promotion for all rings, valid until end of month with 50% off the third item...&#10;&#10;Or upload promotion documents using the button below."
                className="min-h-[200px] resize-none"
              />
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload Documents
                </Button>
                <p className="text-xs opacity-60">
                  PDF, DOC, DOCX, TXT, JPG, PNG
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="mb-0 text-sm">Attached Files ({uploadedFiles.length})</h4>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-background rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 flex-shrink-0 text-[#4B6BFB]" />
                        <span className="text-sm truncate">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-7 w-7 p-0 flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Example Prompts */}
            <Card className="p-4 border-dashed">
              <h4 className="mb-3 text-sm opacity-80">Quick Examples:</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Buy 1 Get 1 50% off on all earrings",
                  "20% off when spending over $500",
                  "Free shipping for orders above $100",
                  "Buy 3 bracelets, get a free pendant"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setAiDescription(example)}
                    className="text-left p-3 rounded-lg hover:bg-muted transition-colors text-sm border border-transparent hover:border-border"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </Card>

            {/* Generate Button */}
            {(aiDescription.trim() || uploadedFiles.length > 0) && (
              <Button 
                className="w-full gap-2 h-12 bg-gradient-to-r from-[#4B6BFB] to-purple-500 hover:from-[#4B6BFB]/90 hover:to-purple-500/90 text-white"
                onClick={handleAiGenerateClick}
              >
                <Send className="w-4 h-4" />
                Generate Promotion with AI
              </Button>
            )}

            {/* Divider */}
            <div className="relative py-4">
              <Separator />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
                <span className="text-xs opacity-60">or</span>
              </div>
            </div>

            {/* Manual Setup Option */}
            <Card className="p-5 border-2 border-dashed hover:border-[#4B6BFB]/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">Manual Setup</h4>
                  <p className="text-sm opacity-60 mb-3">
                    Configure your promotion manually with full control over all settings
                  </p>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={handleManualSetup}
                  >
                    <Settings className="w-4 h-4" />
                    Start Manual Setup
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
