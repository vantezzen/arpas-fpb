// interactions/modeful-touch.ts
import { IInteractionController } from "./base-interaction";
import { ThreeEvent } from "@react-three/fiber";
import { store } from "@/hooks/useSceneObjects";
import { getCurrentMode } from "@/store/uiStore";

/**
 * A doc-based approach for a Modeful (move/rotate/scale) prototype using single-finger deltas.
 */
export class ModefulTouchController implements IInteractionController {
  private selectedObjectId: string | null = null;

  private isDragging = false;
  private lastTouchX = 0;
  private lastTouchY = 0;

  /** We attach doc-level events once in onInit. We remove them in onDispose. */
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
    if (objectId) {
      this.selectedObjectId = objectId;
      this.isDragging = true;
      // store the initial finger pos if available
      const anyEvent = e.nativeEvent as any;
      if (anyEvent.touches?.[0]) {
        this.lastTouchX = anyEvent.touches[0].pageX;
        this.lastTouchY = anyEvent.touches[0].pageY;
      }
    } else {
      // tapped empty space => deselect
      this.selectedObjectId = null;
      this.isDragging = false;
    }
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    // We'll rely on doc-level touchend too
  }

  onFrame(dt: number): void {
    // No device-based logic here, so no continuous update needed.
  }

  /** doc-level events below */

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.isDragging || !this.selectedObjectId) return;
    if (e.touches.length === 0) return;

    const touch = e.touches[0];
    const dx = touch.pageX - this.lastTouchX;
    const dy = touch.pageY - this.lastTouchY;

    this.lastTouchX = touch.pageX;
    this.lastTouchY = touch.pageY;

    // find the object
    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    const mode = getCurrentMode(); // "move" | "rotate" | "scale"

    if (mode === "move") {
      // move in XZ
      const factor = 0.01;
      obj.position.x += dx * factor;
      obj.position.z += dy * factor;
    } else if (mode === "rotate") {
      // rotate around Y
      const rotateFactor = 0.01;
      obj.rotation.y -= dx * rotateFactor;
      // e.g. horizontal drag => rotate
    } else if (mode === "scale") {
      // scale based on vertical drag (or pinch detection if you want)
      const scaleFactor = 0.001;
      const newScale = obj.scale + -dy * scaleFactor;
      obj.scale = Math.max(0.05, newScale);
    }

    store.getState().updateObject(this.selectedObjectId, {
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
    });
  };

  private handleTouchEnd = (e: TouchEvent) => {
    // if no fingers remain, stop dragging
    if (e.touches.length === 0) {
      this.isDragging = false;
      this.selectedObjectId = null;
    }
  };
}
