[@microsoft/fast-components-styles-msft](../README.md) > ["utilities/typography"](../modules/_utilities_typography_.md)

# External module: "utilities/typography"

## Index

### Interfaces

* [TypeRamp](../interfaces/_utilities_typography_.typeramp.md)
* [TypeRampItemConfig](../interfaces/_utilities_typography_.typerampitemconfig.md)

### Type aliases

* [TypeRampItem](_utilities_typography_.md#typerampitem)

### Functions

* [applyType](_utilities_typography_.md#applytype)
* [applyTypeRampConfig](_utilities_typography_.md#applytyperampconfig)

### Object literals

* [typeRamp](_utilities_typography_.md#typeramp-1)

---

## Type aliases

<a id="typerampitem"></a>

###  TypeRampItem

**Ƭ TypeRampItem**: *[TypeRampItemConfig](../interfaces/_utilities_typography_.typerampitemconfig.md)*

*Defined in [utilities/typography.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L18)*

The type ramp item type

___

## Functions

<a id="applytype"></a>

###  applyType

▸ **applyType**(typeConfig: *`keyof TypeRamp`*, viewport?: *`keyof KeyOfToType<Breakpoints, TypeRampItemConfig>`*): `CSSRules`<[DesignSystem](../interfaces/_design_system_index_.designsystem.md)>

*Defined in [utilities/typography.ts:82](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L82)*

Applies a type ramp config instance based on viewport

*__deprecated__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| typeConfig | `keyof TypeRamp` |
| `Optional` viewport | `keyof KeyOfToType<Breakpoints, TypeRampItemConfig>` |

**Returns:** `CSSRules`<[DesignSystem](../interfaces/_design_system_index_.designsystem.md)>

___
<a id="applytyperampconfig"></a>

###  applyTypeRampConfig

▸ **applyTypeRampConfig**(typeConfig: *`keyof TypeRamp`*): `CSSRules`<[DesignSystem](../interfaces/_design_system_index_.designsystem.md)>

*Defined in [utilities/typography.ts:102](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L102)*

Takes a param of type ramp key (string) and returns a type ramp configuration

**Parameters:**

| Name | Type |
| ------ | ------ |
| typeConfig | `keyof TypeRamp` |

**Returns:** `CSSRules`<[DesignSystem](../interfaces/_design_system_index_.designsystem.md)>

___

## Object literals

<a id="typeramp-1"></a>

### `<Const>` typeRamp

**typeRamp**: *`object`*

*Defined in [utilities/typography.ts:39](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L39)*

The type ramp configuration

<a id="typeramp-1.t1"></a>

####  t1

**t1**: *`object`*

*Defined in [utilities/typography.ts:40](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L40)*

<a id="typeramp-1.t1.fontsize"></a>

####  fontSize

**● fontSize**: *`number`* = 60

*Defined in [utilities/typography.ts:41](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L41)*

___
<a id="typeramp-1.t1.lineheight"></a>

####  lineHeight

**● lineHeight**: *`number`* = 72

*Defined in [utilities/typography.ts:42](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L42)*

___

___
<a id="typeramp-1.t2"></a>

####  t2

**t2**: *`object`*

*Defined in [utilities/typography.ts:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L44)*

<a id="typeramp-1.t2.fontsize-1"></a>

####  fontSize

**● fontSize**: *`number`* = 46

*Defined in [utilities/typography.ts:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L45)*

___
<a id="typeramp-1.t2.lineheight-1"></a>

####  lineHeight

**● lineHeight**: *`number`* = 56

*Defined in [utilities/typography.ts:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L46)*

___

___
<a id="typeramp-1.t3"></a>

####  t3

**t3**: *`object`*

*Defined in [utilities/typography.ts:48](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L48)*

<a id="typeramp-1.t3.fontsize-2"></a>

####  fontSize

**● fontSize**: *`number`* = 34

*Defined in [utilities/typography.ts:49](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L49)*

___
<a id="typeramp-1.t3.lineheight-2"></a>

####  lineHeight

**● lineHeight**: *`number`* = 44

*Defined in [utilities/typography.ts:50](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L50)*

___

___
<a id="typeramp-1.t4"></a>

####  t4

**t4**: *`object`*

*Defined in [utilities/typography.ts:52](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L52)*

<a id="typeramp-1.t4.fontsize-3"></a>

####  fontSize

**● fontSize**: *`number`* = 24

*Defined in [utilities/typography.ts:53](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L53)*

___
<a id="typeramp-1.t4.lineheight-3"></a>

####  lineHeight

**● lineHeight**: *`number`* = 32

*Defined in [utilities/typography.ts:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L54)*

___

___
<a id="typeramp-1.t5"></a>

####  t5

**t5**: *`object`*

*Defined in [utilities/typography.ts:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L56)*

<a id="typeramp-1.t5.fontsize-4"></a>

####  fontSize

**● fontSize**: *`number`* = 20

*Defined in [utilities/typography.ts:57](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L57)*

___
<a id="typeramp-1.t5.lineheight-4"></a>

####  lineHeight

**● lineHeight**: *`number`* = 28

*Defined in [utilities/typography.ts:58](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L58)*

___

___
<a id="typeramp-1.t6"></a>

####  t6

**t6**: *`object`*

*Defined in [utilities/typography.ts:60](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L60)*

<a id="typeramp-1.t6.fontsize-5"></a>

####  fontSize

**● fontSize**: *`number`* = 16

*Defined in [utilities/typography.ts:61](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L61)*

___
<a id="typeramp-1.t6.lineheight-5"></a>

####  lineHeight

**● lineHeight**: *`number`* = 24

*Defined in [utilities/typography.ts:62](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L62)*

___

___
<a id="typeramp-1.t7"></a>

####  t7

**t7**: *`object`*

*Defined in [utilities/typography.ts:64](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L64)*

<a id="typeramp-1.t7.fontsize-6"></a>

####  fontSize

**● fontSize**: *`number`* = 14

*Defined in [utilities/typography.ts:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L65)*

___
<a id="typeramp-1.t7.lineheight-6"></a>

####  lineHeight

**● lineHeight**: *`number`* = 20

*Defined in [utilities/typography.ts:66](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L66)*

___

___
<a id="typeramp-1.t8"></a>

####  t8

**t8**: *`object`*

*Defined in [utilities/typography.ts:68](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L68)*

<a id="typeramp-1.t8.fontsize-7"></a>

####  fontSize

**● fontSize**: *`number`* = 12

*Defined in [utilities/typography.ts:69](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L69)*

___
<a id="typeramp-1.t8.lineheight-7"></a>

####  lineHeight

**● lineHeight**: *`number`* = 16

*Defined in [utilities/typography.ts:70](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L70)*

___

___
<a id="typeramp-1.t9"></a>

####  t9

**t9**: *`object`*

*Defined in [utilities/typography.ts:72](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L72)*

<a id="typeramp-1.t9.fontsize-8"></a>

####  fontSize

**● fontSize**: *`number`* = 10

*Defined in [utilities/typography.ts:73](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L73)*

___
<a id="typeramp-1.t9.lineheight-8"></a>

####  lineHeight

**● lineHeight**: *`number`* = 12

*Defined in [utilities/typography.ts:74](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-styles-msft/src/utilities/typography.ts#L74)*

___

___

___

