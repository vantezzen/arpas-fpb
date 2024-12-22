// components/Toolbar.tsx
"use client";

import { useUiStore } from "@/store/uiStore";

export function Toolbar() {
  const currentMode = useUiStore((s) => s.currentMode);
  const setMode = useUiStore((s) => s.setMode);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "rgba(255,255,255,0.8)",
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <button
        style={{
          marginRight: "8px",
          backgroundColor: currentMode === "move" ? "lightgreen" : "white",
        }}
        onClick={() => setMode("move")}
      >
        Move
      </button>
      <button
        style={{
          marginRight: "8px",
          backgroundColor: currentMode === "rotate" ? "lightgreen" : "white",
        }}
        onClick={() => setMode("rotate")}
      >
        Rotate
      </button>
      <button
        style={{
          backgroundColor: currentMode === "scale" ? "lightgreen" : "white",
        }}
        onClick={() => setMode("scale")}
      >
        Scale
      </button>
    </div>
  );
}
