[@microsoft/fast-form-generator-react](../README.md) > ["form/form-item.array"](../modules/_form_form_item_array_.md) > [FormItemArrayProps](../interfaces/_form_form_item_array_.formitemarrayprops.md)

# Interface: FormItemArrayProps

## Hierarchy

 [FormItemCommon](_form_form_item_.formitemcommon.md)

**↳ FormItemArrayProps**

## Index

### Properties

* [data](_form_form_item_array_.formitemarrayprops.md#data)
* [dataLocation](_form_form_item_array_.formitemarrayprops.md#datalocation)
* [default](_form_form_item_array_.formitemarrayprops.md#default)
* [disabled](_form_form_item_array_.formitemarrayprops.md#disabled)
* [index](_form_form_item_array_.formitemarrayprops.md#index)
* [label](_form_form_item_array_.formitemarrayprops.md#label)
* [onChange](_form_form_item_array_.formitemarrayprops.md#onchange)
* [onUpdateActiveSection](_form_form_item_array_.formitemarrayprops.md#onupdateactivesection)
* [required](_form_form_item_array_.formitemarrayprops.md#required)
* [schema](_form_form_item_array_.formitemarrayprops.md#schema)
* [schemaLocation](_form_form_item_array_.formitemarrayprops.md#schemalocation)
* [untitled](_form_form_item_array_.formitemarrayprops.md#untitled)

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

*Overrides [FormItemCommon](_form_form_item_.formitemcommon.md).[dataLocation](_form_form_item_.formitemcommon.md#datalocation)*

*Defined in [form/form-item.array.tsx:40](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.array.tsx#L40)*

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
<a id="onupdateactivesection"></a>

###  onUpdateActiveSection

**● onUpdateActiveSection**: *[updateActiveSection](../modules/_form_form_section_props_.md#updateactivesection)*

*Defined in [form/form-item.array.tsx:50](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.array.tsx#L50)*

The callback to update a different active section and/or component

___
<a id="required"></a>

###  required

**● required**: *`boolean`*

*Inherited from [FormItemCommon](_form_form_item_.formitemcommon.md).[required](_form_form_item_.formitemcommon.md#required)*

*Defined in [form/form-item.tsx:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L20)*

Whether this item is required

___
<a id="schema"></a>

###  schema

**● schema**: *`any`*

*Defined in [form/form-item.array.tsx:30](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.array.tsx#L30)*

The schema

___
<a id="schemalocation"></a>

###  schemaLocation

**● schemaLocation**: *`string`*

*Defined in [form/form-item.array.tsx:35](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.array.tsx#L35)*

The location of the schema

___
<a id="untitled"></a>

###  untitled

**● untitled**: *`string`*

*Defined in [form/form-item.array.tsx:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.array.tsx#L45)*

The string to use for an untitled schema

___

