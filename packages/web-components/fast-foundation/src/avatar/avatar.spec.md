# Avatar

## Overview

An avatar is a graphical representation of a user or object.

### Use Cases

A common use case would be to display an image or text (usually initials) of a user or an object, such as in a user profile.

### Features
- A URL for an image can be passed to the component to be displayed in the backplate
- Badge slot: Able to slot in a badge component
- Media slot: Accepts an `img` or an `svg`

### Prior Art/Examples

- [Fluent UI (Persona)](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona)
- [Fluent UI](https://fluentsite.z22.web.core.windows.net/components/avatar/definition)
- [Lighting Design](https://www.lightningdesignsystem.com/components/avatar/)
- [Evergreen](https://evergreen.segment.com/components/avatar)
- [Ant Design](https://ant.design/components/avatar/)
- [Atlassian](https://atlaskit.atlassian.com/packages/design-system/avatar)
---
### API

*Component Name*
- `fast-avatar`

#### Attributes
None

#### Slots

| Name  | Description               | Elements     |
|-------|---------------------------|--------------|
|-      | Slot for initials         | text         |
|`badge`| Slot for fast badge       | `fast-badge` |
|`media`| Slot for images and icons | `img`, `svg` |

### Anatomy and Appearance

*Template*
```js
<div
    class="backplate"
    part="backplate"
>
    <div class="media" part="media">
        <slot name="media">${options.media ?? ""}</slot>
    </div>
    <div class="content" part="content">
        <slot></slot>
    </div>
</div>
<slot name="badge"></slot>
```

---

## Implementation

```html
<fast-avatar >
</fast-avatar>
```

With `fast-badge` Component:
```html
<fast-avatar>
  <fast-badge slot="badge">&nbsp</fast-badge>
</fast-avatar>
```

### Accessibility

It is important to ensure that when the contrast of text in the backplate meets [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html).

### Globalization

If a badge is used it should appear on the appropriate side of the backplate.

---

## Resources

- [WCAG - 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)

## Next Steps

Some validation will be needed to determine whether a component sizing feature should be natively added to this component or if that should be controlled by the design system's sizing model.
