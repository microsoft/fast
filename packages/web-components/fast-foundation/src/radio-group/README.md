---
id: radio-group
title: fast-radio-group
sidebar_label: radio-group
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/radio-group/README.md
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#radiobutton):

> A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time. Some implementations may initialize the set with all buttons in the unchecked state in order to force the user to check one of the buttons before moving past a certain point in the workflow.

While any DOM content is permissible as a child of the radiogroup, only `fast-radio`'s and slotted content with a role of `radio` will receive keyboard support.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastRadio,
    fastRadioGroup
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRadio(),
        fastRadioGroup()
    );
```

## Usage

```html live
<fast-radio-group value="mango" name="favorite-fruit">
    <fast-radio value="apple">Apple</fast-radio>
    <fast-radio value="mango">Mango</fast-radio>
    <fast-radio value="orange">Orange</fast-radio>
</fast-radio-group>
```

## Create your own design

```ts
import { RadioGroup, radioGroupTemplate as template } from "@microsoft/fast-foundation";
import { radioGroupStyles as styles } from "./my-radio-group.styles";

export const myRadioGroup = RadioGroup.compose({
    baseName: "radio-group",
    template,
    styles,
});
```

## API

### `src/radio-group/radio-group.template.ts`:

#### Functions

| Name                 | Description                                                                   | Parameters            | Return |
| -------------------- | ----------------------------------------------------------------------------- | --------------------- | ------ |
| `radioGroupTemplate` | The template for the {@link @microsoft/fast-foundation#RadioGroup} component. | `context, definition` |        |

<hr/>

#### Exports

| Kind | Name                 | Declaration        | Module                                  | Package |
| ---- | -------------------- | ------------------ | --------------------------------------- | ------- |
| `js` | `radioGroupTemplate` | radioGroupTemplate | src/radio-group/radio-group.template.ts |         |

### `src/radio-group/radio-group.ts`:

#### class: `RadioGroup`

##### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

##### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

##### Fields

| Name                           | Privacy | Type                                         | Default  | Description                                                                                                                                                                                            | Inherited From    |
| ------------------------------ | ------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `readOnly`                     | public  | `boolean`                                    |          | When true, the child radios will be immutable by user interaction. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly \| readonly HTML attribute} for more information. |                   |
| `disabled`                     | public  | `boolean`                                    |          | Disables the radio group and child radios.                                                                                                                                                             |                   |
| `name`                         | public  | `string`                                     |          | The name of the radio group. Setting this value will set the name value&#xD;&#xA;for all child radio elements.                                                                                         |                   |
| `value`                        | public  | `string`                                     |          | The value of the checked radio                                                                                                                                                                         |                   |
| `orientation`                  | public  | `Orientation \| "horizontal" \| "vertical"`  |          | The orientation of the group                                                                                                                                                                           |                   |
| `childItems`                   | public  | `HTMLElement[]`                              |          |                                                                                                                                                                                                        |                   |
| `selectedRadio`                | private | `HTMLInputElement \| null`                   |          |                                                                                                                                                                                                        |                   |
| `focusedRadio`                 | private | `HTMLInputElement \| null`                   |          |                                                                                                                                                                                                        |                   |
| `direction`                    | private | `Direction`                                  |          |                                                                                                                                                                                                        |                   |
| `parentToolbar`                | private | `HTMLElement \| null`                        |          |                                                                                                                                                                                                        |                   |
| `isInsideToolbar`              | private | `boolean`                                    |          |                                                                                                                                                                                                        |                   |
| `isInsideFoundationToolbar`    | private | `boolean`                                    |          |                                                                                                                                                                                                        |                   |
| `radioChangeHandler`           | private |                                              |          |                                                                                                                                                                                                        |                   |
| `moveToRadioByIndex`           | private |                                              |          |                                                                                                                                                                                                        |                   |
| `moveRightOffGroup`            | private |                                              |          |                                                                                                                                                                                                        |                   |
| `moveLeftOffGroup`             | private |                                              |          |                                                                                                                                                                                                        |                   |
| `shouldMoveOffGroupToTheRight` | private |                                              |          |                                                                                                                                                                                                        |                   |
| `shouldMoveOffGroupToTheLeft`  | private |                                              |          |                                                                                                                                                                                                        |                   |
| `checkFocusedRadio`            | private |                                              |          |                                                                                                                                                                                                        |                   |
| `moveRight`                    | private |                                              |          |                                                                                                                                                                                                        |                   |
| `moveLeft`                     | private |                                              |          |                                                                                                                                                                                                        |                   |
| `_presentation`                | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                        | FoundationElement |
| `$presentation`                | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                       | FoundationElement |
| `template`                     | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.           | FoundationElement |
| `styles`                       | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition.  | FoundationElement |

##### Methods

| Name                         | Privacy   | Description | Parameters                                   | Return | Inherited From    |
| ---------------------------- | --------- | ----------- | -------------------------------------------- | ------ | ----------------- |
| `readOnlyChanged`            | private   |             |                                              | `void` |                   |
| `disabledChanged`            | private   |             |                                              | `void` |                   |
| `nameChanged`                | protected |             |                                              | `void` |                   |
| `valueChanged`               | protected |             |                                              | `void` |                   |
| `slottedRadioButtonsChanged` | private   |             | `oldValue: unknown, newValue: HTMLElement[]` | `void` |                   |
| `setupRadioButtons`          | private   |             |                                              | `void` |                   |
| `templateChanged`            | protected |             |                                              | `void` | FoundationElement |
| `stylesChanged`              | protected |             |                                              | `void` | FoundationElement |

##### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
| `disabled`    | disabled    |                |
| `name`        | name        |                |
| `value`       | value       |                |
| `orientation` | orientation |                |

<hr/>

#### Exports

| Kind | Name         | Declaration | Module                         | Package |
| ---- | ------------ | ----------- | ------------------------------ | ------- |
| `js` | `RadioGroup` | RadioGroup  | src/radio-group/radio-group.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-radio-group)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio-group/radio-group.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#radiogroup)
* [Open UI Analysis](https://open-ui.org/components/radio-button.research)