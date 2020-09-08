# Skeleton

## Overview

A skeleton is used as a visual placeholder for an element while it is in a loading state and usually presents itself as a simplified wireframe-like version of the UI it is representing.

### Background

- [Github Issue #3755](https://github.com/microsoft/fast/issues/3755)

### Use Cases

Used to give users a sense of loading progress activity rather than merely presenting a blank page or container.

### Non-goals

#### Specfic Skeletons

Should not be made to reflect a specific element (e.g. `skeleton-button`, `skeleton-text`, `skeleton-heading`, etc...). The skeleton should be as generic of a container as possible to represent various elements of different shapes and sizes.
  
### Features

#### Patterns
This feature allows a `fast-skeleton` component to accept a source for a skeleton "pattern" through the `pattern` attribute or an inline SVG code via the component's slot. A skeleton pattern may be used to represent a transparent graphical shape and layout of a component.

When used in this way the skeleton component would essentially act as a container for the provided SVG mask which can then be applied anywhere in an application.

The SVG would have CSS mask properties applied to it allowing underlying colors and effects (i.e. [shimmer](https://developer.microsoft.com/en-us/fluentui#/controls/web/shimmer)) to be visible through the transparent template.

This feature allows the `fast-skeleton` component to provide maximum design flexibility to represent many shapes and layouts.

#### Shape Attribute
A `circle` or `rect` (rectangle) shape can be selected. The `border-radius` of the `rect` shape will be determined by the design system.

### Prior Art/Examples

- [Ant Design](https://ant.design/components/skeleton/)
- [Carbon](https://www.carbondesignsystem.com/patterns/loading-pattern#skeleton-states)
- [FluentUI (Shimmer)](https://developer.microsoft.com/en-us/fluentui#/controls/web/shimmer)
- [Material UI](https://material-ui.com/components/skeleton/)
- [Kalo](https://kalo.design/components/skeleton/)
- [Pajamas](https://design.gitlab.com/components/skeleton-loader)
- [Polaris](https://polaris.shopify.com/components/feedback-indicators/skeleton-thumbnail)
- [React Loading Skeleton](https://github.com/dvtng/react-loading-skeleton#readme)
- [Semantic UI (Placeholder)](https://semantic-ui.com/elements/placeholder.html)
- [Telus](https://tds.telus.com/community/index.html#skeleton)
- [Thumbprint](https://thumbprint.design/guide/product/loaders/#example-2.-skeleton-loader)
- [Vercel](https://vercel.com/design/skeleton)

## Design

A designer can create an SVG design pattern asset to create custom visual layouts for this component. If a developer does not have design support, they may use skeleton components as a stand-alone element in an existing component. Developers also have the option to manually code SVG's to be used as templates. SVG code quality will have to be enforced to ensure proper rendering of the pattern masks.

### API

#### Component Name
- `fast-skeleton`

#### Attributes
|   Name    | Description                                                 | Type                                |
|-----------|-------------------------------------------------------------|-------------------------------------|
| `shape`   | Determines the skeleton coin shape. Rectangle by default.   | `string: rect (default) | circle`   |
| `fill`    | Sets the background fill of the skeleton component          | `string: hex color`                 |
| `pattern` | Accepts a URL for an SVG asset                              | `string: URL`

### Anatomy and Appearance

#### Template

```js
<template
  aria-busy="${x => x.ariaBusy}"
>
  <img src="${x => x.pattern}" />
  <slot></slot>
</template>
```
---

## Implementation

```html
<fast-skeleton shape="rect"></fast-skeleton>
```

SVG pattern passed via `pattern` attribute:
```html
<fast-skeleton 
  pattern="https://example.com/template.svg"
>
</fast-skeleton>
```

SVG pattern passed via component slot:
```html
<fast-skeleton shape="rect">
  <svg></svg>
</fast-skeleton>
```
### Accessibility

- The `aria-busy` attribute should be applied and set to `true` while this the UI the skeleton represented is still in a loading state
- To maximize the information presented to assistive technologies inline SVG's are the preferred method for applying a `pattern`

### Globalization

The component should respond to directional settings.

## Resources

- [Open UI Analysis](https://open-ui.org/components/skeleton.research)
- [Analysis Spreadsheet](https://microsoft-my.sharepoint-df.com/:x:/r/personal/jocusick_microsoft_com/_layouts/15/guestaccess.aspx?e=E6cgc9&share=EcwzVDELjoZMgn_mbQMGH0YBCLQfFpn-1ksv0j20sLtqsQ)
