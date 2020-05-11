# Design System Provider
- [What is a Design System](#what-is-a-design-system)
- [The Design System Provider](#the-design-system-provider)
    - [FAST Design System Provider](#FAST-design-system-provider)
    - [Use Defaults](#use-defaults)
    - [Composing Design System Providers](#composing-design-system-providers)
    - [Recipes](#recipes)
    - [Creating a Design System Provider](#creating-a-design-system-provider)
        - [Declaring Design System properties](#declaring-design-system-properties)
    - [FAST Design System Properties](#FAST-design-system-properties)

## What is a Design System

The _design system_ can generally be thought of as a collection of named values that inform visual rendering. It quantifies concepts such as type-ramp, color palettes, design units, etc to be used in UI components. Other common names for this concept are _design variables_, _design tokens_ or _theme_.

These values are mutable throughout a UI tree. Where UI tree _A_ may see their contextual _design-unit_ as `4px`, tree _B_ may have its scale increased by providing a _design-unit_ of `6px`. Or, tree _C_ may see a contextual _background color_ of `#FFF` where tree _D_ may see a contextual _background color_ as `#000`.

## Design System Provider

A _design system_ isn't much use without convenient mechanisms to surface the _design system_ values to UI components and change values where desired. This is where the _Design System Provider_ comes in. `@microsoft/fast-components` exports the `FASTDesignSystemProvider` and `DesignSystemProvider` Web Components to help with:

1. Declaring _design system_ properties and default values.
2. Surfacing _design system_ values as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*).
3. Surfacing the _design system_ as a JavaScript object accessible on the Custom Element.
4. Facilitate _design system_ composition in _document order_.
5. Registering CSS Custom Property definitions to create arbitrary CSS Custom Properties as a function of the _design system_.

### FAST Design System Provider

The easiest way to get up-and-running is to use the `FASTDesignSystemProvider`. This Web Component is an implementation of the `DesignSystemProvider` that is configured with _design system_ properties used by the Web Components in the `@microsoft/fast-components` library.

**EXAMPLE: Using the FASTDesignSystemProvider**

```js
import { FASTDesignSystemProvider } from "@microsoft/fast-components";
```

```html
<fast-design-system-provider use-defaults>
    Hello World
</fast-design-system-provider>
```

_Design system_ properties can be overridden by setting the property or attribute on the `fast-design-system-provider`. See [FAST Design System Properties](#FAST-Design-System-Properties) for a comprehensive list of properties.

**EXAMPLE: Setting design system properties**

```html
<fast-design-system-provider use-defaults background-color="#111111" design-unit="6">
    Hello world!
</fast-design-system-provider>
```

### `use-defaults`

In general, a _Design System Provider_ element with the `use-defaults` attribute should exist as an ancestor to all rendered UI - this will ensure that all the values enumerated in the _design system_ are expressed as _CSS custom properties_.

Notice below that none of the code-samples initialize a value to a declared _design system_ property. This is because the _design system_ is designed to function as a waterfall of values - where values assigned lower in the DOM tree override values defined by ancestors. Initializing the value on the instance assigns the value to every instance of the _Design System Provider_ which is generally un-desired.

**EXAMPLE: initialized vs non-initialized properties**

```ts
class ExampleClass {
    public nonInitialized;
    // vs
    public initialized = true;
}
```

The `use-defaults` boolean attribute exposes a mechanism to apply the default values to an element while still allowing nested design system elements to intentionally override specific values. For details on how to set default values, see [Declaring Design System Properties](#Declaring-Design-System-Properties)

### Composing Design System Providers
*Design System Providers* are designed to compose their values with ancestor *Design System Providers* to facilitate changing values for decedents of the provider.

```html
<fast-design-system-provider design-unit="4" background-color="#FFFFFF">
    <p style="height: calc(var(--design-unit) * 1px)">4px</p>
    <p style="background: var(--background-color)">#FFFFFF</p>

    <fast-design-system-provider design-unit="8">
        <p style="height: calc(var(--design-unit) * 1px)">8px</p>
        <p style="background: var(--background-color)">#FFFFFF</p>
    </fast-design-system-provider>
</fast-design-system-provider>
```


### Recipes

There are some things that CSS just can't do. Advanced math, array manipulation, and conditionals are simply not possible with today's CSS.

To address this gap, the _DesignSystemProvider_ is capable of registering `CSSCustomPropertyDefinition` types through the `registerCSSCustomProperty` method:

**EXAMPLE: Register a CSS custom property that is a function of the _design system_**

```ts
DesignSystemProvider.registerCSSCustomProperty({
    name: "design-unit-12th",
    value: designSystem => Math.pow(designSystem.designUnit, 12),
});
```

In the above example, the value function will be re-evaluated if the _design system_ ever changes.

The above API is made especially useful when defining a [component stylesheet](https://github.com/microsoft/fast-dna/blob/master/packages/web-components/fast-element/docs/building-components.md#defining-css) - individual stylesheets can declare dependencies on CSS custom properties that are functions of the element instance's *design system*

**EXAMPLE: creating a recipe dependency**
```ts
import { css } from "@microsoft/fast-element";
import { cssCustomPropertyBehaviorFactory, DesignSystemProvider } from "@microsoft/fast-components";

const styles = css`
    :host {
        height: var(--fancy-height);
    }
`.withBehaviors(
    cssCustomPropertyBehaviorFactory(
        "fancy-height",
        designSystem => Math.pow(designSystem.designUnit, 12),
        DesignSystemProvider.findProvider
    )
)
```

### Creating a Design System Provider

To create a new _Design System Provider_, extend the `DesignSystemProvider` class and decorate it with the `@designSystemProvider` decorator, providing the decorator the element _tag name_ you wish to use:

**EXAMPLE: Creating a custom Design System Provider**

```ts
import { DesignSystemProvider, designSystemProvider } from "@microsoft/fast-components";

@designSystemProvider("fancy-design-system-provider")
class FancyDesignSystemProvider extends DesignSystemProvider {}
```

```html
<fancy-design-system-provider use-defaults>
    Hello Fancy World!
</fancy-design-system-provider>
```

#### Declaring Design System Properties

Building off the above, _design system_ properties can be declared using the `@designSystemProperty` decorator.

**EXAMPLE: Creating a design system property declaration**

```ts
// ..
@designSystemProvider("fancy-design-system-provider")
class FancyDesignSystemProvider extends DesignSystemProvider {
    @attr("fancy-property")
    @designSystemProperty({ cssCustomProperty: "fancy-property", default: "red" })
    public fancyProperty;
}
```

```html
<fancy-design-system-provider use-defaults>
    <p style="color: var(--fancy-property)">Red text!</p>
</fancy-design-system-provider>
```

Declaring a _design system_ property will do several things. By default, the property name being decorated will become a CSS custom property when the value is set. This name can be customized by setting `cssCustomProperty` on the provided config object.

```ts
// Will create a CSS custom property accessible by `var(--fooBar)`
@designSystemProperty({default: "foo"})
public fooBar;
```

```ts
// Will create a CSS custom property accessible by `var(--foo-bar)`
@designSystemProperty({default: "foo", cssCustomProperty: "foo-bar"})
public fooBar;
```

Additionally, creation of CSS custom properties can also be disabled by setting `cssCustomProperty` to `false`;

```ts
// No CSS custom property will be created
@designSystemProperty({default: "foo", cssCustomProperty: false})
public fooBar;
```

The default value _must_ be set through the `default` property on the supplied config. This is the value that will be applied when the `use-defaults` attribute is used and no override property is provided.

### FAST Design System Properties
|Property Name|Type|Attribute Name|CSS Custom property|
|---|---|---|---|
|backgroundColor|string| background-color | background-color |
|accentBaseColor|string| accent-base-color | N/A |
|neutralPalette|string[]| N/A | N/A |
|accentPalette|string[]| N/A | N/A |
|density|DensityOffset| number | density |
|designUnit|number| number | design-unit |
|baseHeightMultiplier|number| base-height-multiplier | base-height-multiplier |
|baseHorizontalSpacingMultiplier|number| base-horizontal-spacing-multiplier | base-horizontal-spacing-multiplier |
|cornerRadius|number| corner-radius | corner-radius |
|elevatedCornerRadius|number| elevated-corner-radius | elevated-corner-radius |
|outlineWidth|number| outline-width | outline-width |
|focusOutlineWidth|number| focus-outline-width | focus-outline-width |
|disabledOpacity|number| disabled-opacity | disabled-opacity |
|typeRampMinus2FontSize | string |  type-ramp-minus-2-font-size | type-ramp-minus-2-font-size |
|typeRampMinus2LineHeight | string |  type-ramp-minus-2-line-height | type-ramp-minus-2-line-height |
|typeRampMinus1FontSize | string |  type-ramp-minus-1-font-size | type-ramp-minus-1-font-size |
|typeRampMinus1LineHeight | string |  type-ramp-minus-1-line-height | type-ramp-minus-1-line-height |
|typeRampBaseFontSize | string |  type-ramp-base-font-size | type-ramp-base-font-size |
|typeRampBaseLineHeight | string |  type-ramp-base-line-height | type-ramp-base-line-height |
|typeRampPlus1FontSize | string |  type-ramp-plus-1-font-size | type-ramp-plus-1-font-size |
|typeRampPlus1LineHeight | string |  type-ramp-plus-1-line-height | type-ramp-plus-1-line-height |
|typeRampPlus2FontSize | string |  type-ramp-plus-2-font-size | type-ramp-plus-2-font-size |
|typeRampPlus2LineHeight | string |  type-ramp-plus-2-line-height | type-ramp-plus-2-line-height |
|typeRampPlus3FontSize | string |  type-ramp-plus-3-font-size | type-ramp-plus-3-font-size |
|typeRampPlus3LineHeight | string |  type-ramp-plus-3-line-height | type-ramp-plus-3-line-height |
|typeRampPlus4FontSize | string |  type-ramp-plus-4-font-size | type-ramp-plus-4-font-size |
|typeRampPlus4LineHeight | string |  type-ramp-plus-4-line-height | type-ramp-plus-4-line-height |
|typeRampPlus5FontSize | string |  type-ramp-plus-5-font-size | type-ramp-plus-5-font-size |
|typeRampPlus5LineHeight | string |  type-ramp-plus-5-line-height | type-ramp-plus-5-line-height |
|typeRampPlus6FontSize | string |  type-ramp-plus-6-font-size | type-ramp-plus-6-font-size |
|typeRampPlus6LineHeight | string |  type-ramp-plus-6-line-height | type-ramp-plus-6-line-height |
|accentFillRestDelta|number| accent-fill-rest-delta | N/A |
|accentFillHoverDelta|number| accent-fill-hover-delta | N/A |
|accentFillActiveDelta|number| accent-fill-active-delta | N/A |
|accentFillFocusDelta|number| accent-fill-focus-delta | N/A |
|accentFillSelectedDelta|number| accent-fill-selected-delta | N/A |
|accentForegroundRestDelta|number| accent-foreground-rest-delta | N/A |
|accentForegroundHoverDelta|number| accent-foreground-hover-delta | N/A |
|accentForegroundActiveDelta|number| accent-foreground-active-delta | N/A |
|accentForegroundFocusDelta|number| accent-foreground-focus-delta | N/A |
|neutralFillRestDelta|number| neutral-fill-rest-delta | N/A |
|neutralFillHoverDelta|number| neutral-fill-hover-delta | N/A |
|neutralFillActiveDelta|number| neutral-fill-active-delta | N/A |
|neutralFillFocusDelta|number| neutral-fill-focus-delta | N/A |
|neutralFillSelectedDelta|number| neutral-fill-selected-delta | N/A |
|neutralFillInputRestDelta|number| neutral-fill-input-rest-delta | N/A |
|neutralFillInputHoverDelta|number| neutral-fill-input-hover-delta | N/A |
|neutralFillInputActiveDelta|number| neutral-fill-input-active-delta | N/A |
|neutralFillInputFocusDelta|number| neutral-fill-input-focus-delta | N/A |
|neutralFillInputSelectedDelta|number| neutral-fill-input-selected-delta | N/A |
|neutralFillStealthRestDelta|number| neutral-fill-stealth-rest-delta | N/A |
|neutralFillStealthHoverDelta|number| neutral-fill-stealth-hover-delta | N/A |
|neutralFillStealthActiveDelta|number| neutral-fill-stealth-active-delta | N/A |
|neutralFillStealthFocusDelta|number| neutral-fill-stealth-focus-delta | N/A |
|neutralFillStealthSelectedDelta|number| neutral-fill-stealth-selected-delta | N/A |
|neutralFillToggleHoverDelta|number| neutral-fill-toggle-hover-delta | N/A |
|neutralFillToggleActiveDelta|number| neutral-fill-toggle-hover-active | N/A |
|neutralFillToggleFocusDelta|number| neutral-fill-toggle-hover-focus | N/A |
|baseLayerLuminance|number  base-layer-luminance| | N/A |
|neutralFillCardDelta|number| neutral-fill-card-delta | N/A |
|neutralForegroundHoverDelta|number| neutral-foreground-hover-delta | N/A |
|neutralForegroundActiveDelta|number| neutral-foreground-active-delta | N/A |
|neutralForegroundFocusDelta|number| neutral-foreground-focus-delta | N/A |
|neutralDividerRestDelta|number| neutral-divider-rest-delta | N/A |
|neutralOutlineRestDelta|number| neutral-outline-rest-delta | N/A |
|neutralOutlineHoverDelta|number| neutral-outline-hover-delta | N/A |
|neutralOutlineActiveDelta|number| neutral-outline-active-delta | N/A |
|neutralOutlineFocusDelta|number| neutral-outline-focus-delta | N/A |
