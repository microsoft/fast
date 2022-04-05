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

## `src/text-area/text-area.ts`:

### class: `TextArea`

#### Superclass

| Name                     | Module                                      | Package |
| ------------------------ | ------------------------------------------- | ------- |
| `FormAssociatedTextArea` | /src/text-area/text-area.form-associated.js |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name            | Privacy | Type                                                               | Default | Description                                                                                                                                                                                                    | Inherited From         |
| --------------- | ------- | ------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `readOnly`      | public  | `boolean`                                                          |         | When true, the control will be immutable by user interaction. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly \| readonly HTML attribute} for more information.              |                        |
| `resize`        | public  | `TextAreaResize \| "none" \| "both" \| "horizontal" \| "vertical"` |         | The resize mode of the element.                                                                                                                                                                                |                        |
| `autofocus`     | public  | `boolean`                                                          |         | Indicates that this element should get focus after the page finishes loading.                                                                                                                                  |                        |
| `formId`        | public  | `string`                                                           |         | The {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Global\_attributes/id \| id} of the {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \| form} the element is associated to |                        |
| `list`          | public  | `string`                                                           |         | Allows associating a {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist \| datalist} to the element by {@link https\://developer.mozilla.org/en-US/docs/Web/API/Element/id}.           |                        |
| `maxlength`     | public  | `number`                                                           |         | The maximum number of characters a user can enter.                                                                                                                                                             |                        |
| `minlength`     | public  | `number`                                                           |         | The minimum number of characters a user can enter.                                                                                                                                                             |                        |
| `name`          | public  | `string`                                                           |         | The name of the element.                                                                                                                                                                                       |                        |
| `placeholder`   | public  | `string`                                                           |         | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                                                       |                        |
| `cols`          | public  | `number`                                                           | `20`    | Sizes the element horizontally by a number of character columns.                                                                                                                                               |                        |
| `rows`          | public  | `number`                                                           |         | Sizes the element vertically by a number of character rows.                                                                                                                                                    |                        |
| `spellcheck`    | public  | `boolean`                                                          |         | Sets if the element is eligible for spell checking but the UA.                                                                                                                                                 |                        |
| `proxy`         |         |                                                                    |         |                                                                                                                                                                                                                | FormAssociatedTextArea |
| `$presentation` | public  | `ComponentPresentation \| null`                                    |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                                                        | FoundationElement      |
| `template`      | public  | `ElementViewTemplate \| void \| null`                              |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                                     | FoundationElement      |
| `styles`        | public  | `ElementStyles \| void \| null`                                    |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.                            | FoundationElement      |

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

### Exports

| Kind | Name             | Declaration    | Module                     | Package |
| ---- | ---------------- | -------------- | -------------------------- | ------- |
| `js` | `TextAreaResize` | TextAreaResize | src/text-area/text-area.ts |         |
| `js` | `TextArea`       | TextArea       | src/text-area/text-area.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-text-area)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-area/text-area.spec.md)