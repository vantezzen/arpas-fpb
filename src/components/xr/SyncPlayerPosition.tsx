import React from "react";
import { useSetAppState } from "../providers/socket";
import { useThree } from "@react-three/fiber";

function SyncPlayerPosition() {
  const setAppState = useSetAppState();
  const { camera } = useThree();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAppState({
        userPosition: camera.position,
        userRotation: camera.rotation,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [camera, setAppState]);

  return null;
}

export default SyncPlayerPosition;
