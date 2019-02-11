---
id: index
title: FAST Components React Base
sidebar_label: Components React Base
---

# FAST Components React Base
Base components are the structural, semantic, and interactive core of a piece of UI without any explicit visual representation. For the most part, base components are only as opinionated as they have to be to support the semantic, structural, and accessibility related goals. In rare cases, there are structural changes made to support external styling (such as native elements like an input of type checkbox). Base components are useful when building out a new design system, or when you have two components that require the same base functionality and structure, but completely different visual represenations (button vs flipper).

## Installation
`npm i --save @microsoft/fast-components-react-base`

## Usage
### Basic implementation
An example of using one of the components from the `@microsoft/fast-components-react-base` package:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ClassNames, IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { Button } from "@microsoft/fast-components-react-base";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

const classNames: ClassNames<IButtonClassNameContract> = {
    button: "my-button-classname"
};

function render(): void {
    ReactDOM.render(
        <Button managedClasses={classNames}>
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
