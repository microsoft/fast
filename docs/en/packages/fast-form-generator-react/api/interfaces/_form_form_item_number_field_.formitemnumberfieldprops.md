[@microsoft/fast-form-generator-react](../README.md) > ["form/form-item.number-field"](../modules/_form_form_item_number_field_.md) > [FormItemNumberFieldProps](../interfaces/_form_form_item_number_field_.formitemnumberfieldprops.md)

# Interface: FormItemNumberFieldProps

## Hierarchy

 [FormItemCommon](_form_form_item_.formitemcommon.md)

**↳ FormItemNumberFieldProps**

## Index

### Properties

* [data](_form_form_item_number_field_.formitemnumberfieldprops.md#data)
* [dataLocation](_form_form_item_number_field_.formitemnumberfieldprops.md#datalocation)
* [default](_form_form_item_number_field_.formitemnumberfieldprops.md#default)
* [disabled](_form_form_item_number_field_.formitemnumberfieldprops.md#disabled)
* [index](_form_form_item_number_field_.formitemnumberfieldprops.md#index)
* [label](_form_form_item_number_field_.formitemnumberfieldprops.md#label)
* [max](_form_form_item_number_field_.formitemnumberfieldprops.md#max)
* [min](_form_form_item_number_field_.formitemnumberfieldprops.md#min)
* [onChange](_form_form_item_number_field_.formitemnumberfieldprops.md#onchange)
* [required](_form_form_item_number_field_.formitemnumberfieldprops.md#required)
* [step](_form_form_item_number_field_.formitemnumberfieldprops.md#step)

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

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[index](_form_form_item_.formitemcommon.md#index)*

*Defined in [form/form-item.tsx:5](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L5)*

The index to assign as a React key for mapping

___
<a id="label"></a>

###  label

**● label**: *`string`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[label](_form_form_item_.formitemcommon.md#label)*

*Defined in [form/form-item.tsx:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L25)*

The label

___
<a id="max"></a>

### `<Optional>` max

**● max**: *`number`*

*Defined in [form/form-item.number-field.tsx:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.number-field.tsx#L19)*

The maximum value allowed

___
<a id="min"></a>

### `<Optional>` min

**● min**: *`number`*

*Defined in [form/form-item.number-field.tsx:14](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.number-field.tsx#L14)*

The minimum value allowed

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
<a id="step"></a>

### `<Optional>` step

**● step**: *`number`*

*Defined in [form/form-item.number-field.tsx:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.number-field.tsx#L24)*

The increment between steps

___

