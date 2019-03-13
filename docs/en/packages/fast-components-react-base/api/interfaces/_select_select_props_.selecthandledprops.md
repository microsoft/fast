[@microsoft/fast-components-react-base](../README.md) > ["select/select.props"](../modules/_select_select_props_.md) > [SelectHandledProps](../interfaces/_select_select_props_.selecthandledprops.md)

# Interface: SelectHandledProps

## Hierarchy

↳  [SelectManagedClasses](_select_select_props_.selectmanagedclasses.md)

**↳ SelectHandledProps**

## Index

### Properties

* [autoFocus](_select_select_props_.selecthandledprops.md#autofocus)
* [defaultSelection](_select_select_props_.selecthandledprops.md#defaultselection)
* [disabled](_select_select_props_.selecthandledprops.md#disabled)
* [displayStringFormatter](_select_select_props_.selecthandledprops.md#displaystringformatter)
* [form](_select_select_props_.selecthandledprops.md#form)
* [isMenuOpen](_select_select_props_.selecthandledprops.md#ismenuopen)
* [labelledBy](_select_select_props_.selecthandledprops.md#labelledby)
* [managedClasses](_select_select_props_.selecthandledprops.md#managedclasses)
* [multiselectable](_select_select_props_.selecthandledprops.md#multiselectable)
* [name](_select_select_props_.selecthandledprops.md#name)
* [onValueChange](_select_select_props_.selecthandledprops.md#onvaluechange)
* [placeholder](_select_select_props_.selecthandledprops.md#placeholder)
* [required](_select_select_props_.selecthandledprops.md#required)
* [selectedItems](_select_select_props_.selecthandledprops.md#selecteditems)
* [trigger](_select_select_props_.selecthandledprops.md#trigger)

---

## Properties

<a id="autofocus"></a>

### `<Optional>` autoFocus

**● autoFocus**: *`boolean`*

*Defined in [select/select.props.ts:86](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L86)*

Whether a listitem should automatically get focus when this component is mounted (multi-select only)

___
<a id="defaultselection"></a>

### `<Optional>` defaultSelection

**● defaultSelection**: *`string`[] \| [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[]*

*Defined in [select/select.props.ts:36](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L36)*

Id's that are initially selected

___
<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: *`boolean`*

*Defined in [select/select.props.ts:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L46)*

Specifies that the control is disabled

___
<a id="displaystringformatter"></a>

### `<Optional>` displayStringFormatter

**● displayStringFormatter**: *`function`*

*Defined in [select/select.props.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L23)*

Function which converts and formats the string may be displayed in the ui in the UI

#### Type declaration
▸(selectedOptions: *[ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[]*, placeholder: *`string`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| selectedOptions | [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[] |
| placeholder | `string` |

**Returns:** `string`

___
<a id="form"></a>

### `<Optional>` form

**● form**: *`string`*

*Defined in [select/select.props.ts:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L51)*

Defines one or more forms the select field belongs to

___
<a id="ismenuopen"></a>

### `<Optional>` isMenuOpen

**● isMenuOpen**: *`boolean`*

*Defined in [select/select.props.ts:41](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L41)*

Specifies that the drop-down list is open

___
<a id="labelledby"></a>

### `<Optional>` labelledBy

**● labelledBy**: *`string`*

*Defined in [select/select.props.ts:92](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L92)*

The aria-labelledby attribute to link the select to an existing element that provides it an accessible name

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-components-react-base/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="multiselectable"></a>

### `<Optional>` multiselectable

**● multiselectable**: *`boolean`*

*Defined in [select/select.props.ts:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L56)*

Specifies that multiple options can be selected at once

___
<a id="name"></a>

### `<Optional>` name

**● name**: *`string`*

*Defined in [select/select.props.ts:61](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L61)*

Defines a name for the drop-down list

___
<a id="onvaluechange"></a>

### `<Optional>` onValueChange

**● onValueChange**: *`function`*

*Defined in [select/select.props.ts:76](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L76)*

The onValueChange event handler

#### Type declaration
▸(newValue: *`string` \| `string`[]*, selectedItems: *[ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[]*, displayString: *`string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| newValue | `string` \| `string`[] |
| selectedItems | [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[] |
| displayString | `string` |

**Returns:** `void`

___
<a id="placeholder"></a>

### `<Optional>` placeholder

**● placeholder**: *`string`*

*Defined in [select/select.props.ts:66](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L66)*

String displayed when there is no selected value

___
<a id="required"></a>

### `<Optional>` required

**● required**: *`boolean`*

*Defined in [select/select.props.ts:71](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L71)*

Specifies that the user is required to select a value before submitting the form

___
<a id="selecteditems"></a>

### `<Optional>` selectedItems

**● selectedItems**: *`string`[] \| [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[]*

*Defined in [select/select.props.ts:31](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L31)*

Selected option id's (controlled mode)

___
<a id="trigger"></a>

### `<Optional>` trigger

**● trigger**: *`function`*

*Defined in [select/select.props.ts:17](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/select/select.props.ts#L17)*

Custom function to render the trigger of the control (ie. the ui that typically displays the current value and opens the menu in single select mode)

#### Type declaration
▸(props: *[SelectProps](../modules/_select_select_props_.md#selectprops)*, state: *[SelectState](_select_select_.selectstate.md)*): `React.ReactNode`

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [SelectProps](../modules/_select_select_props_.md#selectprops) |
| state | [SelectState](_select_select_.selectstate.md) |

**Returns:** `React.ReactNode`

___

