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
  }

  private handleUpdate(nextTouchPoints?: Touch[]) {
    this.updateMove(nextTouchPoints);
    this.updateScale(nextTouchPoints);
    this.updateRotate(nextTouchPoints);
  }

  updateMove(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    if (touchPoints.length !== 1) return;

    // Single-finger only
    const currentTouch = touchPoints[0];
    if (this.prevTouchX === null || this.prevTouchY === null) return;

    // Calculate how far the finger moved in screen coordinates
    const deltaX = currentTouch.clientX - this.prevTouchX;
    const deltaY = currentTouch.clientY - this.prevTouchY;

    // Current object state
    const state = useUiStore.getState();
    const objectPosition = state.cubePosition.clone();

    // 1) Convert the camera's Euler to a full quaternion (pitch/yaw/roll).
    const cameraQuat = new Quaternion().setFromEuler(this.cameraRotation);

    // 2) Take the camera's local -Z as "forward", apply that quaternion → world space.
    const cameraForward = new Vector3(0, 0, -1).applyQuaternion(cameraQuat);

    // 3) Flatten out any pitch/roll so we only move horizontally:
    //    set y=0, then normalize to get the yaw-only direction of the camera.
    cameraForward.y = 0;
    cameraForward.normalize();

    // 4) Compute the camera's horizontal "right" by doing forward x worldUp
    //    (in a standard right-handed system, forward cross up = +right).
    const worldUp = new Vector3(0, 1, 0);
    const cameraRight = new Vector3().crossVectors(cameraForward, worldUp);
    cameraRight.normalize();

    // 5) For the horizontal plane movement, we anchor the camera's Y to the object's Y
    //    so we do not accidentally move the object up or down.
    const cameraFlatPos = new Vector3(
      this.cameraPosition.x,
      objectPosition.y,
      this.cameraPosition.z
    );

    // 6) Find how far the object is from the camera in "forward" & "right" directions.
    const offset = new Vector3().subVectors(objectPosition, cameraFlatPos);
    const distForward = offset.dot(cameraForward);
    const distRight = offset.dot(cameraRight);

    // 7) Decide how to map finger motion to forward/back & left/right movement:
    //    - Swiping UP (deltaY < 0) should move object away from camera.
    //    - Swiping DOWN (deltaY > 0) should move object closer to camera.
    //    - Swiping RIGHT (deltaX > 0) should move object to the camera's right.
    //    - Swiping LEFT (deltaX < 0) should move object to the camera's left.
    //
    //    We'll do:
    //      newDistForward = distForward - deltaY * moveScale
    //      newDistRight   = distRight + deltaX * moveScale
    //
    //    Explanation for the minus sign on deltaY:
    //      - If deltaY < 0 (finger up), we add a positive value to distForward
    //        so object goes further away from camera.
    const moveScale = 0.01;
    const newDistForward = distForward - deltaY * moveScale;
    const newDistRight = distRight + deltaX * moveScale;

    // 8) Rebuild the new position in world space
    const newPos = cameraFlatPos
      .clone()
      .add(cameraForward.clone().multiplyScalar(newDistForward))
      .add(cameraRight.clone().multiplyScalar(newDistRight));

    // 9) Update store
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

    const yRotation = rotation.y + angleDelta;

    // Move both: X and Z rotation
    const prevTouchPoints = this.currentTouchPoints;
    let xRotation = rotation.x;
    let zRotation = rotation.z;
    if (this.distanceDelta && this.distanceDelta < 10 && angleDelta < 0.1) {
      const touch = prevTouchPoints[0];
      const distanceX = touch.clientX - this.prevTouchX;
      const distanceY = touch.clientY - this.prevTouchY;

      xRotation = rotation.x + distanceY * 0.01;
      zRotation = rotation.z + distanceX * 0.01;
    }

    // Update state
    const newRotation = new Euler(xRotation, yRotation, zRotation);

    state.setCubeRotation(newRotation);
  }
}
