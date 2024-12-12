import { HomerSInteractionManager } from "./HomerSInteractionManager";
import { Vector3, Euler, Quaternion } from "three";

export class HomerSModelessManager extends HomerSInteractionManager {
  onInteractionMove(event: any) {
    if (!this.state.isInteracting || !this.state.selectedObject) return;

    const deviceDelta = new Vector3().subVectors(
      event.camera.position,
      this.deviceStartPosition
    );

    const currentRotation = new Quaternion();
    event.camera.getWorldQuaternion(currentRotation);
    const rotationDelta = currentRotation.multiply(
      this.deviceStartRotation.clone().invert()
    );

    // Determine primary movement direction
    const verticalMovement = Math.abs(deviceDelta.y);
    const horizontalMovement = Math.sqrt(
      deviceDelta.x * deviceDelta.x + deviceDelta.z * deviceDelta.z
    );

    if (verticalMovement > horizontalMovement) {
      // Vertical movement controls scale
      const scaleFactor = 1 + deviceDelta.y * 0.1;
      return {
        position: this.objectStartPosition.clone(),
        scale: new Vector3(scaleFactor, scaleFactor, scaleFactor),
        rotation: this.objectStartRotation.clone(),
      };
    } else {
      // Horizontal movement controls position and rotation
      const euler = new Euler().setFromQuaternion(rotationDelta);
      return {
        position: this.objectStartPosition.clone().add(deviceDelta),
        rotation: euler,
        scale: new Vector3(1, 1, 1),
      };
    }
  }
}
