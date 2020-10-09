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
    <fast-disclosure appearance="hypertext">
        <span slot="start">👩🏻‍🦳</span>
        <strong slot="title">Read about White Canary</strong>
        <div>
            Sara Lance, also known by her alter-ego White Canary, is a fictional character
            in The CW's Arrowverse franchise, first introduced in the 2012 pilot episode
            of the television series Arrow, and later starring in Legends of Tomorrow.
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
