import { useXRPlanes } from "@react-three/xr";
import { Vector3 } from "three";
import { Object } from "../providers/state";

export function usePlaneDetection(object: Object) {
  const planes = useXRPlanes();

  const snapToNearestPlane = (position: Vector3) => {
    if (planes.length === 0) return position;

    let closestPlane = planes[0];
    let closestDistance = Infinity;

    planes.forEach((plane) => {
      const distance = position.distanceTo(plane.position);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlane = plane;
      }
    });

    // Only snap if we're close enough to a plane
    if (closestDistance < 0.5) {
      return new Vector3().copy(closestPlane.position);
    }

    return position;
  };

  return {
    snapToNearestPlane,
  };
}
