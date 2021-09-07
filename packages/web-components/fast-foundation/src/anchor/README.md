---
id: anchor
title: fast-anchor
sidebar_label: anchor
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/anchor/README.md
---

As defined by the W3C:

> An anchor is a piece of text which marks the beginning and/or the end of a hypertext link.

`fast-anchor` is a web component implementation of an [HTML anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a). The `fast-components` anchor supports the same visual appearances as the button component (accent, lightweight, neutral, outline, stealth) as well as a hypertext appearance for use inline with text.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastAnchor
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastAnchor()
    );
```

## Usage

```html live
<fast-anchor href="https://fast.design" appearance="hypertext">FAST</fast-anchor>
```

## Create your own design

```ts
import {
    Anchor,
    anchorTemplate as template,
} from "@microsoft/fast-foundation";
import { anchorStyles as styles } from "./my-anchor.styles";

export const myAnchor = Anchor.compose({
    baseName: "anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the anchor element rendered into the shadow DOM.
:::

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-anchor)