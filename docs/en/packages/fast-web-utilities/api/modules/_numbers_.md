[@microsoft/fast-web-utilities](../README.md) > ["numbers"](../modules/_numbers_.md)

# External module: "numbers"

## Index

### Functions

* [limit](_numbers_.md#limit)
* [wrapInBounds](_numbers_.md#wrapinbounds)

---

## Functions

<a id="limit"></a>

###  limit

▸ **limit**(min: *`number`*, max: *`number`*, value: *`number`*): `number`

*Defined in [numbers.ts:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/numbers.ts#L20)*

Ensures that a value is between a min and max value. If value is lower than min, min will be returned. If value is greater than max, max will be retured.

**Parameters:**

| Name | Type |
| ------ | ------ |
| min | `number` |
| max | `number` |
| value | `number` |

**Returns:** `number`

___
<a id="wrapinbounds"></a>

###  wrapInBounds

▸ **wrapInBounds**(min: *`number`*, max: *`number`*, value: *`number`*): `number`

*Defined in [numbers.ts:6](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/numbers.ts#L6)*

This method keeps a given value within the bounds of a min and max value. If the value is larger than the max, the minimum value will be returned. If the value is smaller than the minimum, the maximum will be returned. Otherwise, the value is returned un-changed.

**Parameters:**

| Name | Type |
| ------ | ------ |
| min | `number` |
| max | `number` |
| value | `number` |

**Returns:** `number`

___

