import React, { useEffect, useRef } from "react";
import { Gltf } from "@react-three/drei";
import { useAppState } from "../providers/state";
import { InteractionManager } from "@/lib/interactions/types";
import { useXR } from "@react-three/xr";

interface Props {
  interactionManager: InteractionManager;
}

function InteractiveObjects({ interactionManager }: Props) {
  const appState = useAppState();
  const xr = useXR();

  useEffect(() => {
    // Set up event listeners based on interaction type
    // This will be different for touch vs HOMER-S
  }, [interactionManager]);

  return (
    <>
      {appState.objects.map((object, index) => {
        const transform = interactionManager.getObjectTransform(object);

        return (
          <Gltf
            key={index}
            src={object.url}
            position={transform.position}
            scale={transform.scale}
            rotation={transform.rotation}
            onClick={() => interactionManager.onSelect(index)}
          />
        );
      })}
    </>
  );
}

export default InteractiveObjects;
