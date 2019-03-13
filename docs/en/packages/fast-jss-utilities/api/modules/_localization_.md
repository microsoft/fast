[@microsoft/fast-jss-utilities](../README.md) > ["localization"](../modules/_localization_.md)

# External module: "localization"

## Index

### Enumerations

* [Direction](../enums/_localization_.direction.md)

### Functions

* [applyLocalizedProperty](_localization_.md#applylocalizedproperty)
* [localizeSpacing](_localization_.md#localizespacing)

---

## Functions

<a id="applylocalizedproperty"></a>

###  applyLocalizedProperty

▸ **applyLocalizedProperty**(ltrProperty: *`string`*, rtlProperty: *`string`*, dir: *[Direction](../enums/_localization_.direction.md)*): `string`

*Defined in [localization.ts:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/localization.ts#L34)*

Returns a css property based on a given direction value

**Parameters:**

| Name | Type |
| ------ | ------ |
| ltrProperty | `string` |
| rtlProperty | `string` |
| dir | [Direction](../enums/_localization_.direction.md) |

**Returns:** `string`

___
<a id="localizespacing"></a>

###  localizeSpacing

▸ **localizeSpacing**(dir: *[Direction](../enums/_localization_.direction.md)*): `function`

*Defined in [localization.ts:14](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/localization.ts#L14)*

Localizes top/left/bottom/right formatted arguments, such as the format used by CSS's padding and margin properties. eg. when dir is RTL, "2px 3px 4px 5px" -> "2px 5px 4px 3px"

**Parameters:**

| Name | Type |
| ------ | ------ |
| dir | [Direction](../enums/_localization_.direction.md) |

**Returns:** `function`

___

