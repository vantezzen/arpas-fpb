import { createXRStore } from "@react-three/xr";

export const xrstore = createXRStore({
  mode: "AR",
  sessionInit: {
    optionalFeatures: ["dom-overlay"],
  },
});
