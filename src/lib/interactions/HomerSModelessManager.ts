import { HomerSInteractionManager } from "./HomerSInteractionManager";
import { Vector3, Euler } from "three";

export class HomerSModelessManager extends HomerSInteractionManager {
  onInteractionMove(event: any) {
    if (!this.state.isInteracting || !this.state.selectedObject) return;

    const deviceDelta = new Vector3().subVectors(
      event.camera.position,
      this.deviceStartPosition
    );

    // Calculate the movement direction to determine the interaction type
    const horizontalMovement =
      Math.abs(deviceDelta.x) + Math.abs(deviceDelta.z);
    const verticalMovement = Math.abs(deviceDelta.y);

    if (verticalMovement > horizontalMovement) {
      // Vertical movement = scaling
      const scaleFactor = 1 + deviceDelta.y * 0.1;
      event.object.scale.setScalar(scaleFactor);
    } else {
      // Horizontal movement = translation + rotation
      const rotationFactor = deviceDelta.length() * 0.5;
      event.object.rotation.y += rotationFactor;
      event.object.position.add(deviceDelta);
    }
  }
}
