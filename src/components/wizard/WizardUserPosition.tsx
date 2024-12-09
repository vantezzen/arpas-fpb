import React from "react";
import { useAppState } from "../providers/state";
import { Cone } from "@react-three/drei";

function WizardUserPosition() {
  const appState = useAppState();

  return (
    <group
      position={[appState.userPosition.x, 0, appState.userPosition.z]}
      rotation={[0, appState.userRotation.y, 0]}
    >
      {/* User position indicator */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>

      {/* Direction indicator */}
      <group position={[0, 0.05, 0]}>
        <Cone
          args={[0.3, 1, 32]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0.75]}
        >
          <meshBasicMaterial color="#4CAF50" />
        </Cone>
      </group>
    </group>
  );
}

export default WizardUserPosition;
