import { create } from "zustand";
import { createBattleStore } from "./createBattleStore";
import { createAccountStore } from "./createAccountStore";

export const useMainStore = create((...a) => ({
    ...createBattleStore(...a),
    ...createAccountStore(...a),
}))