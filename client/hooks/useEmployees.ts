import { create } from "zustand";

import type { EmployeeType } from "@/types";

type UseEmployeesType = {
  employees: EmployeeType[];
  setEmployees: (employees: EmployeeType[]) => void;
};

export const useEmployees = create<UseEmployeesType>((set) => ({
  employees: [],
  setEmployees: (employees) => set({ employees }),
}));
