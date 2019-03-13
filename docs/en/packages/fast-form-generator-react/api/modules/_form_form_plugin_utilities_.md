[@microsoft/fast-form-generator-react](../README.md) > ["form/form-plugin.utilities"](../modules/_form_form_plugin_utilities_.md)

# External module: "form/form-plugin.utilities"

## Index

### Interfaces

* [FormPluginLocation](../interfaces/_form_form_plugin_utilities_.formpluginlocation.md)

### Functions

* [getSchemaLocationsOfPlugins](_form_form_plugin_utilities_.md#getschemalocationsofplugins)
* [mapPluginsToSchema](_form_form_plugin_utilities_.md#mappluginstoschema)

---

## Functions

<a id="getschemalocationsofplugins"></a>

###  getSchemaLocationsOfPlugins

▸ **getSchemaLocationsOfPlugins**(schema: *`any`*, schemaLocationPrefix?: *`string`*): [FormPluginLocation](../interfaces/_form_form_plugin_utilities_.formpluginlocation.md)[]

*Defined in [form/form-plugin.utilities.ts:117](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-plugin.utilities.ts#L117)*

Finds the schema locations of types mapped to plugins

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| schema | `any` | - |
| `Default value` schemaLocationPrefix | `string` | &quot;&quot; |

**Returns:** [FormPluginLocation](../interfaces/_form_form_plugin_utilities_.formpluginlocation.md)[]

___
<a id="mappluginstoschema"></a>

###  mapPluginsToSchema

▸ **mapPluginsToSchema**(schema: *`any`*, data: *`any`*, plugins?: *`Array`<[FormPlugin](../classes/_plugin_.formplugin.md)<[FormPluginProps](../interfaces/_plugin_.formpluginprops.md)>>*): `any`

*Defined in [form/form-plugin.utilities.ts:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/form/form-plugin.utilities.ts#L56)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| schema | `any` | - |
| data | `any` | - |
| `Default value` plugins | `Array`<[FormPlugin](../classes/_plugin_.formplugin.md)<[FormPluginProps](../interfaces/_plugin_.formpluginprops.md)>> |  [] |

**Returns:** `any`

___

