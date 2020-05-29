---
id: color
title: Color
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-components/docs/guide/color.doc.md
---

FAST utilizes an adaptive color system that provides some unique advantages:
- Ensure text meets [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) contrast requirements.
- Easily swap from light mode to dark, or anywhere in-between.
- Color themeing through palette tinting.
- Perceptually uniform UI across different background colors.

## Algorithmic Colors (Recipes)
FAST makes heavy use of algorithmic colors; named colors are a product of the *designSystem* object in which they are calculated. In the documentation below, these algorithmic colors will be referred to as *recipes*.

### Inputs
Each color recipe expects as its sole argument the FAST *DesignSystem* object, but there are a few core pieces of data from that object that impact color resolution.

### Palettes
Each color recipe operates on a palette. A palette in an array of hexadecimal colors ordered from light to dark. By default, FAST components leverage the `neutralPalette` and the `accentPalette`. 

### Background color
This is the contextual color that the recipe uses to determine what color it is rendering on. The foreground, outline, and divider recipes will use this color to ensure that the color created is accessible and meets contrast requirements. In fill recipes it is sometimes used as the starting location in the appropriate palette to begin resolution.

### Offsets
Some recipes also leverage offset values, typically for *states* (rest, hovered, active, selected). These offsets are used to retrieve a color at the sum of the offset and some reference index (usually the index of the rest color or the background color in the palette).

## Color Recipes
### Using Color Recipes
First, ensure the UI element has a *FASTDesignSystemProvider* ancestor element - this element will *resolve* the recipe for a component within it that declares a dependency on the recipe.

```html
<fast-design-system-provider use-defaults>
    <my-element>I use a color recipe!</my-element>
</fast-design-system-provider>
```

*For more information on the DesignSystemProvider, see the [*DesignSystemProvider* documentation](fast-foundation/fast-design-system-provider.md)*


Next - declare the recipe as a dependent *behavior* of a Web Component's stylesheet. Then use the recipe as a CSS Custom Property in the stylesheet:

```js
import { css } from "@microsoft/fast-element";
import { neutralFillRest } from "@microsoft/fast-components";

const styles = css`
    :host {
        background: var(--neutral-fill-rest);
    }
`.withBehaviors(
    neutralFillRest
);
```

### Neutral Recipes
#### Layer Recipes
Layer recipes represent the UI layers and surfaces that individual UI elements are contained within. They are applied to primary regions such as toolbars, sidebars, canvas regions, fly-outs, dialogs, and cards.

| name | Description |
|------|-------------|
| `neutralLayerFloating` | Used as the background for floating layers, including context menus and fly-outs. |
| `neutralLayerCard` | Used as the background color for cards. Pair with `neutralLayerCardContainer` for the container background. |
| `neutralLayerCardContainer` | Used as the background color for card containers. Pair with `neutralLayerCard` for the card backgrounds. |
| `neutralLayerL1` | Used as the background color for the primary content layer (L1). |
| `neutralLayerL1Alt` | Alternate color for L1 surfaces. |
| `neutralLayerL2` | Used as the background for the top command surface, logically below L1. |
| `neutralLayerL3` | Used as the background for secondary command surfaces, logically below L2. |
| `neutralLayerL4` | Used as the background for the lowest command surface or title bar, logically below L3. |

#### Text
Neutral text recipes address *most* cases of text used in a UI, from interactive element text, headings, and body text.

| name | Description |
|------|-------------|
| `neutralForegroundRest` | Primary page text color when the text is in a *rest* state. |
| `neutralForegroundHover` | Primary page text color when the text is in a *hover* state. |
| `neutralForegroundActive` | Primary page text color when the text is in a *active* (pressed) state. |
| `neutralForegroundHint` | Secondary *hinting* text to be used with [non-large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 4.5:1 contrast ratio to the background. |
| `neutralForegroundHintLarge` | Secondary *hinting* text to be used with [large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 3:1 contrast ratio to the background. |

#### Fills (Backgrounds)
Neutral fills are indented to be used as fill colors (background) to UI elements to distinguish them from the background. 

| name | Description |
|------|-------------|
| `neutralFillRest`| Used to visually differentiate the UI element from it's background context at rest. |
| `neutralFillHover`| Used as the fill of a `neutralFill` element when hovered. |
| `neutralFillActive`| Used as the fill of a `neutralFill` element when active. |
| `neutralFillSelected`| Used as the fill of a `neutralFill` element when selected. |
| `neutralFillStealthRest`| Used when a UI element's fill is visually differentiated when being interacted with by the user. |
| `neutralFillStealthHover`| Used as the fill of a `neutralFillStealth` element when hovered. |
| `neutralFillStealthActive`| Used as the fill of a `neutralFillStealth` element when active. |
| `neutralFillStealthSelected`| Used as the fill of a `neutralFillStealth` element when selected. |

#### Outlines and Dividers
Neutral outlines are used to construct outline controls and dividers.

| name | Description |
|------|-------------|
| `neutralOutlineRest` | Used as a rest outline color for outline controls. |
| `neutralOutlineHover` | Used as the outline of a `neutralOutline` control when hovered. |
| `neutralOutlineActive` | Used as the outline of a `neutralOutline` control when active.  |
| `neutralDividerRest` | Used as the color for divider elements. |

#### Toggles
Toggle elements such as checkboxes and switches use a specific set of recipes.

| name | Description |
|------|-------------|
| `neutralForegroundToggle` | Used as the foreground of toggle elements with [non-large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 4.5:1 contrast ratio to the background. |
| `neutralForegroundToggleLarge` | Used as the foreground of toggle elements with [large text](https://www.w3.org/TR/WCAG/#contrast-minimum) to meet a 3:1 contrast ratio to the background. |
| `neutralFillToggleRest` | Used as fill of a *toggle* element like checkbox. |
| `neutralFillToggleHover` | Used as the fill of a `neutralFillToggle` element when hovered. |
| `neutralFillToggleActive` | Used as the fill of a `neutralFillToggle` element when active. |

#### Inputs
Text input elements also have a set of recipes specifically tailored.

| name | Description |
|------|-------------|
| `neutralFillInputRest` | Used as the fill of the text input at rest. |
| `neutralFillInputHover` | Used as the fill of the text input when hovered. |
| `neutralFillInputActive` | Used as the fill of the text input when active. |
| `neutralFillInputSelected` | Used as the fill of the text input when selected. |

#### Document Focus
| name | Description |
|------|-------------|
| `neutralFocus` | The color of the focus indicator when the element has document focus. |
| `neutralFocusInnerAccent` | The color of the inner focus-indicator when an *accent fill* element has document focus. |

### Accent Recipes
Accent recipes use the accent palette and are intended to bring attention or otherwise distinguish the element on the page. 

| name | Description |
|------|-------------|
| `accentFillRest` | Used as the fill of an accent element at rest. |
| `accentFillHover` | Used as the fill of an `accentFill` element when hovered. |
| `accentFillActive` | Used as the fill of an `accentFill` element when active. |
| `accentFillSelected` | Used as the fill of an `accentFill` element when selected. |
| `accentFillLarge` |  |
| `accentFillLargeRest` | Used as the fill of an accent element at rest that uses [large text](https://www.w3.org/TR/WCAG/#contrast-minimum). |
| `accentFillLargeHover` | Used as the fill of an `accentFillLarge` element when hovered. |
| `accentFillLargeActive` | Used as the fill of an `accentFillLarge` element when active. |
| `accentFillLargeSelected` | Used as the fill of an `accentFillLarge` element when selected. |
| `accentForegroundCut` | Used as foreground color of text used *over* `accentFill` fill. |
| `accentForegroundCutLarge` | Used as foreground color of text used *over* `accentFillLarge` fill. |