---
id: anchor
title: fast-anchor
sidebar_label: anchor
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/anchor/README.md
description: fast-anchor is a web component implementation of an anchor element.
---

As defined by the W3C:

> An anchor is a piece of text which marks the beginning and/or the end of a hypertext link.

`fast-anchor` is a web component implementation of an [HTML anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a). The `fast-components` anchor supports the same visual appearances as the button component (accent, lightweight, neutral, outline, stealth) as well as a hypertext appearance for use inline with text.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastAnchor
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastAnchor()
    );
```

## Usage

```html live
<fast-anchor href="https://fast.design" appearance="hypertext">FAST</fast-anchor>
```

## Create your own design

```ts
import {
    Anchor,
    anchorTemplate as template,
} from "@microsoft/fast-foundation";
import { anchorStyles as styles } from "./my-anchor.styles";

export const myAnchor = Anchor.compose({
    baseName: "anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the anchor element rendered into the shadow DOM.
:::

## API



### class: `FASTAnchor`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name             | Privacy | Type                                         | Default | Description                                                                                                                                                               | Inherited From |
| ---------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `download`       | public  | `string`                                     |         | Prompts the user to save the linked URL. See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.          |                |
| `href`           | public  | `string`                                     |         | The URL the hyperlink references. See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                 |                |
| `hreflang`       | public  | `string`                                     |         | Hints at the language of the referenced resource. See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information. |                |
| `ping`           | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   |                |
| `referrerpolicy` | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   |                |
| `rel`            | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   |                |
| `target`         | public  | `"_self" or "_blank" or "_parent" or "_top"` |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   |                |
| `type`           | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   |                |
| `control`        | public  | `HTMLAnchorElement`                          |         | References the root element                                                                                                                                               |                |

#### Attributes

| Name             | Field          | Inherited From |
| ---------------- | -------------- | -------------- |
| `download`       | download       |                |
| `href`           | href           |                |
| `hreflang`       | hreflang       |                |
| `ping`           | ping           |                |
| `referrerpolicy` | referrerpolicy |                |
| `rel`            | rel            |                |
| `target`         | target         |                |
| `type`           | type           |                |

#### CSS Parts

| Name      | Description                         |
| --------- | ----------------------------------- |
| `control` | The anchor element                  |
| `content` | The element wrapping anchor content |

#### Slots

| Name    | Description                                             |
| ------- | ------------------------------------------------------- |
| `start` | Content which can be provided before the anchor content |
| `end`   | Content which can be provided after the anchor content  |
|         | The default slot for anchor content                     |

<hr/>

### class: `DelegatesARIALink`

#### Fields

| Name           | Privacy | Type                                  | Default | Description                                                          | Inherited From |
| -------------- | ------- | ------------------------------------- | ------- | -------------------------------------------------------------------- | -------------- |
| `ariaExpanded` | public  | `"true" or "false" or string or null` |         | See https://www.w3.org/WAI/PF/aria/roles#link for more information |                |

#### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `aria-expanded` | ariaExpanded |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-anchor)