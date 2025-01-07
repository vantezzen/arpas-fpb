import React from "react";
import { Button } from "../ui/button";
import { CircleOff, Expand, Move3D, RefreshCcw, Rotate3D } from "lucide-react";

const modes = [
  {
    id: "rotate",
    icon: Rotate3D,
  },
  {
    id: "translate",
    icon: Move3D,
  },
  {
    id: "scale",
    icon: Expand,
  },
];

export type InteractionMode = "rotate" | "translate" | "scale";

export const ModeContext = React.createContext<{
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
}>({
  mode: "rotate",
  setMode: () => {},
});

export function useMode() {
  const ctx = React.useContext(ModeContext);

  return [ctx.mode, ctx.setMode] as const;
}

export function ModeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<InteractionMode>("rotate");

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      <ModeSelector />
      {children}
    </ModeContext.Provider>
  );
}

function ModeSelector() {
  const [mode, setMode] = useMode();

  return (
    <div className="fixed top-0 right-0 p-3 rounded-lg bg-zinc-500 bg-opacity-40 flex gap-2 z-10 m-6">
      {modes.map(({ id, icon: Icon }) => (
        <Button
          key={id}
          onClick={() => setMode(id as InteractionMode)}
          className={`p-2 rounded-lg ${
            mode === id ? "bg-zinc-500" : "bg-zinc-400"
          } aspect-square`}
        >
          <Icon size={24} />
        </Button>
      ))}
    </div>
  );
}

export default ModeSelector;
