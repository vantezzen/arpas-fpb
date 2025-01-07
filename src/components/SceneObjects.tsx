// components/SceneObjects.tsx
"use client";

import { useSceneObjectsStore } from "@/hooks/useSceneObjects";
import { ThreeEvent } from "@react-three/fiber";
import { Object3D } from "three";

export function SceneObjects() {
  const objects = useSceneObjectsStore((s) => s.objects);

  function handlePointerDown(e: ThreeEvent<PointerEvent>, objectId?: string) {
    e.stopPropagation();
    const ctrl = (globalThis as any).storeActiveController;
    ctrl?.onPointerDown(e, e.object as Object3D, objectId);
  }

  function handlePointerUp(e: ThreeEvent<PointerEvent>, objectId?: string) {
    e.stopPropagation();
    const ctrl = (globalThis as any).storeActiveController;
    ctrl?.onPointerUp(e, e.object as Object3D, objectId);
  }

  return (
    <>
      {objects.map((obj) => (
        <mesh
          key={obj.id}
          position={obj.position}
          rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
          scale={[obj.scale, obj.scale, obj.scale]}
          onPointerDown={(e) => handlePointerDown(e, obj.id)}
          onPointerUp={(e) => handlePointerUp(e, obj.id)}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={obj.color} />
        </mesh>
      ))}
    </>
  );
}
