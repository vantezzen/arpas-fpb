"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { ARScene } from "@/components/ARScene";
import { InteractionManager } from "@/components/InteractionManager";
import { getInteractionControllerById } from "@/interactions/getInteractionControllerById";
import { Toolbar } from "@/components/StaticHudToolbar"; // a small UI for modeful
import { EnterARButton } from "@/components/EnterArButton";

export default function ArPrototypePage() {
  const params = useParams();
  const prototypeId = params.prototypeId as string;

  const InteractionClass = getInteractionControllerById(prototypeId);
  if (!InteractionClass) {
    notFound();
  }

  const isModeful = prototypeId.includes("modeful");

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <EnterARButton />
      <ARScene interactionClass={InteractionClass!} />
    </div>
  );
}
