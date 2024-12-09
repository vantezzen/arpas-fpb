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

declare module "@react-three/fiber" {
  interface ThreeElements {
    ambientLight: any;
    directionalLight: any;
    mesh: any;
    group: any;
  }
}

function WizardView() {
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="h-screen w-screen flex">
      <div className="flex-1 relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={resetCamera}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera
              makeDefault
              position={[0, 10, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fov={50}
            />

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

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

            <WizardObjects controlsRef={controlsRef} />
            <WizardUserPosition />

            <OrbitControls
              ref={controlsRef}
              makeDefault
              target={[0, 0, 0]}
              enableDamping={false}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>

      <WizardControls />
    </div>
  );
}

export default WizardView;
