// interactions/modeless-touch.ts

import { IInteractionController } from "./base-interaction";
import { ThreeEvent } from "@react-three/fiber";
import { store } from "@/hooks/useSceneObjects";

/**
 * The ModelessTouchController implements "modeless" manipulation for a single selected object:
 *  - Single-finger => Move (in XZ plane)
 *  - Two-finger => Scale (by pinch distance) and Rotate (by twist angle) simultaneously
 * The user can seamlessly switch from 1 finger to 2 fingers, etc. We track everything in doc-level events.
 */

export class ModelessTouchController implements IInteractionController {
  // The ID of the currently selected object (if any).
  private selectedObjectId: string | null = null;

  // Whether we are currently "dragging" or "manipulating"
  private isDragging = false;

  // For single-finger move:
  private lastSingleX = 0;
  private lastSingleY = 0;

  // For two-finger pinch/rotate:
  private initialPinchDistance = 0;
  private initialAngle = 0;
  private initialScale = 1; // object's scale at the moment we detect 2 fingers
  private initialRotY = 0; // object's rotation.y at the moment we detect 2 fingers

  // We'll also track the object's reference position for single-finger (to avoid "jump")
  // but here we do an incremental approach (accumulate deltas) so we store lastSingleX/Y
  // and apply them directly.

  onInit() {
    // Attach doc-level events
    document.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.handleTouchEnd);
  }

  onDispose() {
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);
  }

  // R3F pointerDown => user tapped a mesh or empty space
  onPointerDown(
    e: ThreeEvent<PointerEvent>,
    obj3D?: THREE.Object3D,
    objectId?: string
  ) {
    e.stopPropagation();

    if (objectId) {
      this.selectedObjectId = objectId;
      this.isDragging = true;

      // If there's at least one finger, store single-finger reference for movement
      const anyEvent = e.nativeEvent as any;
      if (anyEvent.touches?.[0]) {
        this.lastSingleX = anyEvent.touches[0].pageX;
        this.lastSingleY = anyEvent.touches[0].pageY;
      }
    } else {
      // tapped empty space => deselect
      this.selectedObjectId = null;
      this.isDragging = false;
    }
  }

  onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    // We'll rely on doc-level "touchend" to finalize
  }

  onFrame(dt: number) {
    // No device-based or frame-based logic. All doc-level touch events handle transformations.
  }

  // Doc-level event for multi-touch
  private handleTouchMove = (evt: TouchEvent) => {
    if (!this.isDragging || !this.selectedObjectId) return;
    if (evt.touches.length === 0) return;

    const obj = store
      .getState()
      .objects.find((o) => o.id === this.selectedObjectId);
    if (!obj) return;

    // 1 finger => Move
    if (evt.touches.length === 1) {
      const touch = evt.touches[0];
      const dx = touch.pageX - this.lastSingleX;
      const dy = touch.pageY - this.lastSingleY;

      this.lastSingleX = touch.pageX;
      this.lastSingleY = touch.pageY;

      // Move in XZ
      const moveFactor = 0.01;
      obj.position.x += dx * moveFactor;
      obj.position.z += dy * moveFactor;

      store.getState().updateObject(this.selectedObjectId, {
        position: obj.position,
      });
      return;
    }

    // 2 fingers => pinch for scale + twist for rotate
    if (evt.touches.length === 2) {
      const touch1 = evt.touches[0];
      const touch2 = evt.touches[1];

      // Calculate pinch distance and angle
      const x1 = touch1.pageX;
      const y1 = touch1.pageY;
      const x2 = touch2.pageX;
      const y2 = touch2.pageY;

      const dx = x2 - x1;
      const dy = y2 - y1;

      const dist = Math.sqrt(dx * dx + dy * dy); // current pinch distance
      const angle = Math.atan2(dy, dx); // current angle in radians

      // If this is the first time we see 2 fingers, store initial scale, rotation, pinch dist, angle
      if (this.initialPinchDistance === 0 && this.initialAngle === 0) {
        this.initialPinchDistance = dist;
        this.initialAngle = angle;
        this.initialScale = obj.scale;
        this.initialRotY = obj.rotation.y;
      } else {
        // scale
        const scaleRatio = dist / this.initialPinchDistance;
        obj.scale = Math.max(0.05, this.initialScale * scaleRatio);

        // rotate around Y
        const angleDelta = angle - this.initialAngle;
        obj.rotation.y = this.initialRotY + angleDelta;
      }

      store.getState().updateObject(this.selectedObjectId, {
        scale: obj.scale,
        rotation: obj.rotation,
      });
    }

    // If there's more than 2 fingers, we won't handle them here (3+ finger gestures).
    // Could be extended if needed.
  };

  private handleTouchEnd = (evt: TouchEvent) => {
    // If all fingers lifted, end drag
    if (evt.touches.length === 0) {
      this.isDragging = false;
      this.selectedObjectId = null;

      // Reset pinch references
      this.initialPinchDistance = 0;
      this.initialAngle = 0;
    }
    // If user goes from 2 fingers to 1 finger, we might want to reset pinch references
    // so we can do single-finger move again. We'll do that too:
    if (evt.touches.length === 1) {
      this.initialPinchDistance = 0;
      this.initialAngle = 0;
    }
  };
}
