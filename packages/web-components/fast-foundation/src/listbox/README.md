---
id: listbox
title: fast-listbox
sidebar_label: listbox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/listbox/README.md
---

An implementation of a [listbox](https://w3c.github.io/aria-practices/#Listbox). While any DOM content is permissible as a child of the listbox, only [`fast-option`](../listbox-option/README.md) elements, `option` elements, and slotted items with `role="option"` will be treated as options and receive keyboard support.

The `listbox` component has no internals related to form association. For a form-associated `listbox`, see the [`fast-select` component](../select/README.md).

## Usage

```html live
<fast-design-system-provider use-defaults>
    <label id="preferred-format">Preferred Format:</label><br />
    <fast-listbox aria-labelledby="preferred-format" name="preferred-format">
        <fast-option value="vinyl">Vinyl Record</fast-option>
        <fast-option value="casette">Casette</fast-option>
        <fast-option value="cd">Compact Disc</fast-option>
        <fast-option value="digital">Digital</fast-option>
    </fast-listbox>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Listbox, ListboxTemplate as template } from "@microsoft/fast-foundation";

import { ListboxStyles as styles } from "./listbox.styles";

@customElement({
    name: "fast-listbox",
    styles,
    template
})
export class FASTListbox extends Listbox {}
```
