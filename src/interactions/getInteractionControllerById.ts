// interactions/getInteractionControllerById.ts
import { IInteractionController } from "./base-interaction";
import { ModefulTouchController } from "./modeful-touch";
import { ModefulDeviceController } from "./modeful-device";
import { ModelessTouchController } from "./modeless-touch";
import { ModelessDeviceController } from "./modeless-device";

// We map the route param to the corresponding class
export function getInteractionControllerById(
  prototypeId: string
): (new () => IInteractionController) | undefined {
  switch (prototypeId) {
    case "modeful-touch":
      return ModefulTouchController;
    case "modeful-device":
      return ModefulDeviceController;
    case "modeless-touch":
      return ModelessTouchController;
    case "modeless-device":
      return ModelessDeviceController;
    default:
      return undefined;
  }
}
