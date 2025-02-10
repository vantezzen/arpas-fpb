import { StaticHudToolbar } from "@/components/StaticHudToolbar";
import { Button } from "@/components/ui/button";
import { xrstore } from "@/lib/xr";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR } from "@react-three/xr";
import React, { Suspense, useState } from "react";
import ModefulTouchInteraction from "./ModefulTouchInteraction";
import PrototypeCube from "../PrototypeCube";
import UpdateInteraction from "./UpdateInteraction";

function ModefulTouchPrototype() {
  const [interaction] = useState(() => new ModefulTouchInteraction());

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Button onClick={() => xrstore.enterAR()}>Start AR</Button>
      </div>

      <Canvas>
        <XR store={xrstore}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[1, 1, 1]} intensity={1} />

            <PrototypeCube />

            <StaticHudToolbar />
            <UpdateInteraction interaction={interaction} />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}

export default ModefulTouchPrototype;
