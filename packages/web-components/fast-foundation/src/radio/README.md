---
id: fast-radio
title: fast-radio
sidebar_label: fast-radio
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/radio/README.md
---

An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component.

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Radio, RadioTemplate as template } from "@microsoft/fast-foundation";
import { RadioStyles as styles } from "./radio.styles";

@customElement({
    name: "fast-radio",
    template,
    styles,
})
export class FASTRadio extends Radio {}
```

## Usage

```html
    <fast-radio value="mango" required>Mango</fast-radio>
 ```