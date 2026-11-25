import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface DeletePostButtonProps {
  itemId: string;
  itemName: string;
  userId: string;
  variant?: "ghost" | "outline" | "destructive";
  className?: string;
}

export function DeletePostButton({
  itemId,
  itemName,
  userId,
  variant = "ghost",
  className,
}: DeletePostButtonProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", userId)
        .select("id");
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Post could not be deleted");
      }
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item-requests"] });
    },
    onError: () => toast.error("Couldn't delete the post. Please try again."),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={className ?? "text-destructive hover:text-destructive"}
          disabled={deleteMutation.isPending}
          aria-label={`Delete ${itemName}`}
        >
          <Trash2 className="h-4 w-4" />
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            "{itemName}" will be permanently removed from Rebuy. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}