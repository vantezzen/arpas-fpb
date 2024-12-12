import { Object } from "@/components/providers/state";
import { Vector3, Euler, Matrix4 } from "three";

export type InteractionMode = "none" | "translate" | "rotate" | "scale";

export type GestureType = "single-touch" | "multi-touch" | "device-move";

export interface InteractionState {
  selectedObject: number | null;
  mode: InteractionMode;
  isInteracting: boolean;
  startPosition?: Vector3;
  startRotation?: Euler;
  startScale?: Vector3;
  gestureType?: GestureType;
  touchDistance?: number;
}

export interface InteractionConfig {
  modeful: boolean;
  useDevicePosition: boolean; // HOMER-S
  usePlaneDetection: boolean;
}

export interface InteractionManager {
  onSelect: (objectIndex: number) => void;
  onDeselect: () => void;
  onModeChange: (mode: InteractionMode) => void;
  onInteractionStart: (event: any) => void;
  onInteractionMove: (event: any) => void;
  onInteractionEnd: (event: any) => void;
  getObjectTransform: (object: Object) => {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
  };
  onPlaneDetected?: (plane: XRPlane) => void;
  shouldSnapToPlane?: boolean;
  getClosestPlane?: (position: Vector3) => XRPlane | null;
}
