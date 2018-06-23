# React JSS Manager
`fast-react-jss-manager` is a React higher order component (HOC) library for managing component JSS stylesheets. It facilitates using JSS with your react components by controlling when to add, update, and remove a JSS stylesheets. It also allows top-down variable injection into JSS stylesheet functions using the exported `DesignSystemProvider`.

## Installation
`npm i --save @microsoft/fast-react-jss-manager`

## Usage
### Create a react component
`manageJss` is a HOC that passes as props the generated classes from a given stylesheet. The generated classes are made available on the `managedClasses` prop of the rendered component.
```jsx
// button.jsx
import * as React from "react";

class Button extends React.Component {
    render() {
        return (
            <button className={this.props.managedClasses.button}>
                {this.props.children}
            </button>
        );
    }
}
```

### Create a JSS stylesheet
You should also create a JSS stylesheet - for detailed information please reference [https://github.com/cssinjs/jss]. The JSS instance used by the manager uses (jss-preset-default)[https://github.com/cssinjs/jss-preset-default] so feel free to use any syntaxes supported by those plugins.
```js
// buttonSyles.js
const buttonStyles = {
    button: {
        color: "white",
        background: "blue",
        border: "none"
    }
};

```

### Create a Higher Order Component (HOC)
Import the `manageJss` function and use it to create a new, styled `Button` component:

```jsx
import manageJss from "@microsoft/fast-jss-manager-react";
improt buttonStyles from "./buttonStyles";
import Button from "./button";

const StyledButton = manageJss(buttonStyles)(Button);


// Render
<StyledButton>Hello world</StyledButton>
```
### Instance stylesheet
There is a good chance you will need to customize some CSS properties for a component instance. To do this, the HOC returned by `manageJSS` supports a `jssStyleSheet` prop. The object give to this prop will be merged into the style sheet that the component was created with, giving you instance overrides for the original style sheet.

```jsx
const stylesheetOverride = {
    button: {
        color: "green",
        background: "gray"
    }
};

<StyledButton
    jssStyleSheet={ stylesheetOverride }
>
    Hello world
</StyledButton>
```

## Server side compiling
Server side compiling is achieved through the use of a JSS [https://github.com/cssinjs/jss/blob/master/docs/js-api.md#style-sheets-registry](style-sheet-registry). Once the app is run server-side, all stylesheets will be stored in a single registry (`stylesheetRegistry`) for easy output:

```jsx
import { stylesheetRegistry } from "@microsoft/fast-jss-manager-react";

// run code that renders the app

// Compiled CSS can be accessed via the `toString` method
const serverSideCss = stylesheetRegistry.toString();
```
