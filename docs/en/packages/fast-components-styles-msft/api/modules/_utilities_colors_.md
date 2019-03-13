[@microsoft/fast-components-styles-msft](../README.md) > ["utilities/colors"](../modules/_utilities_colors_.md)

# External module: "utilities/colors"

## Index

### Functions

* [applyMixedColor](_utilities_colors_.md#applymixedcolor)
* [backgroundColor](_utilities_colors_.md#backgroundcolor)
* [brandColor](_utilities_colors_.md#brandcolor)
* [disabledContrast](_utilities_colors_.md#disabledcontrast)
* [ensureBackgroundLarge](_utilities_colors_.md#ensurebackgroundlarge)
* [ensureBrandNormal](_utilities_colors_.md#ensurebrandnormal)
* [ensureForegroundNormal](_utilities_colors_.md#ensureforegroundnormal)
* [ensureLargeContrast](_utilities_colors_.md#ensurelargecontrast)
* [ensureNormalContrast](_utilities_colors_.md#ensurenormalcontrast)
* [foregroundColor](_utilities_colors_.md#foregroundcolor)
* [foregroundLarge](_utilities_colors_.md#foregroundlarge)
* [foregroundNormal](_utilities_colors_.md#foregroundnormal)
* [hoverContrast](_utilities_colors_.md#hovercontrast)
* [largeContrast](_utilities_colors_.md#largecontrast)
* [normalContrast](_utilities_colors_.md#normalcontrast)

---

## Functions

<a id="applymixedcolor"></a>

###  applyMixedColor

▸ **applyMixedColor**(color1: *`string`*, color2: *`string`*, mixValue: *`number`*, alpha?: *`number`*): `string`

*Defined in [utilities/colors.ts:12](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L12)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| color1 | `string` | - |
| color2 | `string` | - |
| mixValue | `number` | - |
| `Default value` alpha | `number` | 1 |

**Returns:** `string`

___
<a id="backgroundcolor"></a>

###  backgroundColor

▸ **backgroundColor**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="brandcolor"></a>

###  brandColor

▸ **brandColor**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:40](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L40)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="disabledcontrast"></a>

###  disabledContrast

▸ **disabledContrast**(contrastScale: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [utilities/colors.ts:106](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L106)*

Returns a low-contrast disabled color

**Parameters:**

| Name | Type |
| ------ | ------ |
| contrastScale | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___
<a id="ensurebackgroundlarge"></a>

###  ensureBackgroundLarge

▸ **ensureBackgroundLarge**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:196](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L196)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="ensurebrandnormal"></a>

###  ensureBrandNormal

▸ **ensureBrandNormal**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:168](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L168)*

Ensure the brand color meets normal contrast ratios against a background color

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="ensureforegroundnormal"></a>

###  ensureForegroundNormal

▸ **ensureForegroundNormal**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:132](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L132)*

Ensure the foreground color meets normal contrast ratios against a background color

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="ensurelargecontrast"></a>

###  ensureLargeContrast

▸ **ensureLargeContrast**(contrastScale: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [utilities/colors.ts:91](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L91)*

Ensures a color contrast for large elements where contrast is scaled

**Parameters:**

| Name | Type |
| ------ | ------ |
| contrastScale | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___
<a id="ensurenormalcontrast"></a>

###  ensureNormalContrast

▸ **ensureNormalContrast**(contrastScale: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [utilities/colors.ts:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L65)*

Ensures a color contrast for normal elements where contrast is scaled

**Parameters:**

| Name | Type |
| ------ | ------ |
| contrastScale | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___
<a id="foregroundcolor"></a>

###  foregroundColor

▸ **foregroundColor**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:36](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L36)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="foregroundlarge"></a>

###  foregroundLarge

▸ **foregroundLarge**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:156](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L156)*

Set the foreground color to meet normal contrast ratios against a background color

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="foregroundnormal"></a>

###  foregroundNormal

▸ **foregroundNormal**(config: *[DesignSystem](../interfaces/_design_system_index_.designsystem.md)*): `string`

*Defined in [utilities/colors.ts:144](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L144)*

Set the foreground color to meet normal contrast ratios against a background color

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [DesignSystem](../interfaces/_design_system_index_.designsystem.md) |

**Returns:** `string`

___
<a id="hovercontrast"></a>

###  hoverContrast

▸ **hoverContrast**(contrastScale: *`number`*, operandColor: *`string`*, referenceColor?: *`string`*): `string`

*Defined in [utilities/colors.ts:117](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L117)*

Apply a hover treatment to a color

**Parameters:**

| Name | Type |
| ------ | ------ |
| contrastScale | `number` |
| operandColor | `string` |
| `Optional` referenceColor | `string` |

**Returns:** `string`

___
<a id="largecontrast"></a>

###  largeContrast

▸ **largeContrast**(contrastScale: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [utilities/colors.ts:80](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L80)*

Adjusts contrast for large elements by a contrast scale value

**Parameters:**

| Name | Type |
| ------ | ------ |
| contrastScale | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___
<a id="normalcontrast"></a>

###  normalContrast

▸ **normalContrast**(contrastScale: *`number`*, operandColor: *`string`*, referenceColor: *`string`*): `string`

*Defined in [utilities/colors.ts:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/colors.ts#L54)*

Adjusts contrast for normal elements by a contrast scale value

**Parameters:**

| Name | Type |
| ------ | ------ |
| contrastScale | `number` |
| operandColor | `string` |
| referenceColor | `string` |

**Returns:** `string`

___

