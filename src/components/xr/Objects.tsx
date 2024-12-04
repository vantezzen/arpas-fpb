import React from "react";
import { Gltf } from "@react-three/drei";
import { useAppState } from "../providers/state";

function Objects() {
  const { appState } = useAppState();

  return (
    <>
      {appState.objects.map((object, index) => (
        <Gltf
          key={index}
          src={object.url}
          position={object.position}
          scale={object.scale}
          rotation={object.rotation}
        />
      ))}
    </>
  );
}

export default Objects;
