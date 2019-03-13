[@microsoft/fast-tooling-react](../README.md) > ["viewer/select-device/select-device.base"](../modules/_viewer_select_device_select_device_base_.md) > [SelectDevice](../classes/_viewer_select_device_select_device_base_.selectdevice.md)

# Class: SelectDevice

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops), `__type`, `__type`>

**↳ SelectDevice**

## Index

### Properties

* [referenceResolverStore](_viewer_select_device_select_device_base_.selectdevice.md#referenceresolverstore)
* [referenceStore](_viewer_select_device_select_device_base_.selectdevice.md#referencestore)
* [displayName](_viewer_select_device_select_device_base_.selectdevice.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_viewer_select_device_select_device_base_.selectdevice.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_viewer_select_device_select_device_base_.selectdevice.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_viewer_select_device_select_device_base_.selectdevice.md#unsafe_componentwillupdate)
* [componentDidCatch](_viewer_select_device_select_device_base_.selectdevice.md#componentdidcatch)
* [componentDidMount](_viewer_select_device_select_device_base_.selectdevice.md#componentdidmount)
* [componentDidUpdate](_viewer_select_device_select_device_base_.selectdevice.md#componentdidupdate)
* [componentWillMount](_viewer_select_device_select_device_base_.selectdevice.md#componentwillmount)
* [componentWillReceiveProps](_viewer_select_device_select_device_base_.selectdevice.md#componentwillreceiveprops)
* [componentWillUnmount](_viewer_select_device_select_device_base_.selectdevice.md#componentwillunmount)
* [componentWillUpdate](_viewer_select_device_select_device_base_.selectdevice.md#componentwillupdate)
* [generateClassNames](_viewer_select_device_select_device_base_.selectdevice.md#generateclassnames)
* [getRef](_viewer_select_device_select_device_base_.selectdevice.md#getref)
* [getSnapshotBeforeUpdate](_viewer_select_device_select_device_base_.selectdevice.md#getsnapshotbeforeupdate)
* [handleOnChange](_viewer_select_device_select_device_base_.selectdevice.md#handleonchange)
* [render](_viewer_select_device_select_device_base_.selectdevice.md#render)
* [renderLabel](_viewer_select_device_select_device_base_.selectdevice.md#renderlabel)
* [renderOptions](_viewer_select_device_select_device_base_.selectdevice.md#renderoptions)
* [setRef](_viewer_select_device_select_device_base_.selectdevice.md#setref)
* [shouldComponentUpdate](_viewer_select_device_select_device_base_.selectdevice.md#shouldcomponentupdate)
* [unhandledProps](_viewer_select_device_select_device_base_.selectdevice.md#unhandledprops)
* [withSlot](_viewer_select_device_select_device_base_.selectdevice.md#withslot)
* [withoutSlot](_viewer_select_device_select_device_base_.selectdevice.md#withoutslot)

### Object literals

* [handledProps](_viewer_select_device_select_device_base_.selectdevice.md#handledprops)

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

**● displayName**: *`string`* = "SelectDevice"

*Defined in [viewer/select-device/select-device.base.tsx:7](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L7)*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`> |
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

▸ **componentDidUpdate**(prevProps: *`Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:589*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`> |
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

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`> |
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

▸ **componentWillUpdate**(nextProps: *`Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `void`

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
| nextProps | `Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`> |
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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`>*, prevState: *`Readonly`<`__type`>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`> |
| prevState | `Readonly`<`__type`> |

**Returns:** `SS` \| `null`

___
<a id="handleonchange"></a>

### `<Private>` handleOnChange

▸ **handleOnChange**(e: *`ChangeEvent`<`HTMLSelectElement`>*): `void`

*Defined in [viewer/select-device/select-device.base.tsx:61](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `ChangeEvent`<`HTMLSelectElement`> |

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Defined in [viewer/select-device/select-device.base.tsx:15](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L15)*

**Returns:** `Element`

___
<a id="renderlabel"></a>

### `<Private>` renderLabel

▸ **renderLabel**(): `React.ReactNode`

*Defined in [viewer/select-device/select-device.base.tsx:39](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L39)*

**Returns:** `React.ReactNode`

___
<a id="renderoptions"></a>

### `<Private>` renderOptions

▸ **renderOptions**(): `React.ReactNode`

*Defined in [viewer/select-device/select-device.base.tsx:49](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L49)*

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

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`>*, nextState: *`Readonly`<`__type`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[SelectDeviceProps](../modules/_viewer_select_device_select_device_props_.md#selectdeviceprops) & `__type` & `FoundationProps`> |
| nextState | `Readonly`<`__type`> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): `__type`

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** `__type`

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

*Defined in [viewer/select-device/select-device.base.tsx:9](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L9)*

<a id="handledprops.activedeviceid"></a>

####  activeDeviceId

**● activeDeviceId**: *`undefined`* =  void 0

*Defined in [viewer/select-device/select-device.base.tsx:11](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L11)*

___
<a id="handledprops.devices"></a>

####  devices

**● devices**: *`undefined`* =  void 0

*Defined in [viewer/select-device/select-device.base.tsx:10](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L10)*

___
<a id="handledprops.onupdatedevice"></a>

####  onUpdateDevice

**● onUpdateDevice**: *`undefined`* =  void 0

*Defined in [viewer/select-device/select-device.base.tsx:12](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/select-device/select-device.base.tsx#L12)*

___

___

