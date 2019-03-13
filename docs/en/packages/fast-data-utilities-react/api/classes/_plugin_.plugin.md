[@microsoft/fast-data-utilities-react](../README.md) > ["plugin"](../modules/_plugin_.md) > [Plugin](../classes/_plugin_.plugin.md)

# Class: Plugin

## Type parameters
#### C :  [PluginProps](../interfaces/_plugin_.pluginprops.md)
## Hierarchy

**Plugin**

## Index

### Constructors

* [constructor](_plugin_.plugin.md#constructor)

### Properties

* [config](_plugin_.plugin.md#config)

### Methods

* [matches](_plugin_.plugin.md#matches)
* [resolver](_plugin_.plugin.md#resolver)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Plugin**(config: *`C`*): [Plugin](_plugin_.plugin.md)

*Defined in [plugin.ts:15](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/plugin.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | `C` |

**Returns:** [Plugin](_plugin_.plugin.md)

___

## Properties

<a id="config"></a>

### `<Private>` config

**● config**: *`C`*

*Defined in [plugin.ts:15](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/plugin.ts#L15)*

___

## Methods

<a id="matches"></a>

###  matches

▸ **matches**(id: *`string`*): `boolean`

*Defined in [plugin.ts:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/plugin.ts#L29)*

Determines if there is a match for the IDs set for the plugin and a provided ID

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `boolean`

___
<a id="resolver"></a>

###  resolver

▸ **resolver**(data: *`any`*, childOption?: *[ChildOptionItem](../interfaces/_index_.childoptionitem.md)*): `any`

*Defined in [plugin.ts:37](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-data-utilities-react/src/plugin.ts#L37)*

Resolves the data given

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `any` |
| `Optional` childOption | [ChildOptionItem](../interfaces/_index_.childoptionitem.md) |

**Returns:** `any`

___

