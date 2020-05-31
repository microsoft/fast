---
id: fast-accordion
title: fast-accordion
sidebar_label: fast-accordion
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/accordion/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Accordion, AccordionTemplate as template } from "@microsoft/fast-foundation";
import { MyAccordionStyles as styles } from "./accordion.styles";

@customElement({
    name: "fast-accordion",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAccordion extends Accordion {}
```