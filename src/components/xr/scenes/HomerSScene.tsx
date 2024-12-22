import { HomerSInteractionManager } from "@/lib/interactions/HomerSInteractionManager";
import InteractiveObjects from "../InteractiveObjects";
import { useXR } from "@react-three/xr";
import { useFrame, useThree } from "@react-three/fiber";
import { useModeInManager } from "./ModeContext";

const interactionManager = new HomerSInteractionManager({
  modeful: true,
  useDevicePosition: true,
  usePlaneDetection: true,
  useHitTestSnapping: true,
});

function HomerSScene() {
  const { camera } = useThree();
  const xr = useXR();

  // Pass camera position updates to the interaction manager
  useFrame(() => {
    if (interactionManager.state.isInteracting) {
      interactionManager.onInteractionMove({ camera });
    }
  });

  useModeInManager(interactionManager);

  return <InteractiveObjects interactionManager={interactionManager} />;
}

export default HomerSScene;
