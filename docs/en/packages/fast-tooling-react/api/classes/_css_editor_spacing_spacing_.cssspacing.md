[@microsoft/fast-tooling-react](../README.md) > ["css-editor/spacing/spacing"](../modules/_css_editor_spacing_spacing_.md) > [CSSSpacing](../classes/_css_editor_spacing_spacing_.cssspacing.md)

# Class: CSSSpacing

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md), [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md), [CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)>

**↳ CSSSpacing**

## Index

### Constructors

* [constructor](_css_editor_spacing_spacing_.cssspacing.md#constructor)

### Properties

* [referenceResolverStore](_css_editor_spacing_spacing_.cssspacing.md#referenceresolverstore)
* [referenceStore](_css_editor_spacing_spacing_.cssspacing.md#referencestore)
* [displayName](_css_editor_spacing_spacing_.cssspacing.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_css_editor_spacing_spacing_.cssspacing.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_css_editor_spacing_spacing_.cssspacing.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_css_editor_spacing_spacing_.cssspacing.md#unsafe_componentwillupdate)
* [componentDidCatch](_css_editor_spacing_spacing_.cssspacing.md#componentdidcatch)
* [componentDidMount](_css_editor_spacing_spacing_.cssspacing.md#componentdidmount)
* [componentDidUpdate](_css_editor_spacing_spacing_.cssspacing.md#componentdidupdate)
* [componentWillMount](_css_editor_spacing_spacing_.cssspacing.md#componentwillmount)
* [componentWillReceiveProps](_css_editor_spacing_spacing_.cssspacing.md#componentwillreceiveprops)
* [componentWillUnmount](_css_editor_spacing_spacing_.cssspacing.md#componentwillunmount)
* [componentWillUpdate](_css_editor_spacing_spacing_.cssspacing.md#componentwillupdate)
* [generateClassNames](_css_editor_spacing_spacing_.cssspacing.md#generateclassnames)
* [getRef](_css_editor_spacing_spacing_.cssspacing.md#getref)
* [getSnapshotBeforeUpdate](_css_editor_spacing_spacing_.cssspacing.md#getsnapshotbeforeupdate)
* [getTypeClassNames](_css_editor_spacing_spacing_.cssspacing.md#gettypeclassnames)
* [handleInputOnChange](_css_editor_spacing_spacing_.cssspacing.md#handleinputonchange)
* [handleMouseOut](_css_editor_spacing_spacing_.cssspacing.md#handlemouseout)
* [handleMouseOver](_css_editor_spacing_spacing_.cssspacing.md#handlemouseover)
* [handleTypeClick](_css_editor_spacing_spacing_.cssspacing.md#handletypeclick)
* [render](_css_editor_spacing_spacing_.cssspacing.md#render)
* [renderBase](_css_editor_spacing_spacing_.cssspacing.md#renderbase)
* [renderGrid](_css_editor_spacing_spacing_.cssspacing.md#rendergrid)
* [renderInput](_css_editor_spacing_spacing_.cssspacing.md#renderinput)
* [setRef](_css_editor_spacing_spacing_.cssspacing.md#setref)
* [shouldComponentUpdate](_css_editor_spacing_spacing_.cssspacing.md#shouldcomponentupdate)
* [unhandledProps](_css_editor_spacing_spacing_.cssspacing.md#unhandledprops)
* [withSlot](_css_editor_spacing_spacing_.cssspacing.md#withslot)
* [withoutSlot](_css_editor_spacing_spacing_.cssspacing.md#withoutslot)

### Object literals

* [handledProps](_css_editor_spacing_spacing_.cssspacing.md#handledprops)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new CSSSpacing**(props: *[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md)*): [CSSSpacing](_css_editor_spacing_spacing_.cssspacing.md)

*Defined in [css-editor/spacing/spacing.tsx:36](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L36)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) |

**Returns:** [CSSSpacing](_css_editor_spacing_spacing_.cssspacing.md)

___

## Properties

<a id="referenceresolverstore"></a>

### `<Protected>` referenceResolverStore

**● referenceResolverStore**: *`ReferenceResolverStore`*

*Inherited from Foundation.referenceResolverStore*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:51*

Store all memoized ref callbacks so they can quickly be accessed. Storing the functions allows us to not create new ref functions every update cycle

___
<a id="referencestore"></a>

### `<Protected>` referenceStore

**● referenceStore**: *`ReferenceStore`*

*Inherited from Foundation.referenceStore*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:55*

Location where all react element and component references are stored

___
<a id="displayname"></a>

### `<Static>` displayName

**● displayName**: *`string`* = "CSSSpacing"

*Defined in [css-editor/spacing/spacing.tsx:21](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L21)*

___

## Methods

<a id="unsafe_componentwillmount"></a>

### `<Optional>` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:618*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="unsafe_componentwillreceiveprops"></a>

### `<Optional>` UNSAFE_componentWillReceiveProps

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:650*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:678*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:547*

Catches exceptions generated in descendant components. Unhandled exceptions will cause the entire component tree to unmount.

**Parameters:**

| Name | Type |
| ------ | ------ |
| error | `Error` |
| errorInfo | `ErrorInfo` |

**Returns:** `void`

___
<a id="componentdidmount"></a>

### `<Optional>` componentDidMount

▸ **componentDidMount**(): `void`

*Inherited from ComponentLifecycle.componentDidMount*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:526*

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** `void`

___
<a id="componentdidupdate"></a>

### `<Optional>` componentDidUpdate

▸ **componentDidUpdate**(prevProps: *`Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:589*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)> |
| `Optional` snapshot | `SS` |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:604*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

###  componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md)*): `void`

*Overrides DeprecatedLifecycle.componentWillReceiveProps*

*Defined in [css-editor/spacing/spacing.tsx:57](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | [CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:542*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:663*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(componentClasses?: *`string`*): `string` \| `null`

*Inherited from Foundation.generateClassNames*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:79*

Joins any string with the className prop passed to the component. Used for applying a className to the root element of a component's render function.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` componentClasses | `string` |

**Returns:** `string` \| `null`

___
<a id="getref"></a>

### `<Protected>` getRef

▸ **getRef**(...args: *`Array`<`string` \| `number`>*): `React.ReactNode`

*Inherited from Foundation.getRef*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:70*

Get a reference by key , where function arguments are used as to create the keyname, eg. getRef('foo', 'bar', 0) resolves to this.references.foo.bar\[0\];

Usage: const contentContainer = this.getRef("content-container");

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `Array`<`string` \| `number`> |

**Returns:** `React.ReactNode`

___
<a id="getsnapshotbeforeupdate"></a>

### `<Optional>` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)> |

**Returns:** `SS` \| `null`

___
<a id="gettypeclassnames"></a>

### `<Private>` getTypeClassNames

▸ **getTypeClassNames**(spacingType: *[SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md)*): `string`

*Defined in [css-editor/spacing/spacing.tsx:139](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L139)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| spacingType | [SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md) |

**Returns:** `string`

___
<a id="handleinputonchange"></a>

### `<Private>` handleInputOnChange

▸ **handleInputOnChange**(cssKey: *[SpacingProperty](../enums/_css_editor_spacing_spacing_props_.spacingproperty.md)*): `function`

*Defined in [css-editor/spacing/spacing.tsx:207](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L207)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| cssKey | [SpacingProperty](../enums/_css_editor_spacing_spacing_props_.spacingproperty.md) |

**Returns:** `function`

___
<a id="handlemouseout"></a>

### `<Private>` handleMouseOut

▸ **handleMouseOut**(e: *`MouseEvent`<`HTMLDivElement`>*): `void`

*Defined in [css-editor/spacing/spacing.tsx:199](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L199)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLDivElement`> |

**Returns:** `void`

___
<a id="handlemouseover"></a>

### `<Private>` handleMouseOver

▸ **handleMouseOver**(spacingType?: *[SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md)*): `function`

*Defined in [css-editor/spacing/spacing.tsx:183](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L183)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` spacingType | [SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md) |

**Returns:** `function`

___
<a id="handletypeclick"></a>

### `<Private>` handleTypeClick

▸ **handleTypeClick**(spacingType: *[SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md)*): `function`

*Defined in [css-editor/spacing/spacing.tsx:167](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L167)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| spacingType | [SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md) |

**Returns:** `function`

___
<a id="render"></a>

###  render

▸ **render**(): `React.ReactNode`

*Defined in [css-editor/spacing/spacing.tsx:49](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L49)*

**Returns:** `React.ReactNode`

___
<a id="renderbase"></a>

### `<Private>` renderBase

▸ **renderBase**(activeType: *[SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md)*): `React.ReactNode`

*Defined in [css-editor/spacing/spacing.tsx:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| activeType | [SpacingType](../enums/_css_editor_spacing_spacing_props_.spacingtype.md) |

**Returns:** `React.ReactNode`

___
<a id="rendergrid"></a>

### `<Private>` renderGrid

▸ **renderGrid**(): `React.ReactNode`

*Defined in [css-editor/spacing/spacing.tsx:94](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L94)*

**Returns:** `React.ReactNode`

___
<a id="renderinput"></a>

### `<Private>` renderInput

▸ **renderInput**(spacingKey: *[SpacingProperty](../enums/_css_editor_spacing_spacing_props_.spacingproperty.md)*): `React.ReactNode`

*Defined in [css-editor/spacing/spacing.tsx:128](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L128)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| spacingKey | [SpacingProperty](../enums/_css_editor_spacing_spacing_props_.spacingproperty.md) |

**Returns:** `React.ReactNode`

___
<a id="setref"></a>

### `<Protected>` setRef

▸ **setRef**(...args: *`Array`<`string` \| `number`>*): `ReferenceResolver`

*Inherited from Foundation.setRef*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:63*

Stores a react ref callback under the path provided as arguments. Paths are resolved using lodash's get/set API. The reference object itself will be stored on the referenceStore under the path provided and can be accessed via the getRef method under the same path.

Usage: <div ref={this.setRef("content-container")} />

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `Array`<`string` \| `number`> |

**Returns:** `ReferenceResolver`

___
<a id="shouldcomponentupdate"></a>

### `<Optional>` shouldComponentUpdate

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSSpacingHandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacinghandledprops.md) & [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[CSSSpacingState](../interfaces/_css_editor_spacing_spacing_props_.cssspacingstate.md)> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [CSSSpacingUnhandledProps](../interfaces/_css_editor_spacing_spacing_props_.cssspacingunhandledprops.md)

___
<a id="withslot"></a>

### `<Protected>` withSlot

▸ **withSlot**<`T`>(slot: *`T` \| `T`[]*, nodes?: *`React.ReactNode`*): `React.ReactNode`

*Inherited from Foundation.withSlot*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:80*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| slot | `T` \| `T`[] |
| `Optional` nodes | `React.ReactNode` |

**Returns:** `React.ReactNode`

___
<a id="withoutslot"></a>

### `<Protected>` withoutSlot

▸ **withoutSlot**<`T`>(slot: *`T` \| `T`[]*, nodes?: *`React.ReactNode`*): `React.ReactNode`

*Inherited from Foundation.withoutSlot*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:81*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| slot | `T` \| `T`[] |
| `Optional` nodes | `React.ReactNode` |

**Returns:** `React.ReactNode`

___

## Object literals

<a id="handledprops"></a>

### `<Protected>` handledProps

**handledProps**: *`object`*

*Overrides Foundation.handledProps*

*Defined in [css-editor/spacing/spacing.tsx:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L23)*

<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:35](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L35)*

___
<a id="handledprops.marginbottom"></a>

####  marginBottom

**● marginBottom**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L27)*

___
<a id="handledprops.marginleft"></a>

####  marginLeft

**● marginLeft**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L28)*

___
<a id="handledprops.marginright"></a>

####  marginRight

**● marginRight**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L26)*

___
<a id="handledprops.margintop"></a>

####  marginTop

**● marginTop**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L25)*

___
<a id="handledprops.onspacingtypeupdate"></a>

####  onSpacingTypeUpdate

**● onSpacingTypeUpdate**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L33)*

___
<a id="handledprops.onspacingupdate"></a>

####  onSpacingUpdate

**● onSpacingUpdate**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L34)*

___
<a id="handledprops.paddingbottom"></a>

####  paddingBottom

**● paddingBottom**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:31](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L31)*

___
<a id="handledprops.paddingleft"></a>

####  paddingLeft

**● paddingLeft**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L32)*

___
<a id="handledprops.paddingright"></a>

####  paddingRight

**● paddingRight**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:30](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L30)*

___
<a id="handledprops.paddingtop"></a>

####  paddingTop

**● paddingTop**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L29)*

___
<a id="handledprops.spacingtype"></a>

####  spacingType

**● spacingType**: *`undefined`* =  void 0

*Defined in [css-editor/spacing/spacing.tsx:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/spacing/spacing.tsx#L24)*

___

___

