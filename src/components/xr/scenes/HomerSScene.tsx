import { HomerSInteractionManager } from "@/lib/interactions/HomerSInteractionManager";
import InteractiveObjects from "../InteractiveObjects";
import { useXR } from "@react-three/xr";
import { useThree } from "@react-three/fiber";

const interactionManager = new HomerSInteractionManager({
  modeful: true,
  useDevicePosition: true,
  usePlaneDetection: true,
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

  return <InteractiveObjects interactionManager={interactionManager} />;
}

export default HomerSScene;
