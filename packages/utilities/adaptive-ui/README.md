# Adaptive UI

Adaptive UI is a library for building highly-consistent design systems based around your visual decisions. This represents an evolution of many token implementations that provide end-result values without the means to track how they were derived or easily adjust them.

This is a core feature of [FAST](https://fast.design) and is incorporated into the [Fluent UI Web Components](https://aka.ms/fluentwebcomponents) and other design systems.

## Installation

```shell
npm install --save @microsoft/adaptive-ui
```

```shell
yarn add @microsoft/adaptive-ui
```

## Getting started

The most common way to use this library is through the `DesignToken`s.

For example, in a FAST style sheet:

```ts
css`
    :host {
        background: ${neutralFillRest};
    }
`
```

This will evaluate the `neutralFillRest` recipe when the component loads and apply the correct color appropriate for the current context within design.

Most of the color recipes are contextually aware of where they're used so they produce accessible colors based on the configuration of the design, for instance between light mode and dark mode, or when personalization is applied, like a blue tint to the neutral colors or orange accent color.

To tint the neutral palette, and thus all color recipes derived from it:

```ts
neutralBaseColor.withDefault("#73818C");
```

To switch to dark mode:

```ts
fillColor.withDefault("#232323");
```

See more about the [adaptive color system](./src/color/README.md).

## Road map

The layer system for setting content area background colors and improved handling of light and dark mode is evolving and will be added soon.

The latest version of adaptive density, currently in RFC and PR, will come here soon as well.

The color system is being updated to support opacity in colors, which will enable at least the neutral palette to overlay images or background blur effects like in Windows 11.

### Further afield

The fixed design tokens will evolve into a more configurable definition aligning with industry standards in design tokens.
