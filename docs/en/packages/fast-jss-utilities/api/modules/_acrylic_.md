[@microsoft/fast-jss-utilities](../README.md) > ["acrylic"](../modules/_acrylic_.md)

# External module: "acrylic"

## Index

### Interfaces

* [AcrylicConfig](../interfaces/_acrylic_.acrylicconfig.md)

### Variables

* [backdropFilterSupport](_acrylic_.md#backdropfiltersupport)

### Functions

* [applyAcrylic](_acrylic_.md#applyacrylic)

---

## Variables

<a id="backdropfiltersupport"></a>

### `<Const>` backdropFilterSupport

**● backdropFilterSupport**: *`boolean`* = 
    "backdrop-filter" in document.documentElement.style ||
    "-webkit-backdrop-filter" in document.documentElement.style

*Defined in [acrylic.ts:22](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/acrylic.ts#L22)*

___

## Functions

<a id="applyacrylic"></a>

###  applyAcrylic

▸ **applyAcrylic**<`T`>(config: *[AcrylicConfig](../interfaces/_acrylic_.acrylicconfig.md)*): `CSSRules`<`T`>

*Defined in [acrylic.ts:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/acrylic.ts#L29)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [AcrylicConfig](../interfaces/_acrylic_.acrylicconfig.md) |

**Returns:** `CSSRules`<`T`>

___

