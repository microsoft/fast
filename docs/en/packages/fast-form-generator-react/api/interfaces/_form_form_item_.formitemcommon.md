[@microsoft/fast-form-generator-react](../README.md) > ["form/form-item"](../modules/_form_form_item_.md) > [FormItemCommon](../interfaces/_form_form_item_.formitemcommon.md)

# Interface: FormItemCommon

## Hierarchy

**FormItemCommon**

↳  [FormItemComponentMappingToProperyNamesProps](_form_form_item_.formitemcomponentmappingtoproperynamesprops.md)

↳  [FormControlProps](_form_form_control_props_.formcontrolprops.md)

↳  [FormItemChildrenProps](_form_form_item_children_.formitemchildrenprops.md)

↳  [FormItemSectionLinkProps](_form_form_item_section_link_.formitemsectionlinkprops.md)

↳  [FormItemNumberFieldProps](_form_form_item_number_field_.formitemnumberfieldprops.md)

↳  [FormItemArrayProps](_form_form_item_array_.formitemarrayprops.md)

↳  [FormItemTextareaProps](_form_form_item_textarea_.formitemtextareaprops.md)

↳  [FormItemSelectProps](_form_form_item_select_.formitemselectprops.md)

## Index

### Properties

* [data](_form_form_item_.formitemcommon.md#data)
* [dataLocation](_form_form_item_.formitemcommon.md#datalocation)
* [default](_form_form_item_.formitemcommon.md#default)
* [disabled](_form_form_item_.formitemcommon.md#disabled)
* [index](_form_form_item_.formitemcommon.md#index)
* [label](_form_form_item_.formitemcommon.md#label)
* [onChange](_form_form_item_.formitemcommon.md#onchange)
* [required](_form_form_item_.formitemcommon.md#required)

---

## Properties

<a id="data"></a>

###  data

**● data**: *`any`*

*Defined in [form/form-item.tsx:15](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L15)*

The data

___
<a id="datalocation"></a>

###  dataLocation

**● dataLocation**: *`string`*

*Defined in [form/form-item.tsx:10](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L10)*

The location of the data

___
<a id="default"></a>

### `<Optional>` default

**● default**: *`any`*

*Defined in [form/form-item.tsx:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L45)*

The defaut data (if available)

___
<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: *`boolean`*

*Defined in [form/form-item.tsx:30](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L30)*

Whether this item is disabled

___
<a id="index"></a>

###  index

**● index**: *`number`*

*Defined in [form/form-item.tsx:5](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L5)*

The index to assign as a React key for mapping

___
<a id="label"></a>

###  label

**● label**: *`string`*

*Defined in [form/form-item.tsx:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L25)*

The label

___
<a id="onchange"></a>

###  onChange

**● onChange**: *`function`*

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

*Defined in [form/form-item.tsx:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-item.tsx#L20)*

Whether this item is required

___

