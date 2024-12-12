import { HomerSModelessManager } from "@/lib/interactions/HomerSModelessManager";
import InteractiveObjects from "../InteractiveObjects";
import { ObjectSelector } from "../ObjectSelector";
import { useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";

const interactionManager = new HomerSModelessManager({
  modeful: false,
  useDevicePosition: true,
  usePlaneDetection: true,
  useHitTestSnapping: true,
});

function HomerSModelessScene() {
  const { camera } = useThree();

  useFrame(() => {
    if (interactionManager.state.isInteracting) {
      interactionManager.onInteractionMove({ camera });
    }
  });

  return (
    <>
      <InteractiveObjects interactionManager={interactionManager} />
      <ObjectSelector />
    </>
  );
}

export default HomerSModelessScene;
