import React, { useEffect, useRef, useMemo } from "react";
import { Gltf } from "@react-three/drei";
import { useAppState } from "../providers/state";
import { InteractionManager } from "@/lib/interactions/types";
import { useXR, useXRPlanes, XRHitTest, XRSpace } from "@react-three/xr";
import { PlaneDetectionManager } from "@/lib/interactions/PlaneDetectionManager";
import { HitTestManager } from "@/lib/interactions/HitTestManager";
import { Vector3 } from "three";

interface Props {
  interactionManager: InteractionManager;
}

function InteractiveObjects({ interactionManager }: Props) {
  const appState = useAppState();
  const { session } = useXR();
  const hitTestManager = useMemo(() => new HitTestManager(), []);
  const planeManager = useMemo(() => new PlaneDetectionManager(), []);
  const planes = useXRPlanes();

  useEffect(() => {
    planeManager.updatePlanes(planes);
  }, [planes, planeManager]);

  return (
    <>
      {session && interactionManager.shouldSnapToHitTest && (
        <XRHitTest space="viewer" onResults={hitTestManager.onHitTestResults} />
      )}

      {appState.objects.map((object, index) => {
        let transform = interactionManager.getObjectTransform(object);

        // Only apply hit test if enabled
        if (
          interactionManager.shouldSnapToHitTest &&
          object.position.equals(new Vector3(0, 0, 0))
        ) {
          const hitPosition = hitTestManager.getHitPosition();
          if (hitPosition) {
            transform.position = hitPosition;
          }
        }

        // Apply plane snapping if enabled
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
