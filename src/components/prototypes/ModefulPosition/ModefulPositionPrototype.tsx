import React, { useState } from "react";
import ModefulPositionInteraction from "./ModefulPositionInteraction";
import PrototypeBase from "../PrototypeBase";

function ModefulPositionPrototype() {
  const [interaction] = useState(() => new ModefulPositionInteraction());

  return <PrototypeBase interaction={interaction} modeful />;
}

export default ModefulPositionPrototype;
