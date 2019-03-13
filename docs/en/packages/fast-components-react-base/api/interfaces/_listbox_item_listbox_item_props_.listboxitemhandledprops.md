[@microsoft/fast-components-react-base](../README.md) > ["listbox-item/listbox-item.props"](../modules/_listbox_item_listbox_item_props_.md) > [ListboxItemHandledProps](../interfaces/_listbox_item_listbox_item_props_.listboxitemhandledprops.md)

# Interface: ListboxItemHandledProps

## Hierarchy

↳  [ListboxItemManagedClasses](_listbox_item_listbox_item_props_.listboxitemmanagedclasses.md)

**↳ ListboxItemHandledProps**

## Index

### Properties

* [children](_listbox_item_listbox_item_props_.listboxitemhandledprops.md#children)
* [disabled](_listbox_item_listbox_item_props_.listboxitemhandledprops.md#disabled)
* [displayString](_listbox_item_listbox_item_props_.listboxitemhandledprops.md#displaystring)
* [id](_listbox_item_listbox_item_props_.listboxitemhandledprops.md#id)
* [managedClasses](_listbox_item_listbox_item_props_.listboxitemhandledprops.md#managedclasses)
* [onInvoke](_listbox_item_listbox_item_props_.listboxitemhandledprops.md#oninvoke)
* [value](_listbox_item_listbox_item_props_.listboxitemhandledprops.md#value)

---

## Properties

<a id="children"></a>

### `<Optional>` children

**● children**: *`React.ReactNode`*

*Defined in [listbox-item/listbox-item.props.ts:14](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox-item/listbox-item.props.ts#L14)*

The children of the listbox item

___
<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: *`boolean`*

*Defined in [listbox-item/listbox-item.props.ts:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox-item/listbox-item.props.ts#L19)*

If the item is disabled

___
<a id="displaystring"></a>

### `<Optional>` displayString

**● displayString**: *`string`*

*Defined in [listbox-item/listbox-item.props.ts:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox-item/listbox-item.props.ts#L34)*

Friendly string that may be used in UI display

___
<a id="id"></a>

###  id

**● id**: *`string`*

*Defined in [listbox-item/listbox-item.props.ts:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox-item/listbox-item.props.ts#L29)*

The unique id for the item

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-components-react-base/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="oninvoke"></a>

### `<Optional>` onInvoke

**● onInvoke**: *`function`*

*Defined in [listbox-item/listbox-item.props.ts:40](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox-item/listbox-item.props.ts#L40)*

Callback for when an item is invoked Returns the prop contract for the invoked listbox item

#### Type declaration
▸(e: *`MouseEvent`<`HTMLDivElement`> \| `KeyboardEvent`<`HTMLDivElement`>*, props: *[ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLDivElement`> \| `KeyboardEvent`<`HTMLDivElement`> |
| props | [ListboxItemProps](../modules/_listbox_item_listbox_item_props_.md#listboxitemprops) |

**Returns:** `void`

___
<a id="value"></a>

###  value

**● value**: *`string`*

*Defined in [listbox-item/listbox-item.props.ts:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/listbox-item/listbox-item.props.ts#L24)*

The value of the item

___

