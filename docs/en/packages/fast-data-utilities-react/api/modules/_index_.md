[@microsoft/fast-data-utilities-react](../README.md) > ["index"](../modules/_index_.md)

# External module: "index"

## Index

### Enumerations

* [CombiningKeyword](../enums/_index_.combiningkeyword.md)
* [DataResolverType](../enums/_index_.dataresolvertype.md)
* [DataType](../enums/_index_.datatype.md)
* [PropertyKeyword](../enums/_index_.propertykeyword.md)

### Interfaces

* [ChildOptionItem](../interfaces/_index_.childoptionitem.md)
* [ChildrenLocation](../interfaces/_index_.childrenlocation.md)
* [DataResolver](../interfaces/_index_.dataresolver.md)
* [PluginLocation](../interfaces/_index_.pluginlocation.md)

### Functions

* [getChildOptionBySchemaId](_index_.md#getchildoptionbyschemaid)
* [getDataLocationsOfChildren](_index_.md#getdatalocationsofchildren)
* [getDataLocationsOfPlugins](_index_.md#getdatalocationsofplugins)
* [getLocationsFromObject](_index_.md#getlocationsfromobject)
* [getPartialData](_index_.md#getpartialdata)
* [mapDataToComponent](_index_.md#mapdatatocomponent)
* [mapSchemaLocationFromDataLocation](_index_.md#mapschemalocationfromdatalocation)
* [normalizeDataLocation](_index_.md#normalizedatalocation)

---

## Functions

<a id="getchildoptionbyschemaid"></a>

###  getChildOptionBySchemaId

▸ **getChildOptionBySchemaId**(id: *`string`*, childOptions: *[ChildOptionItem](../interfaces/_index_.childoptionitem.md)[]*): [ChildOptionItem](../interfaces/_index_.childoptionitem.md) \| `undefined`

*Defined in [index.ts:867](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L867)*

Finds the child option using the schema id

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| childOptions | [ChildOptionItem](../interfaces/_index_.childoptionitem.md)[] |

**Returns:** [ChildOptionItem](../interfaces/_index_.childoptionitem.md) \| `undefined`

___
<a id="getdatalocationsofchildren"></a>

###  getDataLocationsOfChildren

▸ **getDataLocationsOfChildren**(schema: *`any`*, data: *`any`*, childOptions: *[ChildOptionItem](../interfaces/_index_.childoptionitem.md)[]*): `string`[]

*Defined in [index.ts:546](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L546)*

Finds the data locations of children

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| data | `any` |
| childOptions | [ChildOptionItem](../interfaces/_index_.childoptionitem.md)[] |

**Returns:** `string`[]

___
<a id="getdatalocationsofplugins"></a>

###  getDataLocationsOfPlugins

▸ **getDataLocationsOfPlugins**(schema: *`any`*, data: *`any`*, childOptions: *[ChildOptionItem](../interfaces/_index_.childoptionitem.md)[]*, dataLocationPrefix?: *`string`*): [PluginLocation](../interfaces/_index_.pluginlocation.md)[]

*Defined in [index.ts:455](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L455)*

Finds the data locations of types mapped to plugins

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| schema | `any` | - |
| data | `any` | - |
| childOptions | [ChildOptionItem](../interfaces/_index_.childoptionitem.md)[] | - |
| `Default value` dataLocationPrefix | `string` | &quot;&quot; |

**Returns:** [PluginLocation](../interfaces/_index_.pluginlocation.md)[]

___
<a id="getlocationsfromobject"></a>

###  getLocationsFromObject

▸ **getLocationsFromObject**(data: *`any`*, location?: *`string`*): `string`[]

*Defined in [index.ts:419](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L419)*

Finds the locations throughout an object

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| data | `any` | - |
| `Default value` location | `string` | &quot;&quot; |

**Returns:** `string`[]

___
<a id="getpartialdata"></a>

###  getPartialData

▸ **getPartialData**(location: *`string`*, data: *`any`*): `any`

*Defined in [index.ts:149](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L149)*

Gets data from a data and location

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | `string` |
| data | `any` |

**Returns:** `any`

___
<a id="mapdatatocomponent"></a>

###  mapDataToComponent

▸ **mapDataToComponent**(schema: *`any`*, data: *`any`*, childOptions: *[ChildOptionItem](../interfaces/_index_.childoptionitem.md)[]*, plugins?: *`Array`<[Plugin](../classes/_plugin_.plugin.md)<[PluginProps](../interfaces/_plugin_.pluginprops.md)>>*): `MappedDataLocation`[]

*Defined in [index.ts:697](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L697)*

Maps data returned from the form generator to the React components

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| schema | `any` | - |
| data | `any` | - |
| childOptions | [ChildOptionItem](../interfaces/_index_.childoptionitem.md)[] | - |
| `Default value` plugins | `Array`<[Plugin](../classes/_plugin_.plugin.md)<[PluginProps](../interfaces/_plugin_.pluginprops.md)>> |  [] |

**Returns:** `MappedDataLocation`[]

___
<a id="mapschemalocationfromdatalocation"></a>

###  mapSchemaLocationFromDataLocation

▸ **mapSchemaLocationFromDataLocation**(dataLocation: *`string`*, data: *`any`*, schema: *`any`*): `string`

*Defined in [index.ts:379](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L379)*

Creates a schema location from a data location

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |
| data | `any` |
| schema | `any` |

**Returns:** `string`

___
<a id="normalizedatalocation"></a>

###  normalizeDataLocation

▸ **normalizeDataLocation**(dataLocation: *`string`*, data: *`any`*): `string`

*Defined in [index.ts:156](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/index.ts#L156)*

Converts all property locations to dot notation and all array item references to bracket notation

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |
| data | `any` |

**Returns:** `string`

___

