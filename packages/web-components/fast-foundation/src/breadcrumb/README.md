---
id: breadcrumb
title: fast-breadcrumb
sidebar_label: breadcrumb
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/breadcrumb/README.md
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#breadcrumb):

> A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order. It helps users find their place within a website or web application. Breadcrumbs are often placed horizontally before a page's main content.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastBreadcrumb,
    fastBreadcrumbItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastBreadcrumb(),
        fastBreadcrumbItem()
    );
```

### Custom Separator

```ts
import {
    provideFASTDesignSystem,
    fastBreadcrumb,
    fastBreadcrumbItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastBreadcrumb(),
        fastBreadcrumbItem({
            separator: " -> "
        })
    );
```

## Usage

```html live
<fast-breadcrumb>
    <fast-breadcrumb-item href="#">Breadcrumb item 1</fast-breadcrumb-item>
    <fast-breadcrumb-item href="#">Breadcrumb item 2</fast-breadcrumb-item>
    <fast-breadcrumb-item >Breadcrumb item 3</fast-breadcrumb-item>
</fast-breadcrumb>
```

## Create your own design

### Breadcrumb

```ts
import { Breadcrumb, breadcrumbTemplate as template } from "@microsoft/fast-foundation";
import { breadcrumbStyles as styles } from "./my-breadcrumb.styles";

export const myBreadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template,
    styles,
});
```

### Breadcrumb Item

```ts
import {
    BreadcrumbItem,
    BreadcrumbItemOptions,
    breadcrumbItemTemplate as template,
} from "@microsoft/fast-foundation";
import { breadcrumbItemStyles as styles } from "./my-breadcrumb-item.styles";

export const myBreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: "breadcrumb-item",
    template,
    styles,
    separator: "/",
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the anchor element rendered into the shadow DOM.
:::

## API

## `src/breadcrumb/breadcrumb.ts`:

### class: `Breadcrumb`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name            | Privacy | Type                                         | Default  | Description                                                                                                                                                                         | Inherited From    |
| --------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `_presentation` | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                     | FoundationElement |
| `$presentation` | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`      | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`        | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                            | Privacy   | Description                                                                                                                                                  | Parameters              | Return | Inherited From    |
| ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ------ | ----------------- |
| `slottedBreadcrumbItemsChanged` | public    |                                                                                                                                                              |                         |        |                   |
| `setItemSeparator`              | private   |                                                                                                                                                              | `lastNode: HTMLElement` | `void` |                   |
| `setLastItemAriaCurrent`        | private   | If child node with an anchor tag and with href is found then apply aria-current to child node otherwise apply aria-current to the host element, with an href | `lastNode: HTMLElement` | `void` |                   |
| `templateChanged`               | protected |                                                                                                                                                              |                         | `void` | FoundationElement |
| `stylesChanged`                 | protected |                                                                                                                                                              |                         | `void` | FoundationElement |

<hr/>

### Exports

| Kind | Name         | Declaration | Module                       | Package |
| ---- | ------------ | ----------- | ---------------------------- | ------- |
| `js` | `Breadcrumb` | Breadcrumb  | src/breadcrumb/breadcrumb.ts |         |

## `src/breadcrumb-item/breadcrumb-item.ts`:

### class: `BreadcrumbItem`

#### Superclass

| Name     | Module      | Package |
| -------- | ----------- | ------- |
| `Anchor` | /src/anchor |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name                              | Privacy | Type                                         | Default  | Description                                                                                                                                                                                                             | Inherited From    |
| --------------------------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `download`                        | public  | `string`                                     |          | Prompts the user to save the linked URL. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                         | Anchor            |
| `href`                            | public  | `string`                                     |          | The URL the hyperlink references. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                                | Anchor            |
| `hreflang`                        | public  | `string`                                     |          | Hints at the language of the referenced resource. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                | Anchor            |
| `ping`                            | public  | `string`                                     |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                                                                  | Anchor            |
| `referrerpolicy`                  | public  | `string`                                     |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                                                                  | Anchor            |
| `rel`                             | public  | `string`                                     |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                                                                  | Anchor            |
| `target`                          | public  | `"_self" \| "_blank" \| "_parent" \| "_top"` |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                                                                  | Anchor            |
| `type`                            | public  | `string`                                     |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \| \&lt;a\&gt; element } for more information.                                                                                                  | Anchor            |
| `control`                         | public  | `HTMLAnchorElement`                          |          | References the root element                                                                                                                                                                                             | Anchor            |
| `handleUnsupportedDelegatesFocus` | private |                                              |          | Overrides the focus call for where delegatesFocus is unsupported. This check works for Chrome, Edge Chromium, FireFox, and Safari Relevant PR on the Firefox browser: https\://phabricator.services.mozilla.com/D123858 | Anchor            |
| `_presentation`                   | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                                         | FoundationElement |
| `$presentation`                   | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                                                                 | FoundationElement |
| `template`                        | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                                              | FoundationElement |
| `styles`                          | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.                                     | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name             | Field          | Inherited From |
| ---------------- | -------------- | -------------- |
| `download`       | download       | Anchor         |
| `href`           | href           | Anchor         |
| `hreflang`       | hreflang       | Anchor         |
| `ping`           | ping           | Anchor         |
| `referrerpolicy` | referrerpolicy | Anchor         |
| `rel`            | rel            | Anchor         |
| `target`         | target         | Anchor         |
| `type`           | type           | Anchor         |

<hr/>

### Exports

| Kind | Name             | Declaration    | Module                                 | Package |
| ---- | ---------------- | -------------- | -------------------------------------- | ------- |
| `js` | `BreadcrumbItem` | BreadcrumbItem | src/breadcrumb-item/breadcrumb-item.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-breadcrumb)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/breadcrumb/breadcrumb.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#breadcrumb)
* [Open UI Analysis](https://open-ui.org/components/Breadcrumb)