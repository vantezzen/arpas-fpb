import React from "react";
import { useAppState } from "../providers/state";
import { Euler, Vector3 } from "three";

function Cube() {
  const [appState] = useAppState();

  return (
    <>
      <mesh
        position={
          new Vector3(
            appState.objectPosition.x,
            appState.objectPosition.y,
            appState.objectPosition.z
          )
        }
        rotation={
          new Euler(
            appState.objectRotation.x,
            appState.objectRotation.y,
            appState.objectRotation.z
          )
        }
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
}

export default Cube;
