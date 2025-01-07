// store/uiStore.ts
"use client";

import { create } from "zustand";

interface UiState {
  currentMode: "move" | "rotate" | "scale";
  setMode: (m: "move" | "rotate" | "scale") => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentMode: "move",
  setMode: (m) => set({ currentMode: m }),
}));

export function getCurrentMode() {
  return useUiStore.getState().currentMode;
}
