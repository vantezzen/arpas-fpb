import { TouchInteractionManager } from "@/lib/interactions/TouchInteractionManager";
import InteractiveObjects from "../InteractiveObjects";

const interactionManager = new TouchInteractionManager({
  modeful: true,
  useDevicePosition: false,
  usePlaneDetection: false,
});

function TouchModefulScene() {
  return <InteractiveObjects interactionManager={interactionManager} />;
}

export default TouchModefulScene;
