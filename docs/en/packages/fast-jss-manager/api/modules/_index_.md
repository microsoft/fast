[@microsoft/fast-jss-manager](../README.md) > ["index"](../modules/_index_.md)

# External module: "index"

## Index

### Interfaces

* [CSSRules](../interfaces/_index_.cssrules.md)
* [NestedAtRules](../interfaces/_index_.nestedatrules.md)

### Type aliases

* [CSSRuleResolver](_index_.md#cssruleresolver)
* [CSSStaticRule](_index_.md#cssstaticrule)
* [ComponentClassNameStyleSheet](_index_.md#componentclassnamestylesheet)
* [ComponentStyleSheet](_index_.md#componentstylesheet)
* [ComponentStyleSheetResolver](_index_.md#componentstylesheetresolver)
* [ComponentStyles](_index_.md#componentstyles)

---

## Type aliases

<a id="cssruleresolver"></a>

###  CSSRuleResolver

**Ƭ CSSRuleResolver**: *`function`*

*Defined in [index.ts:15](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager/src/index.ts#L15)*

Type definition for a function that resolves to a CSS property value. It optionally expects a config object.

#### Type declaration
▸(config?: *`T`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` config | `T` |

**Returns:** `string`

___
<a id="cssstaticrule"></a>

###  CSSStaticRule

**Ƭ CSSStaticRule**: *`Properties` \| `string`*

*Defined in [index.ts:8](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager/src/index.ts#L8)*

Define a static CSS Rule

___
<a id="componentclassnamestylesheet"></a>

###  ComponentClassNameStyleSheet

**Ƭ ComponentClassNameStyleSheet**: *`object`*

*Defined in [index.ts:66](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager/src/index.ts#L66)*

Describes a JSS style object.

#### Type declaration

___
<a id="componentstylesheet"></a>

###  ComponentStyleSheet

**Ƭ ComponentStyleSheet**: *[ComponentClassNameStyleSheet](_index_.md#componentclassnamestylesheet)<`T`, `C`> & [NestedAtRules](../interfaces/_index_.nestedatrules.md)<`C`>*

*Defined in [index.ts:68](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager/src/index.ts#L68)*

___
<a id="componentstylesheetresolver"></a>

###  ComponentStyleSheetResolver

**Ƭ ComponentStyleSheetResolver**: *`function`*

*Defined in [index.ts:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager/src/index.ts#L44)*

A function that resolves to a static JSS stylesheet

#### Type declaration
▸(config: *`C`*): [ComponentStyleSheet](_index_.md#componentstylesheet)<`T`, `C`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | `C` |

**Returns:** [ComponentStyleSheet](_index_.md#componentstylesheet)<`T`, `C`>

___
<a id="componentstyles"></a>

###  ComponentStyles

**Ƭ ComponentStyles**: *[ComponentStyleSheet](_index_.md#componentstylesheet)<`T`, `C`> \| [ComponentStyleSheetResolver](_index_.md#componentstylesheetresolver)<`T`, `C`>*

*Defined in [index.ts:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager/src/index.ts#L33)*

A stylesheet supplied to a JSS manager

___

