import { useFrame } from "@react-three/fiber";
import React from "react";
import { Euler, Quaternion, Vector3 } from "three";
import { useDebounce, useInterval, useUpdate } from "react-use";
import { useSendAppState } from "../providers/socket";

function SyncPlayerPosition() {
  const [position, setPosition] = React.useState(new Vector3(0, 0, 0));
  const [rotation, setRotation] = React.useState(new Quaternion(0, 0, 0, 0));

  const sendAppState = useSendAppState();

  useFrame((state) => {
    const position = state.camera.getWorldPosition(new Vector3());
    const rotation = state.camera.getWorldQuaternion(new Quaternion());

    setPosition(position);
    setRotation(rotation);
  });

  const update = useUpdate();
  useInterval(update, 1000 / 2);
  useDebounce(
    () => {
      console.log("Sending position", position);

      const eulerRotation = new Euler().setFromQuaternion(rotation);

      sendAppState({
        userPosition: position,
        userRotation: {
          x: eulerRotation.x,
          y: eulerRotation.y,
          z: eulerRotation.z,
        } as Euler,
      });
    },
    500,
    [position.x, position.y, position.z, rotation.z, rotation.y, rotation.z]
  );

  return null;
}

export default SyncPlayerPosition;
