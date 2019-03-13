[@microsoft/fast-colors](../README.md) > ["contrast"](../modules/_contrast_.md)

# External module: "contrast"

## Index

### Type aliases

* [ContrastFunction](_contrast_.md#contrastfunction)

### Functions

* [adjustContrast](_contrast_.md#adjustcontrast)
* [contrast](_contrast_.md#contrast)
* [ensureContrast](_contrast_.md#ensurecontrast)

---

## Type aliases

<a id="contrastfunction"></a>

###  ContrastFunction

**Ƭ ContrastFunction**: *`function`*

*Defined in [contrast.ts:8](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/contrast.ts#L8)*

A function to manipulate contrast of two colors.

*__deprecated__*: 

#### Type declaration
▸(targetRatio: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| targetRatio | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___

## Functions

<a id="adjustcontrast"></a>

###  adjustContrast

▸ **adjustContrast**(adjustment: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [contrast.ts:93](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/contrast.ts#L93)*

Adjusts the contrast between two colors by a given ratio adjustment

*__deprecated__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| adjustment | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___
<a id="contrast"></a>

###  contrast

▸ **contrast**(targetRatio: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [contrast.ts:21](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/contrast.ts#L21)*

Adjust the darkness/lightness of a foreground color so that it matches a target contrast ratio against a background color

*__deprecated__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetRatio | `number` |  The desired contrast ratio to bring the operandColor to against the referenceColor |
| operandColor | `string` |
| referenceColor | `string` |  The color value to evaluate contrast against |

**Returns:** `string`

___
<a id="ensurecontrast"></a>

###  ensureContrast

▸ **ensureContrast**(targetRatio: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [contrast.ts:71](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/contrast.ts#L71)*

Ensures that two colors achieve a target contrast ratio. If they don't reach the target contrast ratio, the operandColor will be adjusted to meet the target contrast ratio.

*__deprecated__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| targetRatio | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___

