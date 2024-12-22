import { TouchInteractionManager } from "@/lib/interactions/TouchInteractionManager";
import InteractiveObjects from "../InteractiveObjects";
import { useModeInManager } from "./ModeContext";

const interactionManager = new TouchInteractionManager({
  modeful: true,
  useDevicePosition: false,
  usePlaneDetection: true,
  useHitTestSnapping: true,
});

function TouchModefulScene() {
  useModeInManager(interactionManager);
  return <InteractiveObjects interactionManager={interactionManager} />;
}

export default TouchModefulScene;
