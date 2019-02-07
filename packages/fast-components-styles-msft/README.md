# FAST Components styles MSFT

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

## Color

Color palettes are the core of the how color is applied in MSFT stylesheets. There are two core color palettes that are exposed by the design system that are used to derive color; the *neutral* palette and the *accent* palette. The provided color utilities always derive the colors they return from one of these two palettes. They generally also derive the color from the input *design system*, allowing them to work across a wide variety of background colors.

### Utilities

#### Naming

Color utilities map to a strict naming convention: `[palette-type][usage][style?][state?][size?]`

##### palette-type
Refers to the palette that the resulting color will derive from:
- accent
- neutral

##### usage
Refers to how the color should generally be used:
- foreground - generally text
- fill - generally backgrounds
- outline - borders or outlines

##### style [optional]
Variants on style:
- stealth - blends into the background on rest state

##### state [optional]
The state that the color should be applied to:
- rest
- hover
- active

##### size [optional]
Refers to the *size* of text that the color is designed to work with. [color-contrast](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) requirements vary depending on both font-size and weight. By default, all utilities target normal text and a contrast ratio of 4.5:1. If a utility name has the "large" keyword at the end, it means it is targeting "large" text and a contrast ratio of 3:1.

Component stylesheets can mix and match these utilities to achieve the component design. For example, a secondary button may use:
-  `neutralForeground` for text color
-  `neutralFillRest` / `neutralFillHover` / `neutralFillActive` for background colors

A ghost button may use:
-  `neutralForeground` for text color
-  `neutralFillStealthRest` / `neutralFillStealthHover` / `neutralFillActive` for background colors
-  `neutralOutlineRest` / `neutralOutlineHover` / `neutralOutlineActive` for border colors

#### Usage

Utilities can work in a one of two ways, depending on the arguments supplied:

##### DesignSystem

When a color utility is invoked with a `DesignSystem`, that `DesignSystem` is used to derive a color and the function returns a color. In general, that color will be derived from the `DesignSystem.backgroundColor` property, allowing the stylesheet to change depending on it's context. For example:

```JavaScript
const StyleSheet = {
    button: {
        color: neutralForeground,
        background: neutralFillRest,
        "&:hover": {
            background: neutralFillHover,
        },
        "&:active": {
            background: neutralFillActive,
        }
    }
}
```

##### Callback function

Color utilities can also be invoked with a callback as their sole argument. When invoked with a callback, a function will be returned from the utility that accepts a `DesignSystem`. When the returned function is called, the supplied callback will be invoked and the result will override the `DesignSystem.backgroundColor` used to derive the color. This allows you to derive colors in relation to other colors:

```JavaScript
const StyleSheet = {
    button: {
        color: neutralForeground(neutralFillRest),
        background: neutralFillRest,
        "&:hover": {
            color: neutralForeground(() => "#FF0"),
            background: "#FF0",
        },
        "&:active": {
            background: neutralFillActive,
        }
    }
}
```