import React, { useEffect, useRef } from "react";
import { useSendAppState } from "../providers/socket";
import { useAppState } from "../providers/state";
import { TransformControls } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { useMode } from "./ModeSelector";

function WizardCube() {
  const sendAppState = useSendAppState();
  const [appState, setAppState] = useAppState();
  const transform = useRef<any>();

  const [mode, setMode] = useMode();

  return (
    <>
      <TransformControls
        ref={transform}
        onObjectChange={(e: any) => {
          sendAppState({
            objectPosition: e.target.object.position,
            objectRotation: e.target.object.rotation,
            objectScale: e.target.object.scale,
          });
        }}
        mode={mode}
      >
        <mesh ref={transform}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </TransformControls>
    </>
  );
}

export default WizardCube;
