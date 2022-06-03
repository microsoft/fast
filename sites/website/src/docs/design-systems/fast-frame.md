---
id: fast-frame
title: The FAST Frame Design System 
sidebar_label: FAST Frame Design System
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/fast-frame.md
description: A highly configurable Design System composed of Web Components, Design Tokens, stylesheets, and styling tools.
keywords:
    - fast frame design system
---

FAST Frame ([`@microsoft/fast-components`](https://www.npmjs.com/package/@microsoft/fast-components)) is a highly configurable Design System composed of Web Components, Design Tokens, stylesheets, and styling tools. You can drop it into any app to start with a robust component library and an adaptive and accessible UI system immediately.

## Using FAST Frame Components

### Create a `DesignSystem`

Web components from FAST Frame must be registered with the `DesignSystem` prior to being used in HTML. To set up the `DesignSystem`, first import and invoke the provider function from `@microsoft/fast-foundation` to get the `DesignSystem` instance. Then import the registrations of the components you want to use from `@microsoft/fast-components` and register them with the `DesignSystem`:

```ts
import { 
    fastButton, 
    fastMenu, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton(),
        fastMenu()
    );
```

### Add Element to HTML

Once you've registered the components, as shown above, they are now available for use in your document (or template). Just use the new elements like any other HTML element:

```html
<fast-button>Click me!</fast-button>
```

### Hide undefined elements

Custom Elements that have not been [upgraded](https://developers.google.com/web/fundamentals/web-components/customelements#upgrades) and don't have styles attached can still be rendered by the browser but they likely do not look how they are supposed to. To avoid a *flash of un-styled content* (FOUC), visually hide Custom Elements that are not yet defined:

```CSS
:not(:defined) {
    visibility: hidden;
}
```

:::important
The consuming application must apply this, as the components themselves do not.
:::

## Configuring Components

FAST Frame components are highly configurable, so let’s look at some of the opportunities for configuration that can be leveraged. If you’d like to understand these APIs further, check out the [creating a component library](./creating-a-component-library.md) documentation.

### Configuring the DesignSystem

The `DesignSystem` is the entry-point for most component configurations. It can be used to control the options for which the custom element is defined in the browser, which template and stylesheet to use, and how to disambiguate custom elements that are defined for a single element tag name.

For all APIs described in this section, the configuration overrides apply to all components registered to the DesignSystem except when the option is explicitly provided [during component registration](./fast-frame.md#configuring-components-during-registration).

#### `DesignSystem.withPrefix()`

As [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), FAST Components are [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) subject to the [naming conventions defined by HTML](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name). This means that the element name must contain a ‘-‘ character. By default, the DesignSystem defines all elements registered with it with the “fast” prefix. [The example above](./fast-frame.md/#add-element-to-html) illustrates this, where the FastButton is defined with the ‘fast’ prefix.

This prefix can be changed for all components registered by the DesignSystem using the `DesignSystem.withPrefix()` API:

```ts
import { fastButton, provideFASTDesignSystem } from "@microsoft/fast-components";

provideFASTDesignSystem()
    .withPrefix("faster")
    .register(fastButton())
```

In this case, the element can be used in HTML using the ‘faster’:

```html
<faster-button>Click me!</faster-button>
```

#### `DesignSystem.withShadowRootMode()`

Unless specified during [component registration creation](./creating-a-component-library.md#compose-and-export-registration), all components registered with the DesignSystem are defined with [the shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) originally specified by the component developer (typically "open", as that is both recommended and the default). This behavior can be changed using `DesignSystem.withShadowRootMode()` to close all shadow roots by default:

```ts
provideFASTDesignSystem()
    .withShadowRootMode("closed")
    .register(/* ... */)
```

#### `DesignSystem.withElementDisambiguation()`

By default, an element registered with an already-taken name will not be re-registered with the platform. However, its element definition callback will still be invoked, allowing it to define an alternate presentation (styles and template), scoped to the DOM tree that the design system is defined on.

As a best practice, one should try to avoid registering the same component more than once. However, if your architecture makes this difficult or impossible, you can provide a custom callback to handle disambiguating the duplicate elements.

The `ElementDisambiguationCallback` will be passed the tag name being registered, the type being registered, and the type that was already registered with the tag. Your callback can then return one of three types of values:

* `string` - Return a string to select an alternate name for the element to be registered under.
* `ElementDisambiguation.definitionCallbackOnly` - This is the default callback's return value, which prevents re-registering the element but allows its callback to run and define alternate presentations for the element (styles and template). Note that having more than one presentation for the same element will trigger a slower rendering code path for elements of that type. So, it's best to avoid this unless it's absolutely needed for your application design.
* `ElementDisambiguation.ignoreDuplicate` - This option completely ignores the duplicate element and no action is taken during registration if an element with the same tag is already registered.

Here's an example custom disambiguation callback showing a couple of these options.

```ts
provideFASTDesignSystem()
    .withElementDisambiguation((nameAttempt, typeAttempt, existingType) => {
        if (nameAttempt === "foo") {
            return "bar";
        }

        return ElementDisambiguation.ignoreDuplicate;
    })
    .register(/* ... */)
```

### Configuring Components During Registration

The DesignSystem APIs described above impact all components registered to the DesignSystem, but those options can also be configured or overridden on a per-component basis. Configuring the component itself takes priority over any DesignSystem configuration. 

#### Prefix

The prefix for a component can be configured for a component registration by providing a configuration object with a prefix field during registration:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ prefix: "faster" })
    );
```

#### Template

To use a custom template for a component, provide a `template` field to the configuration object during registration:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ 
            template: html`
                <p>A completely new template</p>
            ` 
        })
    )
```

#### Styles

Styles for a component can be configured as well, by providing a `styles` field to the configuration object during registration:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ 
            styles: css`
                /* completely replace the original styles */
            ` 
        })
    )
```

It's also worth noting that this can be used to extend the existing styles, by importing the originals and composing those with new styles by calling the style function. Here's what that would look like:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({
            styles: (ctx, def) => css`
                ${buttonStyles(ctx, def)}
                /* add your style augmentations here */
            `
        })
    )
```

:::important

At present, there is a minor typing bug across all the style and template functions, so you will need to cast the second argument as follows `${buttonStyles(ctx, def as any)}`. [We have tracked this issue](https://github.com/microsoft/fast/issues/5047) and are planning a fix soon.

:::

#### Shadow Options

Shadow options can be configured as well, including both [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) and [focus delegation](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus):

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ 
            shadowOptions: {
                mode: "closed",
                delegatesFocus: true 
            }
        })
    );
```

For more information on shadow options, see [Element.attachShadow()](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).

## Configuring Styles

FAST Frame is designed to be stylistically flexible, allowing dramatic changes to visual design with minimal code changes. This is possible through the extensive use of [Design Tokens](./design-tokens.md) and an [adaptive color system](./fast-frame.md#adaptive-color-system).

### FAST Frame Design Tokens

FAST exposes the following Design Tokens that can be used to configure components stylistically. This section describes the non-color related Design Tokens. For Design Tokens related to color, see the [adaptive color system section](./fast-frame.md#adaptive-color-system)

#### Typography

| Level              | Font Size Token Name            | Line Height Token Name           |
|--------------------|---------------------------------|----------------------------------|
| Minus 2 (smallest) | `typeRampMinus2FontSize`        | `typeRampMinus2LineHeight`       |
| Minus 1            | `typeRampMinus1FontSize`        | `typeRampMinus1LineHeight`       |
| Base (body)        | `typeRampBaseFontSize`          | `typeRampBaseLineHeight`         |
| Plus 1             | `typeRampPlus1FontSize`         | `typeRampPlus1LineHeight`        |
| Plus 2             | `typeRampPlus2FontSize`         | `typeRampPlus2LineHeight`        |
| Plus 3             | `typeRampPlus3FontSize`         | `typeRampPlus3LineHeight`        |
| Plus 4             | `typeRampPlus4FontSize`         | `typeRampPlus4LineHeight`        |
| Plus 5             | `typeRampPlus5FontSize`         | `typeRampPlus5LineHeight`        |
| Plus 6 (largest)   | `typeRampPlus6FontSize`         | `typeRampPlus6LineHeight`        |
-------------------------------------------------

#### Sizing

- `baseHeightMultiplier`: This value, multiplied by `designUnit`, sets the base height of most controls. Works with adaptive `density` values.
- `baseHorizontalSpacingMultiplier` (future): This value, multiplied by `designUnit`, sets the internal horizontal padding of most controls. Works with adaptive `density` values.
- `controlCornerRadius`: Sets the corner radius used by controls with backplates.
- `density` (in process): An adjustment to sizing tokens `baseHeightMultiplier` and `baseHorizontalSpacingMultiplier`.
- `designUnit`: The unit size of the Design Grid. Used to calculate height and spacing sizes for controls.

#### Misc.

- `direction`: The primary document direction (LTR or RTL).
- `disabledOpacity`: The opacity of disabled controls.
- `strokeWidth`: Controls the width of the stroke of a component that has a stroke.
- `focusStrokeWidth`: Controls the width of the stroke of a component that has a stroke when it has document focus.

### Adaptive Color System

FAST Frame implements an adaptive color system that provides some unique advantages:
- Ensure text meets [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) contrast requirements.
- Easily swap from light mode to dark, or anywhere in-between.
- Color theming through palette tinting.
- Perceptually uniform UI across background colors.

To accomplish these goals, FAST Frame makes heavy use of algorithmic colors called Recipes. Recipes are a combination of an algorithm and input values that produce a desired result. Just as you can bake different types of cookies with different combinations of sugar, butter, flour, and salt, you can produce different design system treatments by altering recipe values (measurements) or algorithms (instructions).

The current base recipes are closely related to their algorithm, but that's a convention and not a requirement. What follows is a list of the algorithms, which function on like-named values. For instance, `accentFill` relies on `accentFillRestDelta`, `accentFillHoverDelta`, `accentFillActiveDelta`, and `accentFillFocusDelta`.

Recipes are currently used for color values, but they are not limited to that and their usage will be expanded soon.

**To better visualize how this works, FAST built an application specificity for exploring the system. Check out [the Color Explorer.](https://color.fast.design/)**

#### Common functionality

Most color recipes are based on a `palette`. Currently, `fast-components` has built-in support for `accent` and `neutral` palettes.

Most color recipes take a `reference` `Swatch`. This is a core concept of Adaptive UI which allows the recipes to vary based on the containing component's color. For instance, supporting a button with consistent treatment between light and dark modes is done with a single recipe.

Many recipes are "stateful", meaning they support rest, hover, active, and focus states for a component.

**"Fill"** means the recipe is intended to fill a larger area, commonly like a component backplate.

**"Foreground"** means the recipe is intended for text, icons, or other lightweight decorations where you need or want to meet contrast requirements.

**"Stroke"** means the recipe is intended for lines, either outline or divider.

#### Accent algorithms

##### accentFill

Stateful.

Relies on `textColor` and `contrastTarget` to find the closest colors from the supplied palette that can be used for component states. For instance, colors needed to support white text and a 14px font (which requires 4.5:1 contrast).

##### accentForeground

Stateful.

Commonly for link text or icon. Also for smaller elements that might not show up well using `accentFill`, for instance, if your accent color is dark purple and you support a dark mode interface.

Like `accentFill` this relies on `textColor` and `contrastTarget` to find the closest colors from the supplied palette that can be used for component states.

##### foregroundOnAccent

Not stateful.

Technically this doesn't _use_ the accent palette, but it's designed to be used _over_ the accent palette. This algorithm simply returns black or white based on the provided `contrastTarget`. It returns white if possible, as a common treatment for an accent button is white text over the accent color.

#### Neutral algorithms

##### neutralDivider

Not stateful.

Used for decorative dividers that do not need to meet contrast requirements.

##### neutralFill

Stateful.

The most basic fill used for buttons or other components.

##### neutralFillContrast

Stateful.

Often Used as a selected state or anywhere you want to draw attention. Meets contrast requirements with the containing background.

##### neutralFillInput

Stateful.

Another basic fill, applied to input elements to allow easy differentiation from other components like buttons.

##### neutralFillStealth

Stateful.

More subtle than `neutralFill` in that the resting state is transparent. Often used for low-priority features to draw less attention.

##### neutralForeground

Not stateful.

Most common recipe, used for plain text or icons.

##### neutralForegroundHint

Not stateful.

Used for subtle text. Meets 4.5:1 minimum contrast requirement.

##### neutralStroke

Stateful.

Used for strong outline, either alone or with a fill.

#### Layers

The layer recipes are used for different sections of an app or site. They are designed to be able to stack, but that is not required. When stacked in sequence, the layers will lighten on top of each other.

The key feature of layering is to support the primary container color for light or dark mode. This produces absolute colors based on the `baseLayerLuminance` value, which sets the luminance for layer one. This is any value between 0 for black or 1 for white.

The difference between each layer is defined with `neutralFillLayerRestDelta`.

Layers are not stateful.

##### neutralFillLayer

The only layer recipe that's relative to the container color instead of absolute. The most common example of this is a Card, which will be one layer color lighter than its container.

##### neutralLayer1, neutralLayer2, neutralLayer3, and neutralLayer4

Absolute layer colors derived from and starting at `baseLayerLuminance`. Layer one is lightest and the values darken as the layer number increases.

##### neutralLayerCardContainer

A special layer to support experiences primarily built with cards, especially in light mode, so cards can be white and the container color can be one layer darker.

##### neutralLayerFloating

A special layer for floating layers, like flyouts or menus. It will be lighter than any other layers if possible, but will also be white in default light mode, as will neutral layer one.

#### Adaptive Color "Don'ts"

The adaptive color system lives entirely in JavaScript, emitting CSS custom properties for styling purposes where appropriate. This means that you should consider the CSS custom properties emitted by color Design Tokens to be immutable. If you declare the CSS custom property in CSS, the adaptive Color System is unable to know that has happened and components will render with incorrect colors, which can lead to accessibility issues. If you need to change the values for those CSS custom properties, set the value using the [DesignToken.setValueFor()](./design-tokens.md#setting-values) API.