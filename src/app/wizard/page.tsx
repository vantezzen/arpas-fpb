"use client";
import React from "react";
import { StateStorageProvider } from "@/components/providers/state";
import { SocketProvider } from "@/components/providers/socket";
import dynamic from "next/dynamic";

// Disable SSR for Three.js components
const WizardView = dynamic(() => import("@/components/wizard/WizardView"), {
  ssr: false,
});

function WizardPage() {
  return (
    <StateStorageProvider>
      <SocketProvider>
        <WizardView />
      </SocketProvider>
    </StateStorageProvider>
  );
}

export default WizardPage;
