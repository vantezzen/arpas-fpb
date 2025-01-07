// hooks/useSceneObjects.ts
"use client";

import { create } from "zustand";
import { Vector3, Euler } from "three";

interface SceneObject {
  id: string;
  position: Vector3;
  rotation: Euler;
  scale: number;
  color: string;
}

interface SceneObjectsState {
  objects: SceneObject[];
  addObject: (obj: SceneObject) => void;
  updateObject: (id: string, partial: Partial<SceneObject>) => void;
}

export const useSceneObjectsStore = create<SceneObjectsState>((set) => ({
  objects: [
    {
      id: "cube-1",
      position: new Vector3(0, 0, -1),
      rotation: new Euler(0, 0, 0),
      scale: 1,
      color: "lightblue",
    },
  ],
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  updateObject: (id, partial) =>
    set((state) => {
      const newObjects = state.objects.map((o) => {
        if (o.id !== id) return o;
        return { ...o, ...partial };
      });
      return { objects: newObjects };
    }),
}));
// For convenience, we also export the store itself
export const store = useSceneObjectsStore;
