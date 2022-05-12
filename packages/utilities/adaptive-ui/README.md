# Adaptive UI

Adaptive UI is a library for building highly-consistent design systems based around your visual decisions instead of a complex map of color swatches and tokens based on t-shirt sizes.

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

The layer system for setting content area background colors and improved handling of light and dark mode is evolving and will be added soon.

See more about the [adaptive color system](./src/color/README.md).
