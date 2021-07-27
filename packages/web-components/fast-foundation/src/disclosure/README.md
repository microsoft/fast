---
id: disclosure
title: fast-disclosure
sidebar_label: disclosure
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/disclosure/README.md
---

A disclosure component is the implementation of native `details` and `summary` controls that toggles the visibility of the extra content. Visually, it would look like a button or hyperlink and beneath extra content. As defined by the W3C:

> A disclosure is a button that controls the visibility of a section of content. When the controlled content is hidden, it is often styled as a typical push button with a right-pointing arrow or triangle to hint that activating the button will display additional content. When the content is visible, the arrow or triangle typically points down.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastDisclosure
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastDisclosure()
    );
```

## Usage

```html live
<fast-disclosure appearance="lightweight">
    <strong slot="title">Read about FAST</strong>
    <div>
        FAST is a collection of technologies built on Web Components and modern Web Standards, designed to help you efficiently tackle some of the most common challenges in website and application design and development.
    </div>
</fast-disclosure>
```

## Create your own design

```ts
import {
    Disclosure,
    disclosureTemplate as template,
} from "@microsoft/fast-foundation";
import { disclosureStyles as styles } from "./my-disclosure.styles";

export const myDisclosure = Disclosure.compose({
    baseName: "disclosure",
    template,
    styles,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-disclosure)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/disclosure/disclosure.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#disclosure)