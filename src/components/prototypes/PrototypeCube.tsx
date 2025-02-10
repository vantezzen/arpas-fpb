import { useUiStore } from "@/store/uiStore";
import React from "react";
import { Euler, Vector3 } from "three";

function PrototypeCube() {
  const appState = useUiStore();

  return (
    <mesh
      position={
        new Vector3(
          appState.cubePosition.x,
          appState.cubePosition.y,
          appState.cubePosition.z
        )
      }
      rotation={
        new Euler(
          appState.cubeRotation.x,
          appState.cubeRotation.y,
          appState.cubeRotation.z
        )
      }
      scale={
        new Vector3(
          appState.cubeScale.x,
          appState.cubeScale.y,
          appState.cubeScale.z
        )
      }
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default PrototypeCube;
