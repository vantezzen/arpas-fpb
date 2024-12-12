import { Vector3 } from "three";
import { useXRPlanes } from "@react-three/xr";

export class PlaneDetectionManager {
  private planes: XRPlane[] = [];
  private snapThreshold = 0.5; // meters

  updatePlanes(newPlanes: XRPlane[]) {
    this.planes = newPlanes;
  }

  findClosestPlane(position: Vector3): XRPlane | null {
    if (this.planes.length === 0) return null;

    let closestPlane = null;
    let closestDistance = Infinity;

    this.planes.forEach((plane) => {
      const distance = position.distanceTo(plane.position);
      if (distance < closestDistance && distance < this.snapThreshold) {
        closestDistance = distance;
        closestPlane = plane;
      }
    });

    return closestPlane;
  }

  snapPositionToPlane(position: Vector3, plane: XRPlane): Vector3 {
    // Project position onto plane
    const snappedPosition = new Vector3().copy(position);
    snappedPosition.y = plane.position.y;
    return snappedPosition;
  }
}
