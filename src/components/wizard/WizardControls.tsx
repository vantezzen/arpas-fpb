import React from "react";
import { OBJECTS, useAppState } from "../providers/state";
import { useSetAppState } from "../providers/socket";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Euler, Vector3 } from "three";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Trash2, RotateCw } from "lucide-react";

function WizardControls() {
  const appState = useAppState();
  const setAppState = useSetAppState();
  const [selectedObject, setSelectedObject] = React.useState<number | null>(
    null
  );

  const handleObjectChange = (
    index: number,
    changes: Partial<(typeof appState.objects)[0]>
  ) => {
    const objects = [...appState.objects];
    objects[index] = { ...objects[index], ...changes };
    setAppState({ objects });
  };

  const handleDeleteObject = (index: number) => {
    const objects = [...appState.objects];
    objects.splice(index, 1);
    setAppState({ objects });
    setSelectedObject(null);
  };

  return (
    <div className="w-80 h-screen bg-background border-l overflow-y-auto p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Add Object</h2>
        <div className="grid grid-cols-2 gap-2">
          {OBJECTS.map((object, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
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
              }}
            >
              <span className="text-sm">{object.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-2">Objects</h2>
        <div className="space-y-2">
          {appState.objects.map((object, index) => {
            const isSelected = selectedObject === index;
            const objectDef = OBJECTS.find((o) => o.url === object.url);

            return (
              <Card
                key={index}
                className={"p-4 " + (isSelected ? "ring-2 ring-primary" : "")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    {objectDef?.name || "Object"} {index + 1}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      onClick={() =>
                        setSelectedObject(isSelected ? null : index)
                      }
                    >
                      {isSelected ? "Done" : "Edit"}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        handleObjectChange(index, {
                          rotation: new Euler(
                            object.rotation.x,
                            object.rotation.y + Math.PI / 2,
                            object.rotation.z
                          ),
                        });
                      }}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteObject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isSelected && (
                  <div className="space-y-4">
                    <div>
                      <Label>Scale</Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={object.scale.x}
                        onChange={(e) =>
                          handleObjectChange(index, {
                            scale: new Vector3(
                              parseFloat(e.target.value),
                              parseFloat(e.target.value),
                              parseFloat(e.target.value)
                            ),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WizardControls;
