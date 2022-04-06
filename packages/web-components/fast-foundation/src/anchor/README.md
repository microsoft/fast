---
id: anchor
title: fast-anchor
sidebar_label: anchor
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/anchor/README.md
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

## `src/anchor/anchor.ts`:

### class: `Anchor`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name             | Privacy | Type                                         | Default | Description                                                                                                                                                                         | Inherited From    |
| ---------------- | ------- | -------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `download`       | public  | `string`                                     |         | Prompts the user to save the linked URL. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.             |                   |
| `href`           | public  | `string`                                     |         | The URL the hyperlink references. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.                    |                   |
| `hreflang`       | public  | `string`                                     |         | Hints at the language of the referenced resource. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.    |                   |
| `ping`           | public  | `string`                                     |         | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.                                                      |                   |
| `referrerpolicy` | public  | `string`                                     |         | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.                                                      |                   |
| `rel`            | public  | `string`                                     |         | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.                                                      |                   |
| `target`         | public  | `"_self" \| "_blank" \| "_parent" \| "_top"` |         | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.                                                      |                   |
| `type`           | public  | `string`                                     |         | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| `<a>` element } for more information.                                                      |                   |
| `control`        | public  | `HTMLAnchorElement`                          |         | References the root element                                                                                                                                                         |                   |
| `$presentation`  | public  | `ComponentPresentation \| null`              |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`       | public  | `ElementViewTemplate \| void \| null`        |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`         | public  | `ElementStyles \| void \| null`              |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

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

<hr/>

### class: `DelegatesARIALink`

#### Fields

| Name           | Privacy | Type                             | Default | Description                                                                  | Inherited From |
| -------------- | ------- | -------------------------------- | ------- | ---------------------------------------------------------------------------- | -------------- |
| `ariaExpanded` | public  | `"true" \| "false" \| undefined` |         | See {@link https\://www\.w3.org/WAI/PF/aria/roles#link} for more information |                |

#### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `aria-expanded` | ariaExpanded |                |

<hr/>

### Exports

| Kind | Name                | Declaration       | Module               | Package |
| ---- | ------------------- | ----------------- | -------------------- | ------- |
| `js` | `Anchor`            | Anchor            | src/anchor/anchor.ts |         |
| `js` | `DelegatesARIALink` | DelegatesARIALink | src/anchor/anchor.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-anchor)