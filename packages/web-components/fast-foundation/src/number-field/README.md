---
id: number-field
title: fast-number-field
sidebar_label: number-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/number-field/README.md
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-number-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastNumberField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastNumberField()
    );
```

### Customizing Glyphs

```ts
import {
    provideFASTDesignSystem,
    fastNumberField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastNumberField({
            stepDownGlyph: `...your step down glyph...`,
            stepUpGlyph: `...your setup up glyph...`,
        })
    );
```

## Usage

```html live
<fast-number-field appearance="filled" min="0" max="10"></fast-number-field>
```

## Create your own design

```ts
import {
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { numberFieldStyles as styles } from "./my-number-field.styles";

export const myNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: "number-field",
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
    stepDownGlyph: `...default step down glyph...`,
    stepUpGlyph: `...default setup up glyph...`,
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-number-field)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/number-field/number-field.spec.md)