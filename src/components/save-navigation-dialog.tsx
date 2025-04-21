// components/ActionConfirmationDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { activeRequests } from '@/lib/axios';

interface ActionConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ActionConfirmationDialog = ({
  open,
  onConfirm,
  onCancel,
}: ActionConfirmationDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Requêtes en cours détectées</AlertDialogTitle>
          <AlertDialogDescription>
            Il y a actuellement {activeRequests.size} requêtes en cours. Fermer ce formulaire pourrait interrompre les téléversements.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onConfirm}>
            Fermer quand même
          </AlertDialogCancel>
          <AlertDialogAction onClick={onCancel}>
            Continuer l’édition
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
