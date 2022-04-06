---
id: text-area
title: fast-text-area
sidebar_label: text-area
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/text-area/README.md
---

An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. The `fast-text-area` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTextArea
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTextArea()
    );
```

## Usage

```html live
<fast-text-area placeholder="Describe your experience">How was your stay?</fast-text-area>
```

## Create your own design

```ts
import {
    TextArea,
    textAreaTemplate as template,
} from "@microsoft/fast-foundation";
import { textAreaStyles as styles } from "./my-text-area.styles";

export const myTextArea = TextArea.compose({
    baseName: "text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

## API



### class: `TextArea`

#### Superclass

| Name                     | Module                                      | Package |
| ------------------------ | ------------------------------------------- | ------- |
| `FormAssociatedTextArea` | /src/text-area/text-area.form-associated.js |         |

#### Fields

| Name            | Privacy | Type                                                               | Default | Description                                                                                                                                                                                              | Inherited From         |
| --------------- | ------- | ------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `readOnly`      | public  | `boolean`                                                          |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information.              |                        |
| `resize`        | public  | `TextAreaResize or "none" or "both" or "horizontal" or "vertical"` |         |                                                                                                                                                                                                          |                        |
| `autofocus`     | public  | `boolean`                                                          |         |                                                                                                                                                                                                          |                        |
| `formId`        | public  | `string`                                                           |         | The [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global\_attributes/id) of the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form or form} the element is associated to |                        |
| `list`          | public  | `string`                                                           |         | Allows associating a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.           |                        |
| `maxlength`     | public  | `number`                                                           |         |                                                                                                                                                                                                          |                        |
| `minlength`     | public  | `number`                                                           |         |                                                                                                                                                                                                          |                        |
| `name`          | public  | `string`                                                           |         |                                                                                                                                                                                                          |                        |
| `placeholder`   | public  | `string`                                                           |         |                                                                                                                                                                                                          |                        |
| `cols`          | public  | `number`                                                           |         |                                                                                                                                                                                                          |                        |
| `rows`          | public  | `number`                                                           |         |                                                                                                                                                                                                          |                        |
| `spellcheck`    | public  | `boolean`                                                          |         |                                                                                                                                                                                                          |                        |
| `proxy`         |         |                                                                    |         |                                                                                                                                                                                                          | FormAssociatedTextArea |
| `$presentation` | public  | `ComponentPresentation or null`                                    |         |                                                                                                                                                                                                          | FoundationElement      |
| `template`      | public  | `ElementViewTemplate or void or null`                              |         |                                                                                                                                                                                                          | FoundationElement      |
| `styles`        | public  | `ElementStyles or void or null`                                    |         |                                                                                                                                                                                                          | FoundationElement      |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
|               | readOnly    |                |
| `resize`      | resize      |                |
|               | autofocus   |                |
| `form`        | formId      |                |
| `list`        | list        |                |
|               | maxlength   |                |
|               | minlength   |                |
| `name`        | name        |                |
| `placeholder` | placeholder |                |
|               | cols        |                |
|               | rows        |                |
|               | spellcheck  |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-text-area)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-area/text-area.spec.md)