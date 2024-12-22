// components/UI/EnterARButton.tsx
"use client";

import { xrstore } from "./ARScene";

export function EnterARButton() {
  const handleEnterAR = async () => {
    try {
      // The store exposes enterAR()
      await xrstore.enterAR();
      console.log("Entered AR session");
    } catch (err) {
      console.error("Failed to enter AR:", err);
    }
  };

  return (
    <button
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 999,
        background: "white",
        border: "1px solid gray",
        borderRadius: 4,
        padding: "8px",
      }}
      onClick={handleEnterAR}
    >
      Enter AR
    </button>
  );
}
