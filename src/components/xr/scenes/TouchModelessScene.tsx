import { TouchModelessManager } from "@/lib/interactions/TouchModelessManager";
import InteractiveObjects from "../InteractiveObjects";
import { ObjectSelector } from "../ObjectSelector";

const interactionManager = new TouchModelessManager({
  modeful: false,
  useDevicePosition: false,
  usePlaneDetection: true,
});

function TouchModelessScene() {
  return (
    <>
      <InteractiveObjects interactionManager={interactionManager} />
      <ObjectSelector />
    </>
  );
}

export default TouchModelessScene;
