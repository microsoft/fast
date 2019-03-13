[@microsoft/fast-css-editor-react](../README.md) > ["position/position"](../modules/_position_position_.md) > [CSSPosition](../classes/_position_position_.cssposition.md)

# Class: CSSPosition

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md), [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md), `__type`>

**↳ CSSPosition**

## Index

### Properties

* [referenceResolverStore](_position_position_.cssposition.md#referenceresolverstore)
* [referenceStore](_position_position_.cssposition.md#referencestore)
* [displayName](_position_position_.cssposition.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_position_position_.cssposition.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_position_position_.cssposition.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_position_position_.cssposition.md#unsafe_componentwillupdate)
* [assignUpdatedProps](_position_position_.cssposition.md#assignupdatedprops)
* [componentDidCatch](_position_position_.cssposition.md#componentdidcatch)
* [componentDidMount](_position_position_.cssposition.md#componentdidmount)
* [componentDidUpdate](_position_position_.cssposition.md#componentdidupdate)
* [componentWillMount](_position_position_.cssposition.md#componentwillmount)
* [componentWillReceiveProps](_position_position_.cssposition.md#componentwillreceiveprops)
* [componentWillUnmount](_position_position_.cssposition.md#componentwillunmount)
* [componentWillUpdate](_position_position_.cssposition.md#componentwillupdate)
* [generateCenterRowClassNames](_position_position_.cssposition.md#generatecenterrowclassnames)
* [generateClassNames](_position_position_.cssposition.md#generateclassnames)
* [getExcludedLocation](_position_position_.cssposition.md#getexcludedlocation)
* [getRef](_position_position_.cssposition.md#getref)
* [getSnapshotBeforeUpdate](_position_position_.cssposition.md#getsnapshotbeforeupdate)
* [getUpdatedPositions](_position_position_.cssposition.md#getupdatedpositions)
* [handleLocationInputOnChange](_position_position_.cssposition.md#handlelocationinputonchange)
* [handleOnChange](_position_position_.cssposition.md#handleonchange)
* [handlePositionOnChange](_position_position_.cssposition.md#handlepositiononchange)
* [render](_position_position_.cssposition.md#render)
* [renderControls](_position_position_.cssposition.md#rendercontrols)
* [renderLocationInput](_position_position_.cssposition.md#renderlocationinput)
* [setRef](_position_position_.cssposition.md#setref)
* [shouldComponentUpdate](_position_position_.cssposition.md#shouldcomponentupdate)
* [unhandledProps](_position_position_.cssposition.md#unhandledprops)
* [withSlot](_position_position_.cssposition.md#withslot)
* [withoutSlot](_position_position_.cssposition.md#withoutslot)

### Object literals

* [handledProps](_position_position_.cssposition.md#handledprops)

---

## Properties

<a id="referenceresolverstore"></a>

### `<Protected>` referenceResolverStore

**● referenceResolverStore**: *`ReferenceResolverStore`*

*Inherited from Foundation.referenceResolverStore*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:51*

Store all memoized ref callbacks so they can quickly be accessed. Storing the functions allows us to not create new ref functions every update cycle

___
<a id="referencestore"></a>

### `<Protected>` referenceStore

**● referenceStore**: *`ReferenceStore`*

*Inherited from Foundation.referenceStore*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:55*

Location where all react element and component references are stored

___
<a id="displayname"></a>

### `<Static>` displayName

**● displayName**: *`string`* = "CSSPosition"

*Defined in [position/position.tsx:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L20)*

___

## Methods

<a id="unsafe_componentwillmount"></a>

### `<Optional>` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:618*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:650*

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
| nextProps | `Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:678*

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
| nextProps | `Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="assignupdatedprops"></a>

### `<Private>` assignUpdatedProps

▸ **assignUpdatedProps**(props: *`string`[]*, updatedPropKey: *`string`*, updatedPropValue: *`string`*): [CSSPositionValues](../interfaces/_position_position_props_.csspositionvalues.md)

*Defined in [position/position.tsx:158](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L158)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | `string`[] |
| updatedPropKey | `string` |
| updatedPropValue | `string` |

**Returns:** [CSSPositionValues](../interfaces/_position_position_props_.csspositionvalues.md)

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:547*

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

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:526*

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** `void`

___
<a id="componentdidupdate"></a>

### `<Optional>` componentDidUpdate

▸ **componentDidUpdate**(prevProps: *`Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:589*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<`__type`> |
| `Optional` snapshot | `SS` |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:604*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:633*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:542*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:663*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="generatecenterrowclassnames"></a>

### `<Private>` generateCenterRowClassNames

▸ **generateCenterRowClassNames**(): `string`

*Defined in [position/position.tsx:102](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L102)*

**Returns:** `string`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(componentClasses?: *`string`*): `string` \| `null`

*Inherited from Foundation.generateClassNames*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:79*

Joins any string with the className prop passed to the component. Used for applying a className to the root element of a component's render function.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` componentClasses | `string` |

**Returns:** `string` \| `null`

___
<a id="getexcludedlocation"></a>

### `<Private>` getExcludedLocation

▸ **getExcludedLocation**(updatedPropKey: *[Location](../enums/_position_position_props_.location.md)*): [Location](../enums/_position_position_props_.location.md)

*Defined in [position/position.tsx:208](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L208)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| updatedPropKey | [Location](../enums/_position_position_props_.location.md) |

**Returns:** [Location](../enums/_position_position_props_.location.md)

___
<a id="getref"></a>

### `<Protected>` getRef

▸ **getRef**(...args: *`Array`<`string` \| `number`>*): `React.ReactNode`

*Inherited from Foundation.getRef*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:70*

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<`__type`> |

**Returns:** `SS` \| `null`

___
<a id="getupdatedpositions"></a>

### `<Private>` getUpdatedPositions

▸ **getUpdatedPositions**(props: *`string`[]*, updatedPropKey: *[Location](../enums/_position_position_props_.location.md)*, updatedPropValue: *`string`*): `Partial`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md)>

*Defined in [position/position.tsx:184](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L184)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | `string`[] |
| updatedPropKey | [Location](../enums/_position_position_props_.location.md) |
| updatedPropValue | `string` |

**Returns:** `Partial`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md)>

___
<a id="handlelocationinputonchange"></a>

### `<Private>` handleLocationInputOnChange

▸ **handleLocationInputOnChange**(location: *[Location](../enums/_position_position_props_.location.md)*): `function`

*Defined in [position/position.tsx:138](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L138)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | [Location](../enums/_position_position_props_.location.md) |

**Returns:** `function`

___
<a id="handleonchange"></a>

### `<Private>` handleOnChange

▸ **handleOnChange**(value: *`string`*, cssKey: *[Location](../enums/_position_position_props_.location.md) \| "position"*): `void`

*Defined in [position/position.tsx:146](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L146)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` |
| cssKey | [Location](../enums/_position_position_props_.location.md) \| "position" |

**Returns:** `void`

___
<a id="handlepositiononchange"></a>

### `<Private>` handlePositionOnChange

▸ **handlePositionOnChange**(e: *`ChangeEvent`<`HTMLSelectElement`>*): `void`

*Defined in [position/position.tsx:134](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `ChangeEvent`<`HTMLSelectElement`> |

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `React.ReactNode`

*Defined in [position/position.tsx:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L32)*

**Returns:** `React.ReactNode`

___
<a id="rendercontrols"></a>

### `<Private>` renderControls

▸ **renderControls**(position?: *[PositionValue](../enums/_position_position_props_.positionvalue.md)*): `Element`

*Defined in [position/position.tsx:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` position | [PositionValue](../enums/_position_position_props_.positionvalue.md) |

**Returns:** `Element`

___
<a id="renderlocationinput"></a>

### `<Private>` renderLocationInput

▸ **renderLocationInput**(location: *[Location](../enums/_position_position_props_.location.md)*): `Element`

*Defined in [position/position.tsx:91](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L91)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| location | [Location](../enums/_position_position_props_.location.md) |

**Returns:** `Element`

___
<a id="setref"></a>

### `<Protected>` setRef

▸ **setRef**(...args: *`Array`<`string` \| `number`>*): `ReferenceResolver`

*Inherited from Foundation.setRef*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:63*

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

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSPositionHandledProps](../interfaces/_position_position_props_.csspositionhandledprops.md) & [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [CSSPositionUnhandledProps](../interfaces/_position_position_props_.csspositionunhandledprops.md)

___
<a id="withslot"></a>

### `<Protected>` withSlot

▸ **withSlot**<`T`>(slot: *`T` \| `T`[]*, nodes?: *`React.ReactNode`*): `React.ReactNode`

*Inherited from Foundation.withSlot*

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:80*

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

*Defined in D:/projects/fast-dna/packages/fast-css-editor-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:81*

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

*Defined in [position/position.tsx:22](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L22)*

<a id="handledprops.bottom"></a>

####  bottom

**● bottom**: *`undefined`* =  void 0

*Defined in [position/position.tsx:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L25)*

___
<a id="handledprops.left"></a>

####  left

**● left**: *`undefined`* =  void 0

*Defined in [position/position.tsx:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L26)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [position/position.tsx:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L29)*

___
<a id="handledprops.onpositionupdate"></a>

####  onPositionUpdate

**● onPositionUpdate**: *`undefined`* =  void 0

*Defined in [position/position.tsx:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L28)*

___
<a id="handledprops.position"></a>

####  position

**● position**: *`undefined`* =  void 0

*Defined in [position/position.tsx:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L23)*

___
<a id="handledprops.right"></a>

####  right

**● right**: *`undefined`* =  void 0

*Defined in [position/position.tsx:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L27)*

___
<a id="handledprops.top"></a>

####  top

**● top**: *`undefined`* =  void 0

*Defined in [position/position.tsx:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-css-editor-react/src/position/position.tsx#L24)*

___

___

