[@microsoft/fast-form-generator-react](../README.md) > ["form/form-control.props"](../modules/_form_form_control_props_.md) > [FormControlProps](../interfaces/_form_form_control_props_.formcontrolprops.md)

# Interface: FormControlProps

## Hierarchy

 [FormItemCommon](_form_form_item_.formitemcommon.md)

**↳ FormControlProps**

## Index

### Properties

* [attributeSettingsMappingToPropertyNames](_form_form_control_props_.formcontrolprops.md#attributesettingsmappingtopropertynames)
* [childOptions](_form_form_control_props_.formcontrolprops.md#childoptions)
* [componentMappingToPropertyNames](_form_form_control_props_.formcontrolprops.md#componentmappingtopropertynames)
* [data](_form_form_control_props_.formcontrolprops.md#data)
* [dataLocation](_form_form_control_props_.formcontrolprops.md#datalocation)
* [default](_form_form_control_props_.formcontrolprops.md#default)
* [disabled](_form_form_control_props_.formcontrolprops.md#disabled)
* [index](_form_form_control_props_.formcontrolprops.md#index)
* [label](_form_form_control_props_.formcontrolprops.md#label)
* [onChange](_form_form_control_props_.formcontrolprops.md#onchange)
* [onUpdateActiveSection](_form_form_control_props_.formcontrolprops.md#onupdateactivesection)
* [propertyName](_form_form_control_props_.formcontrolprops.md#propertyname)
* [required](_form_form_control_props_.formcontrolprops.md#required)
* [schema](_form_form_control_props_.formcontrolprops.md#schema)
* [schemaLocation](_form_form_control_props_.formcontrolprops.md#schemalocation)
* [untitled](_form_form_control_props_.formcontrolprops.md#untitled)

---

## Properties

<a id="attributesettingsmappingtopropertynames"></a>

### `<Optional>` attributeSettingsMappingToPropertyNames

**● attributeSettingsMappingToPropertyNames**: *[FormAttributeSettingsMappingToPropertyNames](_form_form_props_.formattributesettingsmappingtopropertynames.md)*

*Defined in [form/form-control.props.ts:38](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L38)*

The additional attributes mapped to a property name

___
<a id="childoptions"></a>

###  childOptions

**● childOptions**: *[FormChildOptionItem](_form_form_props_.formchildoptionitem.md)[]*

*Defined in [form/form-control.props.ts:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L33)*

The possible child options

___
<a id="componentmappingtopropertynames"></a>

### `<Optional>` componentMappingToPropertyNames

**● componentMappingToPropertyNames**: *[FormComponentMappingToPropertyNamesProps](_form_form_props_.formcomponentmappingtopropertynamesprops.md)*

*Defined in [form/form-control.props.ts:43](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L43)*

The specialized components mapping to property names

___
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

*Defined in [form/form-control.props.ts:48](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L48)*

The section update callback

___
<a id="propertyname"></a>

###  propertyName

**● propertyName**: *`string`*

*Defined in [form/form-control.props.ts:13](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L13)*

The name of the property

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

*Defined in [form/form-control.props.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L18)*

The schema to be used

___
<a id="schemalocation"></a>

###  schemaLocation

**● schemaLocation**: *`string`*

*Defined in [form/form-control.props.ts:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L28)*

The schema location (lodash path syntax)

___
<a id="untitled"></a>

###  untitled

**● untitled**: *`string`*

*Defined in [form/form-control.props.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-control.props.ts#L23)*

The untitled string for missing titles

___

