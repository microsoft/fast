# Typography

*TODO: Sections that will be removed upon review are marked with ~~striketrough~~, remaining for commenting purposes.*

*TODO: Add handling of line height*

## Overview

*Typography* defines the styles and type ramp that can be applied to standard elements. This spec does not currently propose or define any new components.

### Background

Standard html elements like ```<h1>```, ```<p>```, ```<label>```, and ```<span>``` provide options for semantically defining page hierarchy and formatting. Without styles applied, however, these elements will not coordinate properly with the adaptive styling applied to other components.

*Base size*

While the default styling could vary from browser to browser, most seem to adopt the same default styling for compatibility with existing pages. The default base font size is **16px**.

*Heading size*

[Heading element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements) font sizes are calculated from the base size value as follows:

| Element    | Relative | Size   |
|------------|----------|--------|
| ```<h1>``` | 2em      | 32px   |
| ```<h2>``` | 1.5em    | 24px   |
| ```<h3>``` | 1.17em   | 18.7px |
| ```<h4>``` | 1em      | 16px   |
| ```<h5>``` | 0.83em   | 13.2px |
| ```<h6>``` | 0.67em   | 10.7px |

Any of these elements may be used with FAST-DNA styles applied.

### Use Cases

- Defining page hierarchy through one or more sequences of ```<h1>```, ```<h2>```, ```<h3>```, etc.
- Associating a ```<label>``` with an input field
- Styling text as secondary or metatext
- Adding a caption to an image or figure

### Features

- An extensible type ramp based on a default font size
- A set of semantically named styles based on the underlying type ramp
- A default mapping for style to standard elements

### Risks and Challenges

It's possible that styles only (not components) will be harder to implement consistently. We may want to consider simple custom elements that consistently apply the same underlying styles as well as any necessary aria tags.

### Prior Art/Examples

- FAST-DNA (React): [Heading](https://explore.fast.design/components/heading), [Subeading](https://explore.fast.design/components/subheading), [Paragraph](https://explore.fast.design/components/paragraph), [Label](https://explore.fast.design/components/label), [Caption](https://explore.fast.design/components/caption), [Metatext](https://explore.fast.design/components/metatext), [Typography](https://explore.fast.design/components/typography)
- [Material Design](https://material.io/design/typography/the-type-system.html)
- [Bootstrap](https://getbootstrap.com/docs/4.4/content/typography)
- [Ant Design](https://ant.design/components/typography)
- [Semantic UI](https://semantic-ui.com/elements/header.html)
- [Fluent UI](https://fluentsite.z22.web.core.windows.net/components/header/definition)

Most other component frameworks either maintain the base font size or set it smaller to 14px. They also typically maintain heading element sizes based on `em` or `rem`, though some use individual specific values. Typically heading sizes are close to the browser default, though Material Design goes a lot larger at the top.

---

## Design

The type styles published are consistently named so they are easy to identify and consume. A clear separation is made between the semantic naming and the raw type ramp.

Default styles are applied to standard elements such that headings and other base typography pick up the adaptive styling without needing to add class names.

(**Editorial**: can we do this, or do we need to build this support?)

### ~~API~~

*~~The key elements of the component's public API surface~~*

### Adaptive Styling Properties (**Editorial**: Added this section)

- `type-ramp-base-size` = "14px"  
The base size for primary body text. Other type ramp sizes may eventually be determined from this starting value.

### Anatomy and Appearance

The type ramp is constructed as css variables that go plus and minus from the base. This allows a consumer to extend the ramp if necessary.

This ramp is currently based on fixed values according to the current visual design, but could be updated from an algorithm if desired.

- `fast-type-ramp-base-size` = `type-ramp-base-size`
- `fast-type-ramp-plus-1-size` = "16px"
- `fast-type-ramp-plus-2-size` = "20px"
- `fast-type-ramp-plus-3-size` = "28px"
- `fast-type-ramp-plus-4-size` = "34px"
- `fast-type-ramp-plus-5-size` = "46px"
- `fast-type-ramp-plus-6-size` = "60px"
- `fast-type-ramp-minus-1-size` = "12px"
- `fast-type-ramp-minus-2-size` = "10px"

The semantically named styles that are intended to be consumed at the component level:

- `fast-display-type-size` = `fast-type-ramp-plus-6-size`
- `fast-header-type-size` = `fast-type-ramp-plus-5-size`
- `fast-subheader-type-size` = `fast-type-ramp-plus-4-size`
- `fast-page-title-type-size` = `fast-type-ramp-plus-3-size`
- `fast-section-title-type-size` = `fast-type-ramp-plus-2-size`
- `fast-paragraph-larger-type-size` = `fast-type-ramp-plus-1-size`
- `fast-paragraph-type-size` = `fast-type-ramp-base-size`
- `fast-paragraph-smaller-type-size` = `fast-type-ramp-minus-1-size`
- `fast-label-type-size` = `fast-type-ramp-base-size`
- `fast-button-type-size` = `fast-type-ramp-base-size`
- `fast-caption-type-size` = `fast-type-ramp-minus-1-size`
- `fast-caption-smaller-type-size` = `fast-type-ramp-minus-2-size`

The default mappings for standard elements to styles:

- `body` = `fast-paragraph`
- `h1` = `fast-page-title`
- `h2` = `fast-section-title`
- `h3` = `fast-type-ramp-plus-1`
- `h4` = `fast-type-ramp-base`
- `h5` = `fast-type-ramp-minus-1`
- `h6` = `fast-type-ramp-minus-2`
- `label` = `fast-label`

---

## Implementation

*~~Important aspects of the planned implementation with careful consideration of web standards and integration.~~*

### ~~States~~

*~~Key component states, valid state transitions, and how interactions trigger a state transition.~~*

### Accessibility

The benefit of enabling standard elements to be styled is that if used properly they will already have the appropriate default aria roles and attributes. The downside is potential misuse and missing attributes. For instance ```<p class="fast-heading">My Heading</p>``` won't be properly identified as a heading by assistive technology.

### ~~Globalization~~

*~~Consider whether the component has any special globalization needs:~~*

### ~~Security~~

*~~Are there any security implications surrounding the component?~~*

### ~~Performance~~

*~~Are there any performance pitfalls or challenges with implementing the component?~~*

### Dependencies

Potential future dependency on modular or custom type ramp generation algorithm.

### ~~Test Plan~~

*~~What is the plan for testing the component, if different from the normal path?~~*

### Tooling

As the typography styles are not complete components, we will need to provide a way to insert standard text elements and apply a class using a picker or other focused UI.

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

*TODO: How do we document styles? Something like this doc, but separate for styles from components?*

---

## ~~Resources~~

*~~Any related resource links such as web standards, discussion threads, diagrams, etc.~~*

## Next Steps

Apply the styles to the current components and any example pages.

It would be nice to extend the type ramp settings in the future to be able to be specified by a [modular scale](https://type-scale.com/) or another custom algorithm.
