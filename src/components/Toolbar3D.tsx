// components/Toolbar3D.tsx
"use client";

import { Root, Container, Text } from "@react-three/uikit";
import { useUiStore } from "@/store/uiStore";
import { Vector3 } from "three";

/**
 * A 3D toolbar using react-three/uikit, displayed about 1 meter in front
 * of the user, near the bottom center of their view in AR.
 */
export function Toolbar3D() {
  const currentMode = useUiStore((s) => s.currentMode);
  const setMode = useUiStore((s) => s.setMode);

  return (
    /**
     * The "Root" defines a 2D layout in 3D space.
     * sizeX/sizeY define how big the UI is in "scene units."
     * anchorX/anchorY define how it's anchored relative to its (x,y).
     * position places it in the 3D scene (1 meter forward, 1 meter down).
     */
    <Root
      sizeX={0.8} // 0.8 "meters" wide
      sizeY={0.2} // 0.2 "meters" tall
      anchorX="center"
      anchorY="center"
      backgroundColor="#222" // background behind everything
      borderRadius={0.02}
      padding={0.02}
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
    >
      {/* Each "button" is just a Container with onClick. */}
      <Container
        flexGrow={1}
        backgroundColor={currentMode === "move" ? "#4caf50" : "#666"}
        borderRadius={0.02}
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
        borderRadius={0.02}
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
        borderRadius={0.02}
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
  );
}
