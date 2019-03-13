[@microsoft/fast-jss-manager-react](../README.md) > ["design-system-provider"](../modules/_design_system_provider_.md) > [DesignSystemProvider](../classes/_design_system_provider_.designsystemprovider.md)

# Class: DesignSystemProvider

## Type parameters
#### T 
#### SS 
## Hierarchy

 `Component`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>, `object`>

**↳ DesignSystemProvider**

## Index

### Constructors

* [constructor](_design_system_provider_.designsystemprovider.md#constructor)

### Properties

* [context](_design_system_provider_.designsystemprovider.md#context)
* [designSystemOverrides](_design_system_provider_.designsystemprovider.md#designsystemoverrides)
* [downstreamDesignSystem](_design_system_provider_.designsystemprovider.md#downstreamdesignsystem)
* [props](_design_system_provider_.designsystemprovider.md#props)
* [refs](_design_system_provider_.designsystemprovider.md#refs)
* [state](_design_system_provider_.designsystemprovider.md#state)
* [upstreamDesignSystem](_design_system_provider_.designsystemprovider.md#upstreamdesignsystem)
* [contextType](_design_system_provider_.designsystemprovider.md#contexttype)

### Methods

* [UNSAFE_componentWillMount](_design_system_provider_.designsystemprovider.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_design_system_provider_.designsystemprovider.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_design_system_provider_.designsystemprovider.md#unsafe_componentwillupdate)
* [componentDidCatch](_design_system_provider_.designsystemprovider.md#componentdidcatch)
* [componentDidMount](_design_system_provider_.designsystemprovider.md#componentdidmount)
* [componentDidUpdate](_design_system_provider_.designsystemprovider.md#componentdidupdate)
* [componentWillMount](_design_system_provider_.designsystemprovider.md#componentwillmount)
* [componentWillReceiveProps](_design_system_provider_.designsystemprovider.md#componentwillreceiveprops)
* [componentWillUnmount](_design_system_provider_.designsystemprovider.md#componentwillunmount)
* [componentWillUpdate](_design_system_provider_.designsystemprovider.md#componentwillupdate)
* [createDesignSystem](_design_system_provider_.designsystemprovider.md#createdesignsystem)
* [forceUpdate](_design_system_provider_.designsystemprovider.md#forceupdate)
* [getSnapshotBeforeUpdate](_design_system_provider_.designsystemprovider.md#getsnapshotbeforeupdate)
* [render](_design_system_provider_.designsystemprovider.md#render)
* [setState](_design_system_provider_.designsystemprovider.md#setstate)
* [shouldComponentUpdate](_design_system_provider_.designsystemprovider.md#shouldcomponentupdate)
* [updateDownstreamDesignSystem](_design_system_provider_.designsystemprovider.md#updatedownstreamdesignsystem)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DesignSystemProvider**(props: *[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>*, context: *`T`*): [DesignSystemProvider](_design_system_provider_.designsystemprovider.md)

*Overrides Component.__constructor*

*Defined in [design-system-provider.tsx:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/design-system-provider.tsx#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`> |
| context | `T` |

**Returns:** [DesignSystemProvider](_design_system_provider_.designsystemprovider.md)

___

## Properties

<a id="context"></a>

###  context

**● context**: *`any`*

*Inherited from Component.context*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:405*

If using the new style context, re-declare this in your class to be the `React.ContextType` of your `static contextType`.

```ts
static contextType = MyContext
context!: React.ContextType<typeof MyContext>
```

*__deprecated__*: if used without a type annotation, or without static contextType

*__see__*: [https://reactjs.org/docs/legacy-context.html](https://reactjs.org/docs/legacy-context.html)

___
<a id="designsystemoverrides"></a>

### `<Private>` designSystemOverrides

**● designSystemOverrides**: *`T`*

*Defined in [design-system-provider.tsx:38](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/design-system-provider.tsx#L38)*

A copy of this.props.designSystem - we need to store this as a property so that we can determine if designSystem props have changed in the render method. We need to determine if it has changed in render as opposed to componentDidUpdate to avoid a re-render

___
<a id="downstreamdesignsystem"></a>

### `<Private>` downstreamDesignSystem

**● downstreamDesignSystem**: *`T`*

*Defined in [design-system-provider.tsx:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/design-system-provider.tsx#L45)*

The merged upstreamDesignSystem and designSystemOverrides - store this so the object reference doesn't change between renders if both props.designSystem and context don't change

___
<a id="props"></a>

###  props

**● props**: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> & `Readonly`<`object`>*

*Inherited from Component.props*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:430*

___
<a id="refs"></a>

###  refs

**● refs**: *`object`*

*Inherited from Component.refs*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:436*

*__deprecated__*: [https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)

#### Type declaration

[key: `string`]: `ReactInstance`

___
<a id="state"></a>

###  state

**● state**: *`Readonly`<`object`>*

*Inherited from Component.state*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:431*

___
<a id="upstreamdesignsystem"></a>

### `<Private>` upstreamDesignSystem

**● upstreamDesignSystem**: *`T`*

*Defined in [design-system-provider.tsx:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/design-system-provider.tsx#L29)*

We need to store a copy of the context object because React doesn't give good tools to know when the context has changed.

___
<a id="contexttype"></a>

### `<Static>``<Optional>` contextType

**● contextType**: *`Context`<`any`>*

*Inherited from Component.contextType*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:390*

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

*__see__*: [https://reactjs.org/docs/context.html#classcontexttype](https://reactjs.org/docs/context.html#classcontexttype)

___

## Methods

<a id="unsafe_componentwillmount"></a>

### `<Optional>` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:618*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:650*

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
| nextProps | `Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>>*, nextState: *`Readonly`<`object`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:678*

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
| nextProps | `Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> |
| nextState | `Readonly`<`object`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:547*

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

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:526*

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** `void`

___
<a id="componentdidupdate"></a>

### `<Optional>` componentDidUpdate

▸ **componentDidUpdate**(prevProps: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>>*, prevState: *`Readonly`<`object`>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:589*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> |
| prevState | `Readonly`<`object`> |
| `Optional` snapshot | `SS` |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:604*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:633*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:542*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>>*, nextState: *`Readonly`<`object`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:663*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> |
| nextState | `Readonly`<`object`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="createdesignsystem"></a>

### `<Private>` createDesignSystem

▸ **createDesignSystem**(): `T`

*Defined in [design-system-provider.tsx:87](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/design-system-provider.tsx#L87)*

Merges locally stored context with designSystem props. Returns a new object

**Returns:** `T`

___
<a id="forceupdate"></a>

###  forceUpdate

▸ **forceUpdate**(callBack?: *`function`*): `void`

*Inherited from Component.forceUpdate*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:422*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` callBack | `function` |

**Returns:** `void`

___
<a id="getsnapshotbeforeupdate"></a>

### `<Optional>` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>>*, prevState: *`Readonly`<`object`>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> |
| prevState | `Readonly`<`object`> |

**Returns:** `SS` \| `null`

___
<a id="render"></a>

###  render

▸ **render**(): `React.ReactNode`

*Overrides Component.render*

*Defined in [design-system-provider.tsx:53](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/design-system-provider.tsx#L53)*

**Returns:** `React.ReactNode`

___
<a id="setstate"></a>

###  setState

▸ **setState**<`K`>(state: *`function` \| `S` \| `object`*, callback?: *`function`*): `void`

*Inherited from Component.setState*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:417*

**Type parameters:**

#### K :  `keyof object`
**Parameters:**

| Name | Type |
| ------ | ------ |
| state | `function` \| `S` \| `object` |
| `Optional` callback | `function` |

**Returns:** `void`

___
<a id="shouldcomponentupdate"></a>

### `<Optional>` shouldComponentUpdate

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>>*, nextState: *`Readonly`<`object`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-jss-manager-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[DesignSystemProviderProps](../interfaces/_design_system_provider_.designsystemproviderprops.md)<`T`>> |
| nextState | `Readonly`<`object`> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="updatedownstreamdesignsystem"></a>

### `<Private>` updateDownstreamDesignSystem

▸ **updateDownstreamDesignSystem**(): `void`

*Defined in [design-system-provider.tsx:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/design-system-provider.tsx#L65)*

Updates the downstreamDesignSystem if either this.props.designSystem or this.context has changed

**Returns:** `void`

___

