import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import WizardObjects from "./WizardObjects";
import WizardControls from "./WizardControls";
import WizardUserPosition from "./WizardUserPosition";
import * as THREE from "three";
import "@react-three/fiber";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import WizardCube from "./WizardCube";
import { ModeContextProvider } from "./ModeSelector";

declare module "@react-three/fiber" {
  interface ThreeElements {
    ambientLight: any;
    directionalLight: any;
    mesh: any;
    group: any;
  }
}

function WizardView() {
  return (
    <div className="h-screen w-screen flex">
      <ModeContextProvider>
        <div className="flex-1 relative">
          <Canvas shadows>
            <Suspense fallback={null}>
              <PerspectiveCamera
                makeDefault
                position={[10, 10, 10]}
                rotation={[-Math.PI / 2, 0, 0]}
                fov={50}
              />

              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
              />

              <Grid
                args={[100, 100]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#6e6e6e"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#9d4b4b"
                fadeDistance={50}
                fadeStrength={1}
                followCamera={false}
              />

              <WizardCube />

              <OrbitControls makeDefault />
            </Suspense>
          </Canvas>
        </div>
      </ModeContextProvider>
    </div>
  );
}

export default WizardView;
