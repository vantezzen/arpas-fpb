"use client";
import { SocketProvider } from "@/components/providers/socket";
import { StateStorageProvider } from "@/components/providers/state";
import React from "react";
import dynamic from "next/dynamic";

// Import Three.js components dynamically to avoid SSR issues
const Scene = dynamic(
  () => import("@/components/puppet/Scene").then((mod) => mod.default),
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

function PuppetPage() {
  return (
    <StateStorageProvider>
      <SocketProvider>
        <Scene />
      </SocketProvider>
    </StateStorageProvider>
  );
}

export default PuppetPage;
