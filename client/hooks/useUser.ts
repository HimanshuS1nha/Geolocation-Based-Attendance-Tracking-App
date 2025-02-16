import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

import type { UserType } from "@/types";

type UseUserType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  deleteUser: () => Promise<void>;
};

export const useUser = create<UseUserType>((set) => ({
  user: SecureStore.getItem("user")
    ? (JSON.parse(SecureStore.getItem("user")!) as UserType)
    : null,
  setUser: (user) => {
    SecureStore.setItem("user", JSON.stringify(user));
    set({ user });
  },
  deleteUser: async () => {
    await SecureStore.deleteItemAsync("user");
    set({ user: null });
  },
}));
