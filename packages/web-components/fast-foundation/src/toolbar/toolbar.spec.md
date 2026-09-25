# Toolbar

## Overview

As defined by the W3C:

> A toolbar is a container for grouping a set of controls, such as buttons, menubuttons, or checkboxes.
>
> When a set of controls is visually presented as a group, the toolbar role can be used to communicate the presence and purpose of the grouping to screen reader users. Grouping controls into toolbars can also be an effective way of reducing the number of tab stops in the keyboard interface.

Based on the above definition, it appears that as it currently stands, all elements within a toolbar _should_ be interactive controls. This includes support for [disabled controls](#disabled-controls).

### Use Cases

Used anywhere someone may want to visually and structurally group related interactive controls.

- Tom is reading his favorite internet newspaper. Upon finishing an article, he notices that it has accrued nearly one thousand comments. Tom decides to read the comments and he ends up writing a response to someone he disagrees with. As he gets ready to submit, he realizes it will be easier for others to read his comment if he formats it. Tom sees a toolbar with formatting options and is able to bold all the words he deems important. He submits his comment and waits to see what happens next.

### Prior Art/Examples

- [Fluent UI](https://fluentsite.z22.web.core.windows.net/components/toolbar/definition)
- [Material UI](https://material-ui.com/api/toolbar/)
- [WAI-ARIA](https://w3c.github.io/aria-practices/examples/toolbar/toolbar.html)

---

### API

*Component name:*

- `fast-toolbar`

*Attributes:*

- `orientation`: an enum
  - horizontal (default)
  - vertical

*Slots:*

- `default`
- `label` - slot for the label

### Anatomy and Appearance

*Template:*

```html
<template
    role="toolbar"
    orientation="${x => x.orientation}"
>
    <slot name="label"></slot>
    <slot></slot>
</template>
```

## Implementation

**With visible label:**

```html
<h3 id="label">Toolbar visible label</h3>
<fast-toolbar aria-labelledby="label">
    <fast-button>A button</fast-button>
    <fast-checkbox>A checkbox</fast-checkbox>
    <fast-checkbox>Another checkbox</fast-checkbox>
</fast-toolbar>
```

**With slotted label:**

```html
<fast-toolbar>
    <label slot="label">Toolbar slotted label</label>
    <fast-button>A button</fast-button>
    <fast-checkbox>A checkbox</fast-checkbox>
    <fast-checkbox>Another checkbox</fast-checkbox>
</fast-toolbar>
```

**With invisible label:**

```html
<fast-toolbar aria-label="Toolbar label">
    <fast-button>A button</fast-button>
    <fast-checkbox>A checkbox</fast-checkbox>
    <fast-checkbox>Another checkbox</fast-checkbox>
</fast-toolbar>
```

### Accessibility

The interaction model for the toolbar should map to the [W3C interaction model](https://w3c.github.io/aria-practices/#toolbar).

#### Secondary navigation methods

The W3C specification gives the following affordance to toolbar keyboard interactions:

Horizontal:

> In horizontal toolbars, Left Arrow and Right Arrow navigate among controls. Up Arrow and Down Arrow can duplicate Left Arrow and Right Arrow, respectively, or can be reserved for operating controls, such as spin buttons that require vertical arrow keys to operate.

Vertical:

> In vertical toolbars, Up Arrow and Down Arrow navigate among controls. Left Arrow and Right Arrow can duplicate Up Arrow and Down Arrow, respectively, or can be reserved for operating controls, such as horizontal sliders that require horizontal arrow keys to operate.

While affordances are given for secondary navigation methods, the initial stance of FAST is to not support the methods mentioned above in order to not complicate/convolute the API or cause conflict with interaction models for controls contained within the toolbar (such as a select or dropdown). As we gain feedback on the control, we can look at how we may want to support the above if/when it is requested.

#### Disabled controls

> Typically, disabled elements are not focusable when navigating with a keyboard. However, in circumstances where discoverability of a function is crucial, it may be helpful if disabled controls are focusable so screen reader users are more likely to be aware of their presence.

Following the "flexible" principle of FAST, I think we should support an API which enables exposing disabled controls to users. This allows implementors to decide if their circumstances warrant exposing that functionality or not. A simple solution here is that if an author wants to expose a disabled control, they would simply add it to the tabindex:

```html
<fast-button disabled tabindex="0">Disabled</fast-button>
```

#### Labels

A label is required for toolbars.
> If the toolbar has a visible label, it is referenced by aria-labelledby on the toolbar element. Otherwise, the toolbar element has a label provided by aria-label.
