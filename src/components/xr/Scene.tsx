import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useSessionModeSupported, XR } from "@react-three/xr";
import SyncPlayerPosition from "./SyncPlayerPosition";
import { xrstore } from "@/lib/xr";
import { Button } from "../ui/button";
import TouchModefulScene from "./scenes/TouchModefulScene";
import HomerSScene from "./scenes/HomerSScene";
import TouchModelessScene from "./scenes/TouchModelessScene";
import HomerSModelessScene from "./scenes/HomerSModelessScene";
import ObjectSelector from "./ObjectSelector";
import { RoundedBox } from "@react-three/drei";
import { InteractionMode } from "@/lib/interactions/types";
import ModeSelector from "./ModeSelector";
import { ModeProvider } from "./scenes/ModeContext";

export type InteractionType =
  | "touch-modeful"
  | "touch-modeless"
  | "homer-s"
  | "homer-s-modeless";

interface Props {
  interactionType: InteractionType;
}

enum XrMode {
  AR = "immersive-ar",
  VR = "immersive-vr",
}
const xrMode = XrMode.AR;

function Scene({ interactionType }: Props) {
  const getSceneComponent = () => {
    switch (interactionType) {
      case "touch-modeful":
        return <TouchModefulScene />;
      case "touch-modeless":
        return <TouchModelessScene />;
      case "homer-s":
        return <HomerSScene />;
      case "homer-s-modeless":
        return <HomerSModelessScene />;
      default:
        return <TouchModefulScene />;
    }
  };

  const supported = useSessionModeSupported("immersive-ar");

  return (
    <div className="relative h-screen w-screen">
      <ModeProvider>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <Button
            onClick={() =>
              xrMode === XrMode.AR ? xrstore.enterAR() : xrstore.enterVR()
            }
            // disabled={!supported}
          >
            {supported ? "Enter" : "Not supported"} {xrMode}
          </Button>
        </div>

        {interactionType.includes("modeful") && <ModeSelector />}

        <Canvas
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
          }}
          style={{ touchAction: "none" }}
          camera={{
            position: [0, 1.6, 0],
            near: 0.1,
            far: 1000,
            fov: 75,
          }}
        >
          <XR store={xrstore}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[1, 1, 1]} intensity={1} />
              {getSceneComponent()}
              <SyncPlayerPosition />

              {Array.from({ length: 100 }).map((_, i) => {
                const phi = Math.acos(2 * Math.random() - 1);
                const theta = 2 * Math.PI * Math.random();
                const x = 10 * Math.sin(phi) * Math.cos(theta);
                const y = 10 * Math.sin(phi) * Math.sin(theta);
                const z = 10 * Math.cos(phi);
                const color = `#${Math.floor(Math.random() * 16777215).toString(
                  16
                )}`;

                return (
                  <RoundedBox key={i} args={[1, 1, 1]} position={[x, y, z]}>
                    <meshStandardMaterial color={color} />
                  </RoundedBox>
                );
              })}
              <RoundedBox args={[1, 1, 1]} position={[0, 0, -1]} />
            </Suspense>
          </XR>
        </Canvas>

        <ObjectSelector />
      </ModeProvider>
    </div>
  );
}

export default Scene;
