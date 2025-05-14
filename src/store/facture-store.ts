import { instance } from '@/lib/axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Facture {
  id: string;
  title: string;
  description: string;
  numeration: string;
  recipientName: string;
  endDate: string;
  daysDifference: number;
  statusPayment: 'unpaid' | 'paid';
  createdAt: string;
}
interface RawFacture {
  factureId: string;
  numeration: string;
  recipientName: string;
  endDate: string;
  daysDifference: number;
  statusPayment: 'unpaid' | 'paid';
}

interface FactureState {
  factures: Facture[];
  unpaidCount: number;
  isLoading: boolean;
  error: string | null;
  fetchFactures: (userId: string) => Promise<Facture[]>; // ✅ ici aussi !
  addFacture: (facture: Facture) => void;
  markAsPaid: (id: string) => void;
  clearFactures: () => void;
}

export const useFactureStore = create<FactureState>()(
  persist(
    (set, get) => ({
      factures: [],
      unpaidCount: 0,
      isLoading: false,
      error: null,

      fetchFactures: async (userId: string): Promise<Facture[]> => {
        set({ isLoading: true, error: null });
        try {
          const response = await instance.get(`/getOverduePaymentsNotif/${userId}`);
          const filtered = response.data.successPurchases.filter(
            (item: RawFacture) =>
              item?.statusPayment === 'unpaid' &&
              item?.daysDifference >= 0 &&
              item?.daysDifference <= 5,
          );

          const newFactures: Facture[] = filtered.map((item: RawFacture) => ({
            id: item.factureId,
            title: `Facture ${item.numeration}`,
            description: `À régler avant le ${item.endDate}.`,
            statusPayment: item.statusPayment,
            daysDifference: item.daysDifference,
            createdAt: item.endDate,
            recipientName: item.recipientName,
            numeration: item.numeration,
            endDate: item.endDate,
          }));

          set({
            factures: newFactures,
            unpaidCount: newFactures.length,
            isLoading: false,
          });

          return newFactures; // ✅ LE POINT CLÉ
        } catch (err) {
          console.error('Erreur chargement factures :', err);
          set({ error: 'Erreur de chargement', isLoading: false });
          return [];
        }
      },

      addFacture: (facture) => {
        if (get().factures.some((f) => f.id === facture.id)) return;

        set((state) => ({
          factures: [facture, ...state.factures],
          unpaidCount:
            facture.statusPayment === 'unpaid'
              ? state.unpaidCount + 1
              : state.unpaidCount,
        }));
      },

      markAsPaid: (id) => {
        set((state) => ({
          factures: state.factures.map((f) =>
            f.id === id ? { ...f, statusPayment: 'paid' } : f,
          ),
          unpaidCount: state.factures.find(
            (f) => f.id === id && f.statusPayment === 'unpaid',
          )
            ? state.unpaidCount - 1
            : state.unpaidCount,
        }));
      },

      clearFactures: () => {
        set({ factures: [], unpaidCount: 0 });
      },
    }),
    {
      name: 'facture-storage',
      partialize: (state) => ({
        factures: state.factures,
        unpaidCount: state.unpaidCount,
      }),
    },
  ),
);
