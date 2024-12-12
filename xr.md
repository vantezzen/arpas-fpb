The goal of @react-three/xr v6 is to align this library closer to the react-three ecosystem. We, therefore, focussed on supporting the react-three/fiber event handlers. Another focus of v6 is to reduce boilerplate and provide more defaults while also giving developers more access to the lower-level WebXR primitives. In combination, these changes allow developers to build XR experiences that interoperate with the whole react-three ecosystem using only a few lines of code.

For everybody that is transitioning from v5 to v6, we have created a small compatibility layer that includes XRButton, ARButton, VRButton, useInteraction, useXREvent, Interactive, and RayGrab. However, we recommend transitioning away from the compatibility layer as the new recommended way of building with @react-three/xr is more aligned with the whole react-three ecosystem.

For the Controllers and Hands components there are not correspondances in @react-three/xr v6 since input methods such as controllers, hands, but also transient-pointers are added by default. Users can configure the default implementation of those input methods as described here. The teleportation feature of @react-three/xr v5 has also slightly changed. The new API is explained here.

---

title: Store
description: What is the XR Store for?
nav: 8

---

The xr store is the central part of all `@react-three/xr` experiences and allows to configure those experiences using a large set of options, control the experience using various functions, and provide access to the current state of the xr experience.

## Options

When creating a xr store, there are a lot of options that can be used for configuration.

For instance, we can use these options to disable the default controller on the left hand.

```ts
createXRStore({
  controller: { left: false },
});
```

The following tables show all the available options.

| **Property**                 | **Description**                                                                                                                                                                                                                                                                        | **Default Value**                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `controller`                 | Configures the `<DefaultXRController/>` or allows providing a custom implementation. You can set this for each handedness (e.g., left or right hand) individually. Setting this to `false` prevents the controllers from being used.                                                   | `true`                                                                           |
| `transientPointer`           | Configures the `<DefaultXRTransientPointer/>` or allows providing a custom implementation. This can be set individually for each handedness. Setting this to `false` prevents transient pointers from being used.                                                                      | N/A                                                                              |
| `hand`                       | Configures the `<DefaultXRHand/>` or allows providing a custom implementation. You can set this individually for each handedness. Setting this to `false` prevents hand tracking from being used.                                                                                      | N/A                                                                              |
| `gaze`                       | Configures the `<DefaultXRGaze/>` or allows providing a custom gaze implementation. Setting this to `false` prevents gaze-based interaction from being used.                                                                                                                           | `true`                                                                           |
| `screenInput`                | Configures the `<DefaultXRScreenInput/>` or allows providing a custom screen input implementation. Setting this to `false` prevents screen input from being used.                                                                                                                      | `true`                                                                           |
| `emulate`                    | Emulates a specific device (e.g., "metaQuest3") using [IWER](https://github.com/meta-quest/immersive-web-emulation-runtime/) if WebXR is not supported and running on `"localhost"` or pressing `Window/Command + Alt/Option + E`. It can also be set to `false` to disable emulation. | `"metaQuest3"`                                                                   |
| `frameRate`                  | Sets the session's framerate, with options such as `"high"` for smoother performance.                                                                                                                                                                                                  | `"high"`                                                                         |
| `foveation`                  | Sets the WebXR foveation level between `0` (no foveation) and `1` (maximum foveation). If `undefined`, the device/browser's default foveation setting is used.                                                                                                                         | `undefined`                                                                      |
| `frameBufferScaling`         | Adjusts the framebuffer scaling of the session. If undefined, the device/browser's default scaling is used (typically `1`).                                                                                                                                                            | `undefined`                                                                      |
| `enterGrantedSession`        | Automatically enters session modes when granted by the system without manually requesting a session. It can be an array of session modes or a boolean value to enable/disable this feature.                                                                                            | `true`                                                                           |
| `baseAssetPath`              | Specifies the path to load the controller and hand models, and controller profiles from a CDN or local source.                                                                                                                                                                         | `'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/'` |
| `defaultControllerProfileId` | Specifies the fallback profile ID for the controller if no matching profile is found. It is useful for ensuring basic functionality when a specific controller profile isn't available.                                                                                                | `'generic-trigger'`                                                              |
| `defaultXRHandProfileId`     | Specifies the fallback profile ID for hand tracking if no matching profile is found. It ensures basic hand-tracking functionality.                                                                                                                                                     | `'generic-hand'`                                                                 |
| `originReferenceSpace`       | Defines the reference space type for the origin, such as `'local-floor'` or `'bounded-floor'`. Determines how the user's position is tracked in the XR environment.                                                                                                                    | N/A                                                                              |
| `bounded`                    | Enables or disables the session bounds. `false` means unbounded (only available in AR). `true` means bounded (allows to reference the bounding space). `undefined` means bounded but no access to bounding space.                                                                      | `undefined`                                                                      |
| `anchors`                    | Enables or disables anchors, which are fixed points in the XR environment that can be used to attach virtual objects.                                                                                                                                                                  | `true`                                                                           |
| `handTracking`               | Enables or turns off hand-tracking in the session, allowing users to interact with the XR environment using their hands.                                                                                                                                                               | `true`                                                                           |
| `layers`                     | Enables or turns off the use of layers in the session, which can enhance rendering performance by stacking visual content.                                                                                                                                                             | `true`                                                                           |
| `meshDetection`              | Enables or turns off mesh detection, allowing the system to recognize and interact with real-world objects by detecting their mesh.                                                                                                                                                    | `true`                                                                           |
| `planeDetection`             | Enables or turns off plane detection, allowing the system to recognize flat surfaces like floors and tables.                                                                                                                                                                           | `true`                                                                           |
| `depthSensing`               | Enables or disables depth sensing in the session, which can enhance realism by occluding virtual objects from real-world objects.                                                                                                                                                      | `false`                                                                          |
| `customSessionInit`          | Overrides the session initialization object with custom settings. Use with caution, as it can significantly alter the behavior of the XR session.                                                                                                                                      | `undefined`                                                                      |
| `hitTest`                    | Enables or turns off hit testing, which allows the system to detect where the user's input (e.g., a tap or gaze) intersects with objects in the XR environment.                                                                                                                        | `true`                                                                           |
| `domOverlay`                 | Enables or turns off DOM overlay in the session or provides a custom DOM element for the overlay, allowing HTML content to be rendered within the XR environment.                                                                                                                      | `true`                                                                           |
| `secondaryInputSources`      | Enables non-primary (secondary input / tracked) sources. For example, when the device supports hands and controllers, the controllers can be used while the hands are tracked as primary input sources. This can allow to use the tracked controllers for other inputs.                | `false`                                                                          |

## Functions

The xr store provides a large set of functions to modify and control the xr store. For instance, key functions are the `store.enterAR` and `store.enterVR` functions. The following table gives an overview of the complete set of functions that the xr store provides.

| **Function**                                       | **Description**                                                                                                                                                                                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `destroy()`                                        | Irreversibly destroys the XR store.                                                                                                                                                                                                        |
| `enterXR(mode)`                                    | Initiates an XR session in the specified mode (such as `immersive-ar` or `immersive-vr`). The function returns a promise that eventually resolves with the XR session or `undefined` if the session fails to start.                        |
| `enterAR()`                                        | Starts an Augmented Reality (AR) session. The function returns a promise that eventually resolves with the AR session or `undefined` if AR is not supported.                                                                               |
| `enterVR()`                                        | Starts a Virtual Reality (VR) session. The function returns a promise that eventually resolves with the VR session or `undefined` if VR is not supported.                                                                                  |
| `setHand(implementation, handedness?)`             | Updates the hand tracking configuration or implementation. You can target both hands or specify the handedness (`left` or `right`). This allows customization or updates to the hand implementation or configuration during runtime.       |
| `setController(implementation, handedness?)`       | Updates the controller configuration or implementation. You can target both hands or specify the handedness (`left` or `right`). This enables dynamic updates to the controller setup.                                                     |
| `setGaze(implementation)`                          | Updates the gaze-based interaction configuration or implementation. This function is used to modify the gaze implementation or configuration.                                                                                              |
| `setScreenInput(implementation)`                   | Updates the screen input configuration or implementation. This function modifies how screen inputs are handled within the XR session.                                                                                                      |
| `setTransientPointer(implementation, handedness?)` | Updates the transient pointer configuration or implementation. You can target both hands or specify the handedness.                                                                                                                        |
| `setFrameRate(value)`                              | Sets the framerate of the XR session, adjusting the session's performance and visual smoothness. Higher framerates can improve user experience but may require more processing power.                                                      |
| `requestFrame()`                                   | Returns a promise that resolves with the XR frame on the next render. This function is useful for synchronizing actions or processing data in the next render cycle, especially for tasks that need to be aligned with the rendering loop. |

## State

Alongside a set of functions, the xr store also provides the state of the current experience. For instance, the state of the xr store contains the current `XRSession` inside `state.session`.

The following table provides a list of properties available in the state of the xr store.

| **State Property**     | **Description**                                                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `session`              | Represents the current `XRSession`. This object contains all the details and state information about the active XR session.                                                                                        |
| `originReferenceSpace` | Refers to the `XRReferenceSpace` of the origin in the current session. This space is typically set at the floor level and serves as the reference point for the user's position in the XR environment.             |
| `origin`               | Represents the 3D object that defines the session's origin. If this object is `undefined`, the origin is implicitly set at the world position `(0,0,0)`.                                                           |
| `domOverlayRoot`       | The HTML element used for DOM overlays in handheld AR experiences. This is where any content will be overlayed over the handheld AR session.                                                                       |
| `visibilityState`      | Indicates the session's visibility state, such as `"visible-blurred"` when the user sees an Operating System overlay. This property helps manage how the XR experience adjusts to different visibility conditions. |
| `frameRate`            | Represents the configured framerate for the XR session. Note that the actual framerate might be lower if the system cannot maintain the desired performance level.                                                 |
| `mode`                 | Specifies the current XR session mode, such as `immersive-vr`, `immersive-ar`, or `inline`. If no session is active, this will be `null`.                                                                          |
| `detectedPlanes`       | A read-only array of `XRPlane` objects representing the planes detected in the XR environment. These could include surfaces like floors, walls, and tables.                                                        |
| `detectedMeshes`       | A read-only array of `XRMesh` objects representing the meshes detected in the XR environment. These are typically 3D objects that have been identified and tracked during the session.                             |

## useXR

The `useXR` hook allows to retrieve the state from the xr store. For instance, `const session = useXR(xr => xr.session)` allows us to always get the current session from any component that is placed inside the `<XR>` component.

---

title: Object Detection
description: Use detected objects such as meshes and planes for rendering, scene understanding, physics, and more
nav: 10

---

@react-three/xr allows to use the devices mesh and plane detection functionality to detect the meshes and planes in the environment to modify the rendering, allow physics interactions with the environment, and more.

## Detected Planes

The detected planes are accessible through the `useXRPlanes` hook or directly from `useXR(xr => xr.detectPlanes)` and manually go through the returned array. To render the planes in the correct place, the planes' space must provided to the `XRSpace` component. The following example shows how to render the red planes for all detected walls.

```tsx
function RedWalls() {
  const wallPlanes = useXRPlanes("wall");
  return (
    <>
      {wallPlanes.map((plane) => (
        <XRSpace space={plane.planeSpace}>
          <XRPlaneModel plane={plane}>
            <meshBasicMaterial color="red" />
          </XRPlaneModel>
        </XRSpace>
      ))}
    </>
  );
}
```

## Detected Meshes

Mesh detection provides access to the geometry of the environment. Similarly to xr planes, @react-three/fiber allows to retrieve detected meshes using `useXRMeshes` and offers the `XRMeshModel` to render the individual meshes.

---

title: Hit Test
description: How to add hit testing capabilities to your AR experiences?
nav: 19

---

Hit testing allows to check intersections with real-world geometry in AR experiences. `@react-three/xr` provides various hooks and components for setting up hit testing.
The following example shows how to set up a hit test inside the right hand using the `XRHitTest` component, how to get the first hit test result using the `onResults` callback, and how to get the world position of that result into a vector.

```tsx
const matrixHelper = new Matrix4();
const hitTestPosition = new Vector3();

const store = createXRStore({
  hand: {
    right: () => {
      const state = useXRHandState();
      return (
        <>
          <XRHandModel />
          <XRHitTest
            space={state.inputSource.targetRaySpace}
            onResults={(results, getWorldMatrix) => {
              if (results.length === 0) {
                return;
              }
              getWorldMatrix(matrixHelper, results[0]);
              hitTestPosition.setFromMatrixPosition(matrixHelper);
            }}
          />
        </>
      );
    },
  },
});
```

With the `hitTestPosition` containing the world position of the last hit test, we can use it to create a 3d object and sync it to the object's position on every frame.

```tsx
function Point() {
  const ref = useRef<Mesh>(null);
  useFrame(() => ref.current?.position.copy(hitTestPosition));
  return (
    <mesh scale={0.05} ref={ref}>
      <sphereGeometry />
      <meshBasicMaterial />
    </mesh>
  );
}
```

Alternatively, for devices that provide mesh detection, we can also add normal pointer events listeners to the XR Mesh to achieve the same behavior. Check out [this tutorial](./object-detection.md) for more information about mesh detection.

---

title: Anchors
description: How to create and manage anchors in your AR experience?
nav: 17

---

Anchors allow to anchor virtual objects into the physical world in AR experiences. `react-three/xr` offers a multitude of ways to create and manage anchors. A simple solution is `useXRAnchor`, which works similarly to `useState` as it returns the current anchor and a function to request a new anchor as a tuple.

```tsx
const [anchor, requestAnchor] = useXRAnchor();
```

With the `requestAnchor` function, we can request an anchor relative to the `"world"`, a `"space"`, or a `"hitTestResult"`

```tsx
requestAnchor({ relativeTo: "space", space: ... })
```

Once the anchor is created, the `useXRAnchor` hook exposes it as `anchor`. We can now use this `anchor` to put content into it using the `<XRSpace>` component.

```tsx
<XRSpace space={anchor.anchorSpace}>...your content</XRSpace>
```

The following example shows a `Anchor` component that uses the `useXRAnchor` hook and the `XRSpace` component to anchor a Box to the position of the right hand or controller when the respective hand or controller is selected (pinch/trigger).

```tsx
export function Anchor() {
  const [anchor, requestAnchor] = useXRAnchor();
  const controllerState = useXRInputSourceState("controller", "right");
  const handState = useXRInputSourceState("hand", "right");
  const inputSource = controllerState?.inputSource ?? handState?.inputSource;
  useXRInputSourceEvent(
    inputSource,
    "select",
    async () => {
      if (inputSource == null) {
        return;
      }
      requestAnchor({ relativeTo: "space", space: inputSource.targetRaySpace });
    },
    [requestAnchor, inputSource]
  );
  if (anchor == null) {
    return null;
  }
  return (
    <XRSpace space={anchor.anchorSpace}>
      <mesh scale={0.1}>
        <boxGeometry />
      </mesh>
    </XRSpace>
  );
}
```

---

title: FAQ
description: Frequently asked questions about react-three/xr.
nav: 7

---

## How can I read the camera position or rotation in XR?

The current global camera transformation can be accessed through `getWorldPosition` or `getWorldQuaternionn` This works inside of XR, as well as, outside of XR.

```tsx
useFrame((state) => console.log(state.camera.getWorldPosition(new Vector3())));
```

## How can I change the camera position in XR?

In contrast to non-immersive 3D applications, the camera transformation in MR/VR/AR applications should never be directly controlled by the developer since the user's head movement must control the camera's transformation. Therefore, pmndrs/xr provides the XROrigin component, which allows to control where the session's origin is placed inside the 3D scene. The session origin is at the users' feet once they recenter their session. This allows to implicitly control the camera position but prevents the user from getting motion sick when their movement is not reflected in the camera's movement.

## Having problems accessing the camera position or rotation.

Check if you have OrbitControls, CameraControls, or other controls in your scene and make sure to place an `<IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>` guard around them when in XR. This prevents overwriting the camera transformation which is controlled through WebXR when inside an immersive session and allows to access the correct transformation.

```tsx
const OrbitControlsWrapper = () => {
  return (
    <IfInSessionMode deny={["immersive-ar", "immersive-vr"]}>
      <OrbitControls />
    </IfInSessionMode>
  );
};
```

## I cannot enter the XR session!

1. **Missing Https**  
   If you are trying to enter the AR or VR modus and nothing is happening, make sure that you are accessing the website using `https://`.
   In case you are using vite, we recommend using the `@vitejs/plugin-basic-ssl` to try out your vite application on your device while developing.

2. **Missing XR component**  
   If you made sure that the website is accessed using `https://` and still nothing happens when executing `enterAR` or `enterVR`, it is likely that the `<XR>` component is missing. Be sure to add the `<XR>` component directly into the `<Canvas>` and make sure both the `<Canvas>` and the `<XR>` component are present when the button is pressed.

3. **Entering while loading content**  
   If you cannot enter the VR or AR experience, there might be assets in your scene that are loading.
   Make sure to place a suspense boundary around your scene. With this setup, the `<XR>` component stays mounted while your scene loads.

```tsx
<Canvas>
  <XR>
    <Suspense>... your scene</Suspense>
  </XR>
</Canvas>
```

## How can I exit an XR session?

```ts
store.getState().session?.end();
```

## Is WebGPU supported?

WebGPU is finding its way to more and more devices. However, AR and VR devices do not yet implement WebGPU for WebXR, which requires the [WebXR-WebGPU-Binding](https://github.com/immersive-web/WebXR-WebGPU-Binding/blob/main/explainer.md). Therefore, WebGPU is not yet usable for WebXR in general.

## How can I put HTML in my XR scene?

If you are targeting only handheld AR experiences (e.g., for smartphones), you can use dom overlay. Here's a [tutorial for using XRDomOverlays](../tutorials/dom-overlay.md) in your `react-three/xr` experience.

For non-handheld VR and AR experiences, you can use [react-three/uikit](https://github.com/pmndrs/uikit), which renders user interfaces directly inside the 3D scene and is aligned with HTML and CSS concepts.

## Does it work on iOS?

WebXR for VR experiences is supported on Safari for Apple Vision Pro.
WebXR is not supported on iOS Safari yet. The alternative is to use products such as [Variant Launch](https://launch.variant3d.com/), which allow to build WebXR experiences for iOS.

## XRSpace

If you are placing `<XRSpace>` components outside of the `<XROrigin>` while changing the transformation of the `<XROrigin>` (e.g. by setting `<XROrigin position={[0,1,0]} />`), the elements rendered inside of the `<XRSpace>` will not be transformed with the origin. If the transformations of the origin should be applied to the `<XRSpace>`, make sure to place those components inside the `<XROrigin>`. Not placing `<XRSpace>` components into the `<XROrigin>` can be useful in scenarios where you want to move the `<XROrigin>` independently from the `<XRSpace>`. For instance, building a virtual elevator where your actual room is duplicated into the x-axis so that you can use the elevator to travel between multiple instances of your room.

## `onClick` does not play video or allow file uploading (in certain browsers)

As a performance optimization the react-three/xr event system batches html user events per frame. This only applies if you are using `PointerEvents`, `forwardHtmlEvents`, or `forwardObjectEvents`. This can cause issue when executing functions that require a user action. For instance, uploading a file through a input element in a safari can only be triggered manually when immediately caused by a user input. For these use cases, please disable the event batching performance optimization through the options by setting `batchEvents` to `false`.
