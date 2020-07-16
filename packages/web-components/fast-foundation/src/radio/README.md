---
id: radio
title: fast-radio
sidebar_label: radio
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/radio/README.md
---

An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component.

## Usage

```html
<fast-radio value="mango" required>Mango</fast-radio>
 ```

## Applying custom styles

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