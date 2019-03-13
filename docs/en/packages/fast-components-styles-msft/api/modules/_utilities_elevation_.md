[@microsoft/fast-components-styles-msft](../README.md) > ["utilities/elevation"](../modules/_utilities_elevation_.md)

# External module: "utilities/elevation"

## Index

### Enumerations

* [ElevationMultiplier](../enums/_utilities_elevation_.elevationmultiplier.md)

### Interfaces

* [ShadowConfig](../interfaces/_utilities_elevation_.shadowconfig.md)

### Functions

* [elevation](_utilities_elevation_.md#elevation)
* [elevationShadow](_utilities_elevation_.md#elevationshadow)

### Object literals

* [ambientShadowConfig](_utilities_elevation_.md#ambientshadowconfig)
* [directionalShadowConfig](_utilities_elevation_.md#directionalshadowconfig)

---

## Functions

<a id="elevation"></a>

###  elevation

▸ **elevation**(elevationValue: *[ElevationMultiplier](../enums/_utilities_elevation_.elevationmultiplier.md) \| `number`*, color?: *`string`*): `function`

*Defined in [utilities/elevation.ts:64](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L64)*

Apply elevation Used to apply elevation shadow treatment to a component

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| elevationValue | [ElevationMultiplier](../enums/_utilities_elevation_.elevationmultiplier.md) \| `number` | - |
| `Default value` color | `string` |  designSystemDefaults.foregroundColor |

**Returns:** `function`

___
<a id="elevationshadow"></a>

###  elevationShadow

▸ **elevationShadow**(elevationValue: *`number`*, color: *`string`*, shadowConfig: *[ShadowConfig](../interfaces/_utilities_elevation_.shadowconfig.md)*): `function`

*Defined in [utilities/elevation.ts:90](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L90)*

Generate Elevation Shadow Generates a string representing a box shadow value

**Parameters:**

| Name | Type |
| ------ | ------ |
| elevationValue | `number` |
| color | `string` |
| shadowConfig | [ShadowConfig](../interfaces/_utilities_elevation_.shadowconfig.md) |

**Returns:** `function`

___

## Object literals

<a id="ambientshadowconfig"></a>

### `<Const>` ambientShadowConfig

**ambientShadowConfig**: *`object`*

*Defined in [utilities/elevation.ts:43](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L43)*

Ambient shadow config

<a id="ambientshadowconfig.blurmultiplier"></a>

####  blurMultiplier

**● blurMultiplier**: *`number`* = 0.225

*Defined in [utilities/elevation.ts:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L44)*

___
<a id="ambientshadowconfig.opacity"></a>

####  opacity

**● opacity**: *`number`* = 0.18

*Defined in [utilities/elevation.ts:47](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L47)*

___
<a id="ambientshadowconfig.xoffsetmultiplier"></a>

####  xOffsetMultiplier

**● xOffsetMultiplier**: *`number`* = 0

*Defined in [utilities/elevation.ts:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L45)*

___
<a id="ambientshadowconfig.yoffsetmultiplier"></a>

####  yOffsetMultiplier

**● yOffsetMultiplier**: *`number`* = 0.075

*Defined in [utilities/elevation.ts:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L46)*

___

___
<a id="directionalshadowconfig"></a>

### `<Const>` directionalShadowConfig

**directionalShadowConfig**: *`object`*

*Defined in [utilities/elevation.ts:53](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L53)*

Directional shadow config

<a id="directionalshadowconfig.blurmultiplier-1"></a>

####  blurMultiplier

**● blurMultiplier**: *`number`* = 0.9

*Defined in [utilities/elevation.ts:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L54)*

___
<a id="directionalshadowconfig.opacity-1"></a>

####  opacity

**● opacity**: *`number`* = 0.22

*Defined in [utilities/elevation.ts:57](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L57)*

___
<a id="directionalshadowconfig.xoffsetmultiplier-1"></a>

####  xOffsetMultiplier

**● xOffsetMultiplier**: *`number`* = 0

*Defined in [utilities/elevation.ts:55](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L55)*

___
<a id="directionalshadowconfig.yoffsetmultiplier-1"></a>

####  yOffsetMultiplier

**● yOffsetMultiplier**: *`number`* = 0.4

*Defined in [utilities/elevation.ts:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/elevation.ts#L56)*

___

___

