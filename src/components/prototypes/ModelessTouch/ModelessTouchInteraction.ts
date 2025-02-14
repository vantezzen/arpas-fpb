import { useUiStore } from "@/store/uiStore";
import { Euler, Quaternion, Vector3 } from "three";
import Interaction from "../Interaction";

export default class ModelessTouchInteraction implements Interaction {
  private currentTouchPoints: Touch[] = [];

  private cameraPosition = new Vector3();
  private cameraRotation = new Euler();

  private prevTouchX: number | null = null;
  private prevTouchY: number | null = null;

  private prevDistance: number | null = null;

  private prevAngle: number | null = null;
  private distanceDelta: number | null = null;
  private prevCenterPoint: Vector3 | null = null;

  onCameraMove(cameraPosition: Vector3, cameraRotation: Euler) {
    this.cameraPosition.copy(cameraPosition);
    this.cameraRotation.copy(cameraRotation);

    this.handleUpdate();
  }

  onTouchStart(event: TouchEvent) {
    this.currentTouchPoints = Array.from(event.touches);

    const firstTouch = event.touches[0];
    if (firstTouch) {
      this.prevTouchX = firstTouch.clientX;
      this.prevTouchY = firstTouch.clientY;
    }
  }
  onTouchMove(event: TouchEvent) {
    const nextTouchPoints = Array.from(event.touches);
    this.handleUpdate(nextTouchPoints);
    this.currentTouchPoints = nextTouchPoints;

    const firstTouch = event.touches[0];
    if (firstTouch) {
      this.prevTouchX = firstTouch.clientX;
      this.prevTouchY = firstTouch.clientY;
    }
  }
  onTouchEnd(event: TouchEvent) {
    if (this.currentTouchPoints.length === 0) {
      this.prevTouchX = null;
      this.prevTouchY = null;
      this.currentTouchPoints = [];
    }
    this.prevDistance = null;
    this.prevAngle = null;
    this.prevCenterPoint = null;
  }

  private handleUpdate(nextTouchPoints?: Touch[]) {
    this.updateMove(nextTouchPoints);
    this.updateScale(nextTouchPoints);
    this.updateRotate(nextTouchPoints);
  }

  updateMove(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    if (touchPoints.length !== 1) return;

    const currentTouch = touchPoints[0];
    if (this.prevTouchX === null || this.prevTouchY === null) return;

    const deltaX = currentTouch.clientX - this.prevTouchX;
    const deltaY = currentTouch.clientY - this.prevTouchY;
    const state = useUiStore.getState();
    const objectPosition = state.cubePosition.clone();
    const cameraQuat = new Quaternion().setFromEuler(this.cameraRotation);

    // Take the camera's local -Z as "forward", apply that quaternion to world space.
    const cameraForward = new Vector3(0, 0, -1).applyQuaternion(cameraQuat);

    // Flatten out any pitch/roll so we only move horizontally:
    cameraForward.y = 0;
    cameraForward.normalize();

    // compute the camera's horizontal "right" by doing forward x worldUp
    // (in a standard right-handed system, forward cross up = +right).
    const worldUp = new Vector3(0, 1, 0);
    const cameraRight = new Vector3().crossVectors(cameraForward, worldUp);
    cameraRight.normalize();

    // anchor the cameras Y to the objects Y so we do not accidentally move the object up or down.
    const cameraFlatPos = new Vector3(
      this.cameraPosition.x,
      objectPosition.y,
      this.cameraPosition.z
    );

    const offset = new Vector3().subVectors(objectPosition, cameraFlatPos);
    const distForward = offset.dot(cameraForward);
    const distRight = offset.dot(cameraRight);

    const moveScale = 0.01;
    const newDistForward = distForward - deltaY * moveScale;
    const newDistRight = distRight + deltaX * moveScale;

    const newPos = cameraFlatPos
      .clone()
      .add(cameraForward.clone().multiplyScalar(newDistForward))
      .add(cameraRight.clone().multiplyScalar(newDistRight));

    state.setCubePosition(newPos);
  }

  updateScale(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    const prevDistance = this.prevDistance;
    if (touchPoints.length !== 2) return;

    // Calculate the distance between the two touch points
    const touch1 = touchPoints[0];
    const touch2 = touchPoints[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.prevDistance = distance;

    if (prevDistance === null) return;

    const distanceDelta = distance - prevDistance;
    const state = useUiStore.getState();
    this.distanceDelta = distanceDelta;

    const scale = state.cubeScale;
    const newScale = new Vector3(
      scale.x + distanceDelta * 0.01,
      scale.y + distanceDelta * 0.01,
      scale.z + distanceDelta * 0.01
    );

    state.setCubeScale(newScale);
  }

  updateRotate(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    if (touchPoints.length !== 2) return;

    if (this.prevTouchX === null || this.prevTouchY === null) return;

    const touch1 = touchPoints[0];
    const touch2 = touchPoints[1];

    // Angle: Y Rotation
    const angle = Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    );
    const prevAngle = this.prevAngle;
    this.prevAngle = angle;
    if (prevAngle === null) return;

    const angleDelta = angle - prevAngle;
    const state = useUiStore.getState();
    const rotation = state.cubeRotation;

    const yRotation = rotation.y - angleDelta;

    // Move both: X and Z rotation
    const prevTouchPoints = this.currentTouchPoints;
    let xRotation = rotation.x;
    let zRotation = rotation.z;

    const centerPoint = new Vector3(
      (touch1.clientX + touch2.clientX) / 2,
      (touch1.clientY + touch2.clientY) / 2,
      0
    );
    const prevCenterPoint = this.prevCenterPoint;
    this.prevCenterPoint = centerPoint;

    if (prevCenterPoint) {
      const centerPointDelta = new Vector3().subVectors(
        centerPoint,
        prevCenterPoint
      );
      xRotation = rotation.x + centerPointDelta.y * 0.01;
      zRotation = rotation.z - centerPointDelta.x * 0.01;
    }

    // Update state
    const newRotation = new Euler(xRotation, yRotation, zRotation);

    state.setCubeRotation(newRotation);
  }
}
