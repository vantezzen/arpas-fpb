import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR } from "@react-three/xr";
import ShowInteractions from "../ShowInteractions";
import { xrstore } from "@/lib/xr";
import "@react-three/fiber";
import { Button } from "../ui/button";
import Cube from "./Cube";

declare module "@react-three/fiber" {
  interface ThreeElements {
    ambientLight: any;
    directionalLight: any;
    mesh: any;
    group: any;
  }
}

function Scene() {
  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Button onClick={() => xrstore.enterAR()}>Start AR</Button>
      </div>

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

            <Cube />
          </Suspense>
        </XR>
      </Canvas>

      <ShowInteractions />
    </div>
  );
}

export default Scene;
