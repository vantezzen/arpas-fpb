import { useUiStore } from "@/store/uiStore";
import { Euler, Quaternion, Vector3 } from "three";
import Interaction from "../Interaction";

export default class ModefulTouchInteraction implements Interaction {
  private currentTouchPoints: Touch[] = [];

  private cameraPosition = new Vector3();
  private cameraRotation = new Euler();

  private prevTouchX: number | null = null;
  private prevTouchY: number | null = null;

  private prevDistance: number | null = null;

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
  }

  private handleUpdate(nextTouchPoints?: Touch[]) {
    const mode = useUiStore.getState().currentMode;
    if (mode === "move") {
      this.onMove(nextTouchPoints);
    } else if (mode === "scale") {
      this.onScale(nextTouchPoints);
    } else if (mode === "rotate") {
      this.onRotate(nextTouchPoints);
    }
  }

  onMove(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    if (touchPoints.length === 0) return;

    // See comments in ModelessTouchInteraction.ts for the logic breakdown.
    const currentTouch = touchPoints[0];
    if (this.prevTouchX === null || this.prevTouchY === null) return;

    const deltaX = currentTouch.clientX - this.prevTouchX;
    const deltaY = currentTouch.clientY - this.prevTouchY;
    const state = useUiStore.getState();
    const objectPosition = state.cubePosition.clone();

    const cameraQuat = new Quaternion().setFromEuler(this.cameraRotation);
    const cameraForward = new Vector3(0, 0, -1).applyQuaternion(cameraQuat);

    cameraForward.y = 0;
    cameraForward.normalize();

    const worldUp = new Vector3(0, 1, 0);
    const cameraRight = new Vector3().crossVectors(cameraForward, worldUp);
    cameraRight.normalize();

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

  onScale(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    const prevDistance = this.prevDistance;
    if (touchPoints.length < 2) return;

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

    const scale = state.cubeScale;
    const newScale = new Vector3(
      scale.x + distanceDelta * 0.01,
      scale.y + distanceDelta * 0.01,
      scale.z + distanceDelta * 0.01
    );

    state.setCubeScale(newScale);
  }

  onRotate(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    if (touchPoints.length < 1) return;
    if (this.prevTouchX === null || this.prevTouchY === null) return;

    const touch = touchPoints[0];
    const state = useUiStore.getState();
    const rotation = state.cubeRotation;

    const distanceX = touch.clientX - this.prevTouchX;
    const distanceY = touch.clientY - this.prevTouchY;

    const newRotation = new Euler(
      rotation.x + distanceY * 0.01,
      rotation.y + distanceX * 0.01,
      rotation.z
    );

    state.setCubeRotation(newRotation);
  }
}
