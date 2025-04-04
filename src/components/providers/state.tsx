import { createContext, useContext, useState } from "react";
import { Euler, Vector3 } from "three";

export type State = {
  objectPosition: Vector3;
  objectRotation: Euler;
  objectScale: Vector3;

  userPosition: Vector3;
  userRotation: Euler;
};

const DEFAULT_STATE: State = {
  objectPosition: new Vector3(0, 0, 0),
  objectRotation: new Euler(0, 0, 0),
  objectScale: new Vector3(1, 1, 1),

  userPosition: new Vector3(0, 0, 0),
  userRotation: new Euler(0, 0, 0),
};

export const stateStorageContext = createContext<{
  appState: State;
  setAppState: (state: State) => void;
  setUpdatesDisabled: (disabled: boolean) => void;
}>({
  appState: DEFAULT_STATE,
  setAppState: () => {},
  setUpdatesDisabled: () => {},
});

export function StateStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appState, setAppState] = useState<State>(DEFAULT_STATE);
  const [updatesDisabled, setUpdatesDisabled] = useState(false);

  return (
    <stateStorageContext.Provider
      value={{
        appState,
        setAppState: (state) => {
          if (updatesDisabled) {
            return;
          }
          setAppState(state);
        },
        setUpdatesDisabled: (disabled) => {
          setUpdatesDisabled(disabled);
          window.__wizard_disable_updates = disabled;
        },
      }}
    >
      {children}
    </stateStorageContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(stateStorageContext);

  return [
    ctx.appState,
    (state: Partial<State>) => {
      ctx.setAppState({ ...ctx.appState, ...state });
    },
    ctx.setUpdatesDisabled,
  ] as const;
}
