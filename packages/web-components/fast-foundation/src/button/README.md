---
id: button
title: fast-button
sidebar_label: button
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/button/README.md
---

`fast-button` is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). The `fast-components` button supports several visual appearances (accent, lightweight, neutral, outline, stealth).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastButton
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton()
    );
```

## Usage

```html live
<fast-button appearance="primary">Submit</fast-button>
```

## Create your own design

```ts
import {
    Button,
    buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { buttonStyles as styles } from "./my-button.styles";

export const myButton = Button.compose({
    baseName: "button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the button element rendered into the shadow DOM.
:::

## Additional resources

View the full specification for button along with additional configuration options [here](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/button/button.spec.md)