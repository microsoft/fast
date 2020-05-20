---
id: fast-button
title: fast-button
sidebar_label: fast-button
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/button/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Button, ButtonTemplate as template } from "@microsoft/fast-foundation";
import { ButtonStyles as styles } from "./button.styles";

// Button
@customElement({
    name: "fast-button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTButton extends Button {}
```