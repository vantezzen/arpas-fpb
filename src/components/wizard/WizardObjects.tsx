import React, { useRef, useState } from "react";
import { Gltf } from "@react-three/drei";
import { ThreeEvent as ThreeFiberEvent, useThree } from "@react-three/fiber";
import { useAppState } from "../providers/state";
import { useSetAppState } from "../providers/socket";
import { Euler, Vector3 } from "three";
import { OBJECT_SCALES } from "../providers/state";
import "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    mesh: any;
    ringGeometry: any;
    meshBasicMaterial: any;
    circleGeometry: any;
    group: any;
  }
}

type ThreeEvent = ThreeFiberEvent<PointerEvent>;

interface WizardObjectsProps {
  controlsRef: React.RefObject<any>;
}

function WizardObjects({ controlsRef }: WizardObjectsProps) {
  const appState = useAppState();
  const setAppState = useSetAppState();
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const dragStart = useRef<Vector3 | null>(null);

  const handleDragStart = (event: ThreeEvent, index: number) => {
    event.stopPropagation();
    setSelectedObject(index);
    dragStart.current = new Vector3(event.point.x, 0, event.point.z);

    // Disable camera controls
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  };

  const handleDrag = (event: ThreeEvent) => {
    if (selectedObject === null || !dragStart.current) return;

    const currentPoint = new Vector3(event.point.x, 0, event.point.z);
    const deltaX = currentPoint.x - dragStart.current.x;
    const deltaZ = currentPoint.z - dragStart.current.z;

    const objects = [...appState.objects];
    const object = objects[selectedObject];
    object.position = new Vector3(
      object.position.x + deltaX,
      object.position.y,
      object.position.z + deltaZ
    );

    setAppState({ objects });
    dragStart.current = currentPoint;
  };

  const handleDragEnd = () => {
    setSelectedObject(null);
    dragStart.current = null;

    // Re-enable camera controls
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
  };

  return (
    <group>
      {appState.objects.map((object, index) => {
        const isSelected = selectedObject === index;
        const scale = OBJECT_SCALES[object.url] || 1;

        return (
          <group
            key={index}
            position={[object.position.x, 0, object.position.z]}
            rotation={[0, object.rotation.y, 0]}
            scale={[
              object.scale.x * scale,
              object.scale.y * scale,
              object.scale.z * scale,
            ]}
            onPointerDown={(e) => handleDragStart(e, index)}
            onPointerMove={handleDrag}
            onPointerUp={handleDragEnd}
            onPointerLeave={handleDragEnd}
          >
            <Gltf src={object.url} castShadow receiveShadow />
            {isSelected && (
              <>
                {/* Selection ring */}
                <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.2, 1.4, 32]} />
                  <meshBasicMaterial
                    color="#fbbf24"
                    transparent
                    opacity={0.5}
                  />
                </mesh>

                {/* Selection circle */}
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[1.2, 32]} />
                  <meshBasicMaterial
                    color="#fbbf24"
                    transparent
                    opacity={0.2}
                  />
                </mesh>
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default WizardObjects;
