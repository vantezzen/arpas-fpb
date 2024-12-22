import { Vector3 } from "three";

export class PlaneDetectionManager {
  private planes: readonly XRPlane[] = [];
  private snapThreshold = 0.5; // meters

  updatePlanes(newPlanes: readonly XRPlane[]) {
    this.planes = newPlanes;
  }

  findClosestPlane(position: Vector3): XRPlane | null {
    if (this.planes.length === 0) return null;

    let closestPlane = null;
    let closestDistance = Infinity;

    this.planes.forEach((plane) => {
      const closestPoint = plane.polygon.reduce((closest, point) => {
        const pointVector = new Vector3(point.x, point.y, point.z);
        const distance = position.distanceTo(pointVector);
        return distance < position.distanceTo(closest) ? pointVector : closest;
      }, new Vector3(Infinity, Infinity, Infinity));
      const distance = position.distanceTo(closestPoint);
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
    const planeCenter = plane.polygon
      .reduce((center, point) => {
        center.add(new Vector3(point.x, point.y, point.z));
        return center;
      }, new Vector3())
      .divideScalar(plane.polygon.length);
    snappedPosition.y = planeCenter.y;
    return snappedPosition;
  }
}
