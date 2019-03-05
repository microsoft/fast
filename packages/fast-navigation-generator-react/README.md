# FAST Navigation generator React

**FAST Navigation generator React has been deprecated. Use [FAST Tooling React](https://www.npmjs.com/package/@microsoft/fast-tooling-react) instead.**

A React component which generates a tree view navigation. This component is intended to be used in conjunction with `@microsoft/fast-form-generator-react`. It uses a data location (via lodash path syntax) to indicate the active item.

## Installation

`npm i --save @microsoft/fast-navigation-generator-react`

## Usage

The default export is the navigation component.

**Example schemas can be found [here](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-navigation-generator-react/app/configs/children.schema.json) and [here](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-navigation-generator-react/app/configs/no-children.schema.json)**

Uncontrolled example:

```jsx
import * as React from "react";
import CSSEditor from "@microsoft/fast-navigation-generator-react";
import noChildrenSchema from "./no-children.schema.json";
import childrenSchema from "./children.schema.json";

export class Example extends React.Component {
    render() {
        return (
            <Navigation
                data={this.getData()}
                schema={childrenSchema}
                childOptions={this.getChildOptions()}
            />
        );
    }

    getData() {
        return {
            children: [
                {
                    id: get(childrenSchema, "id"),
                    props: {
                        children: {
                            id: get(noChildrenSchema, "id"),
                            props: noChildren,
                        }
                    }
                }
            ]
        };
    }

    getChildOptions() {
        return [
            {
                component: null,
                schema: noChildrenSchema,
            },
            {
                component: null,
                schema: childrenSchema,
            },
        ];
    }
}
```

Controlled example:
Both the `dataLocation` and `onLocationUpdate` props are optional, including both of them will allow the component to be fully controlled.

```jsx
import * as React from "react";
import CSSEditor from "@microsoft/fast-navigation-generator-react";
import noChildrenSchema from "./no-children.schema.json";
import childrenSchema from "./children.schema.json";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLocation: ""
        };
    }

    render() {
        return (
            <Navigation
                data={this.getData()}
                schema={childrenSchema}
                childOptions={this.getChildOptions()}
                dataLocation={this.state.dataLocation}
                onLocationUpdate={this.handleLocationUpdate}
            />
        );
    }

    getData() {
        return {
            children: [
                {
                    id: get(childrenSchema, "id"),
                    props: {
                        children: {
                            id: get(noChildrenSchema, "id"),
                            props: noChildren,
                        }
                    }
                }
            ]
        };
    }

    getChildOptions() {
        return [
            {
                component: null,
                schema: noChildrenSchema,
            },
            {
                component: null,
                schema: childrenSchema,
            },
        ];
    }

    handleLocationUpdate = (newDataLocation) => {
        this.setState({
            dataLocation: newDataLocation
        });
    }
}
```
