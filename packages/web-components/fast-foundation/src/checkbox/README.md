---
id: checkbox
title: fast-checkbox
sidebar_label: checkbox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/checkbox/README.md
---

An implementation of a [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox) as a form-connected web-component.

## Usage

```html
<fast-design-system-provider use-defaults>
    <fieldset>
        <legend>Fruits</legend>
        <fast-checkbox checked>Apple</fast-checkbox>
        <fast-checkbox checked>Banana</fast-checkbox>
        <fast-checkbox>Honeydew</fast-checkbox>
        <fast-checkbox checked>Mango</fast-checkbox>
    </fieldset>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Checkbox, CheckboxTemplate as template } from "@microsoft/fast-foundation";
import { CheckboxStyles as styles } from "./checkbox.styles";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
})
export class FASTCheckbox extends Checkbox {}
```