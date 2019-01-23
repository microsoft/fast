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
## Utilities

### `focus`
`focus` accepts style(s) and an optional selector string. `focus` assumes assignment of `border: none`.

This function is meant to be used in conjuction with a library like JSS. Styles that are given will be returned with a focus selector that is based on whether there is a focus polyfill for focus-visible. If a selector has been passed, this will be added to the focus selector string for the styles. If yopu are padding a selector be surer to include a space before the selector so it appends properly.

```js
import { focus } from "@microsoft/fast-components-styles-msft";

const styles = {
    myComponent: {
        background: "blue",
        ...focus({
            background: "red",
        }),
    },
    myOtherComponent: {
        ...focus("& $optionalSelectorClass", {
            background: "red"
        })
    }
}
```

```css
    myComponent {
        background: blue;
    }

    myComponent:focus-visible {
        background: red;
    }

    myOtherComponent:focus-visible .optionalSelectorClass {
        background: red;
    }
```