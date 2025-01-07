// interactions/modeless-device.ts

import { IInteractionController } from "./base-interaction";
import { ThreeEvent, RootState } from "@react-three/fiber";
import { store } from "@/hooks/useSceneObjects";
import { Vector3, Quaternion, Euler } from "three";

/**
 * ModelessDeviceController:
 * - If an object is selected, we do device-based "move" and "rotate" each frame
 *   (like HOMER-S, pinned offset).
 * - For scale, we do doc-based pinch detection (2-finger), no explicit mode.
 * - If user lifts all fingers, scale is done.
 */
export class ModelessDeviceController implements IInteractionController {
  private selectedObjectId: string | null = null;

  // For device-based move/rotate
  private refCamPos = new Vector3();
  private refCamQuat = new Quaternion();
  private refLocalOffset = new Vector3();
  private refObjRot = new Euler();

  // For pinch-based scale
  private isScaling = false;
  private initialPinchDist = 0;
  private initialScale = 1;

  onInit(): void {
    document.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.handleTouchEnd);
  }

  onDispose(): void {
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);
  }

  onPointerDown(
    e: ThreeEvent<PointerEvent>,
    object3D?: THREE.Object3D,
    objectId?: string
  ) {
    e.stopPropagation();
    if (!objectId) {
      this.selectedObjectId = null;
      return;
    }

    this.selectedObjectId = objectId;

    // store the reference camera + object transform for move/rotate
    const state = (globalThis as any).storeRootState as RootState;
    state.camera.getWorldPosition(this.refCamPos);
    state.camera.getWorldQuaternion(this.refCamQuat);

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    // local offset
    const camQuatInv = this.refCamQuat.clone().invert();
    const delta = obj.position
      .clone()
      .sub(this.refCamPos)
      .applyQuaternion(camQuatInv);
    this.refLocalOffset.copy(delta);

    this.refObjRot.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

    // We also reset scale references if doc-based pinch starts
    this.isScaling = false;
    this.initialPinchDist = 0;
    this.initialScale = obj.scale;
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    // doc-level might finalize pinch
  }

  onFrame(dt: number) {
    if (!this.selectedObjectId) return;
    if (this.isScaling) return;
    // If user is in a pinch gesture, skip device-based movement or do both?

    // device-based move + rotate
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    const state = (globalThis as any).storeRootState as RootState;
    const curCamPos = new Vector3();
    const curCamQuat = new Quaternion();
    state.camera.getWorldPosition(curCamPos);
    state.camera.getWorldQuaternion(curCamQuat);

    // Move
    const localToWorld = this.refLocalOffset
      .clone()
      .applyQuaternion(curCamQuat);
    obj.position.copy(curCamPos).add(localToWorld);

    // Rotate
    const refCamQuatInv = this.refCamQuat.clone().invert();
    const deltaQ = refCamQuatInv.multiply(curCamQuat);
    const eul = new Euler().setFromQuaternion(deltaQ, "YXZ");
    // we'll apply only y for simpler approach
    obj.rotation.y = this.refObjRot.y + eul.y;

    store.getState().updateObject(this.selectedObjectId, {
      position: obj.position,
      rotation: obj.rotation,
    });
  }

  // Doc-level pinch for scale
  private handleTouchMove = (evt: TouchEvent) => {
    if (!this.selectedObjectId) return;
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    if (evt.touches.length === 2) {
      // 2-finger pinch => scale
      this.isScaling = true;
      const t1 = evt.touches[0];
      const t2 = evt.touches[1];
      const dx = t2.pageX - t1.pageX;
      const dy = t2.pageY - t1.pageY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (this.initialPinchDist === 0) {
        // first time we see 2 fingers => store initial scale
        this.initialPinchDist = dist;
        this.initialScale = obj.scale;
      } else {
        const ratio = dist / this.initialPinchDist;
        obj.scale = Math.max(0.05, this.initialScale * ratio);

        store
          .getState()
          .updateObject(this.selectedObjectId, { scale: obj.scale });
      }
    } else if (evt.touches.length === 1) {
      // If user goes from 2->1 finger, scale done, we resume device-based move onFrame
      if (this.isScaling) {
        this.isScaling = false;
        this.initialPinchDist = 0;
      }
    }
  };

  private handleTouchEnd = (evt: TouchEvent) => {
    if (evt.touches.length === 0) {
      // no fingers => done
      this.isScaling = false;
      this.initialPinchDist = 0;
      this.selectedObjectId = null;
    }
  };
}
