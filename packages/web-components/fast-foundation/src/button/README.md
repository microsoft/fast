---
id: fast-button
title: fast-button
sidebar_label: fast-button
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/button/README.md
---

`fast-button` is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). The component supports several visual apperances (accent, lightweight, neutral, outline, stealth).

:::note
This component is built with the expectation that focus is delegated to the button element rendered into the shadow DOM.
:::

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

## Usage
```html live
<fast-design-system-provider use-defaults>
    <fast-button appearance="primary">Submit</fast-button>
</fast-design-system-provider>
```