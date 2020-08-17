# Avatar

## Overview

An avatar is a graphical represention of a user or object.

### Use Cases

A common use case would be to display an image or text (usually initials) of a user or an object, such as in a user profile.

### Features
- A URL for an image can be passed to the component to be displayed in the coin
  - When no image is provided, the initials of the provided name will be displayed in the coin
- Badge slot: Able to slot in a badge component
- `shape`, a circle or square shape can be chosen. Any border radius for square shaped coins should be determined by the users design system values or stylesheet
- `color`, a hexadecimal color can be provided to determine the coin background color
- When a `link` is provided an `aria-link` attribute is added

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
|   Name    | Description                                                 | Type                                |
|-----------|-------------------------------------------------------------|-------------------------------------|
| `name`    | Accepts name string for coin display                        | `string`                            |
| `src` | Accepts URL string of image to be displayed                 | `string`                            |
| `alt`| Accepts alt text for image                                  | `string`                            |
| `link`    | Accepts a URL for the anchor source                         | `string`                            |
| `shape`   | Determines the avatar coin shape. Default will be a circle. | `string: default | circle | square` |
| `fill`    | Sets the background fill of the avatar coin.                | `string: hex color`                 |
| `color`   | Sets the color of the avatar coin text.                     | `string: hex color`                 |

### Anatomy and Appearance

*Template*
```js
  <template>
    <div 
      class="coin ${x => (x.shape === "square" ? "square" : "circle")}"
      style="${x =>
        x.fill || x.color
            ? `background-color: var(--avatar-fill-${x.fill}); color: var(--avatar-color-${x.color});`
            : void 0}"
    >
      <a class="link" href="${x => (x.link ? x.link : void 0)}">
        ${when(x => x.imgSrc, html`
          <img 
            src="${x => x.imgSrc}"
            alt="${x => x.alt}"
            tabindex="${x => (!x.link ? "0" : void 0)}"
            class="image"
          />
        `)}
        <span class="name">${x => x.initials}</span>
      </a>
    </div>
    <slot name="badge"></slot>
  </template> 
```

---

## Implementation

```html
<fast-avatar 
  src="..."
  alt="..."
  link="...">
</fast-avatar>
```

With `fast-badge` Component:
```html
<fast-avatar
  src="..." 
  alt="..."
  link="...">
  <fast-badge slot="badge">&nbsp</fast-badge>
</fast-avatar>
```

### Accessibility

It is important to ensure that when the contrast of text in the coin meets [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html).

If there is a link the component should have an `aria-link` attribute.

### Globalization

If a badge is used it should appear on the appropriate side of the coin.

---

## Resources

- [WCAG - 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- When a link source URL is provided an `aria-link` attribute should be conditionally added

## Next Steps

Some validation will be needed to determine whether a component sizing feature should be natively added to this component or if that should be controlled by the design system's sizing model.
