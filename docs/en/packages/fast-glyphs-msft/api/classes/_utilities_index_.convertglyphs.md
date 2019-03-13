[@microsoft/fast-glyphs-msft](../README.md) > ["utilities/index"](../modules/_utilities_index_.md) > [ConvertGlyphs](../classes/_utilities_index_.convertglyphs.md)

# Class: ConvertGlyphs

## Hierarchy

**ConvertGlyphs**

## Index

### Constructors

* [constructor](_utilities_index_.convertglyphs.md#constructor)

### Properties

* [glyphs](_utilities_index_.convertglyphs.md#glyphs)
* [index](_utilities_index_.convertglyphs.md#index)
* [indexFileDestination](_utilities_index_.convertglyphs.md#indexfiledestination)
* [indexFileType](_utilities_index_.convertglyphs.md#indexfiletype)

### Methods

* [getGlyphs](_utilities_index_.convertglyphs.md#getglyphs)
* [getIndexFileContents](_utilities_index_.convertglyphs.md#getindexfilecontents)
* [normalizeName](_utilities_index_.convertglyphs.md#normalizename)
* [writeIndexFile](_utilities_index_.convertglyphs.md#writeindexfile)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ConvertGlyphs**(options: *[ConvertGlyphConfig](../interfaces/_utilities_index_.convertglyphconfig.md)*): [ConvertGlyphs](_utilities_index_.convertglyphs.md)

*Defined in [utilities/index.ts:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConvertGlyphConfig](../interfaces/_utilities_index_.convertglyphconfig.md) |

**Returns:** [ConvertGlyphs](_utilities_index_.convertglyphs.md)

___

## Properties

<a id="glyphs"></a>

### `<Private>` glyphs

**● glyphs**: *[Glyph](../interfaces/_utilities_index_.glyph.md)[]*

*Defined in [utilities/index.ts:17](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L17)*

___
<a id="index"></a>

### `<Private>` index

**● index**: *`string`*

*Defined in [utilities/index.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L18)*

___
<a id="indexfiledestination"></a>

### `<Private>` indexFileDestination

**● indexFileDestination**: *`string`*

*Defined in [utilities/index.ts:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L20)*

___
<a id="indexfiletype"></a>

### `<Private>` indexFileType

**● indexFileType**: *[ExportFileType](../modules/_utilities_index_.md#exportfiletype)*

*Defined in [utilities/index.ts:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L19)*

___

## Methods

<a id="getglyphs"></a>

###  getGlyphs

▸ **getGlyphs**(glyphFolderPath: *`string`*, glyphFileExtension: *`string`*): [Glyph](../interfaces/_utilities_index_.glyph.md)[]

*Defined in [utilities/index.ts:36](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L36)*

Gets an object containing the glyph names and a string which represents the SVG

**Parameters:**

| Name | Type |
| ------ | ------ |
| glyphFolderPath | `string` |
| glyphFileExtension | `string` |

**Returns:** [Glyph](../interfaces/_utilities_index_.glyph.md)[]

___
<a id="getindexfilecontents"></a>

###  getIndexFileContents

▸ **getIndexFileContents**(): `string`

*Defined in [utilities/index.ts:62](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L62)*

Creates and returns the content to be used in the index file

**Returns:** `string`

___
<a id="normalizename"></a>

### `<Private>` normalizeName

▸ **normalizeName**(glyphName: *`string`*): `string`

*Defined in [utilities/index.ts:84](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L84)*

Normalizes the name of the glyph so that it does not use any characters that JavaScript cannot use in a variable name

**Parameters:**

| Name | Type |
| ------ | ------ |
| glyphName | `string` |

**Returns:** `string`

___
<a id="writeindexfile"></a>

### `<Private>` writeIndexFile

▸ **writeIndexFile**(): `void`

*Defined in [utilities/index.ts:76](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-glyphs-msft/utilities/index.ts#L76)*

Saves the index file containing the SVG string exports to disk

**Returns:** `void`

___

