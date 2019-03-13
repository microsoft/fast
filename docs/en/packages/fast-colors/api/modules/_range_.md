[@microsoft/fast-colors](../README.md) > ["range"](../modules/_range_.md)

# External module: "range"

## Index

### Interfaces

* [ColorConfig](../interfaces/_range_.colorconfig.md)

### Type aliases

* [Color](_range_.md#color)
* [FilterFunction](_range_.md#filterfunction)

### Functions

* [range](_range_.md#range)

---

## Type aliases

<a id="color"></a>

###  Color

**Ƭ Color**: *`string`*

*Defined in [range.ts:67](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/range.ts#L67)*

A color value as a string - can be hex or RGB

___
<a id="filterfunction"></a>

###  FilterFunction

**Ƭ FilterFunction**: *`function`*

*Defined in [range.ts:73](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/range.ts#L73)*

A function that applies a filter to a color

*__deprecated__*: 

#### Type declaration
▸(background: *[Color](_range_.md#color)*, foreground: *[Color](_range_.md#color)*, amount: *`number`*): `Chroma`

**Parameters:**

| Name | Type |
| ------ | ------ |
| background | [Color](_range_.md#color) |
| foreground | [Color](_range_.md#color) |
| amount | `number` |

**Returns:** `Chroma`

___

## Functions

<a id="range"></a>

###  range

▸ **range**(color: *[Color](_range_.md#color)*, options?: *`Partial`<[ColorConfig](../interfaces/_range_.colorconfig.md)>*): [Color](_range_.md#color)[]

*Defined in [range.ts:132](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-colors/src/range.ts#L132)*

Algorithm to generate a range of color variants based on a single color, where the input color is the middle of the returned color range.

*__deprecated__*: 

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| color | [Color](_range_.md#color) | - |
| `Default value` options | `Partial`<[ColorConfig](../interfaces/_range_.colorconfig.md)> |  {} |

**Returns:** [Color](_range_.md#color)[]

___

