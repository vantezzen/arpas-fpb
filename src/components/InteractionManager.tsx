// components/InteractionManager.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { IInteractionController } from "@/interactions/base-interaction";

interface InteractionManagerProps {
  interactionClass: new () => IInteractionController;
}

export function InteractionManager({
  interactionClass,
}: InteractionManagerProps) {
  const controllerRef = useRef<IInteractionController | null>(null);

  useEffect(() => {
    const instance = new interactionClass();
    controllerRef.current = instance;
    (globalThis as any).storeActiveController = instance;
    instance.onInit();

    return () => {
      instance.onDispose();
      (globalThis as any).storeActiveController = null;
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactionClass]);

  useFrame((state, dt) => {
    (globalThis as any).storeRootState = state;
    controllerRef.current?.onFrame(dt);
  });

  return null;
}
