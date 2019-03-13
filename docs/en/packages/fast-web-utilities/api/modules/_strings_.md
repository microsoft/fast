[@microsoft/fast-web-utilities](../README.md) > ["strings"](../modules/_strings_.md)

# External module: "strings"

## Index

### Functions

* [format](_strings_.md#format)
* [isNullOrWhiteSpace](_strings_.md#isnullorwhitespace)
* [pascalCase](_strings_.md#pascalcase)
* [startsWith](_strings_.md#startswith)

---

## Functions

<a id="format"></a>

###  format

▸ **format**(formatSpecifier: *`string`*, ...parameters: *`string`[]*): `string`

*Defined in [strings.ts:6](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/strings.ts#L6)*

Builds a string from a format specifier and replacement parameters.

**Parameters:**

| Name | Type |
| ------ | ------ |
| formatSpecifier | `string` |
| `Rest` parameters | `string`[] |

**Returns:** `string`

___
<a id="isnullorwhitespace"></a>

###  isNullOrWhiteSpace

▸ **isNullOrWhiteSpace**(value: *`string`*): `boolean`

*Defined in [strings.ts:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/strings.ts#L44)*

Determines if the specified string is undefined, null, empty, or whitespace. True if the value is undefined, null, empty, or whitespace, otherwise false.

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` |

**Returns:** `boolean`

___
<a id="pascalcase"></a>

###  pascalCase

▸ **pascalCase**(value: *`string`*): `string`

*Defined in [strings.ts:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/strings.ts#L51)*

Converts a string to Pascal Case

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` |

**Returns:** `string`

___
<a id="startswith"></a>

###  startsWith

▸ **startsWith**(stringToSearch: *`string`*, searchFor: *`string`*, position?: *`number`*): `boolean`

*Defined in [strings.ts:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-web-utilities/src/strings.ts#L28)*

Check to see if one string starts with another

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| stringToSearch | `string` | - |
| searchFor | `string` | - |
| `Default value` position | `number` | 0 |

**Returns:** `boolean`

___

