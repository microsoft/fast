# CSSPosition
The `CSSPosition` component shows the CSS position value as a select, it will also provide a callback for updated this value. When set to "absolute" it will include a UI for allowing the user to select left/right/top/bottom and enter numbers for pixel positioning. The components position will default to static if not set.

## Usage
```jsx
import * as React from "react";
import { CSSPosition } from "@microsoft/fast-css-editor-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positionValues: {
                position: "absolute",
                left: 0
            }
        }
    }

    render() {
        return (
            <CSSPosition
                data={this.state.positionValues}
                onChange={this.handlePositionValueUpdate}
            />
        );
    }

    handlePositionValueUpdate = (updatedPositionValues) => {
        this.setState({
            positionValues: updatedPositionValues
        });
    }
}
```