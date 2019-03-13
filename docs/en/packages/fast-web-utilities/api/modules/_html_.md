[@microsoft/fast-web-utilities](../README.md) > ["html"](../modules/_html_.md)

# External module: "html"

## Index

### Interfaces

* [ClientRectWithMargin](../interfaces/_html_.clientrectwithmargin.md)

### Functions

* [convertStylePropertyPixelsToNumber](_html_.md#convertstylepropertypixelstonumber)
* [getClientRectWithMargin](_html_.md#getclientrectwithmargin)

---

## Functions

<a id="convertstylepropertypixelstonumber"></a>

###  convertStylePropertyPixelsToNumber

▸ **convertStylePropertyPixelsToNumber**(computedStyle: *`CSSStyleDeclaration`*, property: *`string`*): `number`

*Defined in [html.ts:37](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/html.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| computedStyle | `CSSStyleDeclaration` |
| property | `string` |

**Returns:** `number`

___
<a id="getclientrectwithmargin"></a>

###  getClientRectWithMargin

▸ **getClientRectWithMargin**(element: *`HTMLElement`*): [ClientRectWithMargin](../interfaces/_html_.clientrectwithmargin.md)

*Defined in [html.ts:13](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/html.ts#L13)*

Gets the client bounding rectangle including any margins of an element.

**Parameters:**

| Name | Type |
| ------ | ------ |
| element | `HTMLElement` |

**Returns:** [ClientRectWithMargin](../interfaces/_html_.clientrectwithmargin.md)

___

