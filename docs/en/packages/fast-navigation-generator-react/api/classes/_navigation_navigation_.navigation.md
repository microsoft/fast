[@microsoft/fast-navigation-generator-react](../README.md) > ["navigation/navigation"](../modules/_navigation_navigation_.md) > [Navigation](../classes/_navigation_navigation_.navigation.md)

# Class: Navigation

## Type parameters
#### SS 
## Hierarchy

 `Foundation`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md), [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md), [NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>

**↳ Navigation**

## Index

### Constructors

* [constructor](_navigation_navigation_.navigation.md#constructor)

### Properties

* [referenceResolverStore](_navigation_navigation_.navigation.md#referenceresolverstore)
* [referenceStore](_navigation_navigation_.navigation.md#referencestore)
* [rootElement](_navigation_navigation_.navigation.md#rootelement)
* [displayName](_navigation_navigation_.navigation.md#displayname)

### Methods

* [UNSAFE_componentWillMount](_navigation_navigation_.navigation.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](_navigation_navigation_.navigation.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](_navigation_navigation_.navigation.md#unsafe_componentwillupdate)
* [componentDidCatch](_navigation_navigation_.navigation.md#componentdidcatch)
* [componentDidMount](_navigation_navigation_.navigation.md#componentdidmount)
* [componentDidUpdate](_navigation_navigation_.navigation.md#componentdidupdate)
* [componentWillMount](_navigation_navigation_.navigation.md#componentwillmount)
* [componentWillReceiveProps](_navigation_navigation_.navigation.md#componentwillreceiveprops)
* [componentWillUnmount](_navigation_navigation_.navigation.md#componentwillunmount)
* [componentWillUpdate](_navigation_navigation_.navigation.md#componentwillupdate)
* [findCurrentTreeItemIndex](_navigation_navigation_.navigation.md#findcurrenttreeitemindex)
* [focusAndCloseTreeItems](_navigation_navigation_.navigation.md#focusandclosetreeitems)
* [focusAndOpenTreeItems](_navigation_navigation_.navigation.md#focusandopentreeitems)
* [focusFirstTreeItem](_navigation_navigation_.navigation.md#focusfirsttreeitem)
* [focusLastTreeItem](_navigation_navigation_.navigation.md#focuslasttreeitem)
* [focusNextTreeItem](_navigation_navigation_.navigation.md#focusnexttreeitem)
* [focusPreviousTreeItem](_navigation_navigation_.navigation.md#focusprevioustreeitem)
* [generateClassNames](_navigation_navigation_.navigation.md#generateclassnames)
* [getLinkClassNames](_navigation_navigation_.navigation.md#getlinkclassnames)
* [getRef](_navigation_navigation_.navigation.md#getref)
* [getSnapshotBeforeUpdate](_navigation_navigation_.navigation.md#getsnapshotbeforeupdate)
* [getTreeItemNodes](_navigation_navigation_.navigation.md#gettreeitemnodes)
* [getTriggerClassNames](_navigation_navigation_.navigation.md#gettriggerclassnames)
* [handleTreeItemClick](_navigation_navigation_.navigation.md#handletreeitemclick)
* [handleTreeItemKeyUp](_navigation_navigation_.navigation.md#handletreeitemkeyup)
* [isExpanded](_navigation_navigation_.navigation.md#isexpanded)
* [render](_navigation_navigation_.navigation.md#render)
* [renderTreeItem](_navigation_navigation_.navigation.md#rendertreeitem)
* [renderTreeItemContainer](_navigation_navigation_.navigation.md#rendertreeitemcontainer)
* [renderTreeItems](_navigation_navigation_.navigation.md#rendertreeitems)
* [setRef](_navigation_navigation_.navigation.md#setref)
* [shouldComponentUpdate](_navigation_navigation_.navigation.md#shouldcomponentupdate)
* [toggleItems](_navigation_navigation_.navigation.md#toggleitems)
* [unhandledProps](_navigation_navigation_.navigation.md#unhandledprops)
* [withSlot](_navigation_navigation_.navigation.md#withslot)
* [withoutSlot](_navigation_navigation_.navigation.md#withoutslot)
* [getDerivedStateFromProps](_navigation_navigation_.navigation.md#getderivedstatefromprops)

### Object literals

* [handledProps](_navigation_navigation_.navigation.md#handledprops)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Navigation**(props: *[NavigationProps](../modules/_navigation_navigation_props_.md#navigationprops)*): [Navigation](_navigation_navigation_.navigation.md)

*Defined in [navigation/navigation.tsx:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [NavigationProps](../modules/_navigation_navigation_props_.md#navigationprops) |

**Returns:** [Navigation](_navigation_navigation_.navigation.md)

___

## Properties

<a id="referenceresolverstore"></a>

### `<Protected>` referenceResolverStore

**● referenceResolverStore**: *`ReferenceResolverStore`*

*Inherited from Foundation.referenceResolverStore*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:51*

Store all memoized ref callbacks so they can quickly be accessed. Storing the functions allows us to not create new ref functions every update cycle

___
<a id="referencestore"></a>

### `<Protected>` referenceStore

**● referenceStore**: *`ReferenceStore`*

*Inherited from Foundation.referenceStore*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:55*

Location where all react element and component references are stored

___
<a id="rootelement"></a>

### `<Private>` rootElement

**● rootElement**: *`RefObject`<`HTMLDivElement`>*

*Defined in [navigation/navigation.tsx:65](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L65)*

___
<a id="displayname"></a>

### `<Static>` displayName

**● displayName**: *`string`* = "Navigation"

*Defined in [navigation/navigation.tsx:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L23)*

___

## Methods

<a id="unsafe_componentwillmount"></a>

### `<Optional>` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:618*

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

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:650*

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
| nextProps | `Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:678*

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
| nextProps | `Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:547*

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

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:526*

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** `void`

___
<a id="componentdidupdate"></a>

### `<Optional>` componentDidUpdate

▸ **componentDidUpdate**(prevProps: *`Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:589*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)> |
| `Optional` snapshot | `SS` |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:604*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:633*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:542*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:663*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="findcurrenttreeitemindex"></a>

### `<Private>` findCurrentTreeItemIndex

▸ **findCurrentTreeItemIndex**(nodes: *`HTMLElement`[]*, dataLocation: *`string`*): `number`

*Defined in [navigation/navigation.tsx:191](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L191)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nodes | `HTMLElement`[] |
| dataLocation | `string` |

**Returns:** `number`

___
<a id="focusandclosetreeitems"></a>

### `<Private>` focusAndCloseTreeItems

▸ **focusAndCloseTreeItems**(dataLocation: *`string`*): `void`

*Defined in [navigation/navigation.tsx:261](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L261)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `void`

___
<a id="focusandopentreeitems"></a>

### `<Private>` focusAndOpenTreeItems

▸ **focusAndOpenTreeItems**(dataLocation: *`string`*): `void`

*Defined in [navigation/navigation.tsx:241](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L241)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `void`

___
<a id="focusfirsttreeitem"></a>

### `<Private>` focusFirstTreeItem

▸ **focusFirstTreeItem**(): `void`

*Defined in [navigation/navigation.tsx:225](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L225)*

**Returns:** `void`

___
<a id="focuslasttreeitem"></a>

### `<Private>` focusLastTreeItem

▸ **focusLastTreeItem**(): `void`

*Defined in [navigation/navigation.tsx:233](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L233)*

**Returns:** `void`

___
<a id="focusnexttreeitem"></a>

### `<Private>` focusNextTreeItem

▸ **focusNextTreeItem**(dataLocation: *`string`*): `void`

*Defined in [navigation/navigation.tsx:197](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L197)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `void`

___
<a id="focusprevioustreeitem"></a>

### `<Private>` focusPreviousTreeItem

▸ **focusPreviousTreeItem**(dataLocation: *`string`*): `void`

*Defined in [navigation/navigation.tsx:212](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L212)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `void`

___
<a id="generateclassnames"></a>

### `<Protected>` generateClassNames

▸ **generateClassNames**(componentClasses?: *`string`*): `string` \| `null`

*Inherited from Foundation.generateClassNames*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:79*

Joins any string with the className prop passed to the component. Used for applying a className to the root element of a component's render function.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` componentClasses | `string` |

**Returns:** `string` \| `null`

___
<a id="getlinkclassnames"></a>

### `<Private>` getLinkClassNames

▸ **getLinkClassNames**(dataLocation: *`string`*): `string`

*Defined in [navigation/navigation.tsx:292](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L292)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `string`

___
<a id="getref"></a>

### `<Protected>` getRef

▸ **getRef**(...args: *`Array`<`string` \| `number`>*): `React.ReactNode`

*Inherited from Foundation.getRef*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:70*

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

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`>*, prevState: *`Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:583*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`> |
| prevState | `Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)> |

**Returns:** `SS` \| `null`

___
<a id="gettreeitemnodes"></a>

### `<Private>` getTreeItemNodes

▸ **getTreeItemNodes**(): `HTMLElement`[]

*Defined in [navigation/navigation.tsx:320](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L320)*

**Returns:** `HTMLElement`[]

___
<a id="gettriggerclassnames"></a>

### `<Private>` getTriggerClassNames

▸ **getTriggerClassNames**(dataLocation: *`string`*): `string`

*Defined in [navigation/navigation.tsx:306](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L306)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `string`

___
<a id="handletreeitemclick"></a>

### `<Private>` handleTreeItemClick

▸ **handleTreeItemClick**(dataLocation: *`string`*): `function`

*Defined in [navigation/navigation.tsx:374](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L374)*

Handles clicking on a tree item

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `function`

___
<a id="handletreeitemkeyup"></a>

### `<Private>` handleTreeItemKeyUp

▸ **handleTreeItemKeyUp**(dataLocation: *`string`*): `function`

*Defined in [navigation/navigation.tsx:332](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L332)*

Handles key up on a tree item

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `function`

___
<a id="isexpanded"></a>

### `<Private>` isExpanded

▸ **isExpanded**(dataLocation: *`string`*): `boolean`

*Defined in [navigation/navigation.tsx:415](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L415)*

Determines if the tree item should be expanded

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `boolean`

___
<a id="render"></a>

###  render

▸ **render**(): `React.ReactNode`

*Defined in [navigation/navigation.tsx:85](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L85)*

**Returns:** `React.ReactNode`

___
<a id="rendertreeitem"></a>

### `<Private>` renderTreeItem

▸ **renderTreeItem**(navigation: *[TreeNavigation](../interfaces/_navigation_navigation_props_.treenavigation.md)*, level: *`number`*, navigationLength: *`number`*, positionInNavigation: *`number`*, index: *`number`*): `React.ReactNode`

*Defined in [navigation/navigation.tsx:112](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L112)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| navigation | [TreeNavigation](../interfaces/_navigation_navigation_props_.treenavigation.md) |
| level | `number` |
| navigationLength | `number` |
| positionInNavigation | `number` |
| index | `number` |

**Returns:** `React.ReactNode`

___
<a id="rendertreeitemcontainer"></a>

### `<Private>` renderTreeItemContainer

▸ **renderTreeItemContainer**(navigation: *[TreeNavigation](../interfaces/_navigation_navigation_props_.treenavigation.md)[]*, level: *`number`*): `React.ReactNode`

*Defined in [navigation/navigation.tsx:101](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L101)*

Renders the tree item containing element

**Parameters:**

| Name | Type |
| ------ | ------ |
| navigation | [TreeNavigation](../interfaces/_navigation_navigation_props_.treenavigation.md)[] |
| level | `number` |

**Returns:** `React.ReactNode`

___
<a id="rendertreeitems"></a>

### `<Private>` renderTreeItems

▸ **renderTreeItems**(navigation: *[TreeNavigation](../interfaces/_navigation_navigation_props_.treenavigation.md)[]*, level: *`number`*): `React.ReactNode`

*Defined in [navigation/navigation.tsx:173](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L173)*

Renders tree items

**Parameters:**

| Name | Type |
| ------ | ------ |
| navigation | [TreeNavigation](../interfaces/_navigation_navigation_props_.treenavigation.md)[] |
| level | `number` |

**Returns:** `React.ReactNode`

___
<a id="setref"></a>

### `<Protected>` setRef

▸ **setRef**(...args: *`Array`<`string` \| `number`>*): `ReferenceResolver`

*Inherited from Foundation.setRef*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:63*

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

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`>*, nextState: *`Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@types/react/index.d.ts:537*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[NavigationHandledProps](../interfaces/_navigation_navigation_props_.navigationhandledprops.md) & [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md) & `FoundationProps`> |
| nextState | `Readonly`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)> |
| nextContext | `any` |

**Returns:** `boolean`

___
<a id="toggleitems"></a>

### `<Private>` toggleItems

▸ **toggleItems**(dataLocation: *`string`*): `void`

*Defined in [navigation/navigation.tsx:389](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L389)*

Toggles the items by adding/removing them from the openItems array

**Parameters:**

| Name | Type |
| ------ | ------ |
| dataLocation | `string` |

**Returns:** `void`

___
<a id="unhandledprops"></a>

### `<Protected>` unhandledProps

▸ **unhandledProps**(): [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md)

*Inherited from Foundation.unhandledProps*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:74*

Returns an object containing all props that are not enumerated as handledProps

**Returns:** [NavigationUnhandledProps](../interfaces/_navigation_navigation_props_.navigationunhandledprops.md)

___
<a id="withslot"></a>

### `<Protected>` withSlot

▸ **withSlot**<`T`>(slot: *`T` \| `T`[]*, nodes?: *`React.ReactNode`*): `React.ReactNode`

*Inherited from Foundation.withSlot*

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:80*

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

*Defined in D:/projects/fast-dna/packages/fast-navigation-generator-react/node_modules/@microsoft/fast-components-foundation-react/dist/foundation/foundation.d.ts:81*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| slot | `T` \| `T`[] |
| `Optional` nodes | `React.ReactNode` |

**Returns:** `React.ReactNode`

___
<a id="getderivedstatefromprops"></a>

### `<Static>` getDerivedStateFromProps

▸ **getDerivedStateFromProps**(props: *[NavigationProps](../modules/_navigation_navigation_props_.md#navigationprops)*, state: *[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)*): `Partial`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>

*Defined in [navigation/navigation.tsx:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [NavigationProps](../modules/_navigation_navigation_props_.md#navigationprops) |
| state | [NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md) |

**Returns:** `Partial`<[NavigationState](../interfaces/_navigation_navigation_props_.navigationstate.md)>

___

## Object literals

<a id="handledprops"></a>

### `<Protected>` handledProps

**handledProps**: *`object`*

*Overrides Foundation.handledProps*

*Defined in [navigation/navigation.tsx:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L56)*

<a id="handledprops.childoptions"></a>

####  childOptions

**● childOptions**: *`undefined`* =  void 0

*Defined in [navigation/navigation.tsx:59](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L59)*

___
<a id="handledprops.data"></a>

####  data

**● data**: *`undefined`* =  void 0

*Defined in [navigation/navigation.tsx:58](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L58)*

___
<a id="handledprops.datalocation"></a>

####  dataLocation

**● dataLocation**: *`undefined`* =  void 0

*Defined in [navigation/navigation.tsx:61](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L61)*

___
<a id="handledprops.managedclasses"></a>

####  managedClasses

**● managedClasses**: *`undefined`* =  void 0

*Defined in [navigation/navigation.tsx:62](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L62)*

___
<a id="handledprops.onlocationupdate"></a>

####  onLocationUpdate

**● onLocationUpdate**: *`undefined`* =  void 0

*Defined in [navigation/navigation.tsx:60](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L60)*

___
<a id="handledprops.schema"></a>

####  schema

**● schema**: *`undefined`* =  void 0

*Defined in [navigation/navigation.tsx:57](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-navigation-generator-react/src/navigation/navigation.tsx#L57)*

___

___

