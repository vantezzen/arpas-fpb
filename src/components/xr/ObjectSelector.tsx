import React from "react";
import { Plus, X } from "lucide-react";
import { OBJECTS, useAppState } from "../providers/state";
import { Button } from "../ui/button";
import { useSetAppState } from "../providers/socket";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import ObjectDemo from "./ObjectDemo";
import { Euler, Vector3 } from "three";

function ObjectSelector() {
  const { appState } = useAppState();
  const [isOpen, setIsOpen] = React.useState(false);

  const setAppState = useSetAppState();

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button className="fixed bottom-4 right-4" style={{ zIndex: 9999 }}>
            <Plus size={24} />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Objekt hinzufügen</DrawerTitle>
          </DrawerHeader>

          <div className="grid grid-cols-3 gap-3 mb-12">
            {OBJECTS.map((object, index) => (
              <button
                key={index}
                className="cursor-pointer w-full h-32"
                onClick={() => {
                  setAppState({
                    objects: [
                      ...appState.objects,
                      {
                        url: object.url,
                        position: new Vector3(0, 0, 0),
                        scale: new Vector3(1, 1, 1),
                        rotation: new Euler(0, 0, 0),
                      },
                    ],
                  });
                  setIsOpen(false);
                }}
              >
                <ObjectDemo url={object.url} />
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ObjectSelector;
