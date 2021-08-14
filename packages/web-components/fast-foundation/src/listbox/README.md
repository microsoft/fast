---
id: listbox
title: fast-listbox
sidebar_label: listbox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/listbox/README.md
---

An implementation of a [listbox](https://w3c.github.io/aria-practices/#Listbox). While any DOM content is permissible as a child of the listbox, only [`fast-option`](/docs/components/listbox-option) elements, `option` elements, and slotted items with `role="option"` will be treated as options and receive keyboard support.

The `listbox` component has no internals related to form association. For a form-associated `listbox`, see the [`fast-select` component](/docs/components/select).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastListbox,
    fastOption
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastListbox(),
        fastOption()
    );
```

## Usage

```html live
<div>
    <label id="preferred-format">Preferred Format:</label><br />
    <fast-listbox aria-labelledby="preferred-format" name="preferred-format">
        <fast-option value="vinyl">Vinyl Record</fast-option>
        <fast-option value="casette">Casette</fast-option>
        <fast-option value="cd">Compact Disc</fast-option>
        <fast-option value="digital">Digital</fast-option>
    </fast-listbox>
</div>
```

## Create your own design

### Listbox

```ts
import { Listbox, listboxTemplate as template } from "@microsoft/fast-foundation";
import { listboxStyles as styles } from "./my-listbox.styles";

export const myListbox = Listbox.compose({
    baseName: "listbox",
    template,
    styles,
});
```

### Option

See [listbox-option](/docs/components/listbox-option) for more information.

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-listbox)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/listbox/listbox.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#Listbox)