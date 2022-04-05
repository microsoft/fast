---
id: number-field
title: fast-number-field
sidebar_label: number-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/number-field/README.md
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-number-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastNumberField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastNumberField()
    );
```

### Customizing Glyphs

```ts
import {
    provideFASTDesignSystem,
    fastNumberField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastNumberField({
            stepDownGlyph: `...your step down glyph...`,
            stepUpGlyph: `...your setup up glyph...`,
        })
    );
```

## Usage

```html live
<fast-number-field appearance="filled" min="0" max="10"></fast-number-field>
```

## Create your own design

```ts
import {
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { numberFieldStyles as styles } from "./my-number-field.styles";

export const myNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: "number-field",
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
    stepDownGlyph: `...default step down glyph...`,
    stepUpGlyph: `...default setup up glyph...`,
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

## API

## `src/number-field/number-field.ts`:

### class: `NumberField`

#### Superclass

| Name                        | Module                                            | Package |
| --------------------------- | ------------------------------------------------- | ------- |
| `FormAssociatedNumberField` | /src/number-field/number-field.form-associated.js |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name            | Privacy | Type                                  | Default | Description                                                                                                                                                                                                                       | Inherited From            |
| --------------- | ------- | ------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `readOnly`      | public  | `boolean`                             |         | When true, the control will be immutable by user interaction. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly \| readonly HTML attribute} for more information.                                 |                           |
| `autofocus`     | public  | `boolean`                             |         | Indicates that this element should get focus after the page finishes loading. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus \| autofocus HTML attribute} for more information. |                           |
| `hideStep`      | public  | `boolean`                             | `false` | When true, spin buttons will not be rendered                                                                                                                                                                                      |                           |
| `placeholder`   | public  | `string`                              |         | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                                                                          |                           |
| `list`          | public  | `string`                              |         | Allows associating a {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist \| datalist} to the element by {@link https\://developer.mozilla.org/en-US/docs/Web/API/Element/id}.                              |                           |
| `maxlength`     | public  | `number`                              |         | The maximum number of characters a user can enter.                                                                                                                                                                                |                           |
| `minlength`     | public  | `number`                              |         | The minimum number of characters a user can enter.                                                                                                                                                                                |                           |
| `size`          | public  | `number`                              |         | Sets the width of the element to a specified number of characters.                                                                                                                                                                |                           |
| `step`          | public  | `number`                              | `1`     | Amount to increment or decrement the value by                                                                                                                                                                                     |                           |
| `max`           | public  | `number`                              |         | The maximum the value can be                                                                                                                                                                                                      |                           |
| `min`           | public  | `number`                              |         | The minimum the value can be                                                                                                                                                                                                      |                           |
| `valueAsNumber` | public  | `number`                              |         | The value property, typed as a number.                                                                                                                                                                                            |                           |
| `proxy`         |         |                                       |         |                                                                                                                                                                                                                                   | FormAssociatedNumberField |
| `$presentation` | public  | `ComponentPresentation \| null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                                                                           | FoundationElement         |
| `template`      | public  | `ElementViewTemplate \| void \| null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                                                        | FoundationElement         |
| `styles`        | public  | `ElementStyles \| void \| null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.                                               | FoundationElement         |

#### Methods

| Name              | Privacy   | Description                               | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------------------------------------- | ---------- | ------ | ----------------- |
| `stepUp`          | public    | Increments the value using the step value |            | `void` |                   |
| `stepDown`        | public    | Decrements the value using the step value |            | `void` |                   |
| `templateChanged` | protected |                                           |            | `void` | FoundationElement |
| `stylesChanged`   | protected |                                           |            | `void` | FoundationElement |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
|               | autofocus   |                |
| `hide-step`   | hideStep    |                |
| `placeholder` | placeholder |                |
| `list`        | list        |                |
|               | maxlength   |                |
|               | minlength   |                |
|               | size        |                |
|               | step        |                |
|               | max         |                |
|               | min         |                |

<hr/>

### Exports

| Kind | Name          | Declaration | Module                           | Package |
| ---- | ------------- | ----------- | -------------------------------- | ------- |
| `js` | `NumberField` | NumberField | src/number-field/number-field.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-number-field)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/number-field/number-field.spec.md)