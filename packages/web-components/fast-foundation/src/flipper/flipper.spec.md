# Flipper

## Overview

The flipper component is most often used to page through blocks of content or collections of ui elements.

### Use Cases
- Tony is looking for a new refrigerator. He goes onto his computer and navigates the browser to a site that sells appliances. He sees a list of refrigerators but not the one he wants so he clicks an arrow button (flipper) to show more. He sees a new GE Cafe that interests him and clicks on it which directs him to a purchase page.

- Bobby is blind and is also looking for a new refrigerator. He goes onto his computer and navigates the browser to the same site that sells appliances. He tabs through a list of refrigerators until he finds the one that was recommended to him by a friend. Bobby is unaware of the flipper.

### Non-goals
- Other button implementations

### Prior Art/Examples
Limited prior art is available from major component libraries, however many brands and products leverage flippers on the front page of their sites. From a cursory search, the following prominently display either a carousel or scrolling region powered by "flippers":
- Hulu
- Netflix
- Amazon
- Microsoft

---


### API

Extends FAST Element

*Component Name*
- `fast-flipper`

*Attrs*
- `direction` - enum, previous or next. Defaults to next
- `hiddenFromAT` - The control is hidden from assistive technology. In the case that `aria-hidden` exists on the host, the control will default to that value and respond accordingly. If it doesn't exist, we'll internally default to hiding this from AT.
- `disabled` - the control is disabled. There are scenarios where a flipper would be visible and disabled

*Events*
- `click` - mimics the click event of traditional buttons

### Anatomy and Appearance

```
<template
    role="button" 
    aria-hidden=${x => x.hiddenFromAT}
    aria-disabled=${x => x.disabled}
    tabindex=${x => x.hiddenFromAT ? -1 : 0}
>
    ${when(
        x => x.direction === "next",
        html`
        <slot name="next" part="next"></slot>
    `
    )}
    ${when(
        x => x.direction === "previous",
        html`
        <slot name="previous" part="previous"></slot>
    `
    )}
</template>
```


*Screenshots below are of the basic appearance of the component and are not exhaustive.*

| State | Image |
| ----- | ----- |
| previous | ![](./images/previous.png) |
| previous (hover) | ![](./images/previous-hover.png)
| next | ![](./images/next.png)
| next (hover) | ![](./images/next-hover.png)
| dark | ![](./images/previous-dark.png)
| dark (hover) | ![](./images/previous-dark-hover.png)

*Slot Names*
- next - often times a glyph, icon, or text to represent "next" interaction
- previous - often times a glyph, icon, or text to represent "previous" interaction

*Host Classes*
- disabled

*CSS Parts*
- next
- previous

---

## Implementation

### Accessibility

In a majority of use cases, flippers should be hidden from assistive technologies as it typically is a secondary method of navigation which can be confusing for users. Flippers are hidden from screen readers by default, but can be exposed by passing `false` to the `hiddenFromAT` prop. When exposing flippers to screen readers, it's important to pass an `aria-label` if the flipper content is purely presentational and not text. Correct and precise labeling of a component that is purely visual and has no textual context is needed to give proper context to assistive technologies.

### Globalization

Next and previous content should swap in LTR/RTL presentations.

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.