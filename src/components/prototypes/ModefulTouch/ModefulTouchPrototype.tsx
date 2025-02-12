import React, { useState } from "react";
import ModefulTouchInteraction from "./ModefulTouchInteraction";
import PrototypeBase from "../PrototypeBase";

function ModefulTouchPrototype() {
  const [interaction] = useState(() => new ModefulTouchInteraction());

  return <PrototypeBase interaction={interaction} modeful />;
}

export default ModefulTouchPrototype;
