// interactions/modeless-device.ts
import { IInteractionController } from "./base-interaction";
import { ThreeEvent, RootState } from "@react-three/fiber";
import { Vector3, Quaternion, Euler, Object3D } from "three";
import { store } from "@/hooks/useSceneObjects";

/**
 * Modeless device-based (HOMER-S) approach:
 * - Selecting an object "attaches" it to the device for move+rotate.
 * - If user drags on screen => scale.
 * - No explicit mode selection; we do it "modelessly."
 */
export class ModelessDeviceController implements IInteractionController {
  private selectedObjectId: string | null = null;

  // For "move/rotate":
  private refCamPos = new Vector3();
  private refCamQuat = new Quaternion();

  private refLocalOffset = new Vector3(); // offset from camera to object in camera space
  private refObjRot = new Euler(); // object original orientation

  // For scale pinch/drag
  private isScaling = false;
  private lastPointerY = 0;
  private refScale = 1;

  onInit() {}
  onDispose() {}

  onPointerDown(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ) {
    e.stopPropagation();

    if (!objectId) {
      // user tapped empty space => deselect
      this.selectedObjectId = null;
      return;
    }
    this.selectedObjectId = objectId;

    // Store camera transform
    const state = (globalThis as any).storeRootState as RootState;
    state.camera.getWorldPosition(this.refCamPos);
    state.camera.getWorldQuaternion(this.refCamQuat);

    // Get the object
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    // We'll store localOffset so we can do "move" as device moves.
    const camQuatInv = this.refCamQuat.clone().invert();
    const objPosWorld = new Vector3().copy(obj.position);
    const delta = objPosWorld.sub(this.refCamPos);
    this.refLocalOffset.copy(delta.applyQuaternion(camQuatInv));

    // Store object rotation
    this.refObjRot.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

    // For scale references
    this.isScaling = false;
    this.lastPointerY = e.screenY;
    this.refScale = obj.scale;
  }

  onPointerMove(
    e: ThreeEvent<PointerEvent>,
    object3D?: Object3D,
    objectId?: string
  ) {
    e.stopPropagation();
    if (!this.selectedObjectId) return;

    // We'll interpret any pointer move as scaling (modelessly)
    // A more advanced approach would check multi-touch pinch, etc.
    this.isScaling = true;

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    const deltaY = e.screenY - this.lastPointerY;
    this.lastPointerY = e.screenY;

    const scaleFactor = 0.001;
    let newScale = this.refScale + -deltaY * scaleFactor;
    newScale = Math.max(0.05, newScale);
    obj.scale = newScale;

    store.getState().updateObject(this.selectedObjectId, {
      scale: obj.scale,
    });
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    this.isScaling = false;
  }

  onFrame(dt: number) {
    if (!this.selectedObjectId) return;
    // If we are scaling, skip device-based movement
    if (this.isScaling) return;

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    // Device-based "move & rotate"
    const state = (globalThis as any).storeRootState as RootState;
    const curCamPos = new Vector3();
    const curCamQuat = new Quaternion();
    state.camera.getWorldPosition(curCamPos);
    state.camera.getWorldQuaternion(curCamQuat);

    // Move: objectPos = curCamPos + curCamQuat * localOffset
    const localToWorld = this.refLocalOffset
      .clone()
      .applyQuaternion(curCamQuat);
    obj.position.copy(curCamPos).add(localToWorld);

    // Rotate: we compute deltaQ = refCamQuat^-1 * curCamQuat => apply that to object
    const refCamQuatInv = this.refCamPos
      ? this.refCamQuat.clone().invert()
      : null;
    if (refCamQuatInv) {
      const deltaQ = refCamQuatInv.multiply(curCamQuat);
      const eul = new Euler().setFromQuaternion(deltaQ, "YXZ");
      // For a simpler approach, only apply Y rotation
      const newY = this.refObjRot.y + eul.y;
      obj.rotation.set(this.refObjRot.x, newY, this.refObjRot.z);
    }

    store.getState().updateObject(this.selectedObjectId, {
      position: obj.position,
      rotation: obj.rotation,
    });
  }
}
