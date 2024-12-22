// interactions/modeful-touch.ts
import { IInteractionController } from "./base-interaction";
import { ThreeEvent } from "@react-three/fiber";
import { store } from "@/hooks/useSceneObjects";
import { getCurrentMode } from "@/store/uiStore";
import { Vector2, Object3D } from "three";

export class ModefulTouchController implements IInteractionController {
  private selectedObjectId: string | null = null;
  private lastPointerPos = new Vector2();

  // We'll store the original transform
  private refPosX = 0;
  private refPosZ = 0;
  private refRotY = 0;
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
      this.selectedObjectId = null;
      return;
    }
    this.selectedObjectId = objectId;

    this.lastPointerPos.set(e.screenX, e.screenY);

    // store the object transform
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    this.refPosX = obj.position.x;
    this.refPosZ = obj.position.z;
    this.refRotY = obj.rotation.y;
    this.refScale = obj.scale;
  }

  onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!this.selectedObjectId) return;

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    const mode = getCurrentMode(); // "move", "rotate", or "scale"

    const deltaX = e.screenX - this.lastPointerPos.x;
    const deltaY = e.screenY - this.lastPointerPos.y;
    this.lastPointerPos.set(e.screenX, e.screenY);

    if (mode === "move") {
      // move in XZ
      const moveFactor = 0.01;
      obj.position.x = this.refPosX + deltaX * moveFactor;
      obj.position.z = this.refPosZ + deltaY * moveFactor;
    } else if (mode === "rotate") {
      // rotate around Y
      const rotateFactor = 0.01;
      obj.rotation.y = this.refRotY - deltaX * rotateFactor;
    } else if (mode === "scale") {
      // uniform scale based on vertical drag
      const scaleFactor = 0.001;
      let newScale = this.refScale + -deltaY * scaleFactor;
      newScale = Math.max(0.05, newScale);
      obj.scale = newScale;
    }

    store.getState().updateObject(this.selectedObjectId, {
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
    });
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    // done
  }

  onFrame(dt: number) {
    // no continuous logic needed
  }
}
