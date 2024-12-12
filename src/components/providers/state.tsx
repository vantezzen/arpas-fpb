import { createContext, useContext, useState } from "react";
import { Euler, Vector3 } from "three";

export type Object = {
  url: string;
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
};

export type State = {
  objects: Object[];
  userPosition: Vector3;
  userRotation: Euler;
};

export const OBJECTS = [
  {
    name: "Baum",
    url: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf",
  },
  {
    name: "Bank",
    url: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bench-2/model.gltf",
  },
  {
    name: "Laterne",
    url: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/lamp-post/model.gltf",
  },
];

export const OBJECT_SCALES: {
  [key: string]: number;
} = {
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf": 0.1,
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bench-2/model.gltf": 1,
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/lamp-post/model.gltf": 1,
};

const DEFAULT_STATE: State = {
  objects: [],
  userPosition: new Vector3(0, 0, 0),
  userRotation: new Euler(0, 0, 0),
};

export const stateStorageContext = createContext<{
  appState: State;
  setAppState: (state: State) => void;
}>({
  appState: DEFAULT_STATE,
  setAppState: () => {},
});

export function StateStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appState, setAppState] = useState<State>(DEFAULT_STATE);

  return (
    <stateStorageContext.Provider
      value={{
        appState,
        setAppState: setAppState,
      }}
    >
      {children}
    </stateStorageContext.Provider>
  );
}

export function useAppState() {
  return useContext(stateStorageContext).appState;
}
