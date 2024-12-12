import { BaseInteractionManager } from "./BaseInteractionManager";
import { Vector3, Euler, Matrix4 } from "three";
import { Object } from "@/components/providers/state";
import { XRHitTest } from "@react-three/xr";

export class HomerSInteractionManager extends BaseInteractionManager {
  private deviceStartPosition = new Vector3();
  private objectStartPosition = new Vector3();
  private matrixHelper = new Matrix4();

  onInteractionStart(event: any) {
    if (!this.state.selectedObject) return;

    this.state.isInteracting = true;
    // Store the initial device and object positions
    this.deviceStartPosition.copy(event.camera.position);
    this.objectStartPosition.copy(event.object.position);
  }

  onInteractionMove(event: any) {
    if (!this.state.isInteracting || !this.state.selectedObject) return;

    const deviceDelta = new Vector3().subVectors(
      event.camera.position,
      this.deviceStartPosition
    );

    switch (this.state.mode) {
      case "translate":
        // Move object based on device movement
        event.object.position.copy(this.objectStartPosition).add(deviceDelta);
        break;
      case "rotate":
        // Rotate object based on device rotation around object
        const angle = deviceDelta.length() * 0.5;
        event.object.rotation.y += angle;
        break;
      case "scale":
        // Scale object based on distance from initial position
        const scaleFactor = 1 + deviceDelta.length() * 0.1;
        event.object.scale.setScalar(scaleFactor);
        break;
    }
  }

  onInteractionEnd() {
    this.state.isInteracting = false;
  }

  getObjectTransform(object: Object) {
    if (this.config.usePlaneDetection) {
      // Implement plane detection logic here
      return {
        position: object.position,
        rotation: object.rotation,
        scale: object.scale,
      };
    }

    return {
      position: object.position,
      rotation: object.rotation,
      scale: object.scale,
    };
  }
}
