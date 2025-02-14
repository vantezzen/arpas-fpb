import { useUiStore } from "@/store/uiStore";
import { Euler, Quaternion, Vector3 } from "three";
import Interaction from "../Interaction";

export default class ModefulPositionInteraction implements Interaction {
  private currentTouchPoints: Touch[] = [];

  private cameraPosition = new Vector3();
  private cameraRotation = new Euler();

  private prevTouchX: number | null = null;
  private prevTouchY: number | null = null;

  private currentDistance: number | null = null;

  private prevTiltAngle: number | null = null;
  private prevRotation: Euler | null = null;

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
    const nextTouchPoints = Array.from(event.touches);
    this.handleUpdate(nextTouchPoints);
    this.currentTouchPoints = nextTouchPoints;

    if (this.currentTouchPoints.length === 0) {
      this.prevTouchX = null;
      this.prevTouchY = null;

      this.currentTouchPoints = [];
    }
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
    if (touchPoints.length === 0 || this.prevTouchY === null) return;
    const currentTouch = touchPoints[0];
    const deltaY = currentTouch.clientY - this.prevTouchY;

    const objectPosition = useUiStore.getState().cubePosition;

    if (this.currentDistance === null) {
      const distanceObjectToCamera = objectPosition.distanceTo(
        this.cameraPosition
      );
      this.currentDistance = distanceObjectToCamera;
    }
    this.currentDistance -= deltaY * 0.1;

    // Project camera viewpoint with "this.currentDistance" to get the new object position
    const cameraQuat = new Quaternion().setFromEuler(this.cameraRotation);
    const cameraForward = new Vector3(0, 0, -1).applyQuaternion(cameraQuat);
    cameraForward.normalize();

    const newObjectPosition = this.cameraPosition
      .clone()
      .add(cameraForward.multiplyScalar(this.currentDistance));

    useUiStore.getState().setCubePosition(newObjectPosition);
  }

  onScale(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    if (touchPoints.length === 0) return;

    // Use rotating clockwise/counter-clockwise to scale up/down
    const state = useUiStore.getState();
    const objectScale = state.cubeScale;

    const tiltAngle = this.cameraRotation.z;
    const prevTiltAngle = this.prevTiltAngle || tiltAngle;
    this.prevTiltAngle = tiltAngle;

    const tiltDelta = tiltAngle - prevTiltAngle;
    const scaleDelta = tiltDelta * 5;

    const newScale = new Vector3(
      objectScale.x + scaleDelta,
      objectScale.y + scaleDelta,
      objectScale.z + scaleDelta
    );
    state.setCubeScale(newScale);
  }

  onRotate(nextTouchPoints?: Touch[]) {
    const touchPoints = nextTouchPoints || this.currentTouchPoints;
    if (touchPoints.length < 1) return;

    // Copy movement of the device with multiplicator to allow full modification while still seeing it
    const ROTATION_MULTIPLICATOR = 7; // 1/7th rotation is needed for a full rotation of the object
    const state = useUiStore.getState();
    const objectRotation = state.cubeRotation;
    const prevRotation = this.prevRotation;
    this.prevRotation = new Euler(
      this.cameraRotation.x,
      this.cameraRotation.y,
      this.cameraRotation.z
    );

    if (prevRotation == null) return;
    const rotationDelta = new Euler(
      this.cameraRotation.x - prevRotation.x,
      this.cameraRotation.y - prevRotation.y,
      this.cameraRotation.z - prevRotation.z
    );

    const newRotation = new Euler(
      objectRotation.x - rotationDelta.x * ROTATION_MULTIPLICATOR,
      objectRotation.y - rotationDelta.y * ROTATION_MULTIPLICATOR,
      objectRotation.z - rotationDelta.z * ROTATION_MULTIPLICATOR
    );

    state.setCubeRotation(newRotation);
  }
}
