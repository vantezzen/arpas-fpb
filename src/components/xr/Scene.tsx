import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR } from "@react-three/xr";
import Objects from "./Objects";
import SyncPlayerPosition from "./SyncPlayerPosition";
import { xrstore } from "@/lib/xr";
import { Button } from "../ui/button";

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

            <Objects />
            <SyncPlayerPosition />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}

export default Scene;
