import { InteractionMode } from "@/lib/interactions/types";
import React from "react";
import { Button } from "../ui/button";
import { CircleOff, Expand, Move3D, RefreshCcw, Rotate3D } from "lucide-react";
import { useMode } from "./scenes/ModeContext";

const modes = [
  {
    id: "none",
    icon: CircleOff,
  },
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

function ModeSelector() {
  const [mode, setMode] = useMode();

  return (
    <div className="fixed top-0 right-0 p-3 rounded-lg bg-zinc-500 bg-opacity-40 flex gap-2 z-10">
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
