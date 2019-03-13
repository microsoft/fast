[@microsoft/fast-tooling-react](../README.md) > ["data-utilities/location"](../modules/_data_utilities_location_.md)

# External module: "data-utilities/location"

## Index

### Functions

* [getChildOptionBySchemaId](_data_utilities_location_.md#getchildoptionbyschemaid)
* [getDataLocationsOfChildren](_data_utilities_location_.md#getdatalocationsofchildren)
* [getDataLocationsOfPlugins](_data_utilities_location_.md#getdatalocationsofplugins)
* [mapSchemaLocationFromDataLocation](_data_utilities_location_.md#mapschemalocationfromdatalocation)
* [pluginFindIndexCallback](_data_utilities_location_.md#pluginfindindexcallback)

---

## Functions

<a id="getchildoptionbyschemaid"></a>

###  getChildOptionBySchemaId

▸ **getChildOptionBySchemaId**(id: *`string`*, childOptions: *[ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md)[]*): [ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md) \| `undefined`

*Defined in [data-utilities/location.ts:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/data-utilities/location.ts#L25)*

Finds the child option using the schema id

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| childOptions | [ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md)[] |

**Returns:** [ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md) \| `undefined`

___
<a id="getdatalocationsofchildren"></a>

###  getDataLocationsOfChildren

▸ **getDataLocationsOfChildren**(schema: *`any`*, data: *`any`*, childOptions: *[ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md)[]*): `string`[]

*Defined in [data-utilities/location.ts:37](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/data-utilities/location.ts#L37)*

Finds the data locations of children

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| data | `any` |
| childOptions | [ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md)[] |

**Returns:** `string`[]

___
<a id="getdatalocationsofplugins"></a>

###  getDataLocationsOfPlugins

▸ **getDataLocationsOfPlugins**(schema: *`any`*, data: *`any`*, childOptions: *[ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md)[]*, dataLocationPrefix?: *`string`*): [PluginLocation](../interfaces/_data_utilities_types_.pluginlocation.md)[]

*Defined in [data-utilities/location.ts:122](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/data-utilities/location.ts#L122)*

Finds the data locations of types mapped to plugins

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| schema | `any` | - |
| data | `any` | - |
| childOptions | [ChildOptionItem](../interfaces/_data_utilities_types_.childoptionitem.md)[] | - |
| `Default value` dataLocationPrefix | `string` | &quot;&quot; |

**Returns:** [PluginLocation](../interfaces/_data_utilities_types_.pluginlocation.md)[]

___
<a id="mapschemalocationfromdatalocation"></a>

###  mapSchemaLocationFromDataLocation

▸ **mapSchemaLocationFromDataLocation**(dataLocation: *`string`*, data: *`any`*, schema: *`any`*): `string`

*Defined in [data-utilities/location.ts:213](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/data-utilities/location.ts#L213)*

Creates a schema location from a data location

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |
| data | `any` |
| schema | `any` |

**Returns:** `string`

___
<a id="pluginfindindexcallback"></a>

###  pluginFindIndexCallback

▸ **pluginFindIndexCallback**(dataLocation: *`string`*): `function`

*Defined in [data-utilities/location.ts:508](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/data-utilities/location.ts#L508)*

Callback to determine if a string is found within an array of plugin locations

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `function`

___

