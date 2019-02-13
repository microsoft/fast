---
id: index
title: FAST Components React Msft
sidebar_label: Components React Msft
---

# Components React MSFT

A set of React components which implements the Microsoft styling.

## Installation

`npm i --save @microsoft/fast-components-react-msft`

## Usage

An example of using one of the components from the `@microsoft/fast-components-react-msft` package:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, ButtonAppearance } from "@microsoft/fast-components-react-msft";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <Button appearance={ButtonAppearance.primary}>
            Click me!
        </Button>,
        root
    );
}

render();
```

## Documentation site

[FAST Components React Microsoft](https://msft-docs.azurewebsites.net/)
