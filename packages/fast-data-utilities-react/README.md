# FAST React data utilities
React data utilities are used to map data to components and perform other actions that may be necessary to pass data to other FAST-DNA libraries for manipulation, data validation or storage.

## Installation
`npm i --save @microsoft/fast-data-utilities-react`

## Usage
### `mapDataToComponent`
The `mapDataToComponent` function can be used to map data to a React component. It uses JSON Schema, ids and data to create components from plain data.

An example of mapping data to a component from the `@microsoft/fast-data-utilities-react` package:

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dialog } from "@microsoft/fast-components-react-msft";
import * as dialogSchema from "@microsoft/fast-components-react-base/dist/dialog/dialog.schema.json";
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";
import * as paragraphSchema from "@microsoft/fast-components-react-msft/dist/paragraph/paragraph.schema.json";
import { mapDataToComponent } from "@microsoft/fast-data-utilities-react";

const data = {
    visible: true,
    children: [
        {
            id: headingSchema.id,
            props: {
                children: "Heading 1"
            }
        },
        {
            id: paragraphSchema.id,
            props: {
                children: "Lorem ipsum."
            }
        }
    ]
};

const childOptions = [
    { component: Heading, schema: headingSchema },
    { component: Paragraph, schema: paragraphSchema },
];

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render() {
    ReactDOM.render(
        <Dialog {...mapDataToComponent(dialogSchema, data, childOptions)} />,
        root
    );
}

render();
```
