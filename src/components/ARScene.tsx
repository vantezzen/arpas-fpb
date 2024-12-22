// components/ARScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { SceneObjects } from "./SceneObjects";
import { InteractionManager } from "./InteractionManager";
import { Toolbar3D } from "./Toolbar3D";
import { StaticHudToolbar } from "./StaticHudToolbar";

// Create an XR store with no "domOverlay", because we’re using a purely in-scene UI
export const xrstore = createXRStore({
  // planeDetection, meshDetection, anchors, etc. can be enabled if needed
  // domOverlay: false by default
});

interface ARSceneProps {
  interactionControllerClass: new () => any;
}

export function ARScene({ interactionControllerClass }: ARSceneProps) {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <XR store={xrstore}>
        <XROrigin>
          <Suspense fallback={null}>
            <Environment preset="city" />
            {/* The 3D objects that can be manipulated */}
            <SceneObjects />

            {/* Our 3D toolbar in front of the user */}
            <StaticHudToolbar />

            {/* Our custom interaction logic (modeful/modeless) */}
            <InteractionManager interactionClass={interactionControllerClass} />
          </Suspense>
        </XROrigin>
      </XR>
    </Canvas>
  );
}
