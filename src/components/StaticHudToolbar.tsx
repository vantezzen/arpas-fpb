// components/StaticHudToolbar.tsx
"use client";

import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Group } from "three";
import { Root, Container, Text } from "@react-three/uikit";
import { useUiStore } from "@/store/uiStore";

/**
 * A "static" 3D UI toolbar using @react-three/uikit,
 * always in front of the user's camera (a HUD).
 */
export function StaticHudToolbar() {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);

  const currentMode = useUiStore((s) => s.currentMode);
  const setMode = useUiStore((s) => s.setMode);

  /**
   * 1) On mount, we parent the <group> to the camera.
   *    This means the entire group (and our <Root> inside it)
   *    will move with the user's head in AR.
   */
  useEffect(() => {
    if (!groupRef.current) return;
    camera.add(groupRef.current);
    return () => {
      camera.remove(groupRef.current!);
    };
  }, [camera]);

  return (
    /**
     * 2) The <group> is our hook into position/rotation in 3D space.
     *    We'll place it slightly in front of the camera.
     */
    <group ref={groupRef} position={[0, -0.4, -1]}>
      {/**
       * 3) The <Root> from @react-three/uikit is placed inside the group.
       *    "sizeX"/"sizeY" define how large it is in world units (meters).
       *    "anchorX"/"anchorY" define where the layout anchors relative to (0,0).
       */}
      <Root
        sizeX={0.8}
        sizeY={0.2}
        anchorX="center"
        anchorY="bottom"
        backgroundColor="#333"
        borderRadius={0.02}
        padding={0.02}
        flexDirection="row"
        justifyContent="space-evenly"
        // no "position" prop on Root
      >
        <Container
          flexGrow={1}
          backgroundColor={currentMode === "move" ? "#4caf50" : "#666"}
          borderRadius={0.01}
          alignItems="center"
          justifyContent="center"
          onClick={() => setMode("move")}
          marginX={0.01}
        >
          <Text color="white" fontSize={0.05}>
            Move
          </Text>
        </Container>

        <Container
          flexGrow={1}
          backgroundColor={currentMode === "rotate" ? "#4caf50" : "#666"}
          borderRadius={0.01}
          alignItems="center"
          justifyContent="center"
          onClick={() => setMode("rotate")}
          marginX={0.01}
        >
          <Text color="white" fontSize={0.05}>
            Rotate
          </Text>
        </Container>

        <Container
          flexGrow={1}
          backgroundColor={currentMode === "scale" ? "#4caf50" : "#666"}
          borderRadius={0.01}
          alignItems="center"
          justifyContent="center"
          onClick={() => setMode("scale")}
          marginX={0.01}
        >
          <Text color="white" fontSize={0.05}>
            Scale
          </Text>
        </Container>
      </Root>
    </group>
  );
}
