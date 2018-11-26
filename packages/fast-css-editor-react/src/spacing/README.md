# CSSSpacing
The `CSSSpacing` component shows the CSS spacing (margin & padding) value as four input elements, it will also provide a callback for updating this values. When the `spacingType` is set to "margin" the inputs will adjust the top/bottom/left/right margins and when `spacingType` is set to "padding" it will adjust the top/bottom/left/right padding. The components `spacingType` will default to "margin" if not set.

## Usage
```jsx
import * as React from "react";
import { CSSSpacing } from "@microsoft/fast-css-editor-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spacingValues: {
                marginTop: "20px",
                marginLeft: "0"
            }
        }
    }

    render() {
        return (
            <CSSSpacing
                {...this.state.spacingValues}
                onSpacingUpdate={this.handleSpacingValueUpdate}
            />
        );
    }

    handleSpacingValueUpdate = (updatedSpacingValues) => {
        this.setState({
            positionValues: updatedSpacingValues
        });
    }
}
```