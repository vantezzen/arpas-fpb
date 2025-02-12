"use client";
import React from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(
  () =>
    import("@/components/prototypes/ModelessTouch/ModelessTouchPrototype").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Loading AR Experience...</h2>
          <p className="text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    ),
  }
);

function ModelessTouchPage() {
  return <Scene />;
}

export default ModelessTouchPage;
