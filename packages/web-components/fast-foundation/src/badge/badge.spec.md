# fast-badge

## Overview

*Badge* component is used to highlight an item and attract attention or flag status, such as “New”, “Sale”, or other short phrases or a number to represent unread messages, updates available, etc..

### Use Cases

Typical use cases include, but are not limited to, denoting a sale or new item, flagging an item as part of a category or representing a value of unread messages.
  
### Features

A badge has no functionality and no properties:

### Prior Art/Examples
- [FAST Badge (React)](https://www.npmjs.com/package/@microsoft/fast-components-react-msft)
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
- N/A

*Slots:*
- `default`

### Anatomy and Appearance

*Template:*
```
<slot></slot>
```

## Implementation


```
<fast-badge>
    New
</fast-badge>
```

```
<fast-badge>
    99
</fast-badge>
```

### Accessibility

Ensure text meets WCAG 2.1 color contrast against background.

### Globalization

*Badge* should mirror in RTL languages, meaning the *badge* should flip to the other side of the item it is labeling.

### Dependencies

No dependencies outside of fast-element itself.
