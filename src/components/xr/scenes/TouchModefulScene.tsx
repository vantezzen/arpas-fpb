import { TouchInteractionManager } from "@/lib/interactions/TouchInteractionManager";
import InteractiveObjects from "../InteractiveObjects";

const interactionManager = new TouchInteractionManager({
  modeful: true,
  useDevicePosition: false,
  usePlaneDetection: true,
  useHitTestSnapping: true,
});

function TouchModefulScene() {
  return <InteractiveObjects interactionManager={interactionManager} />;
}

export default TouchModefulScene;
