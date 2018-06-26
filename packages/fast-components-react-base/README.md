# FAST Components React Base
A set of React components without styles.

These can be combined with JSS styles to create styled components or used as-is.

## Installation
`npm i --save @microsoft/fast-components-react-base`

## Usage
### Basic implementation
An example of using one of the components from the `@microsoft/fast-components-react-base` package:

```
import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@microsoft/fast-components-react-base";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <Button>
            Click me!
        </Button>,
        root
    );
}

render();
```

### Styled implementation
An example of using the `manageJss` from `@microsoft/fast-jss-manager-react` higher order component to export a component with a JSS style. See the `@microsoft/fast-components-class-name-contracts-base` for the list of class names that can be applied to the base components.

```
import React from "react";
import { Button } from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";

const buttonStyles = {
    button: {
        background: "blue"
    }
};

export default manageJss(buttonStyles)(Button);
```

## Component documentation
Each component comes with a README.md for implementation and other usage details, a JSON schema for the properties that can be used and additional TypeScript definition files.
