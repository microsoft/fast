[@microsoft/fast-form-generator-react](../README.md) > ["form/form-section.utilities"](../modules/_form_form_section_utilities_.md)

# External module: "form/form-section.utilities"

## Index

### Functions

* [checkCategoryConfigPropertyCount](_form_form_section_utilities_.md#checkcategoryconfigpropertycount)
* [checkHasOneOfAnyOf](_form_form_section_utilities_.md#checkhasoneofanyof)
* [checkIsDifferentData](_form_form_section_utilities_.md#checkisdifferentdata)
* [checkIsDifferentSchema](_form_form_section_utilities_.md#checkisdifferentschema)
* [checkIsObject](_form_form_section_utilities_.md#checkisobject)
* [findAssignedParamsByCategoryProperties](_form_form_section_utilities_.md#findassignedparamsbycategoryproperties)
* [findOrderedByPropertyNames](_form_form_section_utilities_.md#findorderedbypropertynames)
* [formItemAttributeMapping](_form_form_section_utilities_.md#formitemattributemapping)
* [formItemMapping](_form_form_section_utilities_.md#formitemmapping)
* [generateExampleData](_form_form_section_utilities_.md#generateexampledata)
* [getArraySchemaLocation](_form_form_section_utilities_.md#getarrayschemalocation)
* [getCategoryIndex](_form_form_section_utilities_.md#getcategoryindex)
* [getCategoryParams](_form_form_section_utilities_.md#getcategoryparams)
* [getData](_form_form_section_utilities_.md#getdata)
* [getDataLocationRelativeToRoot](_form_form_section_utilities_.md#getdatalocationrelativetoroot)
* [getInitialOneOfAnyOfState](_form_form_section_utilities_.md#getinitialoneofanyofstate)
* [getIsNotRequired](_form_form_section_utilities_.md#getisnotrequired)
* [getIsRequired](_form_form_section_utilities_.md#getisrequired)
* [getLabel](_form_form_section_utilities_.md#getlabel)
* [getNormalizedLocation](_form_form_section_utilities_.md#getnormalizedlocation)
* [getOneOfAnyOfActiveIndex](_form_form_section_utilities_.md#getoneofanyofactiveindex)
* [getOneOfAnyOfSelectOptions](_form_form_section_utilities_.md#getoneofanyofselectoptions)
* [getOneOfAnyOfState](_form_form_section_utilities_.md#getoneofanyofstate)
* [getWeightedCategoriesAndItems](_form_form_section_utilities_.md#getweightedcategoriesanditems)
* [handleToggleClick](_form_form_section_utilities_.md#handletoggleclick)
* [isMapping](_form_form_section_utilities_.md#ismapping)
* [isSelect](_form_form_section_utilities_.md#isselect)
* [resolveExampleDataWithCachedData](_form_form_section_utilities_.md#resolveexampledatawithcacheddata)
* [validateSchema](_form_form_section_utilities_.md#validateschema)

---

## Functions

<a id="checkcategoryconfigpropertycount"></a>

###  checkCategoryConfigPropertyCount

▸ **checkCategoryConfigPropertyCount**(formItems: *[FormItemsWithConfigOptions](../interfaces/_form_form_section_props_.formitemswithconfigoptions.md)*, orderByPropertyNames: *[FormOrderByPropertyNamesProps](../interfaces/_form_form_props_.formorderbypropertynamesprops.md)*): `boolean`

*Defined in [form/form-section.utilities.tsx:424](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L424)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| formItems | [FormItemsWithConfigOptions](../interfaces/_form_form_section_props_.formitemswithconfigoptions.md) |
| orderByPropertyNames | [FormOrderByPropertyNamesProps](../interfaces/_form_form_props_.formorderbypropertynamesprops.md) |

**Returns:** `boolean`

___
<a id="checkhasoneofanyof"></a>

###  checkHasOneOfAnyOf

▸ **checkHasOneOfAnyOf**(oneOf: *`any`*, anyOf: *`any`*): `boolean`

*Defined in [form/form-section.utilities.tsx:324](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L324)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| oneOf | `any` |
| anyOf | `any` |

**Returns:** `boolean`

___
<a id="checkisdifferentdata"></a>

###  checkIsDifferentData

▸ **checkIsDifferentData**(currentData: *`any`*, nextData: *`any`*): `boolean`

*Defined in [form/form-section.utilities.tsx:332](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L332)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| currentData | `any` |
| nextData | `any` |

**Returns:** `boolean`

___
<a id="checkisdifferentschema"></a>

###  checkIsDifferentSchema

▸ **checkIsDifferentSchema**(currentSchema: *`any`*, nextSchema: *`any`*): `boolean`

*Defined in [form/form-section.utilities.tsx:328](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L328)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| currentSchema | `any` |
| nextSchema | `any` |

**Returns:** `boolean`

___
<a id="checkisobject"></a>

###  checkIsObject

▸ **checkIsObject**(property: *`any`*, schema: *`any`*): `boolean`

*Defined in [form/form-section.utilities.tsx:390](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L390)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| property | `any` |
| schema | `any` |

**Returns:** `boolean`

___
<a id="findassignedparamsbycategoryproperties"></a>

###  findAssignedParamsByCategoryProperties

▸ **findAssignedParamsByCategoryProperties**(config: *[AssignedParamsByCategoryConfig](../interfaces/_form_form_section_props_.assignedparamsbycategoryconfig.md)*): [AssignedCategoryParams](../interfaces/_form_form_section_props_.assignedcategoryparams.md)

*Defined in [form/form-section.utilities.tsx:394](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L394)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [AssignedParamsByCategoryConfig](../interfaces/_form_form_section_props_.assignedparamsbycategoryconfig.md) |

**Returns:** [AssignedCategoryParams](../interfaces/_form_form_section_props_.assignedcategoryparams.md)

___
<a id="findorderedbypropertynames"></a>

###  findOrderedByPropertyNames

▸ **findOrderedByPropertyNames**(category: *[FormOrderByPropertyNamesCategories](../interfaces/_form_form_props_.formorderbypropertynamescategories.md)*, formItemParameter: *[FormItemParameters](../interfaces/_form_form_section_props_.formitemparameters.md)*, assignedItemWeight: *`number`*): [AssignedCategoryParams](../interfaces/_form_form_section_props_.assignedcategoryparams.md)

*Defined in [form/form-section.utilities.tsx:434](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L434)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| category | [FormOrderByPropertyNamesCategories](../interfaces/_form_form_props_.formorderbypropertynamescategories.md) |
| formItemParameter | [FormItemParameters](../interfaces/_form_form_section_props_.formitemparameters.md) |
| assignedItemWeight | `number` |

**Returns:** [AssignedCategoryParams](../interfaces/_form_form_section_props_.assignedcategoryparams.md)

___
<a id="formitemattributemapping"></a>

###  formItemAttributeMapping

▸ **formItemAttributeMapping**(config: *[AttributeSettingsMappingToPropertyNames](_form_form_props_.md#attributesettingsmappingtopropertynames)*, propertyName: *`string`*): `number` \| `null`

*Defined in [form/form-section.utilities.tsx:303](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L303)*

Assigns an attribute value based on property names

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [AttributeSettingsMappingToPropertyNames](_form_form_props_.md#attributesettingsmappingtopropertynames) |
| propertyName | `string` |

**Returns:** `number` \| `null`

___
<a id="formitemmapping"></a>

###  formItemMapping

▸ **formItemMapping**(config: *[FormComponentMappingToPropertyNamesProps](../interfaces/_form_form_props_.formcomponentmappingtopropertynamesprops.md)*, propertyName: *`string`*): `null` \| [mappingName](../enums/_form_form_item_.mappingname.md)

*Defined in [form/form-section.utilities.tsx:281](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L281)*

Assigns a schema form item mapping based on property name

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [FormComponentMappingToPropertyNamesProps](../interfaces/_form_form_props_.formcomponentmappingtopropertynamesprops.md) |
| propertyName | `string` |

**Returns:** `null` \| [mappingName](../enums/_form_form_item_.mappingname.md)

___
<a id="generateexampledata"></a>

###  generateExampleData

▸ **generateExampleData**(schema: *`any`*, propertyLocation: *`string`*): `any`

*Defined in [form/form-section.utilities.tsx:233](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L233)*

Generates example data for a newly added optional schema item

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| propertyLocation | `string` |

**Returns:** `any`

___
<a id="getarrayschemalocation"></a>

###  getArraySchemaLocation

▸ **getArraySchemaLocation**(schemaLocation: *`string`*, propertyName: *`string`*, schema: *`any`*, oneOfAnyOf: *`any`*): `string`

*Defined in [form/form-section.utilities.tsx:257](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L257)*

Get the array location

**Parameters:**

| Name | Type |
| ------ | ------ |
| schemaLocation | `string` |
| propertyName | `string` |
| schema | `any` |
| oneOfAnyOf | `any` |

**Returns:** `string`

___
<a id="getcategoryindex"></a>

###  getCategoryIndex

▸ **getCategoryIndex**(assignedCategoryParams: *[AssignedCategoryParams](../interfaces/_form_form_section_props_.assignedcategoryparams.md)*, categoryParams: *[FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[]*): `number`

*Defined in [form/form-section.utilities.tsx:409](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L409)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| assignedCategoryParams | [AssignedCategoryParams](../interfaces/_form_form_section_props_.assignedcategoryparams.md) |
| categoryParams | [FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[] |

**Returns:** `number`

___
<a id="getcategoryparams"></a>

###  getCategoryParams

▸ **getCategoryParams**(formItemParameters: *[FormItemParameters](../interfaces/_form_form_section_props_.formitemparameters.md)[]*, orderByPropertyNames: *[FormOrderByPropertyNamesProps](../interfaces/_form_form_props_.formorderbypropertynamesprops.md)*): [FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[]

*Defined in [form/form-section.utilities.tsx:484](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L484)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| formItemParameters | [FormItemParameters](../interfaces/_form_form_section_props_.formitemparameters.md)[] |
| orderByPropertyNames | [FormOrderByPropertyNamesProps](../interfaces/_form_form_props_.formorderbypropertynamesprops.md) |

**Returns:** [FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[]

___
<a id="getdata"></a>

###  getData

▸ **getData**(location: *`string`*, data: *`any`*): `any`

*Defined in [form/form-section.utilities.tsx:363](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L363)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | `string` |
| data | `any` |

**Returns:** `any`

___
<a id="getdatalocationrelativetoroot"></a>

###  getDataLocationRelativeToRoot

▸ **getDataLocationRelativeToRoot**(location: *`string`*, dataLocation: *`string`*): `string`

*Defined in [form/form-section.utilities.tsx:354](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L354)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | `string` |
| dataLocation | `string` |

**Returns:** `string`

___
<a id="getinitialoneofanyofstate"></a>

###  getInitialOneOfAnyOfState

▸ **getInitialOneOfAnyOfState**(schema: *`any`*, data: *`any`*): [InitialOneOfAnyOfState](../interfaces/_form_form_section_props_.initialoneofanyofstate.md)

*Defined in [form/form-section.utilities.tsx:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| data | `any` |

**Returns:** [InitialOneOfAnyOfState](../interfaces/_form_form_section_props_.initialoneofanyofstate.md)

___
<a id="getisnotrequired"></a>

###  getIsNotRequired

▸ **getIsNotRequired**(item: *`any`*, not?: *`string`[]*): `boolean`

*Defined in [form/form-section.utilities.tsx:80](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L80)*

Determine if an item is not required

**Parameters:**

| Name | Type |
| ------ | ------ |
| item | `any` |
| `Optional` not | `string`[] |

**Returns:** `boolean`

___
<a id="getisrequired"></a>

###  getIsRequired

▸ **getIsRequired**(item: *`any`*, required: *`string`[]*): `boolean`

*Defined in [form/form-section.utilities.tsx:61](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L61)*

Determine if an item is required

**Parameters:**

| Name | Type |
| ------ | ------ |
| item | `any` |
| required | `string`[] |

**Returns:** `boolean`

___
<a id="getlabel"></a>

###  getLabel

▸ **getLabel**(label: *`string`*, title: *`string`*): `string`

*Defined in [form/form-section.utilities.tsx:542](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L542)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| label | `string` |
| title | `string` |

**Returns:** `string`

___
<a id="getnormalizedlocation"></a>

###  getNormalizedLocation

▸ **getNormalizedLocation**(location: *`string`*, property: *`string`*, schema: *`any`*): `string`

*Defined in [form/form-section.utilities.tsx:195](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L195)*

Normalizes a location for getting and setting values

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | `string` |
| property | `string` |
| schema | `any` |

**Returns:** `string`

___
<a id="getoneofanyofactiveindex"></a>

###  getOneOfAnyOfActiveIndex

▸ **getOneOfAnyOfActiveIndex**(type: *`string`*, schema: *`any`*, data: *`any`*): `number`

*Defined in [form/form-section.utilities.tsx:131](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L131)*

Find out what the active index should be based on the data

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` |
| schema | `any` |
| data | `any` |

**Returns:** `number`

___
<a id="getoneofanyofselectoptions"></a>

###  getOneOfAnyOfSelectOptions

▸ **getOneOfAnyOfSelectOptions**(schema: *`any`*, state: *`any`*): `Element`[]

*Defined in [form/form-section.utilities.tsx:97](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L97)*

Gets the options for a oneOf/anyOf select

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| state | `any` |

**Returns:** `Element`[]

___
<a id="getoneofanyofstate"></a>

###  getOneOfAnyOfState

▸ **getOneOfAnyOfState**(oneOfAnyOf: *[OneOfAnyOf](../interfaces/_form_form_section_props_.oneofanyof.md)*, nextProps: *[FormSectionProps](../interfaces/_form_form_section_props_.formsectionprops.md) \| [FormControlProps](../interfaces/_form_form_control_props_.formcontrolprops.md)*): [OneOfAnyOf](../interfaces/_form_form_section_props_.oneofanyof.md)

*Defined in [form/form-section.utilities.tsx:336](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L336)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| oneOfAnyOf | [OneOfAnyOf](../interfaces/_form_form_section_props_.oneofanyof.md) |
| nextProps | [FormSectionProps](../interfaces/_form_form_section_props_.formsectionprops.md) \| [FormControlProps](../interfaces/_form_form_control_props_.formcontrolprops.md) |

**Returns:** [OneOfAnyOf](../interfaces/_form_form_section_props_.oneofanyof.md)

___
<a id="getweightedcategoriesanditems"></a>

###  getWeightedCategoriesAndItems

▸ **getWeightedCategoriesAndItems**(categoryParams: *[FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[]*): [FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[]

*Defined in [form/form-section.utilities.tsx:374](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L374)*

Organizes the categories and items by weight

**Parameters:**

| Name | Type |
| ------ | ------ |
| categoryParams | [FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[] |

**Returns:** [FormCategoryProps](../interfaces/_form_form_section_props_.formcategoryprops.md)[]

___
<a id="handletoggleclick"></a>

###  handleToggleClick

▸ **handleToggleClick**(value: *`any`*, id: *`string`*, updateRequested: *`any`*): `any`

*Defined in [form/form-section.utilities.tsx:524](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L524)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `any` |
| id | `string` |
| updateRequested | `any` |

**Returns:** `any`

___
<a id="ismapping"></a>

###  isMapping

▸ **isMapping**(location: *`string`*, componentMappingToPropertyNames: *[FormComponentMappingToPropertyNamesProps](../interfaces/_form_form_props_.formcomponentmappingtopropertynamesprops.md)*): `boolean`

*Defined in [form/form-section.utilities.tsx:532](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L532)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | `string` |
| componentMappingToPropertyNames | [FormComponentMappingToPropertyNamesProps](../interfaces/_form_form_props_.formcomponentmappingtopropertynamesprops.md) |

**Returns:** `boolean`

___
<a id="isselect"></a>

###  isSelect

▸ **isSelect**(property: *`any`*): `boolean`

*Defined in [form/form-section.utilities.tsx:367](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L367)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| property | `any` |

**Returns:** `boolean`

___
<a id="resolveexampledatawithcacheddata"></a>

###  resolveExampleDataWithCachedData

▸ **resolveExampleDataWithCachedData**(schema: *`any`*, cachedData: *`any`*): `any`

*Defined in [form/form-section.utilities.tsx:151](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L151)*

Resolves generated example data with any matching data in the cache

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| cachedData | `any` |

**Returns:** `any`

___
<a id="validateschema"></a>

###  validateSchema

▸ **validateSchema**(schema: *`any`*, data: *`any`*): `boolean`

*Defined in [form/form-section.utilities.tsx:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-section.utilities.tsx#L54)*

Validate a schema against a set of data

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| data | `any` |

**Returns:** `boolean`

___

