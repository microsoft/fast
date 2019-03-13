[@microsoft/fast-layouts-react](../README.md) > ["utilities/breakpoints"](../modules/_utilities_breakpoints_.md)

# External module: "utilities/breakpoints"

## Index

### Type aliases

* [Breakpoint](_utilities_breakpoints_.md#breakpoint)
* [Breakpoints](_utilities_breakpoints_.md#breakpoints)

### Variables

* [defaultBreakpoints](_utilities_breakpoints_.md#defaultbreakpoints)

### Functions

* [getValueByBreakpoint](_utilities_breakpoints_.md#getvaluebybreakpoint)
* [identifyBreakpoint](_utilities_breakpoints_.md#identifybreakpoint)

---

## Type aliases

<a id="breakpoint"></a>

###  Breakpoint

**Ƭ Breakpoint**: *`number`*

*Defined in [utilities/breakpoints.ts:3](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoints.ts#L3)*

___
<a id="breakpoints"></a>

###  Breakpoints

**Ƭ Breakpoints**: *[Breakpoint](_utilities_breakpoints_.md#breakpoint)[]*

*Defined in [utilities/breakpoints.ts:5](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoints.ts#L5)*

___

## Variables

<a id="defaultbreakpoints"></a>

### `<Const>` defaultBreakpoints

**● defaultBreakpoints**: *[Breakpoints](_utilities_breakpoints_.md#breakpoints)* =  [0, 540, 768, 1084, 1400, 1779]

*Defined in [utilities/breakpoints.ts:7](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoints.ts#L7)*

___

## Functions

<a id="getvaluebybreakpoint"></a>

###  getValueByBreakpoint

▸ **getValueByBreakpoint**<`T`>(breakpointSet: *`T`[]*, breakpoints?: *[Breakpoints](_utilities_breakpoints_.md#breakpoints)*): `T`

*Defined in [utilities/breakpoints.ts:31](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoints.ts#L31)*

Gets a value from an array where the index retrieved is either the current break-point or the nearest preceding break-point if no entry exists for the current break-point

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| breakpointSet | `T`[] |
| `Optional` breakpoints | [Breakpoints](_utilities_breakpoints_.md#breakpoints) |

**Returns:** `T`

___
<a id="identifybreakpoint"></a>

###  identifyBreakpoint

▸ **identifyBreakpoint**(windowWidth: *`number`*, breakpoints?: *[Breakpoints](_utilities_breakpoints_.md#breakpoints)*): `number`

*Defined in [utilities/breakpoints.ts:12](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoints.ts#L12)*

Identifies current breakpoint based on window width

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| windowWidth | `number` | - |
| `Default value` breakpoints | [Breakpoints](_utilities_breakpoints_.md#breakpoints) |  defaultBreakpoints |

**Returns:** `number`

___

