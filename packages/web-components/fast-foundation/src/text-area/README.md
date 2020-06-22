---
id: text-area
title: fast-text-area
sidebar_label: text-area
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/text-area/README.md
---

An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. The `fast-text-area` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-text-area placeholder="Describe your experience">How was your stay?</fast-text-area>
</fast-design-system-provider>
```

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TextAreaTemplate as template, TextArea } from "@microsoft/fast-foundation";
import { TextAreaStyles as styles } from "./text-area.styles";

@customElement({
    name: "fast-text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextArea extends TextArea {}
```