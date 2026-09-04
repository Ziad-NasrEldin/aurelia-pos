import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePos } from "@/lib/store";

export function ClearDialog() {
  const open = usePos((s) => s.clearOpen);
  const close = usePos((s) => s.closeClear);
  const clear = usePos((s) => s.clearTicket);

  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear this ticket?</AlertDialogTitle>
          <AlertDialogDescription>
            Items come off the check and off the kitchen board. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={close}>Keep items</AlertDialogCancel>
          <AlertDialogAction onClick={clear}>Clear ticket</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
