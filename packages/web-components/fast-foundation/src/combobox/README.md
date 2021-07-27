---
id: combobox
title: fast-combobox
sidebar_label: combobox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/combobox/README.md
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#combobox):

> A combobox is an input widget with an associated popup that enables users to select a value for the combobox from a collection of possible values. In some implementations, the popup presents allowed values, while in other implementations, the popup presents suggested values, and users may either select one of the suggestions or type a value. The popup may be a listbox, grid, tree, or dialog. Many implementations also include a third optional element -- a graphical Open button adjacent to the combobox, which indicates availability of the popup. Activating the Open button displays the popup if suggestions are available.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastCombobox,
    fastOption
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastCombobox(),
        fastOption()
    );
```

### Customizing the indicator

```ts
import {
    provideFASTDesignSystem,
    fastCombobox,
    fastOption
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastCombobox({
          indicator: `...your indicator...`
        }),
        fastOption()
    );
```

## Usage

```html live
<fast-combobox autocomplete="both">
  <fast-option>Christopher Eccleston</fast-option>
  <fast-option>David Tenant</fast-option>
  <fast-option>Matt Smith</fast-option>
  <fast-option>Peter Capaldi</fast-option>
  <fast-option>Jodie Whittaker</fast-option>
</fast-combobox>
```

## Create your own design

### Combobox

```ts
import {
    Combobox,
    ComboboxOptions,
    comboboxTemplate as template,
} from "@microsoft/fast-foundation";
import { comboboxStyles as styles } from "./my-combobox.styles";

export const myCombobox = Combobox.compose<ComboboxOptions>({
    baseName: "combobox",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
    indicator: `...default indicator...`,
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

### Option

See [listbox-option](/docs/components/listbox-option) for more information.

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-combobox)
* [Component technical specification](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/combobox)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#combobox)