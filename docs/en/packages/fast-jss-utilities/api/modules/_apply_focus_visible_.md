[@microsoft/fast-jss-utilities](../README.md) > ["apply-focus-visible"](../modules/_apply_focus_visible_.md)

# External module: "apply-focus-visible"

## Index

### Functions

* [applyFocusVisible](_apply_focus_visible_.md#applyfocusvisible)
* [applyFocusVisiblePolyfillSelector](_apply_focus_visible_.md#applyfocusvisiblepolyfillselector)
* [applyFocusVisibleSelector](_apply_focus_visible_.md#applyfocusvisibleselector)

---

## Functions

<a id="applyfocusvisible"></a>

###  applyFocusVisible

▸ **applyFocusVisible**<`T`>(styles: *`CSSRules`<`T`>*): `CSSRules`<`T`>

▸ **applyFocusVisible**<`T`>(selector: *`string`*, styles: *`CSSRules`<`T`>*): `CSSRules`<`T`>

*Defined in [apply-focus-visible.ts:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/apply-focus-visible.ts#L19)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| styles | `CSSRules`<`T`> |

**Returns:** `CSSRules`<`T`>

*Defined in [apply-focus-visible.ts:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/apply-focus-visible.ts#L20)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| selector | `string` |
| styles | `CSSRules`<`T`> |

**Returns:** `CSSRules`<`T`>

___
<a id="applyfocusvisiblepolyfillselector"></a>

###  applyFocusVisiblePolyfillSelector

▸ **applyFocusVisiblePolyfillSelector**(selector?: *`string`*): `string`

*Defined in [apply-focus-visible.ts:15](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/apply-focus-visible.ts#L15)*

Returns the selector for the focus-visible polyfill

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` selector | `string` | &quot;&quot; |

**Returns:** `string`

___
<a id="applyfocusvisibleselector"></a>

###  applyFocusVisibleSelector

▸ **applyFocusVisibleSelector**(selector?: *`string`*): `string`

*Defined in [apply-focus-visible.ts:8](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-utilities/src/apply-focus-visible.ts#L8)*

Returns the selector for the browser native :focus-visible implementation

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` selector | `string` | &quot;&quot; |

**Returns:** `string`

___

