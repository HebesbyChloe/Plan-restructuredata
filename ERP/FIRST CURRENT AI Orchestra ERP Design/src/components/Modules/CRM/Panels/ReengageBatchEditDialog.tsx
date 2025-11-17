import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { ReengageBatch } from "../../../../sampledata";

interface ReengageBatchEditDialogProps {
  batch: ReengageBatch | null;
  onClose: () => void;
  onSave: (batchId: string, newName: string) => void;
}

export function ReengageBatchEditDialog({
  batch,
  onClose,
  onSave,
}: ReengageBatchEditDialogProps) {
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    if (batch) {
      setTempName(batch.name);
    }
  }, [batch]);

  if (!batch) return null;

  const handleSave = () => {
    onSave(batch.id, tempName);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4">Edit Batch Name</h3>
        <Input
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="mb-4"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
