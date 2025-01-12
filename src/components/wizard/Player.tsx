import React from "react";
import { useAppState } from "../providers/state";
import { Triangle, Vector3 } from "three";
import { Euler } from "three";
import { Gltf } from "@react-three/drei";

function Player() {
  const [appState] = useAppState();

  return (
    <Gltf
      src="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/fish/model.gltf"
      position={
        new Vector3(
          appState.userPosition.x,
          appState.userPosition.y,
          appState.userPosition.z
        )
      }
      rotation={
        new Euler(
          appState.userRotation.x,
          appState.userRotation.y,
          appState.userRotation.z
        )
      }
    />
  );

  // return (
  //   <mesh
  //     position={
  //       new Vector3(
  //         appState.userPosition.x,
  //         appState.userPosition.y,
  //         appState.userPosition.z
  //       )
  //     }
  //     rotation={
  //       new Euler(
  //         appState.userRotation.x,
  //         appState.userRotation.y,
  //         appState.userRotation.z
  //       )
  //     }
  //   >

  //     <meshStandardMaterial color="blue" />
  //   </mesh>
  // );
}

export default Player;
