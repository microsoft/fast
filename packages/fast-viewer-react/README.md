
# FAST viewer
A self contained React component which shows content in an iframe.
This can be used to as a method for previewing a React component(s) or an entire page.

## Installation
`npm i --save @microsoft/fast-viewer-msft`

## Usage
An example of using one of the components from the `@microsoft/fast-viewer-msft` package:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, ButtonAppearance } from "@microsoft/fast-components-react-msft";
import Viewer from "@microsoft/fast-viewer-msft";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <Viewer
            component={Button}
            data={{children: "Hello world"}}
            styles={""}
        />,
        root
    );
}

render();
```
