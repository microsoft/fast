# FAST Components Microsoft Styles
A collection of JSS (JavaScript Style Sheets) objects and style utilities that power MSFT components in the FAST ecosystem. The component styles are intended to be compiled with [JSS](https://github.com/cssinjs/jss) and used with base components such as `@microsoft/fast-components-base-react`, for the styled components see the `@microsoft/fast-components-msft-react` package. The package can also be applied to a custom component.

## Installation
`npm i --save @microsoft/fast-components-styles-msft`

## Usage
An example of using the `manageJss` from `@microsoft/fast-jss-manager-react` higher order component to export a component with a JSS style using the package.

```
import React from "react";
import { ButtonStyles } from "@microsoft/fast-components-styles-msft";
import manageJss from "@microsoft/fast-jss-manager-react";

class Button extends React.Component {
    render() {
        return (
            <button className={this.props.managedClasses.button}>
                {this.props.children}
            </button>
        );
    }
}

export default manageJss(ButtonStyles)(Button);
```
