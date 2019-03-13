[@microsoft/fast-breakpoint-tracker-react](../README.md) > ["breakpoint-tracker"](../modules/_breakpoint_tracker_.md) > [BreakpointTracker](../classes/_breakpoint_tracker_.breakpointtracker.md)

# Class: BreakpointTracker

## Type parameters
#### SS 
## Hierarchy

 `Component`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md), [BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)>

**↳ BreakpointTracker**

## Index

### Constructors

* [constructor](_breakpoint_tracker_.breakpointtracker.md#constructor)

### Properties

* [context](_breakpoint_tracker_.breakpointtracker.md#context)
* [openRequestAnimationFrame](_breakpoint_tracker_.breakpointtracker.md#openrequestanimationframe)
* [props](_breakpoint_tracker_.breakpointtracker.md#props)
* [refs](_breakpoint_tracker_.breakpointtracker.md#refs)
* [state](_breakpoint_tracker_.breakpointtracker.md#state)
* [breakpoints](_breakpoint_tracker_.breakpointtracker.md#breakpoints)
* [contextType](_breakpoint_tracker_.breakpointtracker.md#contexttype)

### Methods

* [UNSAFE_componentWillMount](_breakpoint_tracker_.breakpointtracker.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_breakpoint_tracker_.breakpointtracker.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_breakpoint_tracker_.breakpointtracker.md#unsafe_componentwillupdate)
* [componentDidCatch](_breakpoint_tracker_.breakpointtracker.md#componentdidcatch)
* [componentDidMount](_breakpoint_tracker_.breakpointtracker.md#componentdidmount)
* [componentDidUpdate](_breakpoint_tracker_.breakpointtracker.md#componentdidupdate)
* [componentWillMount](_breakpoint_tracker_.breakpointtracker.md#componentwillmount)
* [componentWillReceiveProps](_breakpoint_tracker_.breakpointtracker.md#componentwillreceiveprops)
* [componentWillUnmount](_breakpoint_tracker_.breakpointtracker.md#componentwillunmount)
* [componentWillUpdate](_breakpoint_tracker_.breakpointtracker.md#componentwillupdate)
* [forceUpdate](_breakpoint_tracker_.breakpointtracker.md#forceupdate)
* [getSnapshotBeforeUpdate](_breakpoint_tracker_.breakpointtracker.md#getsnapshotbeforeupdate)
* [render](_breakpoint_tracker_.breakpointtracker.md#render)
* [requestFrame](_breakpoint_tracker_.breakpointtracker.md#requestframe)
* [setState](_breakpoint_tracker_.breakpointtracker.md#setstate)
* [shouldComponentUpdate](_breakpoint_tracker_.breakpointtracker.md#shouldcomponentupdate)
* [updateBreakpoint](_breakpoint_tracker_.breakpointtracker.md#updatebreakpoint)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BreakpointTracker**(props: *[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)*): [BreakpointTracker](_breakpoint_tracker_.breakpointtracker.md)

*Overrides Component.__constructor*

*Defined in [breakpoint-tracker.tsx:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L32)*

Constructor for the BreakpointTracker component.

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md) |

**Returns:** [BreakpointTracker](_breakpoint_tracker_.breakpointtracker.md)

___

## Properties

<a id="context"></a>

###  context

**● context**: *`any`*

*Inherited from Component.context*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:405*

If using the new style context, re-declare this in your class to be the `React.ContextType` of your `static contextType`.

```ts
static contextType = MyContext
context!: React.ContextType<typeof MyContext>
```

*__deprecated__*: if used without a type annotation, or without static contextType

*__see__*: [https://reactjs.org/docs/legacy-context.html](https://reactjs.org/docs/legacy-context.html)

___
<a id="openrequestanimationframe"></a>

### `<Private>` openRequestAnimationFrame

**● openRequestAnimationFrame**: *`boolean`*

*Defined in [breakpoint-tracker.tsx:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L32)*

Track if we have an open animation frame request

___
<a id="props"></a>

###  props

**● props**: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> & `Readonly`<`object`>*

*Inherited from Component.props*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:430*

___
<a id="refs"></a>

###  refs

**● refs**: *`object`*

*Inherited from Component.refs*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:436*

*__deprecated__*: [https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)

#### Type declaration

[key: `string`]: `ReactInstance`

___
<a id="state"></a>

###  state

**● state**: *`Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)>*

*Inherited from Component.state*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:431*

___
<a id="breakpoints"></a>

### `<Static>` breakpoints

**● breakpoints**: *[Breakpoints](../modules/_breakpoints_.md#breakpoints)* =  defaultBreakpoints

*Defined in [breakpoint-tracker.tsx:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L27)*

The array of breakpoint values

___
<a id="contexttype"></a>

### `<Static>``<Optional>` contextType

**● contextType**: *`Context`<`any`>*

*Inherited from Component.contextType*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:390*

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

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:618*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:650*

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
| nextProps | `Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)>*, nextState: *`Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:678*

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
| nextProps | `Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> |
| nextState | `Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:547*

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

*Defined in [breakpoint-tracker.tsx:48](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L48)*

React life-cycle method

**Returns:** `void`

___
<a id="componentdidupdate"></a>

### `<Optional>` componentDidUpdate

▸ **componentDidUpdate**(prevProps: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)>*, prevState: *`Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:589*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> |
| prevState | `Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)> |
| `Optional` snapshot | `SS` |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:604*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:633*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

###  componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Overrides ComponentLifecycle.componentWillUnmount*

*Defined in [breakpoint-tracker.tsx:63](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L63)*

React life-cycle method

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)>*, nextState: *`Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:663*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> |
| nextState | `Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="forceupdate"></a>

###  forceUpdate

▸ **forceUpdate**(callBack?: *`function`*): `void`

*Inherited from Component.forceUpdate*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:422*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` callBack | `function` |

**Returns:** `void`

___
<a id="getsnapshotbeforeupdate"></a>

### `<Optional>` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)>*, prevState: *`Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> |
| prevState | `Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)> |

**Returns:** `SS` \| `null`

___
<a id="render"></a>

###  render

▸ **render**(): `React.ReactNode`

*Overrides Component.render*

*Defined in [breakpoint-tracker.tsx:72](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L72)*

React render method

**Returns:** `React.ReactNode`

___
<a id="requestframe"></a>

### `<Private>` requestFrame

▸ **requestFrame**(): `void`

*Defined in [breakpoint-tracker.tsx:98](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L98)*

Request's an animation frame if there are currently no open animation frame requests

**Returns:** `void`

___
<a id="setstate"></a>

###  setState

▸ **setState**<`K`>(state: *`function` \| `S` \| `object`*, callback?: *`function`*): `void`

*Inherited from Component.setState*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:417*

**Type parameters:**

#### K :  `keyof BreakpointTrackerState`
**Parameters:**

| Name | Type |
| ------ | ------ |
| state | `function` \| `S` \| `object` |
| `Optional` callback | `function` |

**Returns:** `void`

___
<a id="shouldcomponentupdate"></a>

### `<Optional>` shouldComponentUpdate

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)>*, nextState: *`Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-breakpoint-tracker-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[BreakpointTrackerProps](../interfaces/_breakpoint_tracker_.breakpointtrackerprops.md)> |
| nextState | `Readonly`<[BreakpointTrackerState](../interfaces/_breakpoint_tracker_.breakpointtrackerstate.md)> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="updatebreakpoint"></a>

### `<Private>` updateBreakpoint

▸ **updateBreakpoint**(): `void`

*Defined in [breakpoint-tracker.tsx:79](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-breakpoint-tracker-react/src/breakpoint-tracker.tsx#L79)*

Updates the active breakpoint

**Returns:** `void`

___

