[@microsoft/fast-form-generator-react](../README.md) > ["form/form.utilities"](../modules/_form_form_utilities_.md)

# External module: "form/form.utilities"

## Index

### Enumerations

* [PropertyKeyword](../enums/_form_form_utilities_.propertykeyword.md)

### Interfaces

* [BreadcrumbItem](../interfaces/_form_form_utilities_.breadcrumbitem.md)
* [NavigationItem](../interfaces/_form_form_utilities_.navigationitem.md)

### Type aliases

* [HandleBreadcrumbClick](_form_form_utilities_.md#handlebreadcrumbclick)

### Functions

* [getActiveComponentAndSection](_form_form_utilities_.md#getactivecomponentandsection)
* [getBreadcrumbs](_form_form_utilities_.md#getbreadcrumbs)
* [getComponentByDataLocation](_form_form_utilities_.md#getcomponentbydatalocation)
* [getCurrentComponentDataLocation](_form_form_utilities_.md#getcurrentcomponentdatalocation)
* [getDataCache](_form_form_utilities_.md#getdatacache)
* [getLocationsFromSegments](_form_form_utilities_.md#getlocationsfromsegments)
* [getNavigation](_form_form_utilities_.md#getnavigation)
* [getNavigationItem](_form_form_utilities_.md#getnavigationitem)
* [getReactDefaultChildren](_form_form_utilities_.md#getreactdefaultchildren)
* [getSchemaByDataLocation](_form_form_utilities_.md#getschemabydatalocation)
* [isRootLocation](_form_form_utilities_.md#isrootlocation)
* [normalizeSchemaLocation](_form_form_utilities_.md#normalizeschemalocation)

---

## Type aliases

<a id="handlebreadcrumbclick"></a>

###  HandleBreadcrumbClick

**Ƭ HandleBreadcrumbClick**: *`function`*

*Defined in [form/form.utilities.ts:41](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L41)*

#### Type declaration
▸(schemaLocation: *`string`*, dataLocation: *`string`*, schema: *`any`*): [BreadcrumbItemEventHandler](_form_form_props_.md#breadcrumbitemeventhandler)

**Parameters:**

| Name | Type |
| ------ | ------ |
| schemaLocation | `string` |
| dataLocation | `string` |
| schema | `any` |

**Returns:** [BreadcrumbItemEventHandler](_form_form_props_.md#breadcrumbitemeventhandler)

___

## Functions

<a id="getactivecomponentandsection"></a>

###  getActiveComponentAndSection

▸ **getActiveComponentAndSection**(schemaLocation: *`string`*, dataLocation: *`string`*, schema?: *`any`*): `Partial`<[FormState](../interfaces/_form_form_props_.formstate.md)>

*Defined in [form/form.utilities.ts:78](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L78)*

Determines the navigation from

*   section links
*   child components
*   array items
*   breadcrumb links

**Parameters:**

| Name | Type |
| ------ | ------ |
| schemaLocation | `string` |
| dataLocation | `string` |
| `Optional` schema | `any` |

**Returns:** `Partial`<[FormState](../interfaces/_form_form_props_.formstate.md)>

___
<a id="getbreadcrumbs"></a>

###  getBreadcrumbs

▸ **getBreadcrumbs**(navigation: *[NavigationItem](../interfaces/_form_form_utilities_.navigationitem.md)[]*, handleClick: *[HandleBreadcrumbClick](_form_form_utilities_.md#handlebreadcrumbclick)*): [BreadcrumbItem](../interfaces/_form_form_utilities_.breadcrumbitem.md)[]

*Defined in [form/form.utilities.ts:279](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L279)*

Gets breadcrumbs from navigation items

**Parameters:**

| Name | Type |
| ------ | ------ |
| navigation | [NavigationItem](../interfaces/_form_form_utilities_.navigationitem.md)[] |
| handleClick | [HandleBreadcrumbClick](_form_form_utilities_.md#handlebreadcrumbclick) |

**Returns:** [BreadcrumbItem](../interfaces/_form_form_utilities_.breadcrumbitem.md)[]

___
<a id="getcomponentbydatalocation"></a>

###  getComponentByDataLocation

▸ **getComponentByDataLocation**(id: *`string`*, childOptions: *[FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[]*): `any`

*Defined in [form/form.utilities.ts:327](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L327)*

Finds the component using the schema id

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| childOptions | [FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[] |

**Returns:** `any`

___
<a id="getcurrentcomponentdatalocation"></a>

###  getCurrentComponentDataLocation

▸ **getCurrentComponentDataLocation**(dataLocation: *`string`*, lastComponentDataLocation: *`string`*): `string`

*Defined in [form/form.utilities.ts:255](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L255)*

Gets the data location from the current component

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |
| lastComponentDataLocation | `string` |

**Returns:** `string`

___
<a id="getdatacache"></a>

###  getDataCache

▸ **getDataCache**(dataCache: *`any`*, newData: *`any`*): `any`

*Defined in [form/form.utilities.ts:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L51)*

Gets the data cache based on a new data object and previous data object

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataCache | `any` |
| newData | `any` |

**Returns:** `any`

___
<a id="getlocationsfromsegments"></a>

###  getLocationsFromSegments

▸ **getLocationsFromSegments**(segments: *`string`[]*): `string`[]

*Defined in [form/form.utilities.ts:103](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L103)*

Gets locations from individual location segments Example: getLocationsFromSegments(\["children\[0\].props.object"\]) output: \["children\[0\]", "children\[0\].props", "children\[0\].props.object"\]

**Parameters:**

| Name | Type |
| ------ | ------ |
| segments | `string`[] |

**Returns:** `string`[]

___
<a id="getnavigation"></a>

###  getNavigation

▸ **getNavigation**(dataLocation: *`string`*, data: *`any`*, schema: *`any`*, childOptions: *[FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[]*): [NavigationItem](../interfaces/_form_form_utilities_.navigationitem.md)[]

*Defined in [form/form.utilities.ts:112](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L112)*

Gets the navigational items

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |
| data | `any` |
| schema | `any` |
| childOptions | [FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[] |

**Returns:** [NavigationItem](../interfaces/_form_form_utilities_.navigationitem.md)[]

___
<a id="getnavigationitem"></a>

###  getNavigationItem

▸ **getNavigationItem**(dataLocation: *`string`*, schemaLocation: *`string`*, schema: *`any`*, data: *`any`*): [NavigationItem](../interfaces/_form_form_utilities_.navigationitem.md)

*Defined in [form/form.utilities.ts:224](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L224)*

Get a single navigation item

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |
| schemaLocation | `string` |
| schema | `any` |
| data | `any` |

**Returns:** [NavigationItem](../interfaces/_form_form_utilities_.navigationitem.md)

___
<a id="getreactdefaultchildren"></a>

###  getReactDefaultChildren

▸ **getReactDefaultChildren**(): [FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[]

*Defined in [form/form.utilities.ts:242](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L242)*

Get React's default children

**Returns:** [FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[]

___
<a id="getschemabydatalocation"></a>

###  getSchemaByDataLocation

▸ **getSchemaByDataLocation**(currentSchema: *`any`*, data: *`any`*, dataLocation: *`string`*, childOptions: *[FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[]*): `any`

*Defined in [form/form.utilities.ts:301](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L301)*

Finds the schema using the data location

**Parameters:**

| Name | Type |
| ------ | ------ |
| currentSchema | `any` |
| data | `any` |
| dataLocation | `string` |
| childOptions | [FormChildOptionItem](../interfaces/_form_form_props_.formchildoptionitem.md)[] |

**Returns:** `any`

___
<a id="isrootlocation"></a>

###  isRootLocation

▸ **isRootLocation**(location: *`string`*): `boolean`

*Defined in [form/form.utilities.ts:272](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L272)*

Check to see if we are on the root location

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | `string` |

**Returns:** `boolean`

___
<a id="normalizeschemalocation"></a>

###  normalizeSchemaLocation

▸ **normalizeSchemaLocation**(schemaLocation: *`string`*): `string`

*Defined in [form/form.utilities.ts:265](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form.utilities.ts#L265)*

Removes any references to array index

**Parameters:**

| Name | Type |
| ------ | ------ |
| schemaLocation | `string` |

**Returns:** `string`

___

