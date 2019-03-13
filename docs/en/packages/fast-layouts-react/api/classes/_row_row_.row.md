[@microsoft/fast-layouts-react](../README.md) > ["row/row"](../modules/_row_row_.md) > [Row](../classes/_row_row_.row.md)

# Class: Row

Grid Row - use this to create rows of pane/canvas content or other content.

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[RowProps](../modules/_row_row_props_.md#rowprops), `HTMLAttributes`<`HTMLDivElement`>, [RowState](../interfaces/_row_row_.rowstate.md)>

**↳ Row**

## Index

### Constructors

* [constructor](_row_row_.row.md#constructor)

### Properties

* [referenceResolverStore](_row_row_.row.md#referenceresolverstore)
* [referenceStore](_row_row_.row.md#referencestore)
* [rootElement](_row_row_.row.md#rootelement)
* [collapsedHeight](_row_row_.row.md#collapsedheight)
* [displayName](_row_row_.row.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_row_row_.row.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_row_row_.row.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_row_row_.row.md#unsafe_componentwillupdate)
* [componentDidCatch](_row_row_.row.md#componentdidcatch)
* [componentDidMount](_row_row_.row.md#componentdidmount)
* [componentDidUpdate](_row_row_.row.md#componentdidupdate)
* [componentWillMount](_row_row_.row.md#componentwillmount)
* [componentWillReceiveProps](_row_row_.row.md#componentwillreceiveprops)
* [componentWillUnmount](_row_row_.row.md#componentwillunmount)
* [componentWillUpdate](_row_row_.row.md#componentwillupdate)
* [generateClassNames](_row_row_.row.md#generateclassnames)
* [generateStyleAttribute](_row_row_.row.md#generatestyleattribute)
* [getHeight](_row_row_.row.md#getheight)
* [getRef](_row_row_.row.md#getref)
* [getSnapshotBeforeUpdate](_row_row_.row.md#getsnapshotbeforeupdate)
* [height](_row_row_.row.md#height)
* [onMouseDown](_row_row_.row.md#onmousedown)
* [onMouseMove](_row_row_.row.md#onmousemove)
* [onMouseUp](_row_row_.row.md#onmouseup)
* [render](_row_row_.row.md#render)
* [renderResizeControl](_row_row_.row.md#renderresizecontrol)
* [setHeight](_row_row_.row.md#setheight)
* [setRef](_row_row_.row.md#setref)
* [shouldComponentUpdate](_row_row_.row.md#shouldcomponentupdate)
* [unhandledProps](_row_row_.row.md#unhandledprops)
* [withSlot](_row_row_.row.md#withslot)
* [withoutSlot](_row_row_.row.md#withoutslot)

### Object literals

* [handledProps](_row_row_.row.md#handledprops)
* [defaultProps](_row_row_.row.md#defaultprops)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Row**(props: *[RowProps](../modules/_row_row_props_.md#rowprops)*): [Row](_row_row_.row.md)

*Defined in [row/row.tsx:151](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L151)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [RowProps](../modules/_row_row_props_.md#rowprops) |

**Returns:** [Row](_row_row_.row.md)

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

*Defined in [row/row.tsx:151](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L151)*

Stores a reference to the pane HTML element

___
<a id="collapsedheight"></a>

### `<Static>``<Private>` collapsedHeight

**● collapsedHeight**: *`number`* = 40

*Defined in [row/row.tsx:132](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L132)*

The height of a row when it is collapsed

___
<a id="displayname"></a>

### `<Static>` displayName

**● displayName**: *`string`* = "Row"

*Defined in [row/row.tsx:117](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L117)*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`>*, nextState: *`Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`> |
| nextState | `Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)> |
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

### `<Optional>` componentDidMount

▸ **componentDidMount**(): `void`

*Inherited from ComponentLifecycle.componentDidMount*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:526*

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** `void`

___
<a id="componentdidupdate"></a>

###  componentDidUpdate

▸ **componentDidUpdate**(prevProps: *[RowProps](../modules/_row_row_props_.md#rowprops)*, prevState: *[RowState](../interfaces/_row_row_.rowstate.md)*): `void`

*Overrides NewLifecycle.componentDidUpdate*

*Defined in [row/row.tsx:176](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L176)*

Handle when component updates

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | [RowProps](../modules/_row_row_props_.md#rowprops) |
| prevState | [RowState](../interfaces/_row_row_.rowstate.md) |

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

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:542*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`>*, nextState: *`Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`> |
| nextState | `Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(): `string`

*Overrides Foundation.generateClassNames*

*Defined in [row/row.tsx:319](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L319)*

**Returns:** `string`

___
<a id="generatestyleattribute"></a>

###  generateStyleAttribute

▸ **generateStyleAttribute**(): `CSSProperties`

*Defined in [row/row.tsx:206](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L206)*

generates the inline style property

**Returns:** `CSSProperties`

___
<a id="getheight"></a>

###  getHeight

▸ **getHeight**(): `number`

*Defined in [row/row.tsx:191](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L191)*

Gets the generated height of the grid row depending on minHeight, maxHeight, and collapsed state.

**Returns:** `number`

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`>*, prevState: *`Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`> |
| prevState | `Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)> |

**Returns:** `SS` \| `null`

___
<a id="height"></a>

###  height

▸ **height**(): `number`

*Defined in [row/row.tsx:169](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L169)*

Return the height of row. Sources from props first, and then state if props.height is undefined

**Returns:** `number`

___
<a id="onmousedown"></a>

###  onMouseDown

▸ **onMouseDown**(e: *`MouseEvent`<`HTMLButtonElement`>*): `void`

*Defined in [row/row.tsx:245](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L245)*

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

*Defined in [row/row.tsx:272](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L272)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent` |

**Returns:** `void`

___
<a id="onmouseup"></a>

###  onMouseUp

▸ **onMouseUp**(e: *`MouseEvent`*): `void`

*Defined in [row/row.tsx:260](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L260)*

Handle mouseUp

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent` |

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `ReactElement`<`HTMLDivElement`>

*Defined in [row/row.tsx:303](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L303)*

**Returns:** `ReactElement`<`HTMLDivElement`>

___
<a id="renderresizecontrol"></a>

###  renderResizeControl

▸ **renderResizeControl**(): `ReactElement`<`HTMLButtonElement`>

*Defined in [row/row.tsx:228](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L228)*

Render the resize button

**Returns:** `ReactElement`<`HTMLButtonElement`>

___
<a id="setheight"></a>

###  setHeight

▸ **setHeight**(height: *`number`*): `void`

*Defined in [row/row.tsx:297](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L297)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| height | `number` |

**Returns:** `void`

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
<a id="shouldcomponentupdate"></a>

### `<Optional>` shouldComponentUpdate

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`>*, nextState: *`Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[RowProps](../modules/_row_row_props_.md#rowprops) & `HTMLAttributes`<`HTMLDivElement`> & `FoundationProps`> |
| nextState | `Readonly`<[RowState](../interfaces/_row_row_.rowstate.md)> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): `HTMLAttributes`<`HTMLDivElement`>

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** `HTMLAttributes`<`HTMLDivElement`>

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

*Defined in [row/row.tsx:134](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L134)*

<a id="handledprops.collapsed"></a>

####  collapsed

**● collapsed**: *`undefined`* =  void 0

*Defined in [row/row.tsx:141](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L141)*

___
<a id="handledprops.fill"></a>

####  fill

**● fill**: *`undefined`* =  void 0

*Defined in [row/row.tsx:135](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L135)*

___
<a id="handledprops.height-1"></a>

####  height

**● height**: *`undefined`* =  void 0

*Defined in [row/row.tsx:138](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L138)*

___
<a id="handledprops.hidden"></a>

####  hidden

**● hidden**: *`undefined`* =  void 0

*Defined in [row/row.tsx:143](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L143)*

___
<a id="handledprops.id"></a>

####  id

**● id**: *`undefined`* =  void 0

*Defined in [row/row.tsx:140](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L140)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [row/row.tsx:145](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L145)*

___
<a id="handledprops.maxheight"></a>

####  maxHeight

**● maxHeight**: *`undefined`* =  void 0

*Defined in [row/row.tsx:137](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L137)*

___
<a id="handledprops.minheight"></a>

####  minHeight

**● minHeight**: *`undefined`* =  void 0

*Defined in [row/row.tsx:136](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L136)*

___
<a id="handledprops.overlay"></a>

####  overlay

**● overlay**: *`undefined`* =  void 0

*Defined in [row/row.tsx:142](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L142)*

___
<a id="handledprops.resizable"></a>

####  resizable

**● resizable**: *`undefined`* =  void 0

*Defined in [row/row.tsx:139](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L139)*

___
<a id="handledprops.resizefrom"></a>

####  resizeFrom

**● resizeFrom**: *`undefined`* =  void 0

*Defined in [row/row.tsx:144](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L144)*

___

___
<a id="defaultprops"></a>

### `<Static>` defaultProps

**defaultProps**: *`object`*

*Defined in [row/row.tsx:119](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L119)*

<a id="defaultprops.collapsed-1"></a>

####  collapsed

**● collapsed**: *`false`* = false

*Defined in [row/row.tsx:124](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L124)*

___
<a id="defaultprops.fill-1"></a>

####  fill

**● fill**: *`false`* = false

*Defined in [row/row.tsx:120](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L120)*

___
<a id="defaultprops.hidden-1"></a>

####  hidden

**● hidden**: *`false`* = false

*Defined in [row/row.tsx:126](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L126)*

___
<a id="defaultprops.maxheight-1"></a>

####  maxHeight

**● maxHeight**: *`number`* = 800

*Defined in [row/row.tsx:122](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L122)*

___
<a id="defaultprops.minheight-1"></a>

####  minHeight

**● minHeight**: *`number`* = 40

*Defined in [row/row.tsx:121](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L121)*

___
<a id="defaultprops.overlay-1"></a>

####  overlay

**● overlay**: *`false`* = false

*Defined in [row/row.tsx:125](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L125)*

___
<a id="defaultprops.resizable-1"></a>

####  resizable

**● resizable**: *`false`* = false

*Defined in [row/row.tsx:123](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/row/row.tsx#L123)*

___

___

