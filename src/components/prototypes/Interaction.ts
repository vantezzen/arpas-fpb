import { Euler, Vector3 } from "three";

export default interface Interaction {
  onCameraMove(cameraPosition: Vector3, cameraRotation: Euler): void;
  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
  onTouchEnd(event: TouchEvent): void;
}
