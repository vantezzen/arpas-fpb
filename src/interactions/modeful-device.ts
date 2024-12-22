// interactions/modeful-device.ts
import { IInteractionController } from "./base-interaction";
import { ThreeEvent, RootState } from "@react-three/fiber";
import { Vector3, Quaternion, Euler, Object3D } from "three";
import { store } from "@/hooks/useSceneObjects";
import { getCurrentMode } from "@/store/uiStore";

/**
 * Modeful Device-based HOMER-S
 * "move": object is pinned to camera at a fixed local offset
 * "rotate": object orientation is controlled by device orientation changes
 * "scale": done by vertical drag or pinch
 */
export class ModefulDeviceController implements IInteractionController {
  private selectedObjectId: string | null = null;

  // For "move":
  private refLocalOffset = new Vector3(); // local offset from camera
  private refCamPos = new Vector3();
  private refCamQuat = new Quaternion();
  private refObjPos = new Vector3();
  private refObjRot = new Euler();

  // For scale drag
  private isScaling = false;
  private lastPointerY = 0;

  onInit() {}
  onDispose() {}

  onPointerDown(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ) {
    e.stopPropagation();

    if (!objectId) {
      // Tapped empty space => deselect
      this.selectedObjectId = null;
      return;
    }

    this.selectedObjectId = objectId;

    // We'll store the camera transform
    const state = (globalThis as any).storeRootState as RootState;
    state.camera.getWorldPosition(this.refCamPos);
    state.camera.getWorldQuaternion(this.refCamQuat);

    // Also store the object transform
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    this.refObjPos.copy(obj.position);
    this.refObjRot.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

    // For "move", compute localOffset in camera space
    // localOffset = inv(camQuat) * (objPos - camPos)
    const objPosWorld = new Vector3().copy(obj.position);
    const camPosWorld = this.refCamPos.clone();
    const camQuatInv = this.refCamQuat.clone().invert();
    const delta = objPosWorld.sub(camPosWorld);
    this.refLocalOffset.copy(delta.applyQuaternion(camQuatInv));

    // For scale if user drags pointer
    this.lastPointerY = e.screenY;
    this.isScaling = false;
  }

  onPointerMove(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ) {
    e.stopPropagation();
    if (!this.selectedObjectId) return;

    // If we're in "scale" mode, do vertical-drag scale
    const mode = getCurrentMode(); // "move" | "rotate" | "scale"
    if (mode === "scale") {
      this.isScaling = true;
      const obj = store
        .getState()
        .objects.find((o) => o.id === this.selectedObjectId);
      if (!obj) return;

      const deltaY = e.screenY - this.lastPointerY;
      this.lastPointerY = e.screenY;

      const scaleFactor = 0.001;
      const newScale = obj.scale + -deltaY * scaleFactor;
      obj.scale = Math.max(0.05, newScale);

      store.getState().updateObject(this.selectedObjectId, {
        scale: obj.scale,
      });
    }
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    this.isScaling = false;
  }

  onFrame(dt: number) {
    if (!this.selectedObjectId) return;
    const mode = getCurrentMode();
    if (mode === "scale" && this.isScaling) {
      // scale is handled in pointer move
      return;
    }

    // We'll do "move" or "rotate" in device-based
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    const state = (globalThis as any).storeRootState as RootState;
    const curCamPos = new Vector3();
    const curCamQuat = new Quaternion();
    state.camera.getWorldPosition(curCamPos);
    state.camera.getWorldQuaternion(curCamQuat);

    if (mode === "move") {
      // objectPos = curCamPos + curCamQuat * refLocalOffset
      const localToWorld = this.refLocalOffset
        .clone()
        .applyQuaternion(curCamQuat);
      const newObjPos = curCamPos.clone().add(localToWorld);
      obj.position.copy(newObjPos);

      store.getState().updateObject(this.selectedObjectId, {
        position: obj.position,
      });
    } else if (mode === "rotate") {
      // We'll rotate the object based on how the camera changed orientation
      // deltaQ = refCamQuat^-1 * curCamQuat
      const refCamQuatInv = this.refCamQuat.clone().invert();
      const deltaQ = refCamQuatInv.multiply(curCamQuat);

      // Convert deltaQ to Euler, apply to object's ref rotation
      const eul = new Euler().setFromQuaternion(deltaQ, "YXZ");
      // Let's only apply Y for a simpler approach
      const newY = this.refObjRot.y + eul.y;
      obj.rotation.set(this.refObjRot.x, newY, this.refObjRot.z);

      store.getState().updateObject(this.selectedObjectId, {
        rotation: obj.rotation,
      });
    }
  }
}
