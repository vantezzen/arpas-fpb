// store/uiStore.ts
"use client";

import { Euler, Vector3 } from "three";
import { create } from "zustand";

interface UiState {
  currentMode: "move" | "rotate" | "scale";
  setMode: (m: "move" | "rotate" | "scale") => void;

  cubePosition: Vector3;
  cubeRotation: Euler;
  cubeScale: Vector3;

  setCubePosition: (position: Vector3) => void;
  setCubeRotation: (rotation: Euler) => void;
  setCubeScale: (scale: Vector3) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentMode: "move",
  setMode: (m) => set({ currentMode: m }),

  cubePosition: new Vector3(),
  cubeRotation: new Euler(),
  cubeScale: new Vector3(1, 1, 1),

  setCubePosition: (position) => set({ cubePosition: position }),
  setCubeRotation: (rotation) => set({ cubeRotation: rotation }),
  setCubeScale: (scale) => set({ cubeScale: scale }),
}));

export function getCurrentMode() {
  return useUiStore.getState().currentMode;
}
