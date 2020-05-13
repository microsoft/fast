# Button & Anchor

## Overview

The button component represent an control that should invoke an action or perform a navigation.

### Use Cases
- Creating simple button or link elements

### Non-goals
- Complex or compisite buttons (like split button)
- Inline "hypertext" anchor
  - This component will expose a base class that a "hypertext" component can leverage, but the component itself is not in the scope of the button.
  
### Features
- Can represent either a hyperlink or a button
- Appearances including "lightweight", "justified", "outline", "primary" and "stealth"
  - I'm proposing droping "justified" because this is a simple matter of removing starting padding.

### Risks and Challenges

Prior implementations of button provide the opportunity to create a `button` element or an `a` element. The `button` element is a form-associated element but the `a` element is not. If we expose a single polymorphic button component that can represent both a `button` and an `a` - we need to figure out how to only form-associate the `button`.

Button also supports a number of appearance options. Ideally these using one of these appearances does not incur the debt of the others, including recipe registrations and CSS bloat.

### Prior Art/Examples
- [FAST DNA React](https://explore.fast.design/components/button)
- [Material UI](https://material-ui.com/components/buttons/)
- [Lightning Design System](https://www.lightningdesignsystem.com/components/buttons/)
- [Carbon Design](https://www.carbondesignsystem.com/components/button/code)
- [Ant Design](https://ant.design/components/button/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/button)
- [Office Fabric](https://developer.microsoft.com/en-us/fabric#/controls/web/button)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/buttons)

---

## Design
The library would expose 2 custom element definitions: 
1. `fast-button`
8. `fast-anchor`

All "button" components will be form-associated and support all methods and attributes of the [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element.

All "anchor" components will support all methods and attributes of the [anchor](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) element.

### API
- [button]([button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button))
- [anchor](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- appearance: `"neutral"  | "outline" | "lightweight" | "stealth" | "primary"` (and `"hypertext"` for anchor)

### Anatomy and Appearance
#### Button
```html
<host>
  <slot name="start"></slot>
  <slot></slot>
  <slot name="end"></slot>
</host>
```
#### Anchor
```html
<host>
  <a> <!-- focus defered to this element -->
    <slot name="start"></slot>
    <slot></slot>
    <slot name="end"></slot>
  </a>
</host>
```

- *Slot Names*
  - start: the content to place at the start of the primary content
  - default: the element's content
  - end: the content to place at the end of the the primary content

### Accessibility
Button elements will appear utilize the button role and will behave as the native `button` element.

Anchor elements will function slightly differently to preserve some of the native capabilities that come from anchors like opening anchors in new tabs, opening anchors in new tabs without navigating to them, and the augmented command menu that gets opened when right+clicking an anchor. They will create an *internal* anchor element to which attributes will get reflected. Focus will also be defered to this internal element.
