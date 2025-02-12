import React, { useRef } from "react";
import { useSendAppState } from "../providers/socket";
import { useAppState } from "../providers/state";
import { TransformControls } from "@react-three/drei";
import { useMode } from "./ModeSelector";

function WizardCube() {
  const sendAppState = useSendAppState();
  const [appState, setAppState, setUpdatesDisabled] = useAppState();
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
        onMouseDown={() => {
          setUpdatesDisabled(true);
          console.log("Mouse down");
        }}
        onMouseUp={() => {
          setUpdatesDisabled(false);
          console.log("Mouse up");
        }}
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
