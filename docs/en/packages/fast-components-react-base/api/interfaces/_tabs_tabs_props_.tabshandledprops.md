[@microsoft/fast-components-react-base](../README.md) > ["tabs/tabs.props"](../modules/_tabs_tabs_props_.md) > [TabsHandledProps](../interfaces/_tabs_tabs_props_.tabshandledprops.md)

# Interface: TabsHandledProps

## Hierarchy

↳  [TabsManagedClasses](_tabs_tabs_props_.tabsmanagedclasses.md)

**↳ TabsHandledProps**

## Index

### Properties

* [activeId](_tabs_tabs_props_.tabshandledprops.md#activeid)
* [children](_tabs_tabs_props_.tabshandledprops.md#children)
* [items](_tabs_tabs_props_.tabshandledprops.md#items)
* [label](_tabs_tabs_props_.tabshandledprops.md#label)
* [managedClasses](_tabs_tabs_props_.tabshandledprops.md#managedclasses)
* [onUpdate](_tabs_tabs_props_.tabshandledprops.md#onupdate)
* [orientation](_tabs_tabs_props_.tabshandledprops.md#orientation)
* [tabItemSlot](_tabs_tabs_props_.tabshandledprops.md#tabitemslot)
* [tabPanelSlot](_tabs_tabs_props_.tabshandledprops.md#tabpanelslot)
* [tabSlot](_tabs_tabs_props_.tabshandledprops.md#tabslot)

---

## Properties

<a id="activeid"></a>

### `<Optional>` activeId

**● activeId**: *`string`*

*Defined in [tabs/tabs.props.ts:20](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L20)*

The active tab item id

___
<a id="children"></a>

### `<Optional>` children

**● children**: *`React.ReactNode`*

*Defined in [tabs/tabs.props.ts:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L25)*

The tabs content

___
<a id="items"></a>

### `<Optional>` items

**● items**: *[TabsItem](_tabs_tabs_props_.tabsitem.md)[]*

*Defined in [tabs/tabs.props.ts:61](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L61)*

The tabs' tab item

___
<a id="label"></a>

###  label

**● label**: *`string`*

*Defined in [tabs/tabs.props.ts:30](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L30)*

The aria-label applied to the tablist for the tab items

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-components-react-base/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="onupdate"></a>

### `<Optional>` onUpdate

**● onUpdate**: *`function`*

*Defined in [tabs/tabs.props.ts:36](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L36)*

The tab update callback which is fired when a tab is clicked or when the focus is switched to it on keyboard action

#### Type declaration
▸(activeTab: *`string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| activeTab | `string` |

**Returns:** `void`

___
<a id="orientation"></a>

### `<Optional>` orientation

**● orientation**: *`Orientation`*

*Defined in [tabs/tabs.props.ts:41](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L41)*

The orientation for the tablist

___
<a id="tabitemslot"></a>

### `<Optional>` tabItemSlot

**● tabItemSlot**: *`string`*

*Defined in [tabs/tabs.props.ts:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L46)*

A string to use for the slot property for tab item children

___
<a id="tabpanelslot"></a>

### `<Optional>` tabPanelSlot

**● tabPanelSlot**: *`string`*

*Defined in [tabs/tabs.props.ts:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L51)*

A string to use for the slot property for tab panel children

___
<a id="tabslot"></a>

### `<Optional>` tabSlot

**● tabSlot**: *`string`*

*Defined in [tabs/tabs.props.ts:56](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/tabs/tabs.props.ts#L56)*

A string to use for the slot property for tab children

___

