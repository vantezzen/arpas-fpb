import { StaticHudToolbar } from "@/components/StaticHudToolbar";
import { Button } from "@/components/ui/button";
import { xrstore } from "@/lib/xr";
import { Canvas } from "@react-three/fiber";
import { XR } from "@react-three/xr";
import React, { Suspense } from "react";
import Interaction from "./Interaction";
import PrototypeCube from "./PrototypeCube";
import UpdateInteraction from "./UpdateInteraction";

function PrototypeBase({
  interaction,
  modeful = false,
}: {
  interaction: Interaction;
  modeful?: boolean;
}) {
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

            {modeful && <StaticHudToolbar />}
            <UpdateInteraction interaction={interaction} />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}

export default PrototypeBase;
