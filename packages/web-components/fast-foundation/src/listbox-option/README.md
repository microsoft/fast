---
id: listbox-option
title: fast-option
sidebar_label: option
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/listbox-option/README.md
---

An implementation of an [option](https://w3c.github.io/aria/#option). To avoid namespace collisions with the [Option() constructor](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement/Option), the component class is `ListboxOption`, and our implementation is named `fast-option`.

The `<fast-option>` component will only provide internals related to form association when used within a form-associated component such as [`fast-select`](/docs/components/select) or [`fast-combobox`](/docs/components/combobox). It will not provide these capabilities when used only with a [`fast-listbox`](/docs/components/listbox).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastOption
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastOption()
    );
```

## Usage

See [`fast-select`](/docs/components/select), [`fast-combobox`](/docs/components/combobox), or [`fast-listbox`](/docs/components/listbox).

## Create your own design

```ts
import {
    ListboxOption,
    listboxOptionTemplate as template,
} from "@microsoft/fast-foundation";
import { optionStyles as styles } from "./my-listbox-option.styles";

export const myOption = ListboxOption.compose({
    baseName: "option",
    template,
    styles,
});
```

## Additional resources

* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/listbox-option/listbox-option.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria/#option)