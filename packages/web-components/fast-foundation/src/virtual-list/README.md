---
id: virtual-list
title: virtual-list
sidebar_label: virtual-list
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/virtual-list/README.md
---

A component that uses a template to render an array of objects based on whether each element would be in or near the specified viewport. 

## Usage

```html live
<fast-design-system-provider>
    <fast-virtual-list>
    </fast-virtual-list>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { VirtualList, VirtualListTemplate as template } from "@microsoft/fast-foundation";
import { VirtualListStyles as styles } from "./virtual-list.styles";

@customElement({
    name: "fast-virtual-list",
    template,
    styles,
})
export class FASTVirtualList extends VirtualList{}
```