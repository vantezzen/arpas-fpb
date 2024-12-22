import React from "react";
import { useThree } from "@react-three/fiber";
import { useAppState } from "../providers/state";

function SyncPlayerPosition() {
  const [, setAppState] = useAppState();
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
