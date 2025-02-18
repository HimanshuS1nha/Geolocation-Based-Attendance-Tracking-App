import { create } from "zustand";

type UseOfficeLocationType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useOfficeLocationModal = create<UseOfficeLocationType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
