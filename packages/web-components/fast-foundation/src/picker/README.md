<!-- ---
id: text-field
title: fast-text-field
sidebar_label: text-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/text-field/README.md
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-text-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.



:::note
This component filters out slotted _text_ nodes that are only white space to properly hide the label when the label is not in use.
:::
## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-text-field appearance="filled" placeholder="user@email.com">Email</fast-text-field>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TextFieldTemplate as template, TextField } from "@microsoft/fast-foundation";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "fast-text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextField extends TextField {}
``` -->

## API

## `src/picker/picker-list-item.ts`:

### class: `PickerListItem`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name               | Privacy | Type                                         | Default  | Description                                                                                                                                                                         | Inherited From    |
| ------------------ | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `value`            | public  | `string`                                     |          | The underlying string value of the item                                                                                                                                             |                   |
| `contentsTemplate` | public  | `ViewTemplate`                               |          | The template used to render the contents of the list item                                                                                                                           |                   |
| `customView`       | private | `HTMLView \| undefined`                      |          |                                                                                                                                                                                     |                   |
| `_presentation`    | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                     | FoundationElement |
| `$presentation`    | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`         | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`           | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                      | Privacy   | Description | Parameters         | Return    | Inherited From    |
| ------------------------- | --------- | ----------- | ------------------ | --------- | ----------------- |
| `contentsTemplateChanged` | private   |             |                    | `void`    |                   |
| `handleKeyDown`           | public    |             | `e: KeyboardEvent` | `boolean` |                   |
| `handleClick`             | public    |             | `e: MouseEvent`    | `boolean` |                   |
| `handleInvoke`            | private   |             |                    | `void`    |                   |
| `updateView`              | private   |             |                    | `void`    |                   |
| `disconnectView`          | private   |             |                    | `void`    |                   |
| `templateChanged`         | protected |             |                    | `void`    | FoundationElement |
| `stylesChanged`           | protected |             |                    | `void`    | FoundationElement |

#### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `value` | value |                |

<hr/>

### Exports

| Kind | Name             | Declaration    | Module                         | Package |
| ---- | ---------------- | -------------- | ------------------------------ | ------- |
| `js` | `PickerListItem` | PickerListItem | src/picker/picker-list-item.ts |         |

## `src/picker/picker-list.ts`:

### class: `PickerList`

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

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

<hr/>

### Exports

| Kind | Name         | Declaration | Module                    | Package |
| ---- | ------------ | ----------- | ------------------------- | ------- |
| `js` | `PickerList` | PickerList  | src/picker/picker-list.ts |         |

## `src/picker/picker-menu-option.ts`:

### class: `PickerMenuOption`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name               | Privacy | Type                                         | Default  | Description                                                                                                                                                                         | Inherited From    |
| ------------------ | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `value`            | public  | `string`                                     |          | The underlying string value of the item                                                                                                                                             |                   |
| `contentsTemplate` | public  | `ViewTemplate`                               |          | The template used to render the contents of the list item                                                                                                                           |                   |
| `customView`       | private | `HTMLView \| undefined`                      |          |                                                                                                                                                                                     |                   |
| `_presentation`    | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                     | FoundationElement |
| `$presentation`    | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`         | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`           | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                      | Privacy   | Description | Parameters      | Return    | Inherited From    |
| ------------------------- | --------- | ----------- | --------------- | --------- | ----------------- |
| `contentsTemplateChanged` | private   |             |                 | `void`    |                   |
| `handleClick`             | public    |             | `e: MouseEvent` | `boolean` |                   |
| `handleInvoked`           | private   |             |                 | `void`    |                   |
| `updateView`              | private   |             |                 | `void`    |                   |
| `disconnectView`          | private   |             |                 | `void`    |                   |
| `templateChanged`         | protected |             |                 | `void`    | FoundationElement |
| `stylesChanged`           | protected |             |                 | `void`    | FoundationElement |

#### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `value` | value |                |

<hr/>

### Exports

| Kind | Name               | Declaration      | Module                           | Package |
| ---- | ------------------ | ---------------- | -------------------------------- | ------- |
| `js` | `PickerMenuOption` | PickerMenuOption | src/picker/picker-menu-option.ts |         |

## `src/picker/picker-menu.ts`:

### class: `PickerMenu`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name                       | Privacy | Type                                         | Default  | Description                                                                                                                                                                         | Inherited From    |
| -------------------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `suggestionsAvailableText` | public  | `string`                                     |          | Text to display to assistive technology when suggestions are available                                                                                                              |                   |
| `_presentation`            | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                     | FoundationElement |
| `$presentation`            | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`                 | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`                   | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                    | Privacy   | Description | Parameters                    | Return | Inherited From    |
| ----------------------- | --------- | ----------- | ----------------------------- | ------ | ----------------- |
| `menuElementsChanged`   | public    |             |                               | `void` |                   |
| `headerElementsChanged` | public    |             |                               | `void` |                   |
| `footerElementsChanged` | public    |             |                               | `void` |                   |
| `updateOptions`         | private   |             |                               | `void` |                   |
| `addSlottedListItems`   | private   |             | `slotChildren: HTMLElement[]` |        |                   |
| `templateChanged`       | protected |             |                               | `void` | FoundationElement |
| `stylesChanged`         | protected |             |                               | `void` | FoundationElement |

<hr/>

### Exports

| Kind | Name         | Declaration | Module                    | Package |
| ---- | ------------ | ----------- | ------------------------- | ------- |
| `js` | `PickerMenu` | PickerMenu  | src/picker/picker-menu.ts |         |

## `src/picker/picker.ts`:

### class: `Picker`

#### Superclass

| Name                   | Module                             | Package |
| ---------------------- | ---------------------------------- | ------- |
| `FormAssociatedPicker` | /src/picker/picker.form-associated |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name                         | Privacy | Type                                         | Default                                                                                                                                                                                                                                         | Description                                                                                                                                                                         | Inherited From       |
| ---------------------------- | ------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `selection`                  | public  | `string`                                     | `""`                                                                                                                                                                                                                                            | Currently selected items. Comma delineated string ie. "apples,oranges".                                                                                                             |                      |
| `options`                    | public  | `string`                                     |                                                                                                                                                                                                                                                 | Currently available options. Comma delineated string ie. "apples,oranges".                                                                                                          |                      |
| `filterSelected`             | public  | `boolean`                                    | `true`                                                                                                                                                                                                                                          | Whether the component should remove an option from the list when it is in the selection                                                                                             |                      |
| `filterQuery`                | public  | `boolean`                                    | `true`                                                                                                                                                                                                                                          | Whether the component should remove options based on the current query                                                                                                              |                      |
| `maxSelected`                | public  | `number \| undefined`                        |                                                                                                                                                                                                                                                 | The maximum number of items that can be selected.                                                                                                                                   |                      |
| `noSuggestionsText`          | public  | `string`                                     | `"No suggestions available"`                                                                                                                                                                                                                    | The text to present to assistive technolgies when no suggestions are available.                                                                                                     |                      |
| `suggestionsAvailableText`   | public  | `string`                                     | `"Suggestions available"`                                                                                                                                                                                                                       | The text to present to assistive technolgies when suggestions are available.                                                                                                        |                      |
| `loadingText`                | public  | `string`                                     | `"Loading suggestions"`                                                                                                                                                                                                                         | The text to present to assistive technologies when suggestions are loading.                                                                                                         |                      |
| `label`                      | public  | `string`                                     |                                                                                                                                                                                                                                                 | Applied to the aria-label attribute of the input element                                                                                                                            |                      |
| `labelledBy`                 | public  | `string`                                     |                                                                                                                                                                                                                                                 | Applied to the aria-labelledby attribute of the input element                                                                                                                       |                      |
| `placeholder`                | public  | `string`                                     |                                                                                                                                                                                                                                                 | Applied to the placeholder attribute of the input element                                                                                                                           |                      |
| `menuPlacement`              | public  | `menuConfigs`                                | `"bottom-fill"`                                                                                                                                                                                                                                 | Controls menu placement                                                                                                                                                             |                      |
| `showLoading`                | public  | `boolean`                                    | `false`                                                                                                                                                                                                                                         | Whether to display a loading state if the menu is opened.                                                                                                                           |                      |
| `listItemTemplate`           | public  | `ViewTemplate`                               |                                                                                                                                                                                                                                                 | Template used to generate selected items. This is used in a repeat directive.                                                                                                       |                      |
| `defaultListItemTemplate`    | public  | `ViewTemplate \| undefined`                  |                                                                                                                                                                                                                                                 | Default template to use for selected items (usually specified in the component template). This is used in a repeat directive.                                                       |                      |
| `menuOptionTemplate`         | public  | `ViewTemplate`                               |                                                                                                                                                                                                                                                 | Template to use for available options. This is used in a repeat directive.                                                                                                          |                      |
| `defaultMenuOptionTemplate`  | public  | `ViewTemplate \| undefined`                  |                                                                                                                                                                                                                                                 | Default template to use for available options (usually specified in the template). This is used in a repeat directive.                                                              |                      |
| `listItemContentsTemplate`   | public  | `ViewTemplate`                               |                                                                                                                                                                                                                                                 | Template to use for the contents of a selected list item                                                                                                                            |                      |
| `menuOptionContentsTemplate` | public  | `ViewTemplate`                               |                                                                                                                                                                                                                                                 | Template to use for the contents of menu options                                                                                                                                    |                      |
| `optionsList`                | public  | `string[]`                                   | `[]`                                                                                                                                                                                                                                            | Current list of options in array form                                                                                                                                               |                      |
| `query`                      | public  | `string`                                     |                                                                                                                                                                                                                                                 | The text value currently in the input field                                                                                                                                         |                      |
| `itemsPlaceholderElement`    | public  | `Node`                                       |                                                                                                                                                                                                                                                 | Reference to the placeholder element for the repeat directive                                                                                                                       |                      |
| `itemsRepeatBehavior`        | private | `RepeatBehavior \| null`                     |                                                                                                                                                                                                                                                 |                                                                                                                                                                                     |                      |
| `optionsRepeatBehavior`      | private | `RepeatBehavior \| null`                     |                                                                                                                                                                                                                                                 |                                                                                                                                                                                     |                      |
| `optionsPlaceholder`         | private | `Node`                                       |                                                                                                                                                                                                                                                 |                                                                                                                                                                                     |                      |
| `inputElementView`           | private | `HTMLView \| null`                           | `null`                                                                                                                                                                                                                                          |                                                                                                                                                                                     |                      |
| `handleTextInput`            | private |                                              |                                                                                                                                                                                                                                                 | Handle input event from input element                                                                                                                                               |                      |
| `handleInputClick`           | private |                                              |                                                                                                                                                                                                                                                 | Handle click event from input element                                                                                                                                               |                      |
| `setRegionProps`             | private |                                              |                                                                                                                                                                                                                                                 | Sets properties on the anchored region once it is instanciated.                                                                                                                     |                      |
| `configLookup`               | private | `object`                                     | `{
        top: FlyoutPosTop,
        bottom: FlyoutPosBottom,
        tallest: FlyoutPosTallest,
        "top-fill": FlyoutPosTopFill,
        "bottom-fill": FlyoutPosBottomFill,
        "tallest-fill": FlyoutPosTallestFill,
    }` | matches menu placement values with the associated menu config                                                                                                                       |                      |
| `proxy`                      |         |                                              |                                                                                                                                                                                                                                                 |                                                                                                                                                                                     | FormAssociatedPicker |
| `_presentation`              | private | `ComponentPresentation \| null \| undefined` | `void 0`                                                                                                                                                                                                                                        |                                                                                                                                                                                     | FoundationElement    |
| `$presentation`              | public  | `ComponentPresentation \| null`              |                                                                                                                                                                                                                                                 | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement    |
| `template`                   | public  | `ElementViewTemplate \| void \| null`        |                                                                                                                                                                                                                                                 | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement    |
| `styles`                     | public  | `ElementStyles \| void \| null`              |                                                                                                                                                                                                                                                 | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement    |

#### Methods

| Name                               | Privacy   | Description                                                                                        | Parameters            | Return    | Inherited From    |
| ---------------------------------- | --------- | -------------------------------------------------------------------------------------------------- | --------------------- | --------- | ----------------- |
| `selectionChanged`                 | private   |                                                                                                    |                       | `void`    |                   |
| `optionsChanged`                   | private   |                                                                                                    |                       | `void`    |                   |
| `menuPlacementChanged`             | private   |                                                                                                    |                       | `void`    |                   |
| `showLoadingChanged`               | private   |                                                                                                    |                       | `void`    |                   |
| `listItemTemplateChanged`          | private   |                                                                                                    |                       | `void`    |                   |
| `defaultListItemTemplateChanged`   | private   |                                                                                                    |                       | `void`    |                   |
| `menuOptionTemplateChanged`        | private   |                                                                                                    |                       | `void`    |                   |
| `defaultMenuOptionTemplateChanged` | private   |                                                                                                    |                       | `void`    |                   |
| `optionsListChanged`               | private   |                                                                                                    |                       | `void`    |                   |
| `queryChanged`                     | private   |                                                                                                    |                       | `void`    |                   |
| `filteredOptionsListChanged`       | private   |                                                                                                    |                       | `void`    |                   |
| `flyoutOpenChanged`                | private   |                                                                                                    |                       | `void`    |                   |
| `showNoOptionsChanged`             | private   |                                                                                                    |                       | `void`    |                   |
| `focus`                            | public    | Move focus to the input element                                                                    |                       |           |                   |
| `initialize`                       | private   | Initialize the component.  This is delayed a frame to ensure children are connected as well.       |                       | `void`    |                   |
| `toggleFlyout`                     | private   | Toggles the menu flyout                                                                            | `open: boolean`       | `void`    |                   |
| `handleMenuOptionsUpdated`         | private   | Handle the menu options updated event from the child menu                                          | `e: Event`            | `void`    |                   |
| `handleKeyDown`                    | public    | Handle key down events.                                                                            | `e: KeyboardEvent`    | `boolean` |                   |
| `handleFocusIn`                    | public    | Handle focus in events.                                                                            | `e: FocusEvent`       | `boolean` |                   |
| `handleFocusOut`                   | public    | Handle focus out events.                                                                           | `e: FocusEvent`       | `boolean` |                   |
| `handleSelectionChange`            | public    | The list of selected items has changed                                                             |                       | `void`    |                   |
| `handleRegionLoaded`               | public    | Anchored region is loaded, menu and options exist in the DOM.                                      | `e: Event`            | `void`    |                   |
| `checkMaxItems`                    | private   | Checks if the maximum number of items has been chosen and updates the ui.                          |                       | `void`    |                   |
| `handleItemInvoke`                 | public    | A list item has been invoked.                                                                      | `e: Event`            | `boolean` |                   |
| `handleOptionInvoke`               | public    | A menu option has been invoked.                                                                    | `e: Event`            | `boolean` |                   |
| `incrementFocusedItem`             | private   | Increments the focused list item by the specified amount                                           | `increment: number`   |           |                   |
| `disableMenu`                      | private   | Disables the menu. Note that the menu can be open, just doens't have any valid options on display. |                       | `void`    |                   |
| `setFocusedOption`                 | private   | Sets the currently focused menu option by index                                                    | `optionIndex: number` | `void`    |                   |
| `updateListItemTemplate`           | private   | Updates the template used for the list item repeat behavior                                        |                       | `void`    |                   |
| `updateOptionTemplate`             | private   | Updates the template used for the menu option repeat behavior                                      |                       | `void`    |                   |
| `updateFilteredOptions`            | private   | Updates the filtered options array                                                                 |                       | `void`    |                   |
| `updateMenuConfig`                 | private   | Updates the menu configuration                                                                     |                       | `void`    |                   |
| `templateChanged`                  | protected |                                                                                                    |                       | `void`    | FoundationElement |
| `stylesChanged`                    | protected |                                                                                                    |                       | `void`    | FoundationElement |

#### Attributes

| Name                         | Field                    | Inherited From |
| ---------------------------- | ------------------------ | -------------- |
| `selection`                  | selection                |                |
| `options`                    | options                  |                |
| `filter-selected`            | filterSelected           |                |
| `filter-query`               | filterQuery              |                |
| `max-selected`               | maxSelected              |                |
| `no-suggestions-text`        | noSuggestionsText        |                |
| `suggestions-available-text` | suggestionsAvailableText |                |
| `loading-text`               | loadingText              |                |
| `label`                      | label                    |                |
| `labelledby`                 | labelledBy               |                |
| `placeholder`                | placeholder              |                |
| `menu-placement`             | menuPlacement            |                |

<hr/>

### Exports

| Kind | Name     | Declaration | Module               | Package |
| ---- | -------- | ----------- | -------------------- | ------- |
| `js` | `Picker` | Picker      | src/picker/picker.ts |         |


I