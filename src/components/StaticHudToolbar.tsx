// components/StaticHudToolbar.tsx
"use client";

import { Root, Container, Text } from "@react-three/uikit";
import { useUiStore } from "@/store/uiStore";

import { Card } from "@react-three/uikit-apfel";
import { Tabs, TabsButton } from "@react-three/uikit-apfel";
import { Billboard } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function StaticHudToolbar() {
  const currentMode = useUiStore((s) => s.currentMode);
  const setMode = useUiStore((s) => s.setMode);

  const { camera } = useThree();
  const uiRef = useRef<THREE.Group>();

  useFrame(() => {
    if (!uiRef.current) return;

    const distance = 8;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const targetPosition = camera.position
      .clone()
      .add(forward.multiplyScalar(distance));

    targetPosition.y -= 3;

    uiRef.current.position.copy(targetPosition);
    uiRef.current.lookAt(camera.position);
  });

  return (
    <Billboard ref={uiRef}>
      <Root anchorX="center" anchorY="top">
        <Card
          borderRadius={32}
          padding={16}
          flexDirection="column"
          alignItems="flex-start"
          gapRow={16}
        >
          <Tabs value={currentMode} onValueChange={setMode}>
            <TabsButton value="move">
              <Text>Move</Text>
            </TabsButton>
            <TabsButton value="rotate">
              <Text>Rotate</Text>
            </TabsButton>
            <TabsButton value="scale">
              <Text>Scale</Text>
            </TabsButton>
          </Tabs>
        </Card>
      </Root>
    </Billboard>
  );

  return (
    <Root
      anchorX="center"
      anchorY="bottom"
      backgroundColor="#333"
      borderRadius={0.02}
      padding={0.02}
      flexDirection="row"
      justifyContent="space-evenly"
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
  );
}
