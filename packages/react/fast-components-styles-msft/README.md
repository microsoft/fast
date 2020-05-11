# FAST Components styles MSFT

A collection of JSS (JavaScript Style Sheets) objects and style utilities that power MSFT components in the FAST ecosystem. The component styles are intended to be compiled with [JSS](https://github.com/cssinjs/jss) and used with base components such as `@microsoft/fast-components-base-react`, for the styled components see the `@microsoft/fast-components-msft-react` package. The package can also be applied to a custom component.

## Installation

`npm i --save @microsoft/fast-components-styles-msft`

## Usage

An example of using the `manageJss` from `@microsoft/fast-jss-manager-react` higher order component to export a component with a JSS style using the package.

```jsx
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

Note that to reduce code bloat, these color utilities only attempt to parse color strings that are hexadecimal (`#RGB` & `#RRGGBB`) and rgb (`rgb(r, g, b)`). Use only these formats for `DesignSystem.neutralPalette`, `DesignSystem.accentPalette`, and `DesignSystem.backgroundColor`.
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
-  `neutralForegroundRest` for text color
-  `neutralFillRest` / `neutralFillHover` / `neutralFillActive` for background colors

A ghost button may use:
-  `neutralForegroundRest` for text color
-  `neutralFillStealthRest` / `neutralFillStealthHover` / `neutralFillActive` for background colors
-  `neutralOutlineRest` / `neutralOutlineHover` / `neutralOutlineActive` for border colors

#### Usage

Utilities can work in a one of two ways, depending on the arguments supplied:

##### DesignSystem

When a color utility is invoked with a `DesignSystem`, that `DesignSystem` is used to derive a color and the function returns a color. In general, that color will be derived from the `DesignSystem.backgroundColor` property, allowing the stylesheet to change depending on it's context. For example:

```JavaScript
const StyleSheet = {
    button: {
        color: neutralForegroundRest,
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
        color: neutralForegroundRest(neutralFillRest),
        background: neutralFillRest,
        "&:hover": {
            color: neutralForegroundRest(() => "#FF0"),
            background: "#FF0",
        },
        "&:active": {
            background: neutralFillActive,
        }
    }
}
```

## Utilities

These utility functions help you write clean and manageable style sheets.

- [Acrylic](#acrylic)
    - [applyAcrylicMaterial](#applyacrylicmaterial)
- [Border](#border)
    - [applyCornerRadius](#applycornerradius)
    - [applyElevatedCornerRadius](#applyelevatedcornerradius)
    - [applyFocusPlaceholderBorder](#applyfocusplaceholderborder)
- [Cursor](#cursor)
    - [applyCursorDefault](#applycursordefault)
    - [applyCursorDisabled](#applycursordisabled)
    - [applyCursorPointer](#applycursorpointer)
- [Density](#density)
    - [DensityCategory](#densitycategory)
    - [height](#height)
    - [heightNumber](#heightnumber)
    - [densityCategorySwitch](#densitycategoryswitch)
    - [horizontalSpacing](#horizontalspacing)
    - [horizontalSpacingNumber](#horizontalspacingnumber)
    - [glyphSize](#glyphsize)
- [Disabled](#disabled)
    - [applyDisabledState](#applydisabledstate)
- [Elevation](#elevation)
    - [ElevationMultiplier](#elevationmultiplier)
    - [applyElevation](#applyelevation)
- [Fonts](#fonts)
    - [applyFontWeightLight](#applyfontweightlight)
    - [applyFontWeightSemiLight](#applyfontweightsemilight)
    - [applyFontWeightNormal](#applyfontweightnormal)
    - [applyFontWeightSemiBold](#applyfontweightsemibold)
    - [applyFontWeightBold](#applyfontweightbold)
- [Typography](#typography)
    - [applyScaledTypeRamp](#applyscaledtyperamp)
    - [applyTypeRamp](#applytyperamp)
    - [applyScaledFontSize](#applyscaledfontsize)
    - [applyScaledLineHeight](#applyscaledlineheight)
    - [applyFontSize](#applyfontsize)
    - [applyLineHeight](#applylineheight)

### Acrylic

Acrylic is a visual treatment that creates a translucent texture which can be added to element surfaces to add depth and help establish a visual hierarchy.

#### applyAcrylicMaterial

Apply a Microsoft implementation of acrylic to a styled element.

**Parameters**:
- `backgroundColor`: This should be an RGBa color value to achieve the acrylic effect
- `opacity`: The opacity of the background
- `fallbackOpacity?`: Applied in the event that backdrop-filter is not supported in the current browser, defaults to 0.9
- `topHighlight?`: The option to highlight the top border of the surface acrylic is applied to, defaults to false

```TypeScript
import { applyAcrylicMaterial } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyAcrylicMaterial("#000", 0.6, 0.9, true),
    },
};
```

### Border

#### applyCornerRadius

Applies the design system value for `cornerRadius`.

```TypeScript
import { applyCornerRadius } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyCornerRadius(),
    },
};
```

#### applyElevatedCornerRadius

Applies the design system value for `elevatedCornerRadius` for UI elements which are elevated or outside the normal document flow.

```TypeScript
import { applyElevatedCornerRadius } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyElevatedCornerRadius(),
    },
};
```

#### applyFocusPlaceholderBorder

Applies a border width, style, and color to reserve the space for a visual focus indicator.

```TypeScript
import { applyFocusPlaceholderBorder } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyFocusPlaceholderBorder(),
    },
};
```

### Cursor

#### applyCursorDefault

Applies styles for a default cursor.

```TypeScript
import { applyCursorDefault } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyCursorDefault(),
    },
};
```

#### applyCursorDisabled

Applies styles for a disabled cursor.

```TypeScript
import { applyCursorDisabled } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component__disabled: {
        ...applyCursorDisabled(),
    },
};
```

#### applyCursorPointer

Applies styles for a "pointer" cursor.

```TypeScript
import { applyCursorPointer } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyCursorPointer(),
    },
};
```

### Density

#### DensityCategory

An enum representing the three density categories:
- `compact`
- `normal`
- `spacious`

#### height

Returns the component height formatted in the provided unit or px by default.

**Parameters**:
- `lines`: The logical number of lines the component takes, 1 by default
- `unit`: The optional unit of measurement; px by default

```TypeScript
import { height } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        height: height(),
    },
};
```

#### heightNumber

Returns the component height as a number.

**Parameters**:
- `lines`: The logical number of lines the component takes, 1 by default

```TypeScript
import { heightNumber } from "@microsoft/fast-components-styles-msft";

const inputSize: DesignSystemResolver<string> = `${heightNumber() / 2}`
);

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        width: inputSize,
        height: inputSize
    },
};
```

#### densityCategorySwitch

Returns a value based on the higher-level category for the density setting. Use this function to adjust things like type size and sizing that is based on a category rather than individual density.

**Parameters**:
- `compactValue`: The adjustment when the category is "compact"
- `normalValue`: The adjustment when the category is "normal"
- `spaciousValue`: The adjustment when the category is "spacious"

```TypeScript
import { densityCategorySwitch } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        marginRight: `${densityCategorySwitch(4, 8, 12)}px`
    },
};
```

#### horizontalSpacing

Returns the standard horizontal spacing typically used for text and icons formatted in the provided unit or px by default.

**Parameters**:
- `adjustment`: Any border that should be removed from the overall content spacing; 0 by default
- `unit`: The optional unit of measurement; px by default

```TypeScript
import { horizontalSpacing } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        paddingLeft: horizontalSpacing(2),
        paddingRight: horizontalSpacing(2),
    },
};
```

#### horizontalSpacingNumber

Returns the standard horizontal spacing for text and icons as a number.

**Parameters**:
- `adjustment`: Any border that should be removed from the overall content spacing; 0 by default

```TypeScript
import { horizontalSpacingNumber } from "@microsoft/fast-components-styles-msft";

const glyphWidth: number = 16;

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        marginRight: `${horizontalSpacingNumber(-2) + glyphWidth}px`
    },
};
```

#### glyphSize

Returns the width and height for a glyph formatted in pixels.

**Parameters**:
- `designSystem` | `unit`: Accepts either a design system configuration or a string

```TypeScript
import { glyphSize } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        width: glyphSize,
        height: glyphSize,
    },
};
```

### Disabled

#### applyDisabledState

Used to apply disabled styles to an element.

```TypeScript
import { applyDisabledState } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component__disabled: {
        ...applyDisabledState(),
    },
};
```

### Elevation

Apply drop-shadow to components and layers to signify elevation.

#### ElevationMultiplier

An enum with common elevation depths.

#### applyElevation

Used with `ElevationMultiplier` to apply elevation to a styled element.

```TypeScript
import { applyElevation, ElevationMultiplier } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyElevation(ElevationMultiplier.e11),
    },
};
```

### Fonts

#### applyFontWeightLight

Applies the `light` font weight value from the design system.

```TypeScript
import { applyFontWeightLight } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyFontWeightLight(),
    },
};
```

#### applyFontWeightSemiLight

Applies the `semilight` font weight value from the design system.

```TypeScript
import { applyFontWeightSemiLight } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyFontWeightSemiLight(),
    },
};
```

#### applyFontWeightNormal

Applies the `normal` font weight value from the design system.

```TypeScript
import { applyFontWeightNormal } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyFontWeightNormal(),
    },
};
```

#### applyFontWeightSemiBold

Applies the `semibold` font weight value from the design system.

```TypeScript
import { applyFontWeightSemiBold } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyFontWeightSemiBold(),
    },
};
```

#### applyFontWeightBold

Applies the `bold` font weight value from the design system.

```TypeScript
import { applyFontWeightBold } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyFontWeightBold(),
    },
};
```

### Typography

#### applyScaledTypeRamp

Applies font-size and line-height CSS properties from a given TypeRamp ID, scaled with design system density.

**Parameters**:
- `key`: keyof TypeRamp

```TypeScript
import { applyScaledTypeRamp } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyScaledTypeRamp("t8"),
    },
};
```

#### applyTypeRamp

Applies font-size and line-height CSS properties from a given TypeRamp ID.

**Parameters**:
- `typeConfig`: keyof TypeRamp

```TypeScript
import { applyTypeRamp } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyTypeRamp("t8"),
    },
};
```

#### applyScaledFontSize

Retrieves the formatted font-size from a TypeRamp ID, scaled with the design-system density.

**Parameters**:
- `key`: keyof TypeRamp

```TypeScript
import { applyScaledFontSize } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        fontSize: applyScaledFontSize("t4"),
    },
};
```

#### applyScaledLineHeight

Retrieves the formatted line-height from a TypeRamp ID, scaled with the design-system density.

**Parameters**:
- `key`: keyof TypeRamp

```TypeScript
import { applyScaledLineHeight } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        lineHeight: applyScaledLineHeight("t4"),
    },
};
```

#### applyFontSize

Retrieves the font-size formatted in pixels from a given TypeRamp ID.

**Parameters**:
- `key`: keyof TypeRamp

```TypeScript
import { applyFontSize } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyFontSize("t8"),
    },
};
```

#### applyLineHeight

Retrieves the line-height formatted in pixels from a given TypeRamp ID.

**Parameters**:
- `key`: keyof TypeRamp

```TypeScript
import { applyLineHeight } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ClassNameContract, DesignSystem> = {
    styled_component: {
        ...applyLineHeight("t8"),
    },
};
```