import React, { useEffect, useRef, useMemo } from "react";
import { Gltf } from "@react-three/drei";
import { useAppState } from "../providers/state";
import { InteractionManager } from "@/lib/interactions/types";
import { useXR, useXRPlanes } from "@react-three/xr";
import { PlaneDetectionManager } from "@/lib/interactions/PlaneDetectionManager";

interface Props {
  interactionManager: InteractionManager;
}

function InteractiveObjects({ interactionManager }: Props) {
  const appState = useAppState();
  const planes = useXRPlanes();
  const planeManager = useMemo(() => new PlaneDetectionManager(), []);

  useEffect(() => {
    planeManager.updatePlanes(planes);
  }, [planes, planeManager]);

  return (
    <>
      {appState.objects.map((object, index) => {
        let transform = interactionManager.getObjectTransform(object);

        if (interactionManager.shouldSnapToPlane) {
          const closestPlane = planeManager.findClosestPlane(
            transform.position
          );
          if (closestPlane) {
            transform.position = planeManager.snapPositionToPlane(
              transform.position,
              closestPlane
            );
          }
        }

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
