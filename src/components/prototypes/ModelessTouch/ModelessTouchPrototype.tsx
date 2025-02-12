import React, { useState } from "react";
import ModelessTouchInteraction from "./ModelessTouchInteraction";
import PrototypeBase from "../PrototypeBase";

function ModelessTouchPrototype() {
  const [interaction] = useState(() => new ModelessTouchInteraction());

  return <PrototypeBase interaction={interaction} />;
}

export default ModelessTouchPrototype;
