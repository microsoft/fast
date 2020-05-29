---
id: fast-text-field
title: fast-text-field
sidebar_label: fast-text-field
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/text-field/README.md
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-text-field` supports two visual apperances, outline and filled, with the control defaulting to the outline appearance.

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TextFieldTemplate as template, TextField } from "@microsoft/fast-foundation";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "fast-text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextField extends TextField {}
```

## Usage

```html
<fast-text-field appearance="filled" placeholder="user@email.com">Email</fast-text-field>
```