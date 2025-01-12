import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Euler, Quaternion, Vector3 } from "three";
import { useDebounce, useInterval, useUpdate } from "react-use";
import { useSendAppState } from "../providers/socket";

function SyncPlayerPosition() {
  const sendAppState = useSendAppState();
  const lastUpdate = useRef(0);

  useFrame((state) => {
    const position = state.camera.getWorldPosition(new Vector3());
    const rotation = state.camera.getWorldQuaternion(new Quaternion());

    if (lastUpdate.current + 300 > Date.now()) {
      return;
    }

    console.log("Sending position", position);
    const eulerRotation = new Euler().setFromQuaternion(rotation);

    sendAppState({
      userPosition: position,
      userRotation: {
        x: eulerRotation.x,
        y: eulerRotation.y,
        z: eulerRotation.z,
      } as Euler,
    });

    lastUpdate.current = Date.now();
  });
  return null;
}

export default SyncPlayerPosition;
