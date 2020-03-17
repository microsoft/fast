# fast-badge

## Overview

*Badge* component is used to highlight an item and attract attention or flag status, such as “New”, “Sale”, or other short phrases or a number to represent unread messages, updates available, etc..

### Use Cases

Typical use cases include, but are not limited to, denoting a sale or new item, flagging an item as part of a category or representing a value of unread messages.
  
### Features

A badge should allow the following properties:
- `fill`, a string that passes the color value for the backplate. Defaults to "transparent".
- `circular`, if circular styling is desired.
- `size`, the size the badge is rendered.

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
- `fill`: string
- `circular`: boolean
- `size`: enum
  - small
  - medium
  - large

*Slots:*
- `default`

### Anatomy and Appearance

*Template:*
```
<slot></slot>
```

## Implementation

```
fast-badge {
   --fill-primary: rgba(255, 0, 0, 1);
   --fill-secondary: #00FF00;
   --fill-transparent: transparent;
   --size-small: 12px;
   --size-medium: 16px;
   --size-large: 20px;
}
```

```
<fast-badge
    fill="primary"
    size="large"
>
    New
</fast-badge>
```

### Accessibility

Ensure text meets WCAG 2.1 color contrast against background.

### Globalization

*Badge* should mirror in RTL languages, meaning the *badge* should flip to the other side of the item it is labeling.

### Dependencies

No dependencies outside of fast-element itself.
