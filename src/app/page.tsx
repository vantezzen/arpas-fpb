"use client";
import { StateStorageProvider } from "@/components/providers/state";
import React from "react";
import dynamic from "next/dynamic";
import { InteractionType } from "@/components/xr/Scene";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ObjectSelector from "@/components/xr/ObjectSelector";

const Scene = dynamic(
  () => import("@/components/xr/Scene").then((mod) => mod.default),
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
  const [interactionType, setInteractionType] =
    React.useState<InteractionType>("homer-s");

  return (
    <StateStorageProvider>
      <Select
        value={interactionType}
        onValueChange={(value) => setInteractionType(value as InteractionType)}
      >
        <SelectTrigger className="w-64">
          <SelectValue>{interactionType}</SelectValue>
        </SelectTrigger>

        <SelectContent>
          {[
            "touch-modeful",
            "touch-modeless",
            "homer-s",
            "homer-s-modeless",
          ].map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Scene interactionType={interactionType} />

      <ObjectSelector />
    </StateStorageProvider>
  );
}

export default PuppetPage;
