import React from "react";
import ModefulTouchInteraction from "./ModefulTouchInteraction";
import { useFrame } from "@react-three/fiber";

function UpdateInteraction({
  interaction,
}: {
  interaction: ModefulTouchInteraction;
}) {
  useFrame((state) => {
    interaction.onCameraMove(state.camera.position, state.camera.rotation);
  });

  return null;
}

export default UpdateInteraction;
