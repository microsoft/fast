# fast-badge

## Overview

*Badge* component is used to highlight an item and attract attention or flag status, such as “New”, “Sale”, or other short phrases.

### Use Cases
Keep the *badge* label short and succinct &ndash; it should not be a sentence or a long phrase (recommend 2-3 words). Short phrases are work well, such as “App of the day,” but keep in mind that they will generally become longer when localized. Keep the text to nouns and adjectives if possible (e.g. “New” or “New today”), so the user won’t think it is an actionable element.

Typical use cases include, but are not limited to, denoting a sale or new item and flagging an item as part of a category
  
### Features

A badge should allow the following properties:
- `filled`, whether the badge draws a backplate or not.
- `size`, the size the badge is rendered.

### Risks and Challenges

It's import to not over dominate the users screen with the use of *badge*. They should be used sparingly to denote special status or draw attention to a particular item.

### Prior Art/Examples
- [FAST-DNA (React)](https://explore.fast.design/components/badge)
- [Material UI](https://material-ui.com/components/badges/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/badges/)
- [Ant Design Badge](https://ant.design/components/badge/)
- [Ant Design Lozenge](https://atlaskit.atlassian.com/packages/core/lozenge)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/badge)

---

### API

*Component name:*
- `fast-badge`

*Attributes:*
- `filled`: boolean
- `size`: enum

*Slots:*
- `default`

### Anatomy and Appearance

*Parts:*
- label
- checkbox
- status-indicator
- status-message

*Template:*
```
<span>
    <slot></slot>
</span>
```

## Implementation

```
<fast-badge
    filled={true}
    size="Large"
>
    New
</fast-badge>
```

### Globalization

*Badge* should mirror in RTL languages, meaning the *badge* should flip to the other side of the item it is labeling.

### Dependencies

No dependencies outside of fast-element itself.

### Documentation

*Badge* component is a short inline [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span) element highlight an item and attract attention or flag status, such as “New”, “Sale”, or other short phrases. It is not interactive, however, it generally overlays interactive content or is positioned close to a commanding component.
