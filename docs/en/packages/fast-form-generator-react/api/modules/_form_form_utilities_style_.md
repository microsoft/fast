[@microsoft/fast-form-generator-react](../README.md) > ["form/form.utilities.style"](../modules/_form_form_utilities_style_.md)

# External module: "form/form.utilities.style"

## Index

### Interfaces

* [BoxShadowConfig](../interfaces/_form_form_utilities_style_.boxshadowconfig.md)

### Variables

* [darkTheme](_form_form_utilities_style_.md#darktheme)
* [lightTheme](_form_form_utilities_style_.md#lighttheme)

### Functions

* [applyAriaHiddenStyles](_form_form_utilities_style_.md#applyariahiddenstyles)
* [applyCleanListStyle](_form_form_utilities_style_.md#applycleanliststyle)
* [applyControl](_form_form_utilities_style_.md#applycontrol)
* [applyControlSingleLineWrapper](_form_form_utilities_style_.md#applycontrolsinglelinewrapper)
* [applyControlWrapper](_form_form_utilities_style_.md#applycontrolwrapper)
* [applyGlobalStyle](_form_form_utilities_style_.md#applyglobalstyle)
* [applyInputBackplateStyle](_form_form_utilities_style_.md#applyinputbackplatestyle)
* [applyInputStyle](_form_form_utilities_style_.md#applyinputstyle)
* [applyLabelStyle](_form_form_utilities_style_.md#applylabelstyle)
* [applyRemoveItemStyle](_form_form_utilities_style_.md#applyremoveitemstyle)
* [applySelectInputStyles](_form_form_utilities_style_.md#applyselectinputstyles)
* [applySelectSpanStyles](_form_form_utilities_style_.md#applyselectspanstyles)
* [applySoftRemove](_form_form_utilities_style_.md#applysoftremove)
* [applySoftRemoveInput](_form_form_utilities_style_.md#applysoftremoveinput)
* [boxShadow](_form_form_utilities_style_.md#boxshadow)
* [insetStrongBoxShadow](_form_form_utilities_style_.md#insetstrongboxshadow)
* [localizePadding](_form_form_utilities_style_.md#localizepadding)

---

## Variables

<a id="darktheme"></a>

### `<Const>` darkTheme

**● darkTheme**: *`string`* = "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9IndoaXRlIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat"

*Defined in [form/form.utilities.style.ts:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L25)*

___
<a id="lighttheme"></a>

### `<Const>` lightTheme

**● lightTheme**: *`string`* = "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9ImJsYWNrIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat"

*Defined in [form/form.utilities.style.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L23)*

Base64 encoded svgs

___

## Functions

<a id="applyariahiddenstyles"></a>

###  applyAriaHiddenStyles

▸ **applyAriaHiddenStyles**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:136](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L136)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applycleanliststyle"></a>

###  applyCleanListStyle

▸ **applyCleanListStyle**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:115](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L115)*

Common wrapper that surrounds a label and an input

**Returns:** `CSSRules`<`__type`>

___
<a id="applycontrol"></a>

###  applyControl

▸ **applyControl**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:251](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L251)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applycontrolsinglelinewrapper"></a>

###  applyControlSingleLineWrapper

▸ **applyControlSingleLineWrapper**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:243](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L243)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applycontrolwrapper"></a>

###  applyControlWrapper

▸ **applyControlWrapper**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:237](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L237)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applyglobalstyle"></a>

###  applyGlobalStyle

▸ **applyGlobalStyle**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:124](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L124)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applyinputbackplatestyle"></a>

###  applyInputBackplateStyle

▸ **applyInputBackplateStyle**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:150](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L150)*

Used for styles radio buttons (vertical and horizontal alignment)

**Returns:** `CSSRules`<`__type`>

___
<a id="applyinputstyle"></a>

###  applyInputStyle

▸ **applyInputStyle**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:91](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L91)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applylabelstyle"></a>

###  applyLabelStyle

▸ **applyLabelStyle**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:78](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L78)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applyremoveitemstyle"></a>

###  applyRemoveItemStyle

▸ **applyRemoveItemStyle**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:207](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L207)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applyselectinputstyles"></a>

###  applySelectInputStyles

▸ **applySelectInputStyles**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:163](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L163)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applyselectspanstyles"></a>

###  applySelectSpanStyles

▸ **applySelectSpanStyles**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:190](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L190)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applysoftremove"></a>

###  applySoftRemove

▸ **applySoftRemove**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:258](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L258)*

**Returns:** `CSSRules`<`__type`>

___
<a id="applysoftremoveinput"></a>

###  applySoftRemoveInput

▸ **applySoftRemoveInput**(): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:269](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L269)*

**Returns:** `CSSRules`<`__type`>

___
<a id="boxshadow"></a>

###  boxShadow

▸ **boxShadow**(config: *[BoxShadowConfig](../interfaces/_form_form_utilities_style_.boxshadowconfig.md)*): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [BoxShadowConfig](../interfaces/_form_form_utilities_style_.boxshadowconfig.md) |

**Returns:** `CSSRules`<`__type`>

___
<a id="insetstrongboxshadow"></a>

###  insetStrongBoxShadow

▸ **insetStrongBoxShadow**(color: *`string`*): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:63](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L63)*

Mimics a border but with boxShadow (strong in the sense of no blur)

**Parameters:**

| Name | Type |
| ------ | ------ |
| color | `string` |

**Returns:** `CSSRules`<`__type`>

___
<a id="localizepadding"></a>

###  localizePadding

▸ **localizePadding**(top: *`number`*, right: *`number`*, bottom: *`number`*, left: *`number`*): `CSSRules`<`__type`>

*Defined in [form/form.utilities.style.ts:38](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.style.ts#L38)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| top | `number` |
| right | `number` |
| bottom | `number` |
| left | `number` |

**Returns:** `CSSRules`<`__type`>

___

