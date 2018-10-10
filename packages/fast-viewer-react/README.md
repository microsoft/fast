
# FAST viewer
A React component which shows content in an iframe via a provided route.
This can be used to as a method for previewing a React component(s) or an entire page.

## Installation
`npm i --save @microsoft/fast-viewer-msft`

## Basic usage
An example of using one of the components from the `@microsoft/fast-viewer-msft` package:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import Viewer from "@microsoft/fast-viewer-msft";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <Viewer iframeSrc={"/example-content"} />,
        root
    );
}

render();
```

## Advanced usage
There are other components in this package which when used in conjunction with the `Viewer` will allow for setting height and width for devices and the control of components and their data.

### Using fixed sizes and devices
Use the `SelectDevice` component to select from provided default devices or provide your own custom device configurations. This component accepts a list of configured devices via the `devices` prop, some default devices are included with the package as a secondary export. It also accepts an `activeIndex` prop which maps to the current index of the provided devices. In addition there is a callback `onUpdateDevice` which will fire a provided function with the new index selected.

Example:
```tsx
import {
    defaultDevices,
    SelectDevice,
} from "@microsoft/fast-viewer-msft";

<SelectDevice
    devices={defaultDevices}
    onUpdateDevice={this.handleDeviceUpdate}
    activeIndex={this.state.activeDeviceIndex}
/>
```

Use the `Rotate` component to switch between landscape and portrait view. This component accepts an `orientation` prop which can be either "landscape" or "portrait". It also accepts an `onUpdateOrientation` callback which will fire a provided function with the new orientation selected.

Example:
```tsx
import {
    Rotate,
} from "@microsoft/fast-viewer-msft";

<Rotate
    orientation={this.state.orientation}
    onUpdateOrientation={this.handleOrientationUpdate}
/>
```

After including any combination of the `SelectDevice` and `Rotate` components, the viewer should have added props tied to your state which will update.

Example:
```tsx
<Viewer
    height={this.state.height}
    width={this.state.width}
    iframeSrc={"/example-content"}
    responsive={defaultDevices[this.state.activeDeviceIndex].display === Display.responsive}
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
