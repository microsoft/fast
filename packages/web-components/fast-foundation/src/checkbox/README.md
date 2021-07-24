---
id: checkbox
title: fast-checkbox
sidebar_label: checkbox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/checkbox/README.md
---

An implementation of a [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox) as a form-connected web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastCheckbox
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastCheckbox()
    );
```

### Customizing Indicators

```ts
import {
    provideFASTDesignSystem,
    fastCheckbox
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastCheckbox({
            checkedIndicator: `...your checked indicator...`,
            indeterminateIndicator: `...your indeterminate indicator...`,
        })
    );
```

## Usage

```html live
<fieldset>
    <legend>Fruits</legend>
    <fast-checkbox checked>Apple</fast-checkbox>
    <fast-checkbox checked>Banana</fast-checkbox>
    <fast-checkbox>Honeydew</fast-checkbox>
    <fast-checkbox checked>Mango</fast-checkbox>
</fieldset>
```

## Create your own design

```ts
import {
    Checkbox,
    CheckboxOptions,
    checkboxTemplate as template,
} from "@microsoft/fast-foundation";
import { checkboxStyles as styles } from "./my-checkbox.styles";

export const myCheckbox = Checkbox.compose<CheckboxOptions>({
    baseName: "checkbox",
    template,
    styles,
    checkedIndicator: `...default checked indicator...`,
    indeterminateIndicator: `...default indeterminate indicator...`,
});
```

## Additional resources

View the full specification for checkbox along with additional configuration options [here](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/checkbox/checkbox.spec.md)