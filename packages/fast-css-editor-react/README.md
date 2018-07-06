# FAST CSS React editor
A set of React components that allows the user to edit CSS properties.

## Installation
`npm i --save @microsoft/fast-css-editor-react`

## Usage
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
                data={this.state.CSSValues}
                onChange={this.handleCssValueUpdate}
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

## Individual component documentation
Each component comes with a README.md for implementation and other usage details and additional TypeScript definition files.