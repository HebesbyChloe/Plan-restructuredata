/**
 * File Brief Upload Component
 * Handles file upload for project/campaign briefs with AI processing
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Upload, FileText, Sparkles } from "lucide-react";

interface FileBriefUploadProps {
  projectType: "project" | "campaign";
  uploadedFile: File | null;
  isProcessing: boolean;
  onFileUpload: (file: File) => void;
  onSkipUpload?: () => void;
}

export function FileBriefUpload({
  projectType,
  uploadedFile,
  isProcessing,
  onFileUpload,
  onSkipUpload,
}: FileBriefUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card className="p-6 border-2 border-dashed border-[#4B6BFB]/30 bg-gradient-to-br from-[#4B6BFB]/5 to-[#6B8AFF]/5">
      {isProcessing ? (
        <div className="py-8">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-center">
              <p className="mb-1">AI is analyzing your brief...</p>
              <p className="text-sm text-muted-foreground mb-0">
                Extracting goals, timeline, and team requirements
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`space-y-4 ${dragActive ? 'opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4B6BFB]/10 to-[#6B8AFF]/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#4B6BFB]" />
            </div>
            <div>
              <h4 className="mb-2 text-[#4B6BFB]">
                {uploadedFile ? uploadedFile.name : `Upload ${projectType === "campaign" ? "Campaign" : "Project"} Brief`}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {uploadedFile ? "File uploaded successfully" : "Drop your brief file here or click to browse"}
              </p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                id="brief-upload-new"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  type="button"
                  className="cursor-pointer"
                  onClick={() => {
                    const input = document.getElementById('brief-upload-new') as HTMLInputElement;
                    input?.click();
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {uploadedFile ? "Change File" : "Choose File"}
                </Button>
                {onSkipUpload && (
                  <Button 
                    variant="ghost" 
                    type="button"
                    className="cursor-pointer"
                    onClick={onSkipUpload}
                  >
                    Create Manually
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </div>

          <Card className="p-3 bg-white dark:bg-card border-[#4B6BFB]/20">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4B6BFB]" />
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-sm">AI Will Extract:</h4>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside mb-0">
                  <li>{projectType === "campaign" ? "Campaign" : "Project"} objectives and goals</li>
                  <li>Timeline and key milestones</li>
                  <li>Team requirements and responsibilities</li>
                  <li>Budget and resource allocation</li>
                  <li>Success metrics and KPIs</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
