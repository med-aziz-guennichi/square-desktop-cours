import { IUser } from '@/types/user.interface';
import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  accessToken: string;
  refreshToken: string;
}

interface UserState {
  user: User | null;
  decodedUser: IUser | null;
  setDecodedUser: (user: IUser) => void;
  setCredentials: (user: User) => void;
  removeCredentials: () => void;
}

const userStoreSlice: StateCreator<UserState> = (set) => ({
  user: null,
  decodedUser: null,
  setCredentials: (user) => set({ user }),
  setDecodedUser: (user: IUser) => set({ decodedUser: user }),
  removeCredentials: () => set({ user: null, decodedUser: null }),
});

const persistedUserStore = persist<UserState>(userStoreSlice, {
  name: 'user',
});

export const useUserStore = create(persistedUserStore);
