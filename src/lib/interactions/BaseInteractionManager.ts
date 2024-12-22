import { Vector3, Euler } from "three";
import {
  InteractionState,
  InteractionConfig,
  InteractionManager,
  InteractionMode,
} from "./types";
import { Object } from "@/components/providers/state";

export abstract class BaseInteractionManager implements InteractionManager {
  public state: InteractionState = {
    selectedObject: null,
    mode: "none",
    isInteracting: false,
  };

  shouldSnapToPlane = this.config.usePlaneDetection;
  shouldSnapToHitTest = this.config.useHitTestSnapping;

  constructor(public config: InteractionConfig) {}

  onSelect(objectIndex: number) {
    this.state.selectedObject = objectIndex;
    if (!this.config.modeful) {
      this.state.mode = "translate";
    }
  }

  onDeselect() {
    this.state.selectedObject = null;
    this.state.mode = "none";
  }

  onModeChange(mode: InteractionMode) {
    if (this.config.modeful) {
      this.state.mode = mode;
    }
  }

  abstract onInteractionStart(event: any): void;
  abstract onInteractionMove(event: any): void;
  abstract onInteractionEnd(event: any): void;
  abstract getObjectTransform(object: Object): {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
  };
}
