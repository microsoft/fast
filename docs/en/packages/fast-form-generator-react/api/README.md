---
id: index
---


Form
====

This is the form component that takes a JSON schema and generates a UI to edit the data. This can be combined with React components to make editable components.

Components
----------

### `Form`

The `Form` is the root component. It controls:

*   The schema and data passed to the `FormSection`
*   The title and breadcrumbs which are updated based on the `activeSchemaLocation`
*   A list of components to keep track of for navigation

#### Props

*   **schema** (_The schema to be used at the root_)
*   **data** (_The data to map to the form_)
*   **onChange** (_The onChange callback to fire when the data is changed_)
*   **childOptions** (_The options to allow as children_)
*   **config** (_The layout configuration_)

#### State:

*   **schema** (_The current subset of the schema_)
*   **activeSchemaLocation** (_The current schema location -- using lodash location syntax_)
*   **activeDataLocation** (_The current data location -- using lodash location syntax_)
*   **dataCache** (_The dataCache which will store data and use it to match to the component when switching between subschemas_)
*   **titleProps** (_Heading props used for the title of the subsection_)
*   **componentTracker** (_Tracks the components to allow children_)

#### Navigation

##### `onUpdateActiveSection`

The `onUpdateActiveSection` is a callback that takes the `schemaLocation`, `dataLocation` and `schema`. It will update the `componentTracker`, `activeSchemaLocation` and `activeDataLocation`.

##### `componentTracker`

The `componentTracker` keeps track of the `dataLocation`, `schemaLocation` and `schema`. If a user moves into a child element, this adds a new component to be tracked by the component tracker. If the user moves 'up' the tree (via breadcrumbs) all sub items from the section selected will be removed from the `componentTracker`.

### `FormSection`

The `FormSection` is a sub-component of Form. It generates a form element in which the schema given to it will generate form items.

#### Props:

*   **schema** (_The subschema provided by the `Form`_)
*   **data** (_The subdata provided by the `Form`_)
*   **dataLocation** (_The location of the data -- used for onChange, this is always absolute to the root schema passed in `Form`_)
*   **schemaLocation** (_The location of the schema -- this is always relative to the current schema_)
*   **dataCache** (_The cached data passed by the `Form`_)
*   **onChange** (_The onChange callback to fire when the data is changed_)
*   **childOptions** (_The options to allow as `children`_)
*   **onUpdateActiveSection** (_The callback to update the active section_)
*   **untitled** (_The string to use if a section/item/etc lacks text or title_)

#### Navigation - Section links

If the section being viewed has subsections, the links of these will be generated, when clicked they will use the `onUpdateActiveSection` callback to the `Form` to trigger a different section to display, this should get added onto the current active section since we always move one level deeper.

##### Toggling new section links

If the section is an object and the section has optional properties that are also objects, these will generate a toggle to add/remove them.

### `FormItemChildren`

This element displays a dropdown for removing `children`, a list of current `children` and a list of possible `children` that can be added.

### `FormItemArray`

This element displays a dropdown for removing items and a list of current items.

#### Navigation - Array item links

If an array item exists, it will generate a link, click it will call the `onUpdateActiveSection` callback to the `Form` to trigger the subsection of the array to display.

### `FormItemCheckbox`

This element is generated from a type `boolean`.

### `FormItemSelect`

This element is generated from an `enum` of any type.

### `FormItemTextField`

This element is generated from type `string` or `number`.

Configuring the Schema Form
---------------------------

The schema form takes a configuration object with properties that will map to layout controls.

Example:

```
var config = {
    customColor: ['color'],
    alignVertical: ['align']
};
```

See the README for the schema-form-layout component for more details.

Schema Form component mappings to property names
------------------------------------------------

This is the form layout component that maps different form layouts for the schema form to use.

### Custom color

Maps a string value to allow a custom color to be chosen by showing a color picker.

Example:

```
customColor: ['color', 'backgroundColor']
```

### Swatch

Maps a string value to allow a set number of strings that correspond to CSS values by showing swatches.

Example:

```
swatch: ['color']
```

### Align Horizontal

Maps a string value to allow all or a subset of the strings 'left', 'center', 'right' using buttons with glyphs.

Example:

```
alignHorizontal: ['align']
```

### Align Vertical

Maps a string value to allow all or a subset of the strings 'top', 'center', 'bottom' using buttons with glyphs.

Example:

```
alignVertical: ['align']
```

### Theme

Maps a string value to allow all or a subset of the strings 'light', 'dark' using buttons with glyphs.

Example:

```
theme: ['theme']
```

### File upload

Maps a string value to allow a file to be uploaded to a location using an onChange event.

Example:

```
fileUpload: {
    propertyNames: ['align'],
    onChange: function() {
        // do something
    }
}
```

## Index

### External modules

* ["class-name-contracts/form-category.class-name-contracts"](modules/_class_name_contracts_form_category_class_name_contracts_.md)
* ["class-name-contracts/form-item.align-horizontal.class-name-contract"](modules/_class_name_contracts_form_item_align_horizontal_class_name_contract_.md)
* ["class-name-contracts/form-item.align-vertical.class-name-contract"](modules/_class_name_contracts_form_item_align_vertical_class_name_contract_.md)
* ["class-name-contracts/form-item.array.class-name-contract"](modules/_class_name_contracts_form_item_array_class_name_contract_.md)
* ["class-name-contracts/form-item.checkbox.class-name-contract"](modules/_class_name_contracts_form_item_checkbox_class_name_contract_.md)
* ["class-name-contracts/form-item.children.class-name-contract"](modules/_class_name_contracts_form_item_children_class_name_contract_.md)
* ["class-name-contracts/form-item.number-field.class-name-contract"](modules/_class_name_contracts_form_item_number_field_class_name_contract_.md)
* ["class-name-contracts/form-item.section-link.class-name-contract"](modules/_class_name_contracts_form_item_section_link_class_name_contract_.md)
* ["class-name-contracts/form-item.select.class-name-contract"](modules/_class_name_contracts_form_item_select_class_name_contract_.md)
* ["class-name-contracts/form-item.textarea.class-name-contract"](modules/_class_name_contracts_form_item_textarea_class_name_contract_.md)
* ["class-name-contracts/form-item.theme.class-name-contract"](modules/_class_name_contracts_form_item_theme_class_name_contract_.md)
* ["class-name-contracts/form-section.class-name-contract"](modules/_class_name_contracts_form_section_class_name_contract_.md)
* ["class-name-contracts/form.class-name-contract"](modules/_class_name_contracts_form_class_name_contract_.md)
* ["class-name-contracts/index"](modules/_class_name_contracts_index_.md)
* ["form/form"](modules/_form_form_.md)
* ["form/form-category"](modules/_form_form_category_.md)
* ["form/form-category.style"](modules/_form_form_category_style_.md)
* ["form/form-control"](modules/_form_form_control_.md)
* ["form/form-control.props"](modules/_form_form_control_props_.md)
* ["form/form-item"](modules/_form_form_item_.md)
* ["form/form-item.align-horizontal"](modules/_form_form_item_align_horizontal_.md)
* ["form/form-item.align-horizontal.style"](modules/_form_form_item_align_horizontal_style_.md)
* ["form/form-item.align-vertical"](modules/_form_form_item_align_vertical_.md)
* ["form/form-item.align-vertical.style"](modules/_form_form_item_align_vertical_style_.md)
* ["form/form-item.array"](modules/_form_form_item_array_.md)
* ["form/form-item.array.style"](modules/_form_form_item_array_style_.md)
* ["form/form-item.array.utilities"](modules/_form_form_item_array_utilities_.md)
* ["form/form-item.base"](modules/_form_form_item_base_.md)
* ["form/form-item.checkbox"](modules/_form_form_item_checkbox_.md)
* ["form/form-item.checkbox.style"](modules/_form_form_item_checkbox_style_.md)
* ["form/form-item.children"](modules/_form_form_item_children_.md)
* ["form/form-item.children.style"](modules/_form_form_item_children_style_.md)
* ["form/form-item.children.text"](modules/_form_form_item_children_text_.md)
* ["form/form-item.file-upload"](modules/_form_form_item_file_upload_.md)
* ["form/form-item.mapping"](modules/_form_form_item_mapping_.md)
* ["form/form-item.number-field"](modules/_form_form_item_number_field_.md)
* ["form/form-item.number-field.style"](modules/_form_form_item_number_field_style_.md)
* ["form/form-item.section-link"](modules/_form_form_item_section_link_.md)
* ["form/form-item.section-link.style"](modules/_form_form_item_section_link_style_.md)
* ["form/form-item.select"](modules/_form_form_item_select_.md)
* ["form/form-item.select.style"](modules/_form_form_item_select_style_.md)
* ["form/form-item.textarea"](modules/_form_form_item_textarea_.md)
* ["form/form-item.textarea.style"](modules/_form_form_item_textarea_style_.md)
* ["form/form-item.theme"](modules/_form_form_item_theme_.md)
* ["form/form-item.theme.style"](modules/_form_form_item_theme_style_.md)
* ["form/form-item.utilities"](modules/_form_form_item_utilities_.md)
* ["form/form-one-of-any-of"](modules/_form_form_one_of_any_of_.md)
* ["form/form-one-of-any-of.props"](modules/_form_form_one_of_any_of_props_.md)
* ["form/form-one-of-any-of.style"](modules/_form_form_one_of_any_of_style_.md)
* ["form/form-plugin.utilities"](modules/_form_form_plugin_utilities_.md)
* ["form/form-section"](modules/_form_form_section_.md)
* ["form/form-section.props"](modules/_form_form_section_props_.md)
* ["form/form-section.style"](modules/_form_form_section_style_.md)
* ["form/form-section.utilities"](modules/_form_form_section_utilities_.md)
* ["form/form.constants.style"](modules/_form_form_constants_style_.md)
* ["form/form.props"](modules/_form_form_props_.md)
* ["form/form.style"](modules/_form_form_style_.md)
* ["form/form.utilities"](modules/_form_form_utilities_.md)
* ["form/form.utilities.style"](modules/_form_form_utilities_style_.md)
* ["form/index"](modules/_form_index_.md)
* ["form/soft-remove"](modules/_form_soft_remove_.md)
* ["form/sorting"](modules/_form_sorting_.md)
* ["index"](modules/_index_.md)
* ["plugin"](modules/_plugin_.md)

---

