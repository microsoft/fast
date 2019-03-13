[@microsoft/fast-viewer-react](../README.md) > ["select-device/select-device.props"](../modules/_select_device_select_device_props_.md) > [SelectDeviceHandledProps](../interfaces/_select_device_select_device_props_.selectdevicehandledprops.md)

# Interface: SelectDeviceHandledProps

## Hierarchy

↳  [SelectDeviceManagedClasses](_select_device_select_device_props_.selectdevicemanagedclasses.md)

**↳ SelectDeviceHandledProps**

## Index

### Properties

* [activeDeviceId](_select_device_select_device_props_.selectdevicehandledprops.md#activedeviceid)
* [devices](_select_device_select_device_props_.selectdevicehandledprops.md#devices)
* [disabled](_select_device_select_device_props_.selectdevicehandledprops.md#disabled)
* [label](_select_device_select_device_props_.selectdevicehandledprops.md#label)
* [managedClasses](_select_device_select_device_props_.selectdevicehandledprops.md#managedclasses)
* [onUpdateDevice](_select_device_select_device_props_.selectdevicehandledprops.md#onupdatedevice)

---

## Properties

<a id="activedeviceid"></a>

###  activeDeviceId

**● activeDeviceId**: *`string`*

*Defined in [select-device/select-device.props.ts:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/select-device/select-device.props.ts#L28)*

The active device

___
<a id="devices"></a>

###  devices

**● devices**: *[Device](_select_device_devices_.device.md)[]*

*Defined in [select-device/select-device.props.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/select-device/select-device.props.ts#L23)*

The list of devices to use as options

___
<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: *`boolean`*

*Defined in [select-device/select-device.props.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/select-device/select-device.props.ts#L18)*

The disabled state for the select

___
<a id="label"></a>

### `<Optional>` label

**● label**: *`string`*

*Defined in [select-device/select-device.props.ts:13](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/select-device/select-device.props.ts#L13)*

The label for the select

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-viewer-react/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="onupdatedevice"></a>

###  onUpdateDevice

**● onUpdateDevice**: *`function`*

*Defined in [select-device/select-device.props.ts:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/select-device/select-device.props.ts#L33)*

The update device event handler

#### Type declaration
▸(id: *`string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `void`

___

