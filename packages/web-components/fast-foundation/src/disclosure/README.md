---
id: disclosure
title: fast-disclosure
sidebar_label: disclosure
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/disclosure/README.md
---

`fast-disclosure` is a web component combination of a button and section of content. A button, an invoker, activates the disclosure and shows/hides the exam content.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-disclosure>
        <button type="button" slot="invoker">More about cars</button>
        <div>
            Most definitions of cars say that they run primarily on roads, seat one to
            eight people, have four tires, and mainly transport people rather than goods.
        </div>
    </fast-disclosure>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Disclosure, DisclosureTemplate as template } from "@microsoft/fast-foundation";
import { DisclosureStyles as styles } from "./disclosure.styles";

// Disclosure
@customElement({
    name: "fast-disclosure",
    template,
    styles,
})
export class FASTDisclosure extends Disclosure {}
```
