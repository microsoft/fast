---
id: radio
title: fast-radio
sidebar_label: radio
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/radio/README.md
---

An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastRadio
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRadio()
    );
```

### Customizing the indicator

```ts
import {
    provideFASTDesignSystem,
    fastRadio
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRadio({
            checkedIndicator: `...your checked indicator...`
        })
    );
```

## Usage

```html live
<div role="radiogroup" aria-labelledby="fruit" name="favorite-fruit">
    <h3 id="fruit">Favorite fruit:</h3>
    <fast-radio value="apple">Apple</fast-radio>
    <fast-radio value="mango">Mango</fast-radio>
    <fast-radio value="orange">Orange</fast-radio>
</div>
 ```

:::note

For a more ergonomic usage of radios in groups, see [the `fast-radio-group` documentation](/docs/components/radio-group).

:::

## Create your own design

```ts
import {
    Radio,
    RadioOptions,
    radioTemplate as template,
} from "@microsoft/fast-foundation";
import { radioStyles as styles } from "./my-radio.styles";

export const myRadio = Radio.compose<RadioOptions>({
    baseName: "radio",
    template,
    styles,
    checkedIndicator: `...default checked indicator...`,
});
```

## API

## `src/radio/radio.ts`:

### class: `Radio`

#### Superclass

| Name                  | Module                           | Package |
| --------------------- | -------------------------------- | ------- |
| `FormAssociatedRadio` | /src/radio/radio.form-associated |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name            | Privacy | Type                                         | Default  | Description                                                                                                                                                                                       | Inherited From      |
| --------------- | ------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `readOnly`      | public  | `boolean`                                    |          | When true, the control will be immutable by user interaction. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly \| readonly HTML attribute} for more information. |                     |
| `name`          | public  | `string`                                     |          | The name of the radio. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname \| name attribute} for more info.                                              |                     |
| `proxy`         |         |                                              |          |                                                                                                                                                                                                   | FormAssociatedRadio |
| `_presentation` | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                   | FoundationElement   |
| `$presentation` | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                                           | FoundationElement   |
| `template`      | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                        | FoundationElement   |
| `styles`        | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.               | FoundationElement   |

#### Methods

| Name                 | Privacy   | Description | Parameters | Return    | Inherited From    |
| -------------------- | --------- | ----------- | ---------- | --------- | ----------------- |
| `readOnlyChanged`    | private   |             |            | `void`    |                   |
| `isInsideRadioGroup` | private   |             |            | `boolean` |                   |
| `templateChanged`    | protected |             |            | `void`    | FoundationElement |
| `stylesChanged`      | protected |             |            | `void`    | FoundationElement |

#### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `readonly` | readOnly |                |

<hr/>

### Exports

| Kind | Name    | Declaration | Module             | Package |
| ---- | ------- | ----------- | ------------------ | ------- |
| `js` | `Radio` | Radio       | src/radio/radio.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-radio)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio/radio.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#radio)
* [Open UI Analysis](https://open-ui.org/components/radio-button.research)