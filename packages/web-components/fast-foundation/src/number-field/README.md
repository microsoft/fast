---
id: number-field
title: fast-number-field
sidebar_label: number-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/number-field/README.md
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-number-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-number-field appearance="filled" min="0" max="10"></fast-number-field>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { NumberFieldTemplate as template, NumberField } from "@microsoft/fast-foundation";
import { NumberFieldStyles as styles } from "./number-field.styles";

@customElement({
    name: "fast-number-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTNumberField extends NumberField {}
```