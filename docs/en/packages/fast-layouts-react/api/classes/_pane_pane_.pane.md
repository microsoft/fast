[@microsoft/fast-layouts-react](../README.md) > ["pane/pane"](../modules/_pane_pane_.md) > [Pane](../classes/_pane_pane_.pane.md)

# Class: Pane

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md), [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md), [PaneState](../interfaces/_pane_pane_.panestate.md)>

**↳ Pane**

## Index

### Constructors

* [constructor](_pane_pane_.pane.md#constructor)

### Properties

* [referenceResolverStore](_pane_pane_.pane.md#referenceresolverstore)
* [referenceStore](_pane_pane_.pane.md#referencestore)
* [rootElement](_pane_pane_.pane.md#rootelement)
* [collapsedWidth](_pane_pane_.pane.md#collapsedwidth)
* [displayName](_pane_pane_.pane.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_pane_pane_.pane.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_pane_pane_.pane.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_pane_pane_.pane.md#unsafe_componentwillupdate)
* [componentDidCatch](_pane_pane_.pane.md#componentdidcatch)
* [componentDidMount](_pane_pane_.pane.md#componentdidmount)
* [componentDidUpdate](_pane_pane_.pane.md#componentdidupdate)
* [componentWillMount](_pane_pane_.pane.md#componentwillmount)
* [componentWillReceiveProps](_pane_pane_.pane.md#componentwillreceiveprops)
* [componentWillUnmount](_pane_pane_.pane.md#componentwillunmount)
* [componentWillUpdate](_pane_pane_.pane.md#componentwillupdate)
* [generateClassNames](_pane_pane_.pane.md#generateclassnames)
* [generateStyleAttribute](_pane_pane_.pane.md#generatestyleattribute)
* [getRef](_pane_pane_.pane.md#getref)
* [getSnapshotBeforeUpdate](_pane_pane_.pane.md#getsnapshotbeforeupdate)
* [getWidth](_pane_pane_.pane.md#getwidth)
* [onMouseDown](_pane_pane_.pane.md#onmousedown)
* [onMouseMove](_pane_pane_.pane.md#onmousemove)
* [onMouseUp](_pane_pane_.pane.md#onmouseup)
* [onWindowResize](_pane_pane_.pane.md#onwindowresize)
* [render](_pane_pane_.pane.md#render)
* [renderResizeControl](_pane_pane_.pane.md#renderresizecontrol)
* [setRef](_pane_pane_.pane.md#setref)
* [setWidth](_pane_pane_.pane.md#setwidth)
* [shouldComponentUpdate](_pane_pane_.pane.md#shouldcomponentupdate)
* [unhandledProps](_pane_pane_.pane.md#unhandledprops)
* [width](_pane_pane_.pane.md#width)
* [withSlot](_pane_pane_.pane.md#withslot)
* [withoutSlot](_pane_pane_.pane.md#withoutslot)

### Object literals

* [handledProps](_pane_pane_.pane.md#handledprops)
* [defaultProps](_pane_pane_.pane.md#defaultprops)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Pane**(props: *[PaneProps](../modules/_pane_pane_props_.md#paneprops)*): [Pane](_pane_pane_.pane.md)

*Defined in [pane/pane.tsx:135](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L135)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [PaneProps](../modules/_pane_pane_props_.md#paneprops) |

**Returns:** [Pane](_pane_pane_.pane.md)

___

## Properties

<a id="referenceresolverstore"></a>

### `<Protected>` referenceResolverStore

**● referenceResolverStore**: *`ReferenceResolverStore`*

*Inherited from Foundation.referenceResolverStore*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:51*

Store all memoized ref callbacks so they can quickly be accessed. Storing the functions allows us to not create new ref functions every update cycle

___
<a id="referencestore"></a>

### `<Protected>` referenceStore

**● referenceStore**: *`ReferenceStore`*

*Inherited from Foundation.referenceStore*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:55*

Location where all react element and component references are stored

___
<a id="rootelement"></a>

### `<Private>` rootElement

**● rootElement**: *`RefObject`<`HTMLDivElement`>*

*Defined in [pane/pane.tsx:135](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L135)*

Stores a reference to the pane HTML element

___
<a id="collapsedwidth"></a>

### `<Static>``<Private>` collapsedWidth

**● collapsedWidth**: *`number`* = 40

*Defined in [pane/pane.tsx:114](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L114)*

The width of a pane when it is collapsed

___
<a id="displayname"></a>

### `<Static>` displayName

**● displayName**: *`string`* = "Pane"

*Defined in [pane/pane.tsx:96](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L96)*

___

## Methods

<a id="unsafe_componentwillmount"></a>

### `<Optional>` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:618*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:650*

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
| nextProps | `Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:678*

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
| nextProps | `Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:547*

Catches exceptions generated in descendant components. Unhandled exceptions will cause the entire component tree to unmount.

**Parameters:**

| Name | Type |
| ------ | ------ |
| error | `Error` |
| errorInfo | `ErrorInfo` |

**Returns:** `void`

___
<a id="componentdidmount"></a>

###  componentDidMount

▸ **componentDidMount**(): `void`

*Overrides ComponentLifecycle.componentDidMount*

*Defined in [pane/pane.tsx:161](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L161)*

Handle when component is mounted to the DOM

**Returns:** `void`

___
<a id="componentdidupdate"></a>

###  componentDidUpdate

▸ **componentDidUpdate**(prevProps: *[PaneProps](../modules/_pane_pane_props_.md#paneprops)*, prevState: *[PaneState](../interfaces/_pane_pane_.panestate.md)*): `void`

*Overrides NewLifecycle.componentDidUpdate*

*Defined in [pane/pane.tsx:179](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L179)*

Handle when component updates

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | [PaneProps](../modules/_pane_pane_props_.md#paneprops) |
| prevState | [PaneState](../interfaces/_pane_pane_.panestate.md) |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:604*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:633*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

###  componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Overrides ComponentLifecycle.componentWillUnmount*

*Defined in [pane/pane.tsx:170](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L170)*

Handle when component is removed from the DOM

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:663*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(): `string`

*Overrides Foundation.generateClassNames*

*Defined in [pane/pane.tsx:323](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L323)*

**Returns:** `string`

___
<a id="generatestyleattribute"></a>

###  generateStyleAttribute

▸ **generateStyleAttribute**(): `CSSProperties`

*Defined in [pane/pane.tsx:209](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L209)*

generates the inline style property

**Returns:** `CSSProperties`

___
<a id="getref"></a>

### `<Protected>` getRef

▸ **getRef**(...args: *`Array`<`string` \| `number`>*): `React.ReactNode`

*Inherited from Foundation.getRef*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:70*

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)> |

**Returns:** `SS` \| `null`

___
<a id="getwidth"></a>

###  getWidth

▸ **getWidth**(): `number`

*Defined in [pane/pane.tsx:194](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L194)*

Gets the generated width of the grid pane depending on minWidth, maxWidth, and collapsed state.

**Returns:** `number`

___
<a id="onmousedown"></a>

###  onMouseDown

▸ **onMouseDown**(e: *`MouseEvent`<`HTMLButtonElement`>*): `void`

*Defined in [pane/pane.tsx:248](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L248)*

Handle mouseDown

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLButtonElement`> |

**Returns:** `void`

___
<a id="onmousemove"></a>

###  onMouseMove

▸ **onMouseMove**(e: *`MouseEvent`*): `void`

*Defined in [pane/pane.tsx:275](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L275)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent` |

**Returns:** `void`

___
<a id="onmouseup"></a>

###  onMouseUp

▸ **onMouseUp**(e: *`MouseEvent`*): `void`

*Defined in [pane/pane.tsx:263](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L263)*

Handle mouseUp

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent` |

**Returns:** `void`

___
<a id="onwindowresize"></a>

###  onWindowResize

▸ **onWindowResize**(e: *`UIEvent`*): `void`

*Defined in [pane/pane.tsx:297](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L297)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `UIEvent` |

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `ReactElement`<`HTMLDivElement`>

*Defined in [pane/pane.tsx:307](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L307)*

**Returns:** `ReactElement`<`HTMLDivElement`>

___
<a id="renderresizecontrol"></a>

###  renderResizeControl

▸ **renderResizeControl**(): `ReactElement`<`HTMLButtonElement`>

*Defined in [pane/pane.tsx:231](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L231)*

Render the resize button

**Returns:** `ReactElement`<`HTMLButtonElement`>

___
<a id="setref"></a>

### `<Protected>` setRef

▸ **setRef**(...args: *`Array`<`string` \| `number`>*): `ReferenceResolver`

*Inherited from Foundation.setRef*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:63*

Stores a react ref callback under the path provided as arguments. Paths are resolved using lodash's get/set API. The reference object itself will be stored on the referenceStore under the path provided and can be accessed via the getRef method under the same path.

Usage: <div ref={this.setRef("content-container")} />

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `Array`<`string` \| `number`> |

**Returns:** `ReferenceResolver`

___
<a id="setwidth"></a>

###  setWidth

▸ **setWidth**(width: *`number`*): `void`

*Defined in [pane/pane.tsx:301](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L301)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| width | `number` |

**Returns:** `void`

___
<a id="shouldcomponentupdate"></a>

### `<Optional>` shouldComponentUpdate

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[PaneHandledProps](../interfaces/_pane_pane_props_.panehandledprops.md) & [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[PaneState](../interfaces/_pane_pane_.panestate.md)> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [PaneUnhandledProps](../interfaces/_pane_pane_props_.paneunhandledprops.md)

___
<a id="width"></a>

###  width

▸ **width**(): `number`

*Defined in [pane/pane.tsx:154](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L154)*

Return the width of Pane. Sources from props first, and then state if props.width is undefined

**Returns:** `number`

___
<a id="withslot"></a>

### `<Protected>` withSlot

▸ **withSlot**<`T`>(slot: *`T` \| `T`[]*, nodes?: *`React.ReactNode`*): `React.ReactNode`

*Inherited from Foundation.withSlot*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:80*

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

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:81*

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

*Defined in [pane/pane.tsx:119](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L119)*

All handled props

<a id="handledprops.collapsed"></a>

####  collapsed

**● collapsed**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:126](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L126)*

___
<a id="handledprops.hidden"></a>

####  hidden

**● hidden**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:128](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L128)*

___
<a id="handledprops.id"></a>

####  id

**● id**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:125](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L125)*

___
<a id="handledprops.initialwidth"></a>

####  initialWidth

**● initialWidth**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:120](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L120)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:130](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L130)*

___
<a id="handledprops.maxwidth"></a>

####  maxWidth

**● maxWidth**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:122](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L122)*

___
<a id="handledprops.minwidth"></a>

####  minWidth

**● minWidth**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:121](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L121)*

___
<a id="handledprops.overlay"></a>

####  overlay

**● overlay**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:127](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L127)*

___
<a id="handledprops.resizable"></a>

####  resizable

**● resizable**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:124](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L124)*

___
<a id="handledprops.resizefrom"></a>

####  resizeFrom

**● resizeFrom**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:129](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L129)*

___
<a id="handledprops.width-1"></a>

####  width

**● width**: *`undefined`* =  void 0

*Defined in [pane/pane.tsx:123](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L123)*

___

___
<a id="defaultprops"></a>

### `<Static>` defaultProps

**defaultProps**: *`object`*

*Defined in [pane/pane.tsx:101](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L101)*

The default props of the Pane component

<a id="defaultprops.collapsed-1"></a>

####  collapsed

**● collapsed**: *`false`* = false

*Defined in [pane/pane.tsx:106](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L106)*

___
<a id="defaultprops.hidden-1"></a>

####  hidden

**● hidden**: *`false`* = false

*Defined in [pane/pane.tsx:108](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L108)*

___
<a id="defaultprops.initialwidth-1"></a>

####  initialWidth

**● initialWidth**: *`number`* = 300

*Defined in [pane/pane.tsx:102](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L102)*

___
<a id="defaultprops.maxwidth-1"></a>

####  maxWidth

**● maxWidth**: *`number`* = 800

*Defined in [pane/pane.tsx:104](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L104)*

___
<a id="defaultprops.minwidth-1"></a>

####  minWidth

**● minWidth**: *`number`* = 100

*Defined in [pane/pane.tsx:103](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L103)*

___
<a id="defaultprops.overlay-1"></a>

####  overlay

**● overlay**: *`false`* = false

*Defined in [pane/pane.tsx:107](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L107)*

___
<a id="defaultprops.resizable-1"></a>

####  resizable

**● resizable**: *`false`* = false

*Defined in [pane/pane.tsx:105](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/pane/pane.tsx#L105)*

___

___

