---
id: search
title: fast-search
sidebar_label: search
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/search/README.md
---

An implementation of a [search](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/search) as a form-connected web-component. The `fast-search` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

:::note
This component filters out slotted _text_ nodes that are only white space to properly hide the label when the label is not in use.
:::

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastSearch
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSearch()
    );
```

## Usage

```html live
<fast-search placeholder="search">search</fast-search>
```

## Create your own design

```ts
import {
    Search,
    searcgTemplate as template,
} from "@microsoft/fast-foundation";
import { searchStyles as styles } from "./my-search.styles";


export const mySearch = Search.compose({
    baseName: "search",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-search)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/search/search.spec.md)