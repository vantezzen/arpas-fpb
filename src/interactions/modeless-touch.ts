// interactions/modeless-touch.ts
import { IInteractionController } from "./base-interaction";
import { ThreeEvent } from "@react-three/fiber";
import { store } from "@/hooks/useSceneObjects";
import { Vector2, Object3D } from "three";

/**
 * Modeless Touch-based (3DTouch):
 * - 1 finger => move
 * - 2 fingers => scale or rotate, based on pinch distance vs. angle
 */
export class ModelessTouchController implements IInteractionController {
  private selectedObjectId: string | null = null;

  // Storing the initial transform
  private initialX = 0;
  private initialZ = 0;
  private initialRotY = 0;
  private initialScale = 1;

  // For single-finger
  private lastSinglePos = new Vector2();

  // For two-finger pinch/rotate
  private pointerPositions: Record<number, Vector2> = {};
  private initialDistance = 0;
  private initialAngle = 0;

  onInit() {}
  onDispose() {}

  onPointerDown(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ) {
    e.stopPropagation();
    if (!objectId) {
      this.selectedObjectId = null;
      return;
    }
    this.selectedObjectId = objectId;

    // store the object transform
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    this.initialX = obj.position.x;
    this.initialZ = obj.position.z;
    this.initialRotY = obj.rotation.y;
    this.initialScale = obj.scale;

    // store pointer position(s)
    this.pointerPositions[e.pointerId] = new Vector2(e.screenX, e.screenY);

    // if only 1 finger => track single finger pos
    if (Object.keys(this.pointerPositions).length === 1) {
      this.lastSinglePos.set(e.screenX, e.screenY);
    } else if (Object.keys(this.pointerPositions).length === 2) {
      // set initialDistance, initialAngle
      const [p1, p2] = Object.values(this.pointerPositions);
      this.initialDistance = p1.distanceTo(p2);
      this.initialAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }
  }

  onPointerMove(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ) {
    e.stopPropagation();
    if (!this.selectedObjectId) return;

    // update pointerPositions
    this.pointerPositions[e.pointerId] = new Vector2(e.screenX, e.screenY);

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    const fingerCount = Object.keys(this.pointerPositions).length;

    if (fingerCount === 1) {
      // single-finger => move
      const oldX = this.lastSinglePos.x;
      const oldY = this.lastSinglePos.y;
      const dx = e.screenX - oldX;
      const dy = e.screenY - oldY;

      this.lastSinglePos.set(e.screenX, e.screenY);

      const moveFactor = 0.01;
      obj.position.x = this.initialX + dx * moveFactor;
      obj.position.z = this.initialZ + dy * moveFactor;
    } else if (fingerCount === 2) {
      // 2-finger => scale or rotate
      const [p1, p2] = Object.values(this.pointerPositions);
      const dist = p1.distanceTo(p2);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      // decide if user is scaling or rotating
      const distDelta = dist - this.initialDistance;
      const angleDelta = angle - this.initialAngle;

      // simple heuristic: if absolute distDelta > absolute angleDelta*(some factor), scale, else rotate
      // Or we can do both! We'll do a simpler approach: pinch => scale, horizontal twist => rotate
      const scaleThreshold = 5; // some pixels difference to trigger scale
      const rotateThreshold = 0.1; // in radians
      const doScale = Math.abs(distDelta) > scaleThreshold;
      const doRotate = Math.abs(angleDelta) > rotateThreshold;

      if (doScale) {
        const scaleFactor = 0.01;
        let newScale = this.initialScale + distDelta * scaleFactor;
        newScale = Math.max(0.05, newScale);
        obj.scale = newScale;
      }
      if (doRotate) {
        const rotateFactor = 1.0; // adjust as needed
        obj.rotation.y = this.initialRotY + angleDelta * rotateFactor;
      }
    }

    store.getState().updateObject(this.selectedObjectId, {
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
    });
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    // remove this pointer from the map
    delete this.pointerPositions[e.pointerId];

    // if no pointers left, done
    if (Object.keys(this.pointerPositions).length === 0) {
      this.selectedObjectId = null;
    }
  }

  onFrame(dt: number) {
    // no continuous device-based logic
  }
}
