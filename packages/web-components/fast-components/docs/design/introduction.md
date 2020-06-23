---
id: introduction
title: Introduction
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-components/docs/design/introduction.md
---

`@microsoft/fast-components` leverages `@microsoft/fast-element` to style components. For details on how to apply CSS, see [leveraging CSS](fast-element/leveraging-css.md).

## Hiding undefined elements

Custom Elements that have not been [upgraded](https://developers.google.com/web/fundamentals/web-components/customelements#upgrades) and don't have styles attached can still be rendered by the browser but they likely do not look how they are supposed to. To avoid a *flash of un-styled content* (FOUC), visually hide Custom Elements if they have not been *defined*:

```CSS
:not(:defined) {
    visibility: hidden;
}
```

:::important
The consuming application must apply this, as the components themselves do not.
:::