[@microsoft/fast-jss-manager-react](../README.md) > ["jss-manager"](../modules/_jss_manager_.md)

# External module: "jss-manager"

## Index

### Interfaces

* [JSSManagedComponentProps](../interfaces/_jss_manager_.jssmanagedcomponentprops.md)
* [JSSStyleSheet](../interfaces/_jss_manager_.jssstylesheet.md)

### Type aliases

* [ManagedJSSProps](_jss_manager_.md#managedjssprops)

### Functions

* [mergeClassNames](_jss_manager_.md#mergeclassnames)

---

## Type aliases

<a id="managedjssprops"></a>

###  ManagedJSSProps

**Ƭ ManagedJSSProps**: *`Pick`<`T`, `Exclude`<`keyof T`, `keyof ManagedClasses<C>`>> & [JSSManagedComponentProps](../interfaces/_jss_manager_.jssmanagedcomponentprops.md)<`S`, `C`>*

*Defined in [jss-manager.tsx:35](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/jss-manager.tsx#L35)*

Prop typing for the JSSManager

___

## Functions

<a id="mergeclassnames"></a>

###  mergeClassNames

▸ **mergeClassNames**(a: *`string` \| `void`*, b: *`string` \| `void`*): `string` \| `void`

*Defined in [jss-manager.tsx:41](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/jss-manager.tsx#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| a | `string` \| `void` |
| b | `string` \| `void` |

**Returns:** `string` \| `void`

___

