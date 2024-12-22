import { InteractionManager, InteractionMode } from "@/lib/interactions/types";
import { createContext, useContext, useEffect, useState } from "react";

export const ModeContext = createContext<
  [InteractionMode, (mode: InteractionMode) => void]
>(["none", () => {}]);

export function useMode() {
  return useContext(ModeContext);
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const modeState = useState<InteractionMode>("none");

  return (
    <ModeContext.Provider value={modeState}>{children}</ModeContext.Provider>
  );
}

export function useModeInManager(interactionManager: InteractionManager) {
  const [mode] = useMode();

  useEffect(() => {
    interactionManager.onModeChange(mode);
  }, [mode, interactionManager]);
}
