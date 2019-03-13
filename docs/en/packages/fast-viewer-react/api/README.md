---
id: index
---


FAST Viewer React
=================

**FAST Viewer React has been deprecated. Use [FAST Tooling React](https://www.npmjs.com/package/@microsoft/fast-tooling-react) instead.**

A React component which shows content in an iframe via a provided route. This can be used to as a method for previewing a React component(s) or an entire page.

Installation
------------

`npm i --save @microsoft/fast-viewer-msft`

Basic usage
-----------

An example of using one of the components from the `@microsoft/fast-viewer-msft` package:

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import Viewer from "@microsoft/fast-viewer-msft";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render() {
    ReactDOM.render(
        <Viewer iframeSrc={"/example-content"} />,
        root
    );
}

render();
```

Advanced usage
--------------

There are other components in this package which when used in conjunction with the `Viewer` will allow for setting height and width for devices and the control of components and their data.

### `SelectDevice`

Use the `SelectDevice` component to select from provided default devices or provide your own custom device configurations. This component accepts a list of configured devices via the `devices` prop, some default devices are included with the package as a secondary export. It also accepts an `activeDeviceId` prop which maps to the current device id of the provided devices. In addition there is a callback `onUpdateDevice` which will fire a provided function with the new device id selected.

Example:

```tsx
import {
    defaultDevices,
    SelectDevice,
} from "@microsoft/fast-viewer-msft";

<SelectDevice
    devices={defaultDevices}
    onUpdateDevice={this.handleDeviceUpdate}
    activeDeviceId={this.state.activeDevice.id}
/>
```

#### `devices`

A device can be either "responsive" or "fixed", if it is responsive it does not take a width and height, if it is fixed it does. When the `Viewer` has been set to use a responsive display, it will show resize handles on the left, right, bottom and bottom corners.

Example of custom devices passed to the `devices` prop:

```json
[
    {
        "id": "responsive",
        "displayName": "Responsive display",
        "display": "responsive"
    },
    {
        "id": "phoneDevice",
        "displayName": "Phone device",
        "display": "fixed",
        "height": 800,
        "width": 320
    }
]
```

#### `onUpdateDevice`

This callback will fire when an option has been selected from the dropdown and give back the clicked items `activeDeviceId`.

Example of a callback passed to `onUpdateDevice` prop:

```jsx
handleDeviceUpdate(activeDeviceId) {
    this.setState({
        activeDeviceId: activeDeviceId
    });
}
```

#### `activeDeviceId`

This is the active device id as indicated by the `devices` array. This should exist on the state of the parent component.

### `Rotate`

Use the `Rotate` component to switch between landscape and portrait view. This component accepts an `orientation` prop which can be either "landscape" or "portrait". It also accepts an `onUpdateOrientation` callback which will fire a provided function with the new orientation selected.

Example:

```jsx
import {
    Rotate,
} from "@microsoft/fast-viewer-msft";

<Rotate
    orientation={this.state.orientation}
    onUpdateOrientation={this.handleOrientationUpdate}
/>
```

#### `orientation`

This is can be set to "landscape" or "portrait".

#### `onUpdateOrientation`

This callback will fire when one of the buttons is clicked to change to "landscape" or "portrait" to indicate which one should be activated.

Example:

```jsx
handleOrientationUpdate(orientation) {
    this.setState({
        orientation: orientation
    });
}
```

### Putting it all together for the `Viewer`

After including any combination of the `SelectDevice` and `Rotate` components, the viewer should have added props tied to your state which will update.

Example:

```tsx
<Viewer
    height={this.state.height}
    width={this.state.width}
    iframeSrc={"/example-content"}
    responsive={this.state.activeDevice.display === Display.responsive}
    onUpdateHeight={this.handleUpdatedHeight}
    onUpdateWidth={this.handleUpdatedWidth}
/>
```

### Allowing live messaging to update components in the iframe

Using the `Viewer` when the provided `iframeSrc` is pointing to a route that contains the `ViewerContent` component.

Example:

```tsx
<Viewer
    iframeSrc={"/example-content"}
    viewerContentProps={[{id: "example", props: {}}]}
/>
```

Using the `ViewerContent` on the route provided to the `Viewer` will allow for the dynamic creation of provided components.

Example component provided in the "/example-content" route for the `Viewer` impplementation example:

```tsx
import * as React from "react";
import { ViewerContent } from "@microsoft/fast-viewer-msft";
import MyComponent from "./my-component";

class ExampleContent extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return <ViewerContent components={[{id: "example", component: MyComponent }]} />;
    }
}

export default UpdatePropsViewerContent;
```

## Index

### External modules

* ["index"](modules/_index_.md)
* ["rotate/index"](modules/_rotate_index_.md)
* ["rotate/rotate"](modules/_rotate_rotate_.md)
* ["rotate/rotate.base"](modules/_rotate_rotate_base_.md)
* ["rotate/rotate.class-name-contract"](modules/_rotate_rotate_class_name_contract_.md)
* ["rotate/rotate.props"](modules/_rotate_rotate_props_.md)
* ["rotate/rotate.style"](modules/_rotate_rotate_style_.md)
* ["select-device/devices"](modules/_select_device_devices_.md)
* ["select-device/index"](modules/_select_device_index_.md)
* ["select-device/select-device"](modules/_select_device_select_device_.md)
* ["select-device/select-device.base"](modules/_select_device_select_device_base_.md)
* ["select-device/select-device.class-name-contract"](modules/_select_device_select_device_class_name_contract_.md)
* ["select-device/select-device.props"](modules/_select_device_select_device_props_.md)
* ["select-device/select-device.style"](modules/_select_device_select_device_style_.md)
* ["utilities/design-system"](modules/_utilities_design_system_.md)
* ["utilities/message-system"](modules/_utilities_message_system_.md)
* ["viewer-content/index"](modules/_viewer_content_index_.md)
* ["viewer-content/viewer-content"](modules/_viewer_content_viewer_content_.md)
* ["viewer-content/viewer-content.base"](modules/_viewer_content_viewer_content_base_.md)
* ["viewer-content/viewer-content.props"](modules/_viewer_content_viewer_content_props_.md)
* ["viewer-content/viewer-content.style"](modules/_viewer_content_viewer_content_style_.md)
* ["viewer/index"](modules/_viewer_index_.md)
* ["viewer/viewer"](modules/_viewer_viewer_.md)
* ["viewer/viewer.base"](modules/_viewer_viewer_base_.md)
* ["viewer/viewer.class-name-contract"](modules/_viewer_viewer_class_name_contract_.md)
* ["viewer/viewer.props"](modules/_viewer_viewer_props_.md)
* ["viewer/viewer.style"](modules/_viewer_viewer_style_.md)

---

