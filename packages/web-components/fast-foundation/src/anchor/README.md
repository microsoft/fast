---
id: anchor
title: fast-anchor
sidebar_label: anchor
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/anchor/README.md
---

`fast-anchor` is a web component implementation of an [HTML anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a). The component supports the same visual appearances as the button component (accent, lightweight, neutral, outline, stealth) as well as a hypertext appearance for use inline with text.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-anchor href="https://fast.design" appearance="hypertext">FAST</fast-anchor>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-foundation";
import { MyAnchorStyles as styles } from "./anchor.styles";

@customElement({
    name: "fast-anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAnchor extends Anchor {}
```

:::note
This component is built with the expectation that focus is delegated to the anchor element rendered into the shadow DOM.
:::