---
id: radio
title: fast-radio
sidebar_label: radio
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/radio/README.md
---

An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastRadio
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRadio()
    );
```

### Customizing the indicator

```ts
import {
    provideFASTDesignSystem,
    fastRadio
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRadio({
            checkedIndicator: `...your checked indicator...`
        })
    );
```

## Usage

```html live
<fast-radio value="mango" required>Mango</fast-radio>
 ```

## Create your own design

```ts
import {
    Radio,
    RadioOptions,
    radioTemplate as template,
} from "@microsoft/fast-foundation";
import { radioStyles as styles } from "./my-radio.styles";

export const myRadio = Radio.compose<RadioOptions>({
    baseName: "radio",
    template,
    styles,
    checkedIndicator: `...default checked indicator...`,
});
```

## Additional resources

View the full specification for radio along with additional configuration options [here](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio/radio.spec.md)