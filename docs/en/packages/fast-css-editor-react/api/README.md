---
id: index
---


FAST CSS editor React
=====================

**FAST CSS editor React has been deprecated. Use [FAST Tooling React](https://www.npmjs.com/package/@microsoft/fast-tooling-react) instead.**

A set of React components that allows the user to edit CSS properties.

Installation
------------

`npm i --save @microsoft/fast-css-editor-react`

Usage
-----

### Default component export

The default export implements all of the individual components to create a set of form elements that allow for editing of CSS values.

```jsx
import * as React from "react";
import CSSEditor from "@microsoft/fast-css-editor-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            CSSValues: {
                position: "absolute",
                left: 0
            }
        }
    }

    render() {
        return (
            <CSSEditor
                {...this.state.CSSValues}
                onPositionUpdate={this.handleCssValueUpdate}
            />
        );
    }

    handleCssValueUpdate = (updatedCSSValues) => {
        this.setState({
            CSSValues: updatedCSSValues
        });
    }
}
```

Individual component documentation
----------------------------------

Each component comes with a README.md for implementation and other usage details and additional TypeScript definition files.

## Index

### External modules

* ["editor"](modules/_editor_.md)
* ["editor.constants.style"](modules/_editor_constants_style_.md)
* ["editor.props"](modules/_editor_props_.md)
* ["editor.style"](modules/_editor_style_.md)
* ["editor.utilities.style"](modules/_editor_utilities_style_.md)
* ["index"](modules/_index_.md)
* ["position/index"](modules/_position_index_.md)
* ["position/position"](modules/_position_position_.md)
* ["position/position.props"](modules/_position_position_props_.md)
* ["position/position.style"](modules/_position_position_style_.md)
* ["spacing/index"](modules/_spacing_index_.md)
* ["spacing/spacing"](modules/_spacing_spacing_.md)
* ["spacing/spacing.props"](modules/_spacing_spacing_props_.md)
* ["spacing/spacing.style"](modules/_spacing_spacing_style_.md)

---

