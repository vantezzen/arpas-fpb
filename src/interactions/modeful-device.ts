// interactions/modeful-device.ts
import { IInteractionController } from "./base-interaction";
import { ThreeEvent, RootState } from "@react-three/fiber";
import { store } from "@/hooks/useSceneObjects";
import { getCurrentMode } from "@/store/uiStore";
import { Vector3, Quaternion, Euler } from "three";

export class ModefulDeviceController implements IInteractionController {
  private selectedObjectId: string | null = null;

  private refCamPos = new Vector3();
  private refCamQuat = new Quaternion();
  private refLocalOffset = new Vector3();
  private refObjRot = new Euler();

  private isScaling = false;
  private lastPointerY = 0;

  onInit() {
    // Nothing special
  }

  onDispose() {
    // Nothing special
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

    const state = (globalThis as any).storeRootState as RootState;
    state.camera.getWorldPosition(this.refCamPos);
    state.camera.getWorldQuaternion(this.refCamQuat);

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    // local offset for "move"
    const camQuatInv = this.refCamQuat.clone().invert();
    const delta = obj.position
      .clone()
      .sub(this.refCamPos)
      .applyQuaternion(camQuatInv);
    this.refLocalOffset.copy(delta);

    // store rotation
    this.refObjRot.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

    this.lastPointerY = e.screenY;
    this.isScaling = false;
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    this.isScaling = false;
  }

  onFrame(dt: number) {
    if (!this.selectedObjectId) return;
    const mode = getCurrentMode(); // "move" | "rotate" | "scale"

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
      // pinned offset
      const localToWorld = this.refLocalOffset
        .clone()
        .applyQuaternion(curCamQuat);
      obj.position.copy(curCamPos).add(localToWorld);
      store.getState().updateObject(this.selectedObjectId, {
        position: obj.position,
      });
    } else if (mode === "rotate") {
      // orientation delta
      const refCamQuatInv = this.refCamQuat.clone().invert();
      const deltaQ = refCamQuatInv.multiply(curCamQuat);
      const eul = new Euler().setFromQuaternion(deltaQ, "YXZ");
      obj.rotation.y = this.refObjRot.y + eul.y;
      store.getState().updateObject(this.selectedObjectId, {
        rotation: obj.rotation,
      });
    }
    // scale is done by pointerMove in doc-based or by onPointerDown => we can do a simple pointer drag if we want
  }

  /** We can still do a simple vertical drag for scale if we want pointer-based scale. */
  onPointerMove(e: ThreeEvent<PointerEvent>) {
    const mode = getCurrentMode();
    if (mode !== "scale") return;
    if (!this.selectedObjectId) return;

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    const deltaY = e.screenY - this.lastPointerY;
    this.lastPointerY = e.screenY;

    const scaleFactor = 0.001;
    obj.scale = Math.max(0.05, obj.scale + -deltaY * scaleFactor);

    store.getState().updateObject(this.selectedObjectId, { scale: obj.scale });
  }
}
