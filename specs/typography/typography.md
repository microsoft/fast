# Typography

*TODO: Sections that will be removed upon review are marked with ~~striketrough~~, remaining for commenting purposes.*

## Overview

*Typography* defines the underlying type size system for applying to elements, css classes, or within components. This spec does not propose any components of its own.

### Background

A type ramp can help create balance and contrast in formatted content. Sizes from a ramp can be applied linearly to form progression and information hierarchy, or selected artistically.

The use of type ramps has existed since the early days of printing, where fixed sizes and intervals were common. In digital representation we have increased flexibility and options, including calculating more precise and variable scales.

This typography system provides an extensible structure anchored around a base size, from fixed values or generated using a modular scale.

### Use Cases

- Formatting main body content
- Defining page hierarchy using headings
- Providing a label for an input field
- Adding a caption to an image or figure

### Features

- An extensible type ramp around a base font size
- CSS variables to apply the type ramp

### Risks and Challenges

Further typography-related specs build on the underlying principles and resources defined here. It will be important to provide meaningful ways to allow for semantic styles and consistent application of appearances in balance with flexibility and maintenance cost.

### Prior Art / Examples

- [FAST-DNA (React)](https://explore.fast.design/components/typography)
- [Material Design](https://material.io/design/typography/the-type-system.html)
- [Bootstrap](https://getbootstrap.com/docs/4.4/content/typography)
- [Ant Design](https://ant.design/components/typography)
- [Mineral UI](https://mineral-ui.netlify.com/typography)

---

## Design

The default type ramp uses a selection of values from [Microsoft Fluent Design](https://www.microsoft.com/design/fluent).

![](./images/type-ramp.png)

Note the "Ramp ID", which is used to select the desired size. This ramp is centered around the base type size to associate the relative sizes between content. For instance, your main body text uses the `base` size. You may want a caption to be smaller than that, so you use `-1`. You want your [headings](./headings.md) to be larger, so you use one or more of the `+` sizes.

This is more declarative than using an index position to reference the sizes, like `7` if this ramp is numbered from the top or `3` if numbered from the bottom. It also allows the sizes that you use to be related to each other rather than at other arbitrary points on the ramp. For example, three levels of headings above body text are `16px`, `20px`, and `28px` instead of jumping all the way to `60px` at the top and skipping the middle. You can add additional sizes at the top and bottom if necessary.

*Note that these are just examples and nothing about any particular usage of a type size is prescribed by the underlying ramp. See further typography specs for other systematic ways to apply the sizes.*

Type style variables can be added at any point in the DOM. Generally they would be created globally for consistent application throughout your app or site, or they could be overridden or added for a single section of a page.

### API

Pseudo interfaces: (*Could be functions or decorators or otherwise*)

- `typeRamp()`: A default type ramp as illustrated above
- `typeRamp({'12px', '14px', '24px', '36px'}, 1)`: A type ramp with fixed type size values and default line height, index 1 is base
- `typeRamp({{'12px', '16px'}, {'14px', '20px'}, {'24px', '28px'}, {'36px', '44px'}}, 1)`: A type ramp with fixed type size values and fixed individual line heights
- `typeRamp(16, 1.25, 3, 5)`: A type ramp based at `16px` on a major third [modular scale](https://type-scale.com/) of `1.25` with `3` sizes below base and `5` sizes above.

### Anatomy and Appearance

The type ramp is presented as css variables that extend plus and minus from the base.

- `fast-type-ramp-base-size` = `"14px"`
- `fast-type-ramp-base-height` = `"20px"`
- `fast-type-ramp-plus-1-size` = `"16px"`
- `fast-type-ramp-plus-1-height` = `"24px"`
- `fast-type-ramp-plus-2-size` = `"20px"`
- `fast-type-ramp-plus-2-height` = `"28px"`
- `fast-type-ramp-plus-3-size` = `"28px"`
- `fast-type-ramp-plus-3-height` = `"36px"`
- `fast-type-ramp-plus-4-size` = `"34px"`
- `fast-type-ramp-plus-4-height` = `"44px"`
- `fast-type-ramp-plus-5-size` = `"46px"`
- `fast-type-ramp-plus-5-height` = `"56px"`
- `fast-type-ramp-plus-6-size` = `"60px"`
- `fast-type-ramp-plus-6-height` = `"72px"`
- `fast-type-ramp-minus-1-size` = `"12px"`
- `fast-type-ramp-minus-1-height` = `"16px"`
- `fast-type-ramp-minus-2-size` = `"10px"`
- `fast-type-ramp-minus-2-height` = `"16px"`

---

## Implementation

*~~Important aspects of the planned implementation with careful consideration of web standards and integration.~~*

### ~~States~~

*~~Key component states, valid state transitions, and how interactions trigger a state transition.~~*

### Accessibility

Since this spec only deals with type styles there are not traditional accessibility concerns, however this might be a point of potential future extension to allow for type sizing or capping of the smallest size.

### ~~Globalization~~

*~~Consider whether the component has any special globalization needs:~~*

### ~~Security~~

*~~Are there any security implications surrounding the component?~~*

### ~~Performance~~

*~~Are there any performance pitfalls or challenges with implementing the component?~~*

### ~~Dependencies~~

~~Potential future dependency on modular or custom type ramp generation algorithm.~~

### ~~Test Plan~~

*~~What is the plan for testing the component, if different from the normal path?~~*

### Tooling

As the typography styles are not components, it would be nice to provide a way to apply typical combinations to elements using a picker or other focused UI.

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

*TODO: How do we document styles? Something like this doc, but separate for styles from components?*

---

## ~~Resources~~

*~~Any related resource links such as web standards, discussion threads, diagrams, etc.~~*

## Next Steps

Apply the styles to the current components and any example pages.

It would be nice to extend the type ramp settings in the future to be able to be specified by a [modular scale](https://type-scale.com/) or another custom algorithm.
