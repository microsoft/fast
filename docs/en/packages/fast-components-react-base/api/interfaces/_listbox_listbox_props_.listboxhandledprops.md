[@microsoft/fast-components-react-base](../README.md) > ["listbox/listbox.props"](../modules/_listbox_listbox_props_.md) > [ListboxHandledProps](../interfaces/_listbox_listbox_props_.listboxhandledprops.md)

# Interface: ListboxHandledProps

## Hierarchy

↳  [ListboxManagedClasses](_listbox_listbox_props_.listboxmanagedclasses.md)

**↳ ListboxHandledProps**

## Index

### Properties

* [children](_listbox_listbox_props_.listboxhandledprops.md#children)
* [defaultSelection](_listbox_listbox_props_.listboxhandledprops.md#defaultselection)
* [disabled](_listbox_listbox_props_.listboxhandledprops.md#disabled)
* [focusItemOnMount](_listbox_listbox_props_.listboxhandledprops.md#focusitemonmount)
* [labelledBy](_listbox_listbox_props_.listboxhandledprops.md#labelledby)
* [managedClasses](_listbox_listbox_props_.listboxhandledprops.md#managedclasses)
* [multiselectable](_listbox_listbox_props_.listboxhandledprops.md#multiselectable)
* [onItemInvoked](_listbox_listbox_props_.listboxhandledprops.md#oniteminvoked)
* [onSelectedItemsChanged](_listbox_listbox_props_.listboxhandledprops.md#onselecteditemschanged)
* [selectedItems](_listbox_listbox_props_.listboxhandledprops.md#selecteditems)
* [typeAheadEnabled](_listbox_listbox_props_.listboxhandledprops.md#typeaheadenabled)
* [typeAheadPropertyKey](_listbox_listbox_props_.listboxhandledprops.md#typeaheadpropertykey)

---

## Properties

<a id="children"></a>

### `<Optional>` children

**● children**: *`React.ReactNode`*

*Defined in [listbox/listbox.props.ts:14](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L14)*

The listbox children

___
<a id="defaultselection"></a>

### `<Optional>` defaultSelection

**● defaultSelection**: *`string`[] \| [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[]*

*Defined in [listbox/listbox.props.ts:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L45)*

Options that are initially selected

___
<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: *`boolean`*

*Defined in [listbox/listbox.props.ts:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L65)*

Specifies that the control is disabled

___
<a id="focusitemonmount"></a>

### `<Optional>` focusItemOnMount

**● focusItemOnMount**: *`boolean`*

*Defined in [listbox/listbox.props.ts:60](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L60)*

Whether a listitem should automatically get focus when this component is mounted

___
<a id="labelledby"></a>

### `<Optional>` labelledBy

**● labelledBy**: *`string`*

*Defined in [listbox/listbox.props.ts:35](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L35)*

The aria-labelledby attribute to link the listbox to an existing element that provides it an accessible name

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

*Defined in [listbox/listbox.props.ts:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L29)*

Whether this listbox supports multi-selection (default is 'false')

___
<a id="oniteminvoked"></a>

### `<Optional>` onItemInvoked

**● onItemInvoked**: *`function`*

*Defined in [listbox/listbox.props.ts:55](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L55)*

The onItemInvoked event handler

#### Type declaration
▸(item: *[ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| item | [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops) |

**Returns:** `void`

___
<a id="onselecteditemschanged"></a>

### `<Optional>` onSelectedItemsChanged

**● onSelectedItemsChanged**: *`function`*

*Defined in [listbox/listbox.props.ts:50](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L50)*

The onSelectedItemsChanged event handler

#### Type declaration
▸(selectedItems: *[ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| selectedItems | [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[] |

**Returns:** `void`

___
<a id="selecteditems"></a>

### `<Optional>` selectedItems

**● selectedItems**: *`string`[] \| [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)[]*

*Defined in [listbox/listbox.props.ts:40](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L40)*

Selected options(controlled mode)

___
<a id="typeaheadenabled"></a>

### `<Optional>` typeAheadEnabled

**● typeAheadEnabled**: *`boolean`*

*Defined in [listbox/listbox.props.ts:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L24)*

Enable type ahead

___
<a id="typeaheadpropertykey"></a>

### `<Optional>` typeAheadPropertyKey

**● typeAheadPropertyKey**: *`string`*

*Defined in [listbox/listbox.props.ts:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox/listbox.props.ts#L19)*

The name of the prop on child components that is used as the data for type ahead focus

___

