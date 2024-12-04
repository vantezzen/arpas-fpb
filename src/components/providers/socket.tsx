import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { State, useAppState } from "./state";

const socketContext = createContext<Socket | null>(null);
export default socketContext;

export function useSocket() {
  const socket = useContext(socketContext);
  if (!socket) {
    throw new Error("usesocket must be used within a SocketProvider");
  }
  return socket;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { _internal_setAppState } = useAppState();

  // Create a new socket when the component mounts
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
    };
  }, []);

  // Handle incoming events
  useEffect(() => {
    if (!socket) {
      console.log("Socket not ready, skipping event handling");
      return;
    }

    const handler = (message: State) => {
      console.log("Received status message", message);
      _internal_setAppState(message);
    };

    socket.on("message", handler);

    return () => {
      socket.off("message", handler);
    };
  }, [socket, _internal_setAppState]);

  return (
    <socketContext.Provider value={socket}>
      {socket ? children : <div>Connecting to server...</div>}
    </socketContext.Provider>
  );
}

export function useSetAppState() {
  const { appState } = useAppState();
  const socket = useSocket();

  return (newState: Partial<State>) => {
    const mergedState = { ...appState, ...newState };

    socket.send("message", mergedState);
  };
}
