# Avatar

## Overview

An avatar is a graphical represention of a user or object.

### Use Cases

A common use case would be to display an image or text (usually initials) of a user or an object.

### Features
- Image slot: Able to slot in an avatar image
- Badge slot: Able to slot in a badge component
- `size`, a numeric value that determines the size of the avatar
- `shape`, a circle or square shape can be chosen
- `color`, a hexadecimal color can be provided to determine the coin background color
- If no image is provided, the initials of the provided name will be displayed

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
|   Name    | Description                                  | Type                |
|-----------|----------------------------------------------|---------------------|
| `name`    | Accepts name string for coin display         | `string`            |
| `shape`   | Determines the avatar coin shape.            | `circle | square`   |
| `fill`    | Sets the background fill of the avatar coin. | `string: hex color` |
| `color`   | Sets the color of the avatar coin text.      | `string: hex color` |
| `size`    | Sets the size of avatar coin.                | `number`            |

### Anatomy and Appearance

*Template*
```
<div class="coin">
  <a href="${ x => x.link}">
    <span class="name">
      ${x => x.name}
    </span>
    ${when(x => x.imgSrc, html<TestAvatar>`
      <img class="photo"
        alt="${ x => x.altText }" 
        src="${ x => x.imgSrc }" />
    `)}

  </a>
</div>
<slot class="badge" name="badge"></slot>
```

---

## Implementation

```
<test-avatar 
  imgSrc=""
  altText="Jenny's profile image"
  link="">
</test-avatar>
```

With `fast-badge` Component:
```
<test-avatar 
  altText="Jenny's profile image"
  link="">
  <fast-badge slot="badge" 
    fill="primary"
    circular=>C</fast-badge>
</test-avatar>
```

### Accessibility

It is important to ensure that when the contrast of text in the coin meets [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html).

### Globalization

If a badge is used it should appear on the appropriate side of the coin.

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---

## Resources

- [WCAG - 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)

## Next Steps

I believe some feature validation will be needed to determine whether some features should be natively added to this component or if they should be added by the developer party for their particular use case.
