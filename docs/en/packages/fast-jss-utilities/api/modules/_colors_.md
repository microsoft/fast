[@microsoft/fast-jss-utilities](../README.md) > ["colors"](../modules/_colors_.md)

# External module: "colors"

## Index

### Enumerations

* [WCAGElementContrastRatios](../enums/_colors_.wcagelementcontrastratios.md)

### Functions

* [contrastHasher](_colors_.md#contrasthasher)
* [scaleContrast](_colors_.md#scalecontrast)

---

## Functions

<a id="contrasthasher"></a>

###  contrastHasher

▸ **contrastHasher**(...args: *`Array`<`string` \| `number`>*): `string`

*Defined in [colors.ts:12](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/colors.ts#L12)*

Hashing function for contrast memoization

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `Array`<`string` \| `number`> |

**Returns:** `string`

___
<a id="scalecontrast"></a>

###  scaleContrast

▸ **scaleContrast**(baseRatio: *`number`*, scaleFactor: *`number`*): `number`

*Defined in [colors.ts:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/colors.ts#L54)*

Scales a contrast ratio (baseRatio) up by a scaleFactor (a number between 0 and 100) to achieve a new contrast ratio. When scaleFactor is 0, the baseRatio is returned. When scaleFactor is 100, 21 is returned. Otherwise, a number between baseRatio and 21 will be returned.

**Parameters:**

| Name | Type |
| ------ | ------ |
| baseRatio | `number` |
| scaleFactor | `number` |

**Returns:** `number`

___

