// components/ARScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { SceneObjects } from "./SceneObjects";
import { InteractionManager } from "./InteractionManager";
import { StaticHudToolbar } from "./StaticHudToolbar";

export const xrstore = createXRStore({});

interface ARSceneProps {
  interactionClass: new () => any;
}

export function ARScene({ interactionClass }: ARSceneProps) {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <XR store={xrstore}>
        <XROrigin>
          <Suspense fallback={null}>
            <Environment preset="city" />
            <SceneObjects />
            <InteractionManager interactionClass={interactionClass} />
            <StaticHudToolbar />
          </Suspense>
        </XROrigin>
      </XR>
    </Canvas>
  );
}
