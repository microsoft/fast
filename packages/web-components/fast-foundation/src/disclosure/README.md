---
id: disclosure
title: fast-disclosure
sidebar_label: disclosure
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/disclosure/README.md
description: fast-disclosure is a web component based on disclosure specification.
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

## API



### class: `FASTDisclosure`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name       | Privacy | Type      | Default | Description                                                     | Inherited From |
| ---------- | ------- | --------- | ------- | --------------------------------------------------------------- | -------------- |
| `expanded` | public  | `boolean` | `false` | Determines if the element should show the extra content or not. |                |
| `summary`  | public  | `string`  |         | Invoker title                                                   |                |

#### Methods

| Name       | Privacy   | Description                                       | Parameters | Return | Inherited From |
| ---------- | --------- | ------------------------------------------------- | ---------- | ------ | -------------- |
| `show`     | public    | Show extra content.                               |            | `void` |                |
| `hide`     | public    | Hide extra content.                               |            | `void` |                |
| `toggle`   | public    | Toggle the current(expanded/collapsed) state.     |            | `void` |                |
| `setup`    | protected | Register listener and set default disclosure mode |            | `void` |                |
| `onToggle` | protected | Update the aria attr and fire \`toggle\` event    |            |        |                |

#### Events

| Name     | Type | Description                                      | Inherited From |
| -------- | ---- | ------------------------------------------------ | -------------- |
| `toggle` |      | fires a toggle event when the summary is toggled |                |

#### Attributes

| Name      | Field    | Inherited From |
| --------- | -------- | -------------- |
|           | expanded |                |
| `summary` | summary  |                |

#### CSS Parts

| Name              | Description                                    |
| ----------------- | ---------------------------------------------- |
| `details`         | The outer container element                    |
| `summary`         | The outer \`summary\` container                |
| `summary-content` | The container for the \`summary\` slot content |
| `content`         | The container for the default slot content     |

#### Slots

| Name      | Description                                              |
| --------- | -------------------------------------------------------- |
| `start`   | Content which can be provided before the summary content |
| `end`     | Content which can be provided after the summary content  |
| `summary` | The summary content                                      |
|           | The default slot for the disclosure content              |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-disclosure)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/disclosure/disclosure.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#disclosure)