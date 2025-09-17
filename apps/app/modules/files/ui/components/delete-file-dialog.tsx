import { useMutation } from "convex/react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PublicFile | null;
  onDeleted?: () => void;
}

export const DeleteFileDialog = ({
  open,
  onOpenChange,
  file,
  onDeleted,
}: DeleteFileDialogProps) => {
  const deleteFile = useMutation(api.private.files.deletefile);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!file) return;

    setIsDeleting(true);
    try {
      await deleteFile({
        entryId: file.id,
      });
      toast.success("File deleted successfully");
      onDeleted?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the file ? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {file && (
          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Type : {file.type.toUpperCase()} | Size : {file.size}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            variant={"outline"}
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            disabled={isDeleting || !file}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting" : "Delete"}
            {isDeleting && (
                <Loader className="size-4 shrink-0 animate-spin ml-1" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
