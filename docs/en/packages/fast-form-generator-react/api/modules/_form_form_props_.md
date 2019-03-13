[@microsoft/fast-form-generator-react](../README.md) > ["form/form.props"](../modules/_form_form_props_.md)

# External module: "form/form.props"

## Index

### Interfaces

* [AttributeSettingsCommon](../interfaces/_form_form_props_.attributesettingscommon.md)
* [FormAttributeSettingsMappingToPropertyNames](../interfaces/_form_form_props_.formattributesettingsmappingtopropertynames.md)
* [FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)
* [FormComponentMappingToPropertyNamesProps](../interfaces/_form_form_props_.formcomponentmappingtopropertynamesprops.md)
* [FormLocation](../interfaces/_form_form_props_.formlocation.md)
* [FormOrderByPropertyNamesCategories](../interfaces/_form_form_props_.formorderbypropertynamescategories.md)
* [FormOrderByPropertyNamesProperties](../interfaces/_form_form_props_.formorderbypropertynamesproperties.md)
* [FormOrderByPropertyNamesProps](../interfaces/_form_form_props_.formorderbypropertynamesprops.md)
* [FormProps](../interfaces/_form_form_props_.formprops.md)
* [FormState](../interfaces/_form_form_props_.formstate.md)
* [TextareaAttributeRows](../interfaces/_form_form_props_.textareaattributerows.md)
* [TextareaAttributeSettingsMappingToPropertyNames](../interfaces/_form_form_props_.textareaattributesettingsmappingtopropertynames.md)

### Type aliases

* [AttributeSettingsMappingToPropertyNames](_form_form_props_.md#attributesettingsmappingtopropertynames)
* [BreadcrumbItemEventHandler](_form_form_props_.md#breadcrumbitemeventhandler)
* [DataOnChange](_form_form_props_.md#dataonchange)
* [FormTag](_form_form_props_.md#formtag)
* [LocationOnChange](_form_form_props_.md#locationonchange)
* [PropsOnChange](_form_form_props_.md#propsonchange)
* [SchemaOnChange](_form_form_props_.md#schemaonchange)

---

## Type aliases

<a id="attributesettingsmappingtopropertynames"></a>

###  AttributeSettingsMappingToPropertyNames

**Ƭ AttributeSettingsMappingToPropertyNames**: *[TextareaAttributeSettingsMappingToPropertyNames](../interfaces/_form_form_props_.textareaattributesettingsmappingtopropertynames.md)*

*Defined in [form/form.props.ts:184](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.props.ts#L184)*

___
<a id="breadcrumbitemeventhandler"></a>

###  BreadcrumbItemEventHandler

**Ƭ BreadcrumbItemEventHandler**: *`function`*

*Defined in [form/form.props.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.props.ts#L18)*

#### Type declaration
▸(e: *`MouseEvent`<`HTMLAnchorElement`>*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLAnchorElement`> |

**Returns:** `void`

___
<a id="dataonchange"></a>

###  DataOnChange

**Ƭ DataOnChange**: *`function`*

*Defined in [form/form.props.ts:8](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.props.ts#L8)*

#### Type declaration
▸(location: *`string`*, data: *`any`*, isArray?: *`boolean`*, index?: *`number`*, isChildren?: *`boolean`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | `string` |
| data | `any` |
| `Optional` isArray | `boolean` |
| `Optional` index | `number` |
| `Optional` isChildren | `boolean` |

**Returns:** `void`

___
<a id="formtag"></a>

###  FormTag

**Ƭ FormTag**: *"form" \| "div"*

*Defined in [form/form.props.ts:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.props.ts#L20)*

___
<a id="locationonchange"></a>

###  LocationOnChange

**Ƭ LocationOnChange**: *`function`*

*Defined in [form/form.props.ts:16](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.props.ts#L16)*

#### Type declaration
▸(dataLocation: *`string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `void`

___
<a id="propsonchange"></a>

###  PropsOnChange

**Ƭ PropsOnChange**: *`function`*

*Defined in [form/form.props.ts:4](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.props.ts#L4)*

#### Type declaration
▸(data: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `any` |

**Returns:** `void`

___
<a id="schemaonchange"></a>

###  SchemaOnChange

**Ƭ SchemaOnChange**: *`function`*

*Defined in [form/form.props.ts:6](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.props.ts#L6)*

#### Type declaration
▸(schema: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |

**Returns:** `void`

___

