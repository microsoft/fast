[@microsoft/fast-layouts-react](../README.md) > ["column/column"](../modules/_column_column_.md) > [Column](../classes/_column_column_.column.md)

# Class: Column

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md), [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md), `__type`>

**↳ Column**

## Index

### Properties

* [referenceResolverStore](_column_column_.column.md#referenceresolverstore)
* [referenceStore](_column_column_.column.md#referencestore)
* [displayName](_column_column_.column.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_column_column_.column.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_column_column_.column.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_column_column_.column.md#unsafe_componentwillupdate)
* [augmentMsGrid](_column_column_.column.md#augmentmsgrid)
* [componentDidCatch](_column_column_.column.md#componentdidcatch)
* [componentDidMount](_column_column_.column.md#componentdidmount)
* [componentDidUpdate](_column_column_.column.md#componentdidupdate)
* [componentWillMount](_column_column_.column.md#componentwillmount)
* [componentWillReceiveProps](_column_column_.column.md#componentwillreceiveprops)
* [componentWillUnmount](_column_column_.column.md#componentwillunmount)
* [componentWillUpdate](_column_column_.column.md#componentwillupdate)
* [generateClassNames](_column_column_.column.md#generateclassnames)
* [generateColumnPosition](_column_column_.column.md#generatecolumnposition)
* [generateColumnSpan](_column_column_.column.md#generatecolumnspan)
* [generateRow](_column_column_.column.md#generaterow)
* [generateStyleAttribute](_column_column_.column.md#generatestyleattribute)
* [getRef](_column_column_.column.md#getref)
* [getSnapshotBeforeUpdate](_column_column_.column.md#getsnapshotbeforeupdate)
* [getValueByBreakpoint](_column_column_.column.md#getvaluebybreakpoint)
* [render](_column_column_.column.md#render)
* [setRef](_column_column_.column.md#setref)
* [shouldComponentUpdate](_column_column_.column.md#shouldcomponentupdate)
* [shouldTrackBreakpoints](_column_column_.column.md#shouldtrackbreakpoints)
* [unhandledProps](_column_column_.column.md#unhandledprops)
* [update](_column_column_.column.md#update)
* [withSlot](_column_column_.column.md#withslot)
* [withoutSlot](_column_column_.column.md#withoutslot)

### Object literals

* [handledProps](_column_column_.column.md#handledprops)
* [defaultProps](_column_column_.column.md#defaultprops)

---

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
<a id="displayname"></a>

### `<Static>` displayName

**● displayName**: *`string`* = "Column"

*Defined in [column/column.tsx:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L34)*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="augmentmsgrid"></a>

### `<Private>` augmentMsGrid

▸ **augmentMsGrid**(value: *`number` \| `null`*): `number`

*Defined in [column/column.tsx:163](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L163)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` \| `null` |

**Returns:** `number`

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

*Defined in [column/column.tsx:55](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L55)*

Component has mounted

**Returns:** `void`

___
<a id="componentdidupdate"></a>

###  componentDidUpdate

▸ **componentDidUpdate**(previousProps: *[ColumnProps](../modules/_column_column_props_.md#columnprops)*): `void`

*Overrides NewLifecycle.componentDidUpdate*

*Defined in [column/column.tsx:71](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L71)*

Component has updated

**Parameters:**

| Name | Type |
| ------ | ------ |
| previousProps | [ColumnProps](../modules/_column_column_props_.md#columnprops) |

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

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

###  componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Overrides ComponentLifecycle.componentWillUnmount*

*Defined in [column/column.tsx:64](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L64)*

Component will be unmounted

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(): `string`

*Overrides Foundation.generateClassNames*

*Defined in [column/column.tsx:104](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L104)*

Generates the column classes

**Returns:** `string`

___
<a id="generatecolumnposition"></a>

### `<Private>` generateColumnPosition

▸ **generateColumnPosition**(): `number` \| `null`

*Defined in [column/column.tsx:140](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L140)*

Generates the position of a column

**Returns:** `number` \| `null`

___
<a id="generatecolumnspan"></a>

### `<Private>` generateColumnSpan

▸ **generateColumnSpan**(): `number`

*Defined in [column/column.tsx:125](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L125)*

Generates the column-span value

**Returns:** `number`

___
<a id="generaterow"></a>

### `<Private>` generateRow

▸ **generateRow**(): `string` \| `null`

*Defined in [column/column.tsx:153](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L153)*

Generates the row that a column should be placed in

**Returns:** `string` \| `null`

___
<a id="generatestyleattribute"></a>

### `<Private>` generateStyleAttribute

▸ **generateStyleAttribute**(): `CSSProperties`

*Defined in [column/column.tsx:174](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L174)*

Generates the style attribute of the column

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<`__type`> |

**Returns:** `SS` \| `null`

___
<a id="getvaluebybreakpoint"></a>

### `<Private>` getValueByBreakpoint

▸ **getValueByBreakpoint**<`T`>(breakpointSet: *`T`[]*): `T`

*Defined in [column/column.tsx:112](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L112)*

Gets a value from an array where the index retrieved is either the current break-point or the nearest preceding break-point if no entry exists for the current break-point

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| breakpointSet | `T`[] |

**Returns:** `T`

___
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Defined in [column/column.tsx:90](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L90)*

Render the component

**Returns:** `Element`

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

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md) & [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="shouldtrackbreakpoints"></a>

### `<Private>` shouldTrackBreakpoints

▸ **shouldTrackBreakpoints**(props: *[ColumnProps](../modules/_column_column_props_.md#columnprops)*): `boolean`

*Defined in [column/column.tsx:206](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L206)*

Determines if we should be tracking breakpoints based on a set of props

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [ColumnProps](../modules/_column_column_props_.md#columnprops) |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [ColumnUnhandledProps](../interfaces/_column_column_props_.columnunhandledprops.md)

___
<a id="update"></a>

### `<Private>` update

▸ **update**(): `void`

*Defined in [column/column.tsx:216](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L216)*

Force the component to update

**Returns:** `void`

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

*Defined in [column/column.tsx:43](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L43)*

<a id="handledprops.gutter"></a>

####  gutter

**● gutter**: *`undefined`* =  void 0

*Defined in [column/column.tsx:49](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L49)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [column/column.tsx:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L44)*

___
<a id="handledprops.order"></a>

####  order

**● order**: *`undefined`* =  void 0

*Defined in [column/column.tsx:48](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L48)*

___
<a id="handledprops.position"></a>

####  position

**● position**: *`undefined`* =  void 0

*Defined in [column/column.tsx:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L46)*

___
<a id="handledprops.row"></a>

####  row

**● row**: *`undefined`* =  void 0

*Defined in [column/column.tsx:47](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L47)*

___
<a id="handledprops.span"></a>

####  span

**● span**: *`undefined`* =  void 0

*Defined in [column/column.tsx:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L45)*

___

___
<a id="defaultprops"></a>

### `<Static>` defaultProps

**defaultProps**: *`object`*

*Defined in [column/column.tsx:39](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L39)*

Define default props

<a id="defaultprops.span-1"></a>

####  span

**● span**: *`number`* = 12

*Defined in [column/column.tsx:40](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.tsx#L40)*

___

___

