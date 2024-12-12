import { BaseInteractionManager } from "./BaseInteractionManager";
import { Vector3, Euler, Matrix4, Quaternion } from "three";
import { Object } from "@/components/providers/state";

export class HomerSInteractionManager extends BaseInteractionManager {
  private deviceStartPosition = new Vector3();
  private deviceStartRotation = new Quaternion();
  private objectStartPosition = new Vector3();
  private objectStartRotation = new Euler();
  private matrixHelper = new Matrix4();

  shouldSnapToPlane = this.config.usePlaneDetection;

  onInteractionStart(event: any) {
    if (!this.state.selectedObject) return;

    this.state.isInteracting = true;
    this.deviceStartPosition.copy(event.camera.position);
    event.camera.getWorldQuaternion(this.deviceStartRotation);

    if (event.object) {
      this.objectStartPosition.copy(event.object.position);
      this.objectStartRotation.copy(event.object.rotation);
    }
  }

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

    if (this.config.modeful) {
      switch (this.state.mode) {
        case "translate":
          return {
            position: this.objectStartPosition.clone().add(deviceDelta),
          };
        case "rotate":
          const euler = new Euler().setFromQuaternion(rotationDelta);
          return { rotation: euler };
        case "scale":
          const distance = deviceDelta.length();
          const scaleFactor = 1 + distance * (deviceDelta.y > 0 ? 0.1 : -0.1);
          return { scale: new Vector3(scaleFactor, scaleFactor, scaleFactor) };
      }
    }

    return {
      position: this.objectStartPosition.clone().add(deviceDelta),
      rotation: this.objectStartRotation.clone(),
      scale: new Vector3(1, 1, 1),
    };
  }

  onInteractionEnd() {
    this.state.isInteracting = false;
  }

  getObjectTransform(object: Object) {
    return {
      position: object.position,
      rotation: object.rotation,
      scale: object.scale,
    };
  }
}
