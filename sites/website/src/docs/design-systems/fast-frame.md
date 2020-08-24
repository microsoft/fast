---
id: fast-frame
title: The FAST Frame Design System 
sidebar_label: FAST Frame
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/fast-frame.md
---
The FAST Frame Design System is the Design System that comes with the `@microsoft/fast-components` package.

## What's in the FAST Frame Design System?
Every piece of Design System data in the FAST Frame Design System exists in the [`FASTDesignSystem`](/docs/api/fast-components.fastdesignsystem) interface. The [`FASTDesignSystemProvider`](/docs/api/fast-components.fastdesignsystemprovider) *implements* the [`FASTDesignSystem`](/docs/api/fast-components.fastdesignsystem). These two resources are the best place to look for a catalog of what Design System data exists in FAST Frame, as well as which CSS custom properties exist and which HTML attributes / JavaScript properties are used to configure the Design System.

Each Design System property in the [`FASTDesignSystemProvider`](/docs/api/fast-components.fastdesignsystemprovider) will list the HTML attribute on the `<fast-design-system-provider>` that controls the property, and also whether it creates a corresponding CSS custom property. For more information on how to *set* each Design System property see [Setting Design System Properties](/docs/design-systems/using-the-design-system#setting-design-system-properties), and for information on how to use Design System CSS custom properties see [Using Design System CSS Custom Properties](/docs/design-systems/using-the-design-system#css-custom-properties).

## Using the FAST Frame Design System
To use the FAST Frame Design System, simply ensure the [`FASTDesignSystemProvider`](/docs/api/fast-components.fastdesignsystemprovider) is define and use the element in your view:

**Example: Using the [`FASTDesignSystemProvider`](/docs/api/fast-components.fastdesignsystemprovider)**
```ts
import { FASTDesignSystemProvider } from "@microsoft/fast-components";

FASTDesignSystemProvider; // Prevent tree shaking
```
```html
<fast-design-system-provider use-defaults>
    Hello world
</fast-design-system-provider>
```

:::note
It is encouraged to add the `<fast-design-system-provider>` at the root of your view with the `use-defaults` attribute. This ensures that all Design System properties are initialized. For more info see the [`use-defaults`](/docs/design-systems/using-the-design-system#use-defaults)
:::

### Type-ramp
The FAST type ramp is exposed by the `FASTDesignSystemProvider` as CSS Custom Properties. It organizes the ramp around a _base_ font size and line-height, ascending and descending from the _base_. The CSS Custom Properties that can be used are:

| Level              | Font Size                       | Line Height                      |
|--------------------|---------------------------------|----------------------------------|
| Minus 2 (smallest) | `--type-ramp-minus-2-font-size` | `--type-ramp-minus-2-line-height`|
| Minus 1            | `--type-ramp-minus-1-font-size` | `--type-ramp-minus-1-line-height`|
| Base (body)        | `--type-ramp-base-font-size`    | `--type-ramp-base-line-height`   |
| Plus 1             | `--type-ramp-plus-1-font-size`  | `--type-ramp-plus-1-line-height` |
| Plus 2             | `--type-ramp-plus-2-font-size`  | `--type-ramp-plus-2-line-height` |
| Plus 3             | `--type-ramp-plus-3-font-size`  | `--type-ramp-plus-3-line-height` |
| Plus 4             | `--type-ramp-plus-4-font-size`  | `--type-ramp-plus-4-line-height` |
| Plus 5             | `--type-ramp-plus-5-font-size`  | `--type-ramp-plus-5-line-height` |
| Plus 6 (largest)   | `--type-ramp-plus-6-font-size`  | `--type-ramp-plus-6-line-height` |

### Adaptive Color
FAST Frame implements an adaptive color system that provides some unique advantages:
- Ensure text meets [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) contrast requirements.
- Easily swap from light mode to dark, or anywhere in-between.
- Color themeing through palette tinting.
- Perceptually uniform UI across background colors.

To accomplish these goals, FAST Frame makes heavy use of algorithmic colors; named colors that are a product of the Design System in which they are calculated. In the documentation below, these algorithmic colors will be referred to as [Recipes](/docs/design-systems/fast-frame#color-recipes). [Recipes](/docs/design-systems/fast-frame#color-recipes) operate on three primary inputs: [Palettes](/docs/design-systems/fast-frame#palettes), [the background color](/docs/design-systems/fast-frame#background-color), and [offsets / deltas](/docs/design-systems/fast-frame#offsets-deltas).

#### Palettes
Each color recipe operates on a palette. A palette is an array of hexadecimal colors ordered from light to dark by [relative luminance](https://www.w3.org/WAI/GL/wiki/Relative_luminance#:~:text=WCAG%20definition%20of%20relative%20luminance,and%201%20for%20lightest%20white). By default, FAST components leverage the `neutralPalette` and the `accentPalette`.

See [accentPalette](api/fast-components.fastdesignsystemprovider.accentpalette.md) and [neutralPalette](api/fast-components.fastdesignsystemprovider.neutralpalette.md) for more details.

##### Generating and Replacing Palettes
`@microsoft/fast-components` exposes a convenient function to generate a color palette from an arbitrary source color, and this function is how the default `neutralPalette` and `accentPalette` are generated. You can generate a new palette by choosing a palette source color and invoking the palette generation function:

###### Replacing the neutral palette
```js
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { createColorPalette } from "@microsoft/fast-components";

const palette = createColorPalette(parseColorHexRGB("#28EBD7"));
```

The palette can then be applied to the `FASTDesignSystemProvider` to communicate to components the palette change:

```js
// ...
const provider = document.querySelector("fast-design-system-provider");

provider.neutralPalette = palette;
```

###### Replacing the accent palette
The same approach can be taken for the `accentPalette`, but when doing so the `accentPaletteBaseColor` should *also* be replaced:

```js
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { createColorPalette } from "@microsoft/fast-components";

const accent = "#F27D07";
const palette = createColorPalette(parseColorHexRGB(accent));
const provider = document.querySelector("fast-design-system-provider");

provider.accentBaseColor = accent;
provider.accentPalette = palette;
```

#### Background color
This is the contextual color that the recipe uses to determine what color it is rendering on. The foreground, outline, and divider recipes will use this color to ensure that the color created is accessible and meets contrast requirements. In fill recipes, it is sometimes used as the starting location in the appropriate palette to begin resolution.

See [backgroundColor](api/fast-components.fastdesignsystemprovider.backgroundcolor.md) for more details.

#### Offsets / Deltas
If you look at the properties of the [`FASTDesignSystem`](/docs/api/fast-components.fastdesignsystem), you'll notice a number of "Delta" properties. These are used by color recipes to *shift* the colors derived from recipes by index of the palette. You can adjust these values to fine-tune each individual color recipe.

#### Color recipes
Color recipes are algorithmic colors generated relative to a context. Recipes can be thought of and used as named colors, however they are more than simple variables; they are generated values where the value of the Recipe will change depending on the context in which it is generated. The primary inputs to any color recipe are [Palettes](/docs/design-systems/fast-frame#palettes), [the background color](/docs/design-systems/fast-frame#background-color), and [offsets / deltas](/docs/design-systems/fast-frame#offsets-deltas), which come from the nearest ancestor `<fast-design-system-provider>`.

We created the [Color Explorer](https://color.fast.design/) as a visualization tool to help see what each of the following color recipes does.

##### Using Color Recipes
First, ensure the UI element has a [`FASTDesignSystemProvider`](/docs/api/fast-components.fastdesignsystemprovider) ancestor element - this element will *resolve* the recipe for a component within it that declares a dependency on the recipe.

```html
<fast-design-system-provider use-defaults>
    <my-element>I use a color recipe!</my-element>
</fast-design-system-provider>
```

Next - declare the recipe as a dependent *behavior* of a FAST Component's stylesheet. Then use the recipe as a CSS Custom Property in the stylesheet:

```js
import { css } from "@microsoft/fast-element";
import { neutralFillRestBehavior } from "@microsoft/fast-components";

const styles = css`
    :host {
        background: ${neutralFillRestBehavior.var};
    }
`.withBehaviors(
    neutralFillRestBehavior
);
```

Then, define a [FAST element](/docs/fast-element/defining-elements) and use the element in your page!

:::note
For more information on what this is doing, see [CSS Custom Property Behaviors](/docs/design-systems/using-the-design-system#csscustompropertybehavior)
:::

##### Neutral recipes
###### Layer recipes
Layer recipes represent the UI layers and surfaces that individual UI elements are contained within. They are applied to primary regions such as toolbars, sidebars, canvas regions, fly-outs, dialogs, and cards.

| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `neutralLayerFloatingBehavior` | `--neutral-layer-floating` | Used as the background for floating layers, including context menus and fly-outs. |
| `neutralLayerCardBehavior` | `--neutral-layer-card`|  Used as the background color for cards. Pair with `neutralLayerCardContainer` for the container background. |
| `neutralLayerCardContainerBehavior` | `--neutral-layer-card-container` |  Used as the background color for card containers. Pair with `neutralLayerCard` for the card backgrounds. |
| `neutralLayerL1Behavior` | `--neutral-layer-l1` | Used as the background color for the primary content layer (L1). |
| `neutralLayerL1AltBehavior` | `--neutral-layer-l1-alt`| Alternate color for L1 surfaces. |
| `neutralLayerL2Behavior` | `--neutral-layer-l2` | Used as the background for the top command surface, logically below L1. |
| `neutralLayerL3Behavior` | `--neutral-layer-l3` | Used as the background for secondary command surfaces, logically below L2. |
| `neutralLayerL4Behavior` | `--neutral-layer-l4`| Used as the background for the lowest command surface or title bar, logically below L3. |

###### Text
Neutral text recipes address *most* cases of text used in a UI, from interactive element text, headings, and body text.

| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `neutralForegroundRestBehavior` | `--neutral-foreground-rest` | Primary page text color when the text is in a *rest* state. |
| `neutralForegroundHoverBehavior` | `--neutral-foreground-hover` | Primary page text color when the text is in a *hover* state. |
| `neutralForegroundActiveBehavior` | `--neutral-foreground-active`| Primary page text color when the text is in a *active* (pressed) state. |
| `neutralForegroundHintBehavior` | `--neutral-foreground-hint`| Secondary *hinting* text to be used with [non-large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 4.5:1 contrast ratioBehavior to the background. |
| `neutralForegroundHintLargeBehavior` | `--neutral-foreground-hint-large`| Secondary *hinting* text to be used with [large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 3:1 contrast ratio to the background. |

###### Fills (backgrounds)
Neutral fills are indented to be used as fill colors (background) to UI elements to distinguish them from the background.

| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `neutralFillRestBehavior`| `--neutral-fill-rest` | Used to visually differentiate the UI element from it's background context at rest. |
| `neutralFillHoverBehavior`| `--neutral-fill-hover` | Used as the fill of a `neutralFill` element when hovered. |
| `neutralFillActiveBehavior`| `--neutral-fill-active` | Used as the fill of a `neutralFill` element when active. |
| `neutralFillSelectedBehavior`| `--neutral-fill-selected` | Used as the fill of a `neutralFill` element when selected. |
| `neutralFillStealthRestBehavior`| `--neutral-fill-stealth-rest` | Used when a UI element's fill is visually differentiated when being interacted with by the user. |
| `neutralFillStealthHoverBehavior`| `--neutral-fill-stealth-hover` | Used as the fill of a `neutralFillStealth` element when hovered. |
| `neutralFillStealthActiveBehavior`| `--neutral-fill-stealth-active` | Used as the fill of a `neutralFillStealth` element when active. |
| `neutralFillStealthSelectedBehavior`| `--neutral-fill-stealth-selected` | Used as the fill of a `neutralFillStealth` element when selected. |

###### Outlines and dividers
Neutral outlines are used to construct outline controls and dividers.

| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `neutralOutlineRestBehavior` | `--neutral-outline-rest` | Used as a rest outline color for outline controls. |
| `neutralOutlineHoverBehavior` | `--neutral-outline-hover` | Used as the outline of a `neutralOutline` control when hovered. |
| `neutralOutlineActiveBehavior` | `--neutral-outline-active` | Used as the outline of a `neutralOutline` control when active.  |
| `neutralDividerRestBehavior` | `--neutral-divider-rest` | Used as the color for divider elements. |

###### Toggles
Toggle elements such as checkboxes and switches use a specific set of recipes.

| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `neutralForegroundToggleBehavior` | `--neutral-foreground-toggle` | Used as the foreground of toggle elements with [non-large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 4.5:1 contrast ratio to the background. |
| `neutralForegroundToggleLargeBehavior` | `--neutral-foreground-toggle-large` | Used as the foreground of toggle elements with [large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 3:1 contrast ratio to the background. |
| `neutralFillToggleRestBehavior` | `--neutral-foreground-rest` | Used as fill of a *toggle* element like checkbox. |
| `neutralFillToggleHoverBehavior` | `--neutral-foreground-hover` | Used as the fill of a `neutralFillToggle` element when hovered. |
| `neutralFillToggleActiveBehavior` | `--neutral-foreground-active` | Used as the fill of a `neutralFillToggle` element when active. |

###### Inputs
Text input elements also have a set of recipes specifically tailored.

| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `neutralFillInputRestBehavior` | `--neutral-fill-input-rest` | Used as the fill of the text input at rest. |
| `neutralFillInputHoverBehavior` | `--neutral-fill-input-hover` | Used as the fill of the text input when hovered. |
| `neutralFillInputActiveBehavior` | `--neutral-fill-input-active` | Used as the fill of the text input when active. |
| `neutralFillInputSelectedBehavior` | `--neutral-fill-input-selected` | Used as the fill of the text input when selected. |

###### Document focus
| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `neutralFocusBehavior` | `--neutral-focus` | The color of the focus indicator when the element has document focus. |
| `neutralFocusInnerAccentBehavior` | `--neutral-focus-inner-accent` | The color of the inner focus-indicator when an *accent fill* element has document focus. |

##### Accent recipes
Accent recipes use the accent palette and are intended to bring attention or otherwise distinguish the element on the page.

| Behavior Name | CSS Custom Property | Description |
|---------------|---------------------|-------------|
| `accentFillRestBehavior` | `--accent-fill-rest` | Used as the fill of an accent element at rest. |
| `accentFillHoverBehavior` | `--accent-fill-hover` | Used as the fill of an accent fill element when hovered. |
| `accentFillActiveBehavior` | `--accent-fill-active` | Used as the fill of an accent fill element when active. |
| `accentFillSelectedBehavior` | `--accent-fill-selected` | Used as the fill of an accent fill element when selected. |
| `accentFillLargeRestBehavior` | `--accent-fill-large-rest` | Used as the fill of an accent element at rest that uses [large text](https://www.w3.org/TR/WCAG/#contrast-minimum). |
| `accentFillLargeHoverBehavior` | `--accent-fill-large-hover` | Used as the fill of an accent fill large element when hovered. |
| `accentFillLargeActiveBehavior` | `--accent-fill-large-active` | Used as the fill of an accent fill large element when active. |
| `accentFillLargeSelectedBehavior` | `--accent-fill-large-selected` | Used as the fill of an accent fill large element when selected. |
| `accentForegroundCutBehavior` | `--accent-foreground-cut` | Used as foreground color of text used *over* accent fill fill. |
| `accentForegroundCutLargeBehavior` | `--accent-foreground-cut-large` | Used as foreground color of text used *over* accent fill large fill. |