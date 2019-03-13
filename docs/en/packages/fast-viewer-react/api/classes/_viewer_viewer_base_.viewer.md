[@microsoft/fast-viewer-react](../README.md) > ["viewer/viewer.base"](../modules/_viewer_viewer_base_.md) > [Viewer](../classes/_viewer_viewer_base_.viewer.md)

# Class: Viewer

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md), [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md), [ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)>

**↳ Viewer**

## Index

### Constructors

* [constructor](_viewer_viewer_base_.viewer.md#constructor)

### Properties

* [iframeRef](_viewer_viewer_base_.viewer.md#iframeref)
* [referenceResolverStore](_viewer_viewer_base_.viewer.md#referenceresolverstore)
* [referenceStore](_viewer_viewer_base_.viewer.md#referencestore)
* [displayName](_viewer_viewer_base_.viewer.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_viewer_viewer_base_.viewer.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_viewer_viewer_base_.viewer.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_viewer_viewer_base_.viewer.md#unsafe_componentwillupdate)
* [componentDidCatch](_viewer_viewer_base_.viewer.md#componentdidcatch)
* [componentDidMount](_viewer_viewer_base_.viewer.md#componentdidmount)
* [componentDidUpdate](_viewer_viewer_base_.viewer.md#componentdidupdate)
* [componentWillMount](_viewer_viewer_base_.viewer.md#componentwillmount)
* [componentWillReceiveProps](_viewer_viewer_base_.viewer.md#componentwillreceiveprops)
* [componentWillUnmount](_viewer_viewer_base_.viewer.md#componentwillunmount)
* [componentWillUpdate](_viewer_viewer_base_.viewer.md#componentwillupdate)
* [generateClassNames](_viewer_viewer_base_.viewer.md#generateclassnames)
* [generateContentRegionClassNames](_viewer_viewer_base_.viewer.md#generatecontentregionclassnames)
* [getHeight](_viewer_viewer_base_.viewer.md#getheight)
* [getRef](_viewer_viewer_base_.viewer.md#getref)
* [getSnapshotBeforeUpdate](_viewer_viewer_base_.viewer.md#getsnapshotbeforeupdate)
* [getWidth](_viewer_viewer_base_.viewer.md#getwidth)
* [handleBottomLeftMouseDown](_viewer_viewer_base_.viewer.md#handlebottomleftmousedown)
* [handleBottomMouseDown](_viewer_viewer_base_.viewer.md#handlebottommousedown)
* [handleBottomRightMouseDown](_viewer_viewer_base_.viewer.md#handlebottomrightmousedown)
* [handleLeftMouseDown](_viewer_viewer_base_.viewer.md#handleleftmousedown)
* [handleMessage](_viewer_viewer_base_.viewer.md#handlemessage)
* [handleMouseDown](_viewer_viewer_base_.viewer.md#handlemousedown)
* [handleMouseMove](_viewer_viewer_base_.viewer.md#handlemousemove)
* [handleMouseUp](_viewer_viewer_base_.viewer.md#handlemouseup)
* [handleRightMouseDown](_viewer_viewer_base_.viewer.md#handlerightmousedown)
* [handleUpdateHeight](_viewer_viewer_base_.viewer.md#handleupdateheight)
* [handleUpdateWidth](_viewer_viewer_base_.viewer.md#handleupdatewidth)
* [postMessage](_viewer_viewer_base_.viewer.md#postmessage)
* [render](_viewer_viewer_base_.viewer.md#render)
* [renderResponsiveBottomRow](_viewer_viewer_base_.viewer.md#renderresponsivebottomrow)
* [renderResponsiveLeftHandle](_viewer_viewer_base_.viewer.md#renderresponsivelefthandle)
* [renderResponsiveRightHandle](_viewer_viewer_base_.viewer.md#renderresponsiverighthandle)
* [setRef](_viewer_viewer_base_.viewer.md#setref)
* [shouldComponentUpdate](_viewer_viewer_base_.viewer.md#shouldcomponentupdate)
* [unhandledProps](_viewer_viewer_base_.viewer.md#unhandledprops)
* [updateMessage](_viewer_viewer_base_.viewer.md#updatemessage)
* [withSlot](_viewer_viewer_base_.viewer.md#withslot)
* [withoutSlot](_viewer_viewer_base_.viewer.md#withoutslot)

### Object literals

* [handledProps](_viewer_viewer_base_.viewer.md#handledprops)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Viewer**(props: *[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md)*): [Viewer](_viewer_viewer_base_.viewer.md)

*Defined in [viewer/viewer.base.tsx:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) |

**Returns:** [Viewer](_viewer_viewer_base_.viewer.md)

___

## Properties

<a id="iframeref"></a>

### `<Private>` iframeRef

**● iframeRef**: *`RefObject`<`HTMLIFrameElement`>*

*Defined in [viewer/viewer.base.tsx:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L54)*

___
<a id="referenceresolverstore"></a>

### `<Protected>` referenceResolverStore

**● referenceResolverStore**: *`ReferenceResolverStore`*

*Inherited from Foundation.referenceResolverStore*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:51*

Store all memoized ref callbacks so they can quickly be accessed. Storing the functions allows us to not create new ref functions every update cycle

___
<a id="referencestore"></a>

### `<Protected>` referenceStore

**● referenceStore**: *`ReferenceStore`*

*Inherited from Foundation.referenceStore*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:55*

Location where all react element and component references are stored

___
<a id="displayname"></a>

### `<Static>` displayName

**● displayName**: *`string`* = "Viewer"

*Defined in [viewer/viewer.base.tsx:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L44)*

___

## Methods

<a id="unsafe_componentwillmount"></a>

### `<Optional>` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:618*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:650*

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
| nextProps | `Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:678*

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
| nextProps | `Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:547*

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

*Defined in [viewer/viewer.base.tsx:91](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L91)*

**Returns:** `void`

___
<a id="componentdidupdate"></a>

###  componentDidUpdate

▸ **componentDidUpdate**(prevProps: *[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md)*, prevState: *[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)*): `void`

*Overrides NewLifecycle.componentDidUpdate*

*Defined in [viewer/viewer.base.tsx:74](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L74)*

Handle when component updates

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | [ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) |
| prevState | [ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md) |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:604*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:633*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:542*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:663*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(componentClasses?: *`string`*): `string` \| `null`

*Inherited from Foundation.generateClassNames*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:79*

Joins any string with the className prop passed to the component. Used for applying a className to the root element of a component's render function.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` componentClasses | `string` |

**Returns:** `string` \| `null`

___
<a id="generatecontentregionclassnames"></a>

### `<Private>` generateContentRegionClassNames

▸ **generateContentRegionClassNames**(): `string`

*Defined in [viewer/viewer.base.tsx:210](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L210)*

**Returns:** `string`

___
<a id="getheight"></a>

### `<Private>` getHeight

▸ **getHeight**(): `any`

*Defined in [viewer/viewer.base.tsx:194](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L194)*

**Returns:** `any`

___
<a id="getref"></a>

### `<Protected>` getRef

▸ **getRef**(...args: *`Array`<`string` \| `number`>*): `React.ReactNode`

*Inherited from Foundation.getRef*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:70*

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)> |

**Returns:** `SS` \| `null`

___
<a id="getwidth"></a>

### `<Private>` getWidth

▸ **getWidth**(): `any`

*Defined in [viewer/viewer.base.tsx:202](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L202)*

**Returns:** `any`

___
<a id="handlebottomleftmousedown"></a>

### `<Private>` handleBottomLeftMouseDown

▸ **handleBottomLeftMouseDown**(e: *`MouseEvent`<`HTMLButtonElement`>*): `void`

*Defined in [viewer/viewer.base.tsx:367](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L367)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLButtonElement`> |

**Returns:** `void`

___
<a id="handlebottommousedown"></a>

### `<Private>` handleBottomMouseDown

▸ **handleBottomMouseDown**(e: *`MouseEvent`<`HTMLButtonElement`>*): `void`

*Defined in [viewer/viewer.base.tsx:348](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L348)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLButtonElement`> |

**Returns:** `void`

___
<a id="handlebottomrightmousedown"></a>

### `<Private>` handleBottomRightMouseDown

▸ **handleBottomRightMouseDown**(e: *`MouseEvent`<`HTMLButtonElement`>*): `void`

*Defined in [viewer/viewer.base.tsx:356](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L356)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLButtonElement`> |

**Returns:** `void`

___
<a id="handleleftmousedown"></a>

### `<Private>` handleLeftMouseDown

▸ **handleLeftMouseDown**(e: *`MouseEvent`<`HTMLButtonElement`>*): `void`

*Defined in [viewer/viewer.base.tsx:378](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L378)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLButtonElement`> |

**Returns:** `void`

___
<a id="handlemessage"></a>

### `<Private>` handleMessage

▸ **handleMessage**(e: *`MessageEvent`*): `void`

*Defined in [viewer/viewer.base.tsx:229](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L229)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MessageEvent` |

**Returns:** `void`

___
<a id="handlemousedown"></a>

### `<Private>` handleMouseDown

▸ **handleMouseDown**(handleLocation: *[ResizeHandleLocation](../enums/_viewer_viewer_props_.resizehandlelocation.md)*): `function`

*Defined in [viewer/viewer.base.tsx:319](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L319)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| handleLocation | [ResizeHandleLocation](../enums/_viewer_viewer_props_.resizehandlelocation.md) |

**Returns:** `function`

___
<a id="handlemousemove"></a>

### `<Private>` handleMouseMove

▸ **handleMouseMove**(e: *`MouseEvent`*): `void`

*Defined in [viewer/viewer.base.tsx:265](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L265)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent` |

**Returns:** `void`

___
<a id="handlemouseup"></a>

### `<Private>` handleMouseUp

▸ **handleMouseUp**(e: *`MouseEvent`*): `void`

*Defined in [viewer/viewer.base.tsx:251](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L251)*

Handle mouseUp

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent` |

**Returns:** `void`

___
<a id="handlerightmousedown"></a>

### `<Private>` handleRightMouseDown

▸ **handleRightMouseDown**(e: *`MouseEvent`<`HTMLButtonElement`>*): `void`

*Defined in [viewer/viewer.base.tsx:386](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L386)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLButtonElement`> |

**Returns:** `void`

___
<a id="handleupdateheight"></a>

### `<Private>` handleUpdateHeight

▸ **handleUpdateHeight**(height: *`number`*): `void`

*Defined in [viewer/viewer.base.tsx:394](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L394)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| height | `number` |

**Returns:** `void`

___
<a id="handleupdatewidth"></a>

### `<Private>` handleUpdateWidth

▸ **handleUpdateWidth**(width: *`number`*): `void`

*Defined in [viewer/viewer.base.tsx:400](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L400)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| width | `number` |

**Returns:** `void`

___
<a id="postmessage"></a>

### `<Private>` postMessage

▸ **postMessage**(message: *[ViewerMessage](../interfaces/_utilities_message_system_.viewermessage.md)*): `void`

*Defined in [viewer/viewer.base.tsx:220](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L220)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | [ViewerMessage](../interfaces/_utilities_message_system_.viewermessage.md) |

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Defined in [viewer/viewer.base.tsx:100](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L100)*

**Returns:** `Element`

___
<a id="renderresponsivebottomrow"></a>

### `<Private>` renderResponsiveBottomRow

▸ **renderResponsiveBottomRow**(): `Element`

*Defined in [viewer/viewer.base.tsx:152](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L152)*

**Returns:** `Element`

___
<a id="renderresponsivelefthandle"></a>

### `<Private>` renderResponsiveLeftHandle

▸ **renderResponsiveLeftHandle**(): `Element`

*Defined in [viewer/viewer.base.tsx:126](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L126)*

**Returns:** `Element`

___
<a id="renderresponsiverighthandle"></a>

### `<Private>` renderResponsiveRightHandle

▸ **renderResponsiveRightHandle**(): `Element`

*Defined in [viewer/viewer.base.tsx:139](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L139)*

**Returns:** `Element`

___
<a id="setref"></a>

### `<Protected>` setRef

▸ **setRef**(...args: *`Array`<`string` \| `number`>*): `ReferenceResolver`

*Inherited from Foundation.setRef*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:63*

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

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[ViewerHandledProps](../interfaces/_viewer_viewer_props_.viewerhandledprops.md) & [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[ViewerState](../interfaces/_viewer_viewer_base_.viewerstate.md)> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [ViewerUnhandledProps](../interfaces/_viewer_viewer_props_.viewerunhandledprops.md)

___
<a id="updatemessage"></a>

### `<Private>` updateMessage

▸ **updateMessage**(): `void`

*Defined in [viewer/viewer.base.tsx:184](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L184)*

**Returns:** `void`

___
<a id="withslot"></a>

### `<Protected>` withSlot

▸ **withSlot**<`T`>(slot: *`T` \| `T`[]*, nodes?: *`React.ReactNode`*): `React.ReactNode`

*Inherited from Foundation.withSlot*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:80*

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

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:81*

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

*Defined in [viewer/viewer.base.tsx:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L46)*

<a id="handledprops.height"></a>

####  height

**● height**: *`undefined`* =  void 0

*Defined in [viewer/viewer.base.tsx:49](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L49)*

___
<a id="handledprops.iframesrc"></a>

####  iframeSrc

**● iframeSrc**: *`undefined`* =  void 0

*Defined in [viewer/viewer.base.tsx:48](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L48)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [viewer/viewer.base.tsx:47](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L47)*

___
<a id="handledprops.responsive"></a>

####  responsive

**● responsive**: *`undefined`* =  void 0

*Defined in [viewer/viewer.base.tsx:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L51)*

___
<a id="handledprops.width"></a>

####  width

**● width**: *`undefined`* =  void 0

*Defined in [viewer/viewer.base.tsx:50](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/viewer/viewer.base.tsx#L50)*

___

___

