[@microsoft/fast-form-generator-react](../README.md) > ["form/form-item.textarea"](../modules/_form_form_item_textarea_.md) > [FormItemTextareaProps](../interfaces/_form_form_item_textarea_.formitemtextareaprops.md)

# Interface: FormItemTextareaProps

## Hierarchy

 [FormItemCommon](_form_form_item_.formitemcommon.md)

**↳ FormItemTextareaProps**

## Index

### Properties

* [data](_form_form_item_textarea_.formitemtextareaprops.md#data)
* [dataLocation](_form_form_item_textarea_.formitemtextareaprops.md#datalocation)
* [default](_form_form_item_textarea_.formitemtextareaprops.md#default)
* [disabled](_form_form_item_textarea_.formitemtextareaprops.md#disabled)
* [index](_form_form_item_textarea_.formitemtextareaprops.md#index)
* [label](_form_form_item_textarea_.formitemtextareaprops.md#label)
* [onChange](_form_form_item_textarea_.formitemtextareaprops.md#onchange)
* [required](_form_form_item_textarea_.formitemtextareaprops.md#required)
* [rows](_form_form_item_textarea_.formitemtextareaprops.md#rows)

---

## Properties

<a id="data"></a>

###  data

**● data**: *`any`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[data](_form_form_item_.formitemcommon.md#data)*

*Defined in [form/form-item.tsx:15](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L15)*

The data

___
<a id="datalocation"></a>

###  dataLocation

**● dataLocation**: *`string`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[dataLocation](_form_form_item_.formitemcommon.md#datalocation)*

*Defined in [form/form-item.tsx:10](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L10)*

The location of the data

___
<a id="default"></a>

### `<Optional>` default

**● default**: *`any`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[default](_form_form_item_.formitemcommon.md#default)*

*Defined in [form/form-item.tsx:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L45)*

The defaut data (if available)

___
<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: *`boolean`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[disabled](_form_form_item_.formitemcommon.md#disabled)*

*Defined in [form/form-item.tsx:30](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L30)*

Whether this item is disabled

___
<a id="index"></a>

###  index

**● index**: *`number`*

*Overrides [FormItemCommon](_form_form_item_.formitemcommon.md).[index](_form_form_item_.formitemcommon.md#index)*

*Defined in [form/form-item.textarea.tsx:14](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.textarea.tsx#L14)*

The unique index for the section

___
<a id="label"></a>

###  label

**● label**: *`string`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[label](_form_form_item_.formitemcommon.md#label)*

*Defined in [form/form-item.tsx:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L25)*

The label

___
<a id="onchange"></a>

###  onChange

**● onChange**: *`function`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[onChange](_form_form_item_.formitemcommon.md#onchange)*

*Defined in [form/form-item.tsx:35](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L35)*

The passed onChange function

#### Type declaration
▸(dataLocation: *`string`*, value: *`any`*, isArray?: *`boolean`*, index?: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |
| value | `any` |
| `Optional` isArray | `boolean` |
| `Optional` index | `number` |

**Returns:** `void`

___
<a id="required"></a>

###  required

**● required**: *`boolean`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[required](_form_form_item_.formitemcommon.md#required)*

*Defined in [form/form-item.tsx:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L20)*

Whether this item is required

___
<a id="rows"></a>

### `<Optional>` rows

**● rows**: *`number`*

*Defined in [form/form-item.textarea.tsx:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.textarea.tsx#L19)*

The number of rows to assign to the textarea

___

