[@microsoft/fast-components-foundation-react](../README.md) > ["foundation/foundation"](../modules/_foundation_foundation_.md)

# External module: "foundation/foundation"

## Index

### Interfaces

* [ReferenceResolverStore](../interfaces/_foundation_foundation_.referenceresolverstore.md)
* [ReferenceStore](../interfaces/_foundation_foundation_.referencestore.md)

### Type aliases

* [HandledProps](_foundation_foundation_.md#handledprops)
* [ReferenceResolver](_foundation_foundation_.md#referenceresolver)

---

## Type aliases

<a id="handledprops"></a>

###  HandledProps

**Ƭ HandledProps**: *`object`*

*Defined in [foundation/foundation.ts:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-foundation-react/src/foundation/foundation.ts#L24)*

Describes the object that enumerates all handled props for a component. This object includes all props that are in some way consumed or manipulated by component code. These props will not be mapped onto the underlying root DOM node

#### Type declaration

___
<a id="referenceresolver"></a>

###  ReferenceResolver

**Ƭ ReferenceResolver**: *`function`*

*Defined in [foundation/foundation.ts:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-foundation-react/src/foundation/foundation.ts#L29)*

Describes a function that that resolves a react reference element or component.

#### Type declaration
▸<`T`>(reference: *`T`*): `void`

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| reference | `T` |

**Returns:** `void`

___

