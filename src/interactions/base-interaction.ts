// interactions/base-interaction.ts
import { ThreeEvent } from "@react-three/fiber";
import { Object3D } from "three";

export interface IInteractionController {
  onInit(): void;
  onDispose(): void;

  /** Called on pointerDown in R3F (object or empty space) */
  onPointerDown(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ): void;

  /** Called on pointerUp in R3F */
  onPointerUp(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ): void;

  /** If you still want to catch pointerMove from R3F for device-based or selection logic. */
  onPointerMove?(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ): void;

  /** Called each frame for device-based or continuous logic */
  onFrame(dt: number): void;
}
