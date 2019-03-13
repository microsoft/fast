[@microsoft/fast-layouts-react](../README.md) > ["grid/grid"](../modules/_grid_grid_.md) > [Grid](../classes/_grid_grid_.grid.md)

# Class: Grid

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md), [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md), `__type`>

**↳ Grid**

## Index

### Properties

* [referenceResolverStore](_grid_grid_.grid.md#referenceresolverstore)
* [referenceStore](_grid_grid_.grid.md#referencestore)
* [displayName](_grid_grid_.grid.md#displayname)

### Accessors

* [tag](_grid_grid_.grid.md#tag)

### Methods

* [UNSAFE_componentWillMount](_grid_grid_.grid.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_grid_grid_.grid.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_grid_grid_.grid.md#unsafe_componentwillupdate)
* [componentDidCatch](_grid_grid_.grid.md#componentdidcatch)
* [componentDidMount](_grid_grid_.grid.md#componentdidmount)
* [componentDidUpdate](_grid_grid_.grid.md#componentdidupdate)
* [componentWillMount](_grid_grid_.grid.md#componentwillmount)
* [componentWillReceiveProps](_grid_grid_.grid.md#componentwillreceiveprops)
* [componentWillUnmount](_grid_grid_.grid.md#componentwillunmount)
* [componentWillUpdate](_grid_grid_.grid.md#componentwillupdate)
* [generateAlignment](_grid_grid_.grid.md#generatealignment)
* [generateClassNames](_grid_grid_.grid.md#generateclassnames)
* [generateGutter](_grid_grid_.grid.md#generategutter)
* [generateHTMLTag](_grid_grid_.grid.md#generatehtmltag)
* [generateStyleAttributes](_grid_grid_.grid.md#generatestyleattributes)
* [getRef](_grid_grid_.grid.md#getref)
* [getSnapshotBeforeUpdate](_grid_grid_.grid.md#getsnapshotbeforeupdate)
* [render](_grid_grid_.grid.md#render)
* [renderChildren](_grid_grid_.grid.md#renderchildren)
* [setRef](_grid_grid_.grid.md#setref)
* [shouldComponentUpdate](_grid_grid_.grid.md#shouldcomponentupdate)
* [shouldTrackBreakpoints](_grid_grid_.grid.md#shouldtrackbreakpoints)
* [unhandledProps](_grid_grid_.grid.md#unhandledprops)
* [update](_grid_grid_.grid.md#update)
* [withSlot](_grid_grid_.grid.md#withslot)
* [withoutSlot](_grid_grid_.grid.md#withoutslot)

### Object literals

* [handledProps](_grid_grid_.grid.md#handledprops)
* [defaultProps](_grid_grid_.grid.md#defaultprops)

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

**● displayName**: *`string`* = "Grid"

*Defined in [grid/grid.tsx:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L34)*

___

## Accessors

<a id="tag"></a>

### `<Private>` tag

**get tag**(): `any`

*Defined in [grid/grid.tsx:39](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L39)*

Stores HTML tag for use in render

**Returns:** `any`

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
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

*Defined in [grid/grid.tsx:80](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L80)*

Component has mounted

**Returns:** `void`

___
<a id="componentdidupdate"></a>

###  componentDidUpdate

▸ **componentDidUpdate**(previousProps: *[GridProps](../modules/_grid_grid_props_.md#gridprops)*): `void`

*Overrides NewLifecycle.componentDidUpdate*

*Defined in [grid/grid.tsx:96](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L96)*

Component has updated

**Parameters:**

| Name | Type |
| ------ | ------ |
| previousProps | [GridProps](../modules/_grid_grid_props_.md#gridprops) |

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

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

###  componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Overrides ComponentLifecycle.componentWillUnmount*

*Defined in [grid/grid.tsx:89](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L89)*

Component will be unmounted

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="generatealignment"></a>

### `<Private>` generateAlignment

▸ **generateAlignment**(alignment: *[GridAlignment](../enums/_grid_grid_props_.gridalignment.md)*): `string`

*Defined in [grid/grid.tsx:138](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L138)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| alignment | [GridAlignment](../enums/_grid_grid_props_.gridalignment.md) |

**Returns:** `string`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(): `string`

*Overrides Foundation.generateClassNames*

*Defined in [grid/grid.tsx:112](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L112)*

**Returns:** `string`

___
<a id="generategutter"></a>

### `<Private>` generateGutter

▸ **generateGutter**(): `number`

*Defined in [grid/grid.tsx:128](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L128)*

Generates the column-span value

**Returns:** `number`

___
<a id="generatehtmltag"></a>

### `<Private>` generateHTMLTag

▸ **generateHTMLTag**(): `string`

*Defined in [grid/grid.tsx:166](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L166)*

Creates tags for rendering based on href

**Returns:** `string`

___
<a id="generatestyleattributes"></a>

### `<Private>` generateStyleAttributes

▸ **generateStyleAttributes**(): `HTMLAttributes`<`HTMLDivElement`>

*Defined in [grid/grid.tsx:149](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L149)*

**Returns:** `HTMLAttributes`<`HTMLDivElement`>

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<`__type`> |

**Returns:** `SS` \| `null`

___
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Defined in [grid/grid.tsx:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L65)*

Renders the Grid markup

**Returns:** `Element`

___
<a id="renderchildren"></a>

### `<Private>` renderChildren

▸ **renderChildren**(): `React.ReactNode` \| `React.ReactNode`[]

*Defined in [grid/grid.tsx:170](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L170)*

**Returns:** `React.ReactNode` \| `React.ReactNode`[]

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

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[GridHandledProps](../interfaces/_grid_grid_props_.gridhandledprops.md) & [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="shouldtrackbreakpoints"></a>

### `<Private>` shouldTrackBreakpoints

▸ **shouldTrackBreakpoints**(props: *[GridProps](../modules/_grid_grid_props_.md#gridprops)*): `boolean`

*Defined in [grid/grid.tsx:121](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L121)*

Determines if we should be tracking breakpoints based on a set of props

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [GridProps](../modules/_grid_grid_props_.md#gridprops) |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [GridUnhandledProps](../interfaces/_grid_grid_props_.gridunhandledprops.md)

___
<a id="update"></a>

### `<Private>` update

▸ **update**(): `void`

*Defined in [grid/grid.tsx:145](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L145)*

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

*Defined in [grid/grid.tsx:52](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L52)*

<a id="handledprops.columncount"></a>

####  columnCount

**● columnCount**: *`undefined`* =  void 0

*Defined in [grid/grid.tsx:53](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L53)*

___
<a id="handledprops.gridcolumn"></a>

####  gridColumn

**● gridColumn**: *`undefined`* =  void 0

*Defined in [grid/grid.tsx:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L54)*

___
<a id="handledprops.gutter"></a>

####  gutter

**● gutter**: *`undefined`* =  void 0

*Defined in [grid/grid.tsx:55](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L55)*

___
<a id="handledprops.horizontalalign"></a>

####  horizontalAlign

**● horizontalAlign**: *`undefined`* =  void 0

*Defined in [grid/grid.tsx:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L56)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [grid/grid.tsx:57](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L57)*

___
<a id="handledprops.tag-1"></a>

####  tag

**● tag**: *`undefined`* =  void 0

*Defined in [grid/grid.tsx:58](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L58)*

___
<a id="handledprops.verticalalign"></a>

####  verticalAlign

**● verticalAlign**: *`undefined`* =  void 0

*Defined in [grid/grid.tsx:59](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L59)*

___

___
<a id="defaultprops"></a>

### `<Static>` defaultProps

**defaultProps**: *`object`*

*Defined in [grid/grid.tsx:43](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L43)*

<a id="defaultprops.columncount-1"></a>

####  columnCount

**● columnCount**: *`number`* = 12

*Defined in [grid/grid.tsx:49](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L49)*

___
<a id="defaultprops.gridcolumn-1"></a>

####  gridColumn

**● gridColumn**: *`number`* = 2

*Defined in [grid/grid.tsx:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L45)*

___
<a id="defaultprops.gutter-1"></a>

####  gutter

**● gutter**: *`number`* = 8

*Defined in [grid/grid.tsx:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L46)*

___
<a id="defaultprops.horizontalalign-1"></a>

####  horizontalAlign

**● horizontalAlign**: *[stretch](../enums/_grid_grid_props_.gridalignment.md#stretch)* =  GridAlignment.stretch

*Defined in [grid/grid.tsx:48](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L48)*

___
<a id="defaultprops.tag-2"></a>

####  tag

**● tag**: *[div](../enums/_grid_grid_props_.gridtag.md#div)* =  GridTag.div

*Defined in [grid/grid.tsx:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L44)*

___
<a id="defaultprops.verticalalign-1"></a>

####  verticalAlign

**● verticalAlign**: *[stretch](../enums/_grid_grid_props_.gridalignment.md#stretch)* =  GridAlignment.stretch

*Defined in [grid/grid.tsx:47](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/grid/grid.tsx#L47)*

___

___

