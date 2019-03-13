[@microsoft/fast-form-generator-react](../README.md) > ["plugin"](../modules/_plugin_.md) > [FormPlugin](../classes/_plugin_.formplugin.md)

# Class: FormPlugin

## Type parameters
#### C :  [FormPluginProps](../interfaces/_plugin_.formpluginprops.md)
## Hierarchy

**FormPlugin**

## Index

### Constructors

* [constructor](_plugin_.formplugin.md#constructor)

### Properties

* [config](_plugin_.formplugin.md#config)

### Methods

* [matches](_plugin_.formplugin.md#matches)
* [resolver](_plugin_.formplugin.md#resolver)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FormPlugin**(config: *`C`*): [FormPlugin](_plugin_.formplugin.md)

*Defined in [plugin.ts:12](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/plugin.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | `C` |

**Returns:** [FormPlugin](_plugin_.formplugin.md)

___

## Properties

<a id="config"></a>

### `<Private>` config

**● config**: *`C`*

*Defined in [plugin.ts:12](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/plugin.ts#L12)*

___

## Methods

<a id="matches"></a>

###  matches

▸ **matches**(id: *`string`*): `boolean`

*Defined in [plugin.ts:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/plugin.ts#L26)*

Determines if there is a match for the IDs set for the plugin and a provided ID

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `boolean`

___
<a id="resolver"></a>

###  resolver

▸ **resolver**(schema: *`any`*, data?: *`any`*): `any`

*Defined in [plugin.ts:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-form-generator-react/src/plugin.ts#L34)*

Resolves the schema partial given

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| `Optional` data | `any` |

**Returns:** `any`

___

