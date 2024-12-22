// app/ar/[prototypeId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { getInteractionControllerById } from "@/interactions/getInteractionControllerById";
import { ARScene, xrstore } from "@/components/ARScene";
import { Button } from "@/components/ui/button";

export default function ArPrototypePage() {
  const params = useParams();
  const prototypeId = params.prototypeId as string;

  const InteractionClass = getInteractionControllerById(prototypeId);
  if (!InteractionClass) {
    return <p>Prototype not found: {prototypeId}</p>;
  }

  const handleEnterAR = async () => {
    try {
      await xrstore.enterAR();
      console.log("Entered AR session.");
    } catch (err) {
      console.error("Failed to enter AR:", err);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Button onClick={handleEnterAR}>Enter AR</Button>

      <ARScene interactionControllerClass={InteractionClass} />
    </div>
  );
}
