import { BaseInteractionManager } from "./BaseInteractionManager";
import { Vector2, Vector3, Euler } from "three";
import { Object } from "@/components/providers/state";

export class TouchModelessManager extends BaseInteractionManager {
  private touchStart = new Vector2();
  private lastTouch = new Vector2();

  onInteractionStart(event: TouchEvent) {
    if (!this.state.selectedObject) return;

    this.state.isInteracting = true;

    if (event.touches.length === 2) {
      this.state.gestureType = "multi-touch";
      this.state.touchDistance = this.getTouchDistance(event.touches);
    } else {
      this.state.gestureType = "single-touch";
      const touch = event.touches[0];
      this.touchStart.set(touch.clientX, touch.clientY);
      this.lastTouch.copy(this.touchStart);
    }
  }

  onInteractionMove(event: TouchEvent) {
    if (!this.state.isInteracting || !this.state.selectedObject) return;

    if (
      event.touches.length === 2 &&
      this.state.gestureType === "multi-touch"
    ) {
      // Handle scaling and rotation
      const newDistance = this.getTouchDistance(event.touches);
      const scaleFactor = newDistance / (this.state.touchDistance || 1);
      this.state.touchDistance = newDistance;

      // Calculate rotation from the line between touch points
      const angle = this.getTouchAngle(event.touches);
      return {
        scale: new Vector3().setScalar(scaleFactor),
        rotation: new Euler(0, angle, 0),
      };
    } else {
      // Handle translation with single touch
      const touch = event.touches[0];
      const currentTouch = new Vector2(touch.clientX, touch.clientY);
      const delta = currentTouch.sub(this.lastTouch);
      this.lastTouch.set(touch.clientX, touch.clientY);

      return {
        position: new Vector3(delta.x * 0.01, 0, delta.y * 0.01),
      };
    }
  }

  onInteractionEnd() {
    this.state.isInteracting = false;
    this.state.gestureType = undefined;
    this.state.touchDistance = undefined;
  }

  private getTouchDistance(touches: TouchList): number {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchAngle(touches: TouchList): number {
    return Math.atan2(
      touches[1].clientY - touches[0].clientY,
      touches[1].clientX - touches[0].clientX
    );
  }

  getObjectTransform(object: Object) {
    const transform = {
      position: object.position,
      rotation: object.rotation,
      scale: object.scale,
    };

    // The actual snapping will be handled by InteractiveObjects
    return transform;
  }
}
