[@microsoft/fast-tooling-react](../README.md) > ["viewer/viewer/viewer.props"](../modules/_viewer_viewer_viewer_props_.md) > [ViewerHandledProps](../interfaces/_viewer_viewer_viewer_props_.viewerhandledprops.md)

# Interface: ViewerHandledProps

## Hierarchy

↳  [ViewerManagedClasses](_viewer_viewer_viewer_props_.viewermanagedclasses.md)

**↳ ViewerHandledProps**

## Index

### Properties

* [height](_viewer_viewer_viewer_props_.viewerhandledprops.md#height)
* [iframePostMessage](_viewer_viewer_viewer_props_.viewerhandledprops.md#iframepostmessage)
* [iframeSrc](_viewer_viewer_viewer_props_.viewerhandledprops.md#iframesrc)
* [managedClasses](_viewer_viewer_viewer_props_.viewerhandledprops.md#managedclasses)
* [onInitializeViewerContentProps](_viewer_viewer_viewer_props_.viewerhandledprops.md#oninitializeviewercontentprops)
* [onUpdateHeight](_viewer_viewer_viewer_props_.viewerhandledprops.md#onupdateheight)
* [onUpdateViewerContentProps](_viewer_viewer_viewer_props_.viewerhandledprops.md#onupdateviewercontentprops)
* [onUpdateWidth](_viewer_viewer_viewer_props_.viewerhandledprops.md#onupdatewidth)
* [responsive](_viewer_viewer_viewer_props_.viewerhandledprops.md#responsive)
* [viewerContentProps](_viewer_viewer_viewer_props_.viewerhandledprops.md#viewercontentprops)
* [width](_viewer_viewer_viewer_props_.viewerhandledprops.md#width)

---

## Properties

<a id="height"></a>

### `<Optional>` height

**● height**: *`number`*

*Defined in [viewer/viewer/viewer.props.ts:39](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L39)*

The height of the viewer

___
<a id="iframepostmessage"></a>

### `<Optional>` iframePostMessage

**● iframePostMessage**: *[CustomViewerMessage](../modules/_viewer_utilities_message_system_.md#customviewermessage)*

*Defined in [viewer/viewer/viewer.props.ts:29](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L29)*

Custom message to pass to the iframe

___
<a id="iframesrc"></a>

###  iframeSrc

**● iframeSrc**: *`string`*

*Defined in [viewer/viewer/viewer.props.ts:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L19)*

The src route for the viewer iframe

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-tooling-react/node_modules/@microsoft/fast-jss-manager-react/node_modules/@microsoft/fast-jss-manager/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="oninitializeviewercontentprops"></a>

### `<Optional>` onInitializeViewerContentProps

**● onInitializeViewerContentProps**: *`function`*

*Defined in [viewer/viewer/viewer.props.ts:64](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L64)*

A callback for when content props are requested to be initialized

#### Type declaration
▸(message: *[ViewerMessage](../modules/_viewer_utilities_message_system_.md#viewermessage)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | [ViewerMessage](../modules/_viewer_utilities_message_system_.md#viewermessage) |

**Returns:** `void`

___
<a id="onupdateheight"></a>

### `<Optional>` onUpdateHeight

**● onUpdateHeight**: *`function`*

*Defined in [viewer/viewer/viewer.props.ts:49](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L49)*

A callback for when height should update

#### Type declaration
▸(height: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| height | `number` |

**Returns:** `void`

___
<a id="onupdateviewercontentprops"></a>

### `<Optional>` onUpdateViewerContentProps

**● onUpdateViewerContentProps**: *`function`*

*Defined in [viewer/viewer/viewer.props.ts:59](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L59)*

A callback for when content props have been requested to be updated

#### Type declaration
▸(message: *[ViewerMessage](../modules/_viewer_utilities_message_system_.md#viewermessage)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | [ViewerMessage](../modules/_viewer_utilities_message_system_.md#viewermessage) |

**Returns:** `void`

___
<a id="onupdatewidth"></a>

### `<Optional>` onUpdateWidth

**● onUpdateWidth**: *`function`*

*Defined in [viewer/viewer/viewer.props.ts:54](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L54)*

A callback for when width should update

#### Type declaration
▸(width: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| width | `number` |

**Returns:** `void`

___
<a id="responsive"></a>

### `<Optional>` responsive

**● responsive**: *`boolean`*

*Defined in [viewer/viewer/viewer.props.ts:34](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L34)*

The responsive, resizable functionality for the viewer

___
<a id="viewercontentprops"></a>

### `<Optional>` viewerContentProps

**● viewerContentProps**: *`any`*

*Defined in [viewer/viewer/viewer.props.ts:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L24)*

The props to be assigned to the ViewerContent component

___
<a id="width"></a>

### `<Optional>` width

**● width**: *`number`*

*Defined in [viewer/viewer/viewer.props.ts:44](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/viewer/viewer/viewer.props.ts#L44)*

The width of the viewer

___

