[@microsoft/fast-components-react-base](../README.md) > ["dialog/dialog.props"](../modules/_dialog_dialog_props_.md) > [DialogHandledProps](../interfaces/_dialog_dialog_props_.dialoghandledprops.md)

# Interface: DialogHandledProps

## Hierarchy

↳  [DialogManagedClasses](_dialog_dialog_props_.dialogmanagedclasses.md)

**↳ DialogHandledProps**

## Index

### Properties

* [children](_dialog_dialog_props_.dialoghandledprops.md#children)
* [contentHeight](_dialog_dialog_props_.dialoghandledprops.md#contentheight)
* [contentWidth](_dialog_dialog_props_.dialoghandledprops.md#contentwidth)
* [describedBy](_dialog_dialog_props_.dialoghandledprops.md#describedby)
* [label](_dialog_dialog_props_.dialoghandledprops.md#label)
* [labelledBy](_dialog_dialog_props_.dialoghandledprops.md#labelledby)
* [managedClasses](_dialog_dialog_props_.dialoghandledprops.md#managedclasses)
* [modal](_dialog_dialog_props_.dialoghandledprops.md#modal)
* [onDismiss](_dialog_dialog_props_.dialoghandledprops.md#ondismiss)
* [visible](_dialog_dialog_props_.dialoghandledprops.md#visible)

---

## Properties

<a id="children"></a>

### `<Optional>` children

**● children**: *`React.ReactNode` \| `React.ReactNode`[]*

*Defined in [dialog/dialog.props.ts:13](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L13)*

The dialog content

___
<a id="contentheight"></a>

### `<Optional>` contentHeight

**● contentHeight**: *`string`*

*Defined in [dialog/dialog.props.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L23)*

The dialog content height

___
<a id="contentwidth"></a>

### `<Optional>` contentWidth

**● contentWidth**: *`string`*

*Defined in [dialog/dialog.props.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L18)*

The dialog content width

___
<a id="describedby"></a>

### `<Optional>` describedBy

**● describedBy**: *`string`*

*Defined in [dialog/dialog.props.ts:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L29)*

The aria-describedby attribute to link the dialog to an element that describes its purpose

___
<a id="label"></a>

### `<Optional>` label

**● label**: *`string`*

*Defined in [dialog/dialog.props.ts:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L34)*

The aria-label to provide an accessible name for the dialog

___
<a id="labelledby"></a>

### `<Optional>` labelledBy

**● labelledBy**: *`string`*

*Defined in [dialog/dialog.props.ts:40](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L40)*

The aria-labelledby attribute to link the dialog to an existing element that provides it an accessible name

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-components-react-base/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="modal"></a>

### `<Optional>` modal

**● modal**: *`boolean`*

*Defined in [dialog/dialog.props.ts:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L46)*

The option to add modal functionality and prevent a user from interacting with elements outside the dialog

___
<a id="ondismiss"></a>

### `<Optional>` onDismiss

**● onDismiss**: *`function`*

*Defined in [dialog/dialog.props.ts:52](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L52)*

The onDismiss callback Callback is registered on click of the modal overlay or when escape key is pressed

#### Type declaration
▸(e?: *`MouseEvent` \| `KeyboardEvent`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` e | `MouseEvent` \| `KeyboardEvent` |

**Returns:** `void`

___
<a id="visible"></a>

### `<Optional>` visible

**● visible**: *`boolean`*

*Defined in [dialog/dialog.props.ts:58](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/dialog/dialog.props.ts#L58)*

Sets the visibility of the dialog to assistive technologies If true, aria-hidden is false

___

