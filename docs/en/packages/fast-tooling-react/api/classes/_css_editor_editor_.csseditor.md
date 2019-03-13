[@microsoft/fast-tooling-react](../README.md) > ["css-editor/editor"](../modules/_css_editor_editor_.md) > [CSSEditor](../classes/_css_editor_editor_.csseditor.md)

# Class: CSSEditor

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md), [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md), `__type`>

**↳ CSSEditor**

## Index

### Properties

* [referenceResolverStore](_css_editor_editor_.csseditor.md#referenceresolverstore)
* [referenceStore](_css_editor_editor_.csseditor.md#referencestore)
* [displayName](_css_editor_editor_.csseditor.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_css_editor_editor_.csseditor.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_css_editor_editor_.csseditor.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_css_editor_editor_.csseditor.md#unsafe_componentwillupdate)
* [componentDidCatch](_css_editor_editor_.csseditor.md#componentdidcatch)
* [componentDidMount](_css_editor_editor_.csseditor.md#componentdidmount)
* [componentDidUpdate](_css_editor_editor_.csseditor.md#componentdidupdate)
* [componentWillMount](_css_editor_editor_.csseditor.md#componentwillmount)
* [componentWillReceiveProps](_css_editor_editor_.csseditor.md#componentwillreceiveprops)
* [componentWillUnmount](_css_editor_editor_.csseditor.md#componentwillunmount)
* [componentWillUpdate](_css_editor_editor_.csseditor.md#componentwillupdate)
* [generateClassNames](_css_editor_editor_.csseditor.md#generateclassnames)
* [getOmittedProps](_css_editor_editor_.csseditor.md#getomittedprops)
* [getRef](_css_editor_editor_.csseditor.md#getref)
* [getSnapshotBeforeUpdate](_css_editor_editor_.csseditor.md#getsnapshotbeforeupdate)
* [handlePositionUpdate](_css_editor_editor_.csseditor.md#handlepositionupdate)
* [handleSpacingUpdate](_css_editor_editor_.csseditor.md#handlespacingupdate)
* [render](_css_editor_editor_.csseditor.md#render)
* [renderPosition](_css_editor_editor_.csseditor.md#renderposition)
* [setRef](_css_editor_editor_.csseditor.md#setref)
* [shouldComponentUpdate](_css_editor_editor_.csseditor.md#shouldcomponentupdate)
* [unhandledProps](_css_editor_editor_.csseditor.md#unhandledprops)
* [withSlot](_css_editor_editor_.csseditor.md#withslot)
* [withoutSlot](_css_editor_editor_.csseditor.md#withoutslot)

### Object literals

* [handledProps](_css_editor_editor_.csseditor.md#handledprops)

---

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

**● displayName**: *`string`* = "CSSEditor"

*Defined in [css-editor/editor.tsx:16](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L16)*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
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

▸ **componentDidUpdate**(prevProps: *`Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:589*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<`__type`> |
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

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:633*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

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

▸ **componentWillUpdate**(nextProps: *`Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
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
<a id="getomittedprops"></a>

### `<Private>` getOmittedProps

▸ **getOmittedProps**(): `string`[]

*Defined in [css-editor/editor.tsx:74](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L74)*

**Returns:** `string`[]

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<`__type`> |

**Returns:** `SS` \| `null`

___
<a id="handlepositionupdate"></a>

### `<Private>` handlePositionUpdate

▸ **handlePositionUpdate**(position: *[CSSPositionValues](../interfaces/_css_editor_position_position_props_.csspositionvalues.md)*): `void`

*Defined in [css-editor/editor.tsx:78](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| position | [CSSPositionValues](../interfaces/_css_editor_position_position_props_.csspositionvalues.md) |

**Returns:** `void`

___
<a id="handlespacingupdate"></a>

### `<Private>` handleSpacingUpdate

▸ **handleSpacingUpdate**(spacing: *[CSSSpacingValues](../interfaces/_css_editor_spacing_spacing_props_.cssspacingvalues.md)*): `void`

*Defined in [css-editor/editor.tsx:94](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| spacing | [CSSSpacingValues](../interfaces/_css_editor_spacing_spacing_props_.cssspacingvalues.md) |

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `React.ReactNode`

*Defined in [css-editor/editor.tsx:38](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L38)*

**Returns:** `React.ReactNode`

___
<a id="renderposition"></a>

### `<Private>` renderPosition

▸ **renderPosition**(): `React.ReactNode`

*Defined in [css-editor/editor.tsx:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L46)*

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

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[CSSEditorHandledProps](../interfaces/_css_editor_editor_props_.csseditorhandledprops.md) & [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [CSSEditorUnhandledProps](../interfaces/_css_editor_editor_props_.csseditorunhandledprops.md)

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

*Defined in [css-editor/editor.tsx:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L18)*

<a id="handledprops.bottom"></a>

####  bottom

**● bottom**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:21](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L21)*

___
<a id="handledprops.left"></a>

####  left

**● left**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:22](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L22)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:35](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L35)*

___
<a id="handledprops.marginbottom"></a>

####  marginBottom

**● marginBottom**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L26)*

___
<a id="handledprops.marginleft"></a>

####  marginLeft

**● marginLeft**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L28)*

___
<a id="handledprops.marginright"></a>

####  marginRight

**● marginRight**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L29)*

___
<a id="handledprops.margintop"></a>

####  marginTop

**● marginTop**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L27)*

___
<a id="handledprops.onpositionupdate"></a>

####  onPositionUpdate

**● onPositionUpdate**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L24)*

___
<a id="handledprops.onspacingupdate"></a>

####  onSpacingUpdate

**● onSpacingUpdate**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L34)*

___
<a id="handledprops.paddingbottom"></a>

####  paddingBottom

**● paddingBottom**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:30](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L30)*

___
<a id="handledprops.paddingleft"></a>

####  paddingLeft

**● paddingLeft**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L32)*

___
<a id="handledprops.paddingright"></a>

####  paddingRight

**● paddingRight**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L33)*

___
<a id="handledprops.paddingtop"></a>

####  paddingTop

**● paddingTop**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:31](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L31)*

___
<a id="handledprops.position"></a>

####  position

**● position**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L19)*

___
<a id="handledprops.right"></a>

####  right

**● right**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L23)*

___
<a id="handledprops.spacingtype"></a>

####  spacingType

**● spacingType**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L25)*

___
<a id="handledprops.top"></a>

####  top

**● top**: *`undefined`* =  void 0

*Defined in [css-editor/editor.tsx:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/css-editor/editor.tsx#L20)*

___

___

