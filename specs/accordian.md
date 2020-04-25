# Accordion

## Overview

As defined by the W3C:
> An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.

### Use Cases

- Frank finds a spelling error in the FAST-DNA documentation. He submits a pull request (PR) to fix the error and goes to eat lunch while waiting for the maintainers to review his PR. Upon returning from lunch he notices a widget on the screen saying certain status checks failed. He clicks on the headline of the widget and it reveals additional information stating that he needs to run prettier to ensure proper formatting. He clicks the headline again and the additional information collapses. Frank runs prettier and his PR is completed successfully.

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
- `expand` - enum
  - single - default
  - multi

*Events*
- `change: CustomEvent`
  - no custom data
  - bubbles

**Accordion Header**
*Component names:*
- `accordion-header`

*Attributes:*
- `id` - string

*Parts:*
- button

*Slot Names*
- expanded-glyph
- collapsed-glyph

**Accordion Panel**
*Component names:*
- `accordion-panel`

*Attributes:*
- `id` - string

### Anatomy and Appearance

```HTML
<!-- shadow root -->
<div>
    <h3>
        <button
            type="button"
            part="button"
            aria-expanded="true"
            class="button"
            aria-controls="panel1"
            id="accordion1"
        >
            Panel one
            <slot name="expanded-glyph" part="expanded-glyph"></slot>
            <slot name="collapsed-glyph" part="collapsed-glyph"></slot>
       </button>
    </h3>
    <div
        id="panel1"
        role="region"
        aria-labelledby="accordion1"
    >
        Panel one content
    </div>
    <h3>
        <button
            type="button"
            aria-expanded="false"
            class="button"
            aria-controls="panel2"
            id="accordion2"
        >
            Panel one
            <slot name="expanded-glyph" part="expanded-glyph"></slot>
            <slot name="collapsed-glyph" part="collapsed-glyph"></slot>
       </button>
    </h3>
    <div
        id="panel2"
        part="panel"
        role="region"
        aria-labelledby="accordion2"
        class="panel"
    >
        Panel one content
    </div>
    <h3>
        <button
            type="button"
            aria-expanded="true"
            class="button"
            aria-controls="panel3"
            id="accordion3"
        >
            Panel one
            <slot name="expanded-glyph" part="expanded-glyph"></slot>
            <slot name="collapsed-glyph" part="collapsed-glyph"></slot>
       </button>
    </h3>
    <div
        id="panel3"
        part="panel"
        role="region"
        aria-labelledby="accordion3"
        class="panel"
    >
        Panel one content
    </div>
</div>

<!-- end shadow root -->
```

---

## Implementation

```HTML
<fast-accordion>
    <fast-accordion-header>Panel one</fast-accordion-header>
    <fast-accordion-panel>Panel one content</fast-accordion-panel>
    <fast-accordion-header>Panel two</fast-accordion-header>
    <fast-accordion-panel>Panel two content</fast-accordion-panel>
    <fast-accordion-header>Panel three</fast-accordion-header>
    <fast-accordion-panel>Panel three content</fast-accordion-panel>
</fast-accordion>
```

### States


### Accessibility

### Globalization

Start and end content should swap in LTR presentations.

### Test Plan

While testing is still TBD for our web components, we would expect this to align with the testing strategy and not require any additional test support.

---
