// interactions/base-interaction.ts
import { ThreeEvent } from "@react-three/fiber";
import { Object3D } from "three";

/**
 * The required interface for all our interaction controllers.
 */
export interface IInteractionController {
  /** Called once on mount of the controller */
  onInit(): void;

  /** Called once on unmount of the controller */
  onDispose(): void;

  /**
   * Called whenever a pointer/touch goes down on an object or the scene.
   * @param e The pointer event from R3F
   * @param object3D The actual Three.js object that was hit (if any)
   * @param objectId The scene object ID that was hit (if any)
   */
  onPointerDown(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ): void;

  /**
   * Called on pointer/touch move.
   * @param e The pointer event from R3F
   * @param object3D The actual Three.js object that was hit (if any)
   * @param objectId The scene object ID that was hit (if any)
   */
  onPointerMove(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ): void;

  /**
   * Called on pointer/touch up.
   * @param e The pointer event from R3F
   * @param object3D The actual Three.js object that was hit (if any)
   * @param objectId The scene object ID that was hit (if any)
   */
  onPointerUp(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ): void;

  /**
   * Called each frame in a useFrame loop for continuous updates (e.g. device-based movement).
   * @param dt delta time in seconds
   */
  onFrame(dt: number): void;
}
