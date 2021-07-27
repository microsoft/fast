---
id: select
title: fast-select
sidebar_label: select
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/select/README.md
---

An implementation of an [HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) as a form-connected web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastSelect,
    fastOption
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSelect(),
        fastOption()
    );
```

### Customizing the Indicator

```ts
import {
    provideFASTDesignSystem,
    fastSelect,
    fastOption
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSelect({
          indicator: `...your indicator...`
        }),
        fastOption()
    );
```

## Usage

```html live
<fast-select id="shirt-size">
  <fast-option value="s">Small</fast-option>
  <fast-option value="m">Medium</fast-option>
  <fast-option value="l">Large</fast-option>
  <fast-option value="xl">Extra Large</fast-option>
</fast-select>
```

## Create your own design

### Select

```ts
import {
    Select,
    SelectOptions,
    selectTemplate as template,
} from "@microsoft/fast-foundation";
import { selectStyles as styles } from "./my-select.styles";

export const mySelect = Select.compose<SelectOptions>({
    baseName: "select",
    template,
    styles,
    indicator: `...default indicator...`,
});
```

### Option

See [listbox-option](/docs/components/listbox-option) for more information.

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-select)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/select/select.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)
* [Open UI Analysis](https://open-ui.org/components/select.research)
* [Open UI Proposal](https://open-ui.org/components/select)