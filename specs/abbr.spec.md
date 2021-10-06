# Abbr (abbreviation)

## Overview

From [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr), the `<abbr>` HTML element represents an abbreviation or acronym. Much of this specification borrows heavily from the details provided by MDN. The primary *need* for this element is that it relies on the native browser tooltip which cannot be styled. Design systems and web authors looking for consistency across experiences may find a `<fast-attr>` element beneficial as it would enable comparable support with customizable UI.

### Use Cases

- When an abbreviation is used and you want to provide an expansion or definition outside the flow of the document's content, use `<fast-abbr>` with a tooltip for full text.
- To define an abbreviation which may be unfamiliar to the reader, present the term using `<fast-abbr>` and either the corresponding attribute for full text or inline text providing the definition.
- When an abbreviation's presence in the text needs to be clearly noted, the `<fast-abbr>` element is useful. This can be used, in turn, for styling or scripting purposes.


### Non-goals

- Abbr includes no implicit role and does not receive focus. Accordingly, the tooltip of `<fast-abbr>` will only show on hover.
- Full parity with the `<abbr>` API is a non-goal as it relies on the native tooltip tied to the `title` attribute. As this behavior cannot be suppressed we will need to use a different attribute namespace.

### Prior Art/Examples

-   [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr)

---

### API

_Component name:_

-   `fast-abbr`

_Attributes:_

-   `text` - The full text content of the abbreviation.
-   `delay` - time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300.
-   `position` - where the tooltip should appear relative to its target. 'start' and 'end' are like 'left' and 'right' but are inverted when the direction is 'rtl' When the position is undefined the tooltip is placed above or below the anchor based on available space.
    -   top
    -   bottom
    -   left
    -   right
    -   start
    -   end

_Slots:_

-   `default` - typically used for the abbreviation text

### Anatomy and Appearance

_Template:_

```
<template>
    <slot></slot>
    <fast-tooltip
        position=${x => x.position}
        visible=${x => x.showTooltip}
        delay=${x => x.delay}
        ${ref("tooltip")}
    >
        ${x => x.text}
    </fast-tooltip>
</template>
```

## Implementation

```
<p>This <fast-abbr text="Specification">spec</fast-abbr> makes the case for abbr.</p>
```

### Accessibility

There is no implicit role on the component. Any role is allowed.

### Dependencies

This component depends on [Tooltip](../tooltip/tooltip.spec.md) which likewise depends on [anchored region](../anchored-region/anchored-region.spec.md).
