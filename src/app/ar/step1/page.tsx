"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { Vector3 } from "three";

/**
 * XR store for AR usage
 */
const xrstore = createXRStore({});

/**
 * We'll keep a global move multiplier we can tweak.
 */
let globalMoveMultiplier = 0.005;

export default function ArStep1DomEventsFirstMove() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <EnterARButton />
      <ARScene />
      <MultiplierUI />
    </div>
  );
}

/**
 * AR Scene with a single cube, doc-level touch approach,
 * no jump by capturing initial positions on the first move event.
 */
function ARScene() {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <XR store={xrstore}>
        <XROrigin>
          <Suspense fallback={null}>
            <Environment preset="city" />
            <SingleCube />
          </Suspense>
        </XROrigin>
      </XR>
    </Canvas>
  );
}

function EnterARButton() {
  const handleEnterAR = async () => {
    console.log("[FirstMove] Enter AR clicked");
    try {
      await xrstore.enterAR();
      console.log("[FirstMove] enterAR() success");
    } catch (err) {
      console.error("[FirstMove] enterAR() failed:", err);
    }
  };

  return (
    <button
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 999,
        padding: "8px",
      }}
      onClick={handleEnterAR}
    >
      Enter AR
    </button>
  );
}

/**
 * A small UI to adjust the globalMoveMultiplier.
 */
function MultiplierUI() {
  const [val, setVal] = useState(globalMoveMultiplier);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    globalMoveMultiplier = newVal;
    setVal(newVal);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        zIndex: 999,
        background: "rgba(255,255,255,0.8)",
        padding: 8,
      }}
    >
      <label style={{ marginRight: 8 }}>Move Multiplier:</label>
      <input
        type="number"
        step="0.001"
        value={val}
        onChange={handleChange}
        style={{ width: "60px" }}
      />
    </div>
  );
}

/**
 * SingleCube:
 * - position in React state
 * - isSelected in React state
 * - We do NOT store initial positions on pointerDown
 * - On the FIRST doc-level touchmove while isSelected, we store initial positions.
 * - On subsequent moves, we do the offset.
 * - On touchend, we deselect if no fingers remain.
 */
function SingleCube() {
  const [cubePos, setCubePos] = useState(() => new Vector3(0, 0, -1));
  const [isSelected, setIsSelected] = useState(false);

  // We'll keep references for the "initial" state once we do the first move
  const initialCubePosRef = useRef(new Vector3(0, 0, -1));
  const initialTouchRef = useRef({ x: 0, y: 0 });

  // A ref to track if we've done the "initial" setup yet
  const hasInitialRef = useRef(false);

  useEffect(() => {
    function handleDocTouchMove(e: TouchEvent) {
      if (!isSelected) return;
      if (e.touches.length === 0) return;

      const touch = e.touches[0];

      if (!hasInitialRef.current) {
        // This is the FIRST move event since we selected.
        // We'll store the current cube pos as the "initial" pos,
        // and store the finger pos as the "initial" finger coords,
        // then set hasInitialRef.current = true and do NO movement this time.
        hasInitialRef.current = true;
        initialCubePosRef.current = cubePos.clone();
        initialTouchRef.current = { x: touch.pageX, y: touch.pageY };

        console.log(
          "[FirstMove] first doc touchMove => storing initialCubePos=",
          initialCubePosRef.current.toArray(),
          " initialTouch=",
          initialTouchRef.current
        );
        return;
      }

      // after we've stored the initial, we do the normal offset approach
      const dx = touch.pageX - initialTouchRef.current.x;
      const dy = touch.pageY - initialTouchRef.current.y;

      setCubePos(() => {
        const newPos = initialCubePosRef.current.clone();
        newPos.x += dx * globalMoveMultiplier;
        newPos.z += dy * globalMoveMultiplier;

        console.log(
          "[FirstMove] doc touchMove => dx=",
          dx,
          "dy=",
          dy,
          " newPos=",
          newPos.toArray()
        );
        return newPos;
      });
    }

    function handleDocTouchEnd(e: TouchEvent) {
      if (e.touches.length === 0) {
        setIsSelected(false);
        hasInitialRef.current = false; // reset so next time we do firstMove logic again
        console.log(
          "[FirstMove] doc touchEnd => isSelected=false, hasInitialRef=false"
        );
      }
    }

    document.addEventListener("touchmove", handleDocTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleDocTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleDocTouchMove);
      document.removeEventListener("touchend", handleDocTouchEnd);
    };
  }, [isSelected, cubePos]);

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    console.log("[FirstMove] pointerDown => isSelected=true");
    setIsSelected(true);
    // We do NOT store any initial positions here. We'll do it on the first doc-level move.
  }

  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    console.log(
      "[FirstMove] pointerUp => doc touchend might handle isSelected=false"
    );
  }

  const color = isSelected ? "tomato" : "lightblue";

  return (
    <mesh
      position={cubePos}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
