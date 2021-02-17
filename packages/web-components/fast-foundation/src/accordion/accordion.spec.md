# Accordion

## Overview

As defined by the W3C:
> An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.

### Use Cases

- Frank finds a spelling error in the FAST documentation. He submits a pull request (PR) to fix the error and goes to eat lunch while waiting for the maintainers to review his PR. Upon returning from lunch he notices a widget on the screen saying certain status checks failed. He clicks on the headline of the widget and it reveals additional information stating that he needs to run prettier to ensure proper formatting. He clicks the headline again and the additional information collapses. Frank runs prettier and his PR is completed successfully.

- On April 16th Randy wakes up in a cold sweat because he realized he made a mistake in filing his taxes with the IRS. He opens his laptop and goes to the IRS website and sees a link to "frequently asked questions". Randy sees a list of questions on the page with an arrow next to it indicating that answers are hidden. He sees a question titled, "What should I do if I made a mistake on my federal turn that I've already filed?" Randy clicks the question and sees a section detailing out the exact steps to take. With his anxiety eased, Randy goes back to bed and falls asleep.

### Features

1. Optionally allow only a single section to be expanded. This behavior is opt-in and not default behavior.

2. Support for interactive content within the header, such as a menu button, checkbox, etc.

3. Optional support for nested accordions. Ideally this behavior will "just work" and no special behaviors will need to be added to enable/support this. The expectation here should be that an accordion takes content and whatever content is inside the accordion panel respects its own interaction model.

### Prior Art/Examples

- [Ant Design](https://ant.design/components/collapse/)
- [Carbon Design](https://www.carbondesignsystem.com/components/accordion/usage/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/accordion/)
- [Fluent UI](https://fluentsite.z22.web.core.windows.net/components/accordion/accessibility)
- [Primer](https://primer.style/components/Details)
- [Bootstrap](https://getbootstrap.com/docs/4.3/components/collapse/)

---

### API

**Accordion**
*Component Name*
- `fast-accordion`

*Attributes:*
- `expand-mode` - enum
  - single
  - multi - default

*Events*
- `change: CustomEvent`
  - no custom data
  - bubbles

**Accordion Item**
*Component names:*
- `fast-accordion-item`

*Attributes:*
- `expanded` - boolean
- `id` - string
- `heading-level` - enum
  - 1
  - 2
  - 3 - default
  - 4
  - 5
  - 6

*Parts:*
- panel
- button

*Slot Names*
- default
- heading
- collapsed-icon
- expanded-icon
- start
- end

*Observable*
- `expandedIcon` - A property used to override the default icon in the `expanded-icon` slot.
- `collapsedIcon` - A property used to override the default icon in the `collapsed-icon` slot.

```ts
const expandedIcon = html`
        <svg>
            <path/>
        </svg>
`

 const collapsedIcon = html`
    <svg>
        <path/>
    </svg>
 `

export class MyAccordionItem extends AccordionItem {
    constructor() {
        super();
        this.expandedIcon = expandedArrorIcon;
        this.collapsedIcon = collapsedArrorIcon;
    }
}
```

### Anatomy and Appearance

```HTML
<!-- shadow root -->
<div>
    <div role="heading" aria-level="3">
        <slot name="start" part="start"></slot>
        <button
            class="button"
            part="button"
            aria-expanded="true"
            aria-controls="accordion1-panel"
            id="accordion1"
        >
            <slot name="heading" part="heading">Panel one</slot>
       </button>
       <slot name="end" part="end"></slot>
       <span class="icon" part="icon">
           <slot name="expanded-icon" part="expanded-icon"></slot>
           <slot name="collapsed-icon" part="collapsed-icon"></slot>
       </span>
    </div>
    <div
        id="accordion1-panel"
        role="region"
        aria-labelledby="accordion1"
    >
        Panel one content
    </div>
    <div role="heading" aria-level="3">
        <slot name="start" part="start"></slot>
        <button
            class="button"
            part="button"
            aria-expanded="false"
            aria-controls="accordion2-panel"
            id="accordion2"
        >
            <slot name="heading" part="heading">Panel two</slot>
       </button>
       <slot name="end" part="end"></slot>
       <span class="icon" part="icon">
           <slot name="expanded-icon" part="expanded-icon"></slot>
           <slot name="collapsed-icon" part="collapsed-icon"></slot>
       </span>
    </div>
    <div
        id="accordion2-panel"
        part="panel"
        role="region"
        aria-labelledby="accordion2"
        class="panel"
    >
        Panel two content
    </div>
    <div role="heading" aria-level="3">
        <slot name="start" part="start"></slot>
        <button
            class="button"
            part="button"
            aria-expanded="true"
            aria-controls="accordion3-panel"
            id="accordion3"
        >
            <slot name="heading" part="heading">Panel three</slot>
        </button>
        <slot name="end" part="end"></slot>
        <span class="icon" part="icon">
           <slot name="expanded-icon" part="expanded-icon"></slot>
           <slot name="collapsed-icon" part="collapsed-icon"></slot>
       </span>
    </div>
    <div
        id="accordion3-panel"
        part="panel"
        role="region"
        aria-labelledby="accordion3"
        class="panel"
    >
        Panel three content
    </div>
</div>

<!-- end shadow root -->
```

---

## Implementation

```HTML
<fast-accordion>
    <fast-accordion-item>
        <span slot="heading">Panel one</span>
        <span slot="icon">^</span>
        Panel one content
    </fast-accordion-item>
    <fast-accordion-item expanded>
        <span slot="heading">Panel two</span>
        <span slot="icon">^</span>
        Panel two content
    </fast-accordion-item>
    <fast-accordion-item>
        <span slot="heading">Panel three</span>
        <span slot="icon">^</span>
        Panel three content
    </fast-accordion-item>
</fast-accordion>
```

### States

Accordion has 2 modes of expansion let can be set via `expand-mode`. `expand-mode` defaults to `multi`, meaning multiple accordion-items can be expanded at any given time. If `expand-mode` is set to `single` then only one item can be expanded, meaning that when you activate a header all other headers with collapse.


### Accessibility

Keyboard interactions for tabbing and up and down arrow should focus the next or previous header. Space bar should toggle the expansion of the focused header.

### Globalization

Component should mirror in RTL presentations.

### Test Plan

While testing is still TBD for our web components, we would expect this to align with the testing strategy and not require any additional test support.

---
