import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    accessToken: string;
    refreshToken: string;
}

interface UserState {
    user: User | null;
    decodedUser: any | null;
    setDecodedUser: (user: any) => void;
    setCredentials: (user: User) => void;
    removeCredentials: () => void;
}

const userStoreSlice: StateCreator<UserState> = (set) => ({
    user: null,
    decodedUser: null,
    setCredentials: (user) => set({ user }),
    setDecodedUser: (user: any) => set({ decodedUser: user }),
    removeCredentials: () => set({ user: null }),
});

const persistedUserStore = persist<UserState>(userStoreSlice, {
    name: "user",
});

export const useUserStore = create(persistedUserStore);