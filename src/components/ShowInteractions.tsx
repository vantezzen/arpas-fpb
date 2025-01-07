import React, { useEffect, useState } from "react";
import { useSocket } from "./providers/socket";

type Interaction = {
  x: number;
  y: number;
  type: "touch" | "drag";
  id: number;
};

function ShowInteractions() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const socket = useSocket();

  useEffect(() => {
    const abort = new AbortController();

    const addInteraction = (x: number, y: number, type: "touch" | "drag") => {
      const interaction: Interaction = {
        x,
        y,
        type,
        id: Date.now(),
      };
      setInteractions((prev) => [...prev, interaction]);
      socket.emit("interaction", interaction);

      // Remove interaction after 1 second
      setTimeout(() => {
        setInteractions((prev) => prev.filter((i) => i.id !== interaction.id));
      }, 1000);
    };

    // Handle mouse interactions
    document.addEventListener(
      "mousedown",
      (event) => {
        addInteraction(event.clientX, event.clientY, "touch");
      },
      { signal: abort.signal }
    );

    document.addEventListener(
      "mousemove",
      (event) => {
        if (event.buttons !== 1) return;
        addInteraction(event.clientX, event.clientY, "drag");
      },
      { signal: abort.signal }
    );

    // Handle touch interactions
    document.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];
        addInteraction(touch.clientX, touch.clientY, "touch");
      },
      { signal: abort.signal }
    );

    document.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches[0];
        addInteraction(touch.clientX, touch.clientY, "drag");
      },
      { signal: abort.signal }
    );

    return () => {
      abort.abort();
    };
  }, [socket]);

  return (
    <>
      {interactions.map((interaction) => (
        <div
          key={interaction.id}
          className="pointer-events-none fixed z-50 select-none"
          style={{
            left: interaction.x - 25,
            top: interaction.y - 25,
            width: 50,
            height: 50,
          }}
        >
          <div
            className={`absolute inset-0 animate-ping rounded-full ${
              interaction.type === "touch"
                ? "bg-blue-500 opacity-75"
                : "bg-green-500 opacity-50"
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full ${
              interaction.type === "touch" ? "bg-blue-500" : "bg-green-500"
            }`}
          />
        </div>
      ))}
    </>
  );
}

export default ShowInteractions;
