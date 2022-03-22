---
id: text-area
title: fast-text-area
sidebar_label: text-area
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/text-area/README.md
---

An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. The `fast-text-area` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTextArea
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTextArea()
    );
```

## Usage

```html live
<fast-text-area placeholder="Describe your experience">How was your stay?</fast-text-area>
```

## Create your own design

```ts
import {
    TextArea,
    textAreaTemplate as template,
} from "@microsoft/fast-foundation";
import { textAreaStyles as styles } from "./my-text-area.styles";

export const myTextArea = TextArea.compose({
    baseName: "text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-text-area)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-area/text-area.spec.md)