import { create } from "zustand";
import { createAccountStore } from "./createAccountStore";
import { AccountStore } from "../types";

export const useMainStore = create<AccountStore>((set, get) => ({
  ...createAccountStore(set, get),
}));
