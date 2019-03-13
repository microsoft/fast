[@microsoft/fast-colors](../README.md) > ["luminosity"](../modules/_luminosity_.md)

# External module: "luminosity"

## Index

### Type aliases

* [LuminositySwitch](_luminosity_.md#luminosityswitch)

### Functions

* [luminance](_luminosity_.md#luminance)
* [luminanceSwitch](_luminosity_.md#luminanceswitch)

---

## Type aliases

<a id="luminosityswitch"></a>

###  LuminositySwitch

**Ƭ LuminositySwitch**: *`function`*

*Defined in [luminosity.ts:7](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/luminosity.ts#L7)*

Type definition for a luminosity switch

*__deprecated__*: 

#### Type declaration
▸(a: *`any`*, b: *`any`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| a | `any` |
| b | `any` |

**Returns:** `any`

___

## Functions

<a id="luminance"></a>

###  luminance

▸ **luminance**(targetLuminance: *`number`*, sourceColor: *`Chroma`*, round?: *`function`*): `number`[]

*Defined in [luminosity.ts:16](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/luminosity.ts#L16)*

Adjust a color to a specific luminosity. This function is almost a direct copy of [https://github.com/gka/chroma.js/blob/master/src/io/luminance.coffee](https://github.com/gka/chroma.js/blob/master/src/io/luminance.coffee), except that it accepts a rounding function. This is necessary to prevent contrast ratios being slightly below their target due to rounding RGB channel values the wrong direction.

*__deprecated__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| targetLuminance | `number` |
| sourceColor | `Chroma` |
| `Optional` round | `function` |

**Returns:** `number`[]

___
<a id="luminanceswitch"></a>

###  luminanceSwitch

▸ **luminanceSwitch**(operandLuminance: *`number`*, referenceLuminance: *`number`*): [LuminositySwitch](_luminosity_.md#luminosityswitch)

*Defined in [luminosity.ts:69](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/luminosity.ts#L69)*

Returns a function that selects one of two arguments based on the value of luminance inputs.

*__deprecated__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| operandLuminance | `number` |
| referenceLuminance | `number` |

**Returns:** [LuminositySwitch](_luminosity_.md#luminosityswitch)

___

