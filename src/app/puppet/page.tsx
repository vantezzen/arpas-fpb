"use client";
import { SocketProvider } from "@/components/providers/socket";
import { StateStorageProvider } from "@/components/providers/state";
import React from "react";

import { XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { Text, Gltf, Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { xrstore } from "@/lib/xr";
import Objects from "@/components/xr/Objects";

function PuppetPage() {
  return (
    <StateStorageProvider>
      <SocketProvider>
        <Button onClick={() => xrstore.enterAR()}>Start AR</Button>
        <Canvas>
          <XR store={xrstore}>
            <ambientLight />
            <Objects />
          </XR>
        </Canvas>
      </SocketProvider>
    </StateStorageProvider>
  );
}

export default PuppetPage;
