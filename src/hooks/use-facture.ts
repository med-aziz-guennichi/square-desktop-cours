import { useFactureStore } from '@/store/facture-store';
import { useNotificationsStore } from '@/store/notification-store';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useCheckFactures = (userId: string, role: string) => {
  const fetchFactures = useFactureStore((state) => state.fetchFactures);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const shownRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      if (!userId || !role || !['student', 'responsable'].includes(role)) return;
      if (shownRef.current) return;

      const newFactures = await fetchFactures(userId);
      const unpaid = newFactures.find((f) => f.statusPayment === 'unpaid');

      if (unpaid) {
        // ✅ 1. Notification visuelle (Toast)
        toast.warning('Paiement en attente', {
          description: `Facture #${unpaid.numeration} - Votre paiement est arrivé à ${unpaid.endDate}`,
          action: {
            label: 'Voir',
            onClick: () => {
              window.location.href = '/mes-factures';
            },
          },
        });

        // ✅ 2. Ajouter dans le système de notification
        addNotification({
          id: `facture-${unpaid.id}`,
          title: 'Facture impayée',
          name: 'Facture impayée', // ✅ ajouté ici
          description: `Votre facture ${unpaid.numeration} est en attente de paiement.`,
          createdAt: new Date().toISOString(),
          read: false,
          status: 'unread',
          type: 'alert',
          screen: 'mes-factures',
        });

        shownRef.current = true;
      }
    };

    load();
  }, [userId, role, fetchFactures, addNotification]);
};
