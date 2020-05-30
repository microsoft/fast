---
id: fast-accordion-item
title: fast-accordion-item
sidebar_label: fast-accordion-item
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/accordion/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { AccordionItem, AccordionItemTemplate as template } from "@microsoft/fast-foundation";
import { MyAccordionItemStyles as styles } from "./accordion-item.styles";

@customElement({
    name: "fast-accordion-item",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAccordionItem extends AccordionItem {}
```