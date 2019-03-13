[@microsoft/fast-components-react-base](../README.md) > ["context-menu-item/context-menu-item.props"](../modules/_context_menu_item_context_menu_item_props_.md) > [ContextMenuItemHandledProps](../interfaces/_context_menu_item_context_menu_item_props_.contextmenuitemhandledprops.md)

# Interface: ContextMenuItemHandledProps

## Hierarchy

↳  [ContextMenuItemManagedClasses](_context_menu_item_context_menu_item_props_.contextmenuitemmanagedclasses.md)

**↳ ContextMenuItemHandledProps**

## Index

### Properties

* [children](_context_menu_item_context_menu_item_props_.contextmenuitemhandledprops.md#children)
* [disabled](_context_menu_item_context_menu_item_props_.contextmenuitemhandledprops.md#disabled)
* [managedClasses](_context_menu_item_context_menu_item_props_.contextmenuitemhandledprops.md#managedclasses)
* [onInvoke](_context_menu_item_context_menu_item_props_.contextmenuitemhandledprops.md#oninvoke)
* [role](_context_menu_item_context_menu_item_props_.contextmenuitemhandledprops.md#role)

---

## Properties

<a id="children"></a>

### `<Optional>` children

**● children**: *`React.ReactNode`*

*Defined in [context-menu-item/context-menu-item.props.ts:17](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/context-menu-item/context-menu-item.props.ts#L17)*

The children of the context menu item

___
<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: *`boolean`*

*Defined in [context-menu-item/context-menu-item.props.ts:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/context-menu-item/context-menu-item.props.ts#L27)*

If the menu item is disabled

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-components-react-base/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="oninvoke"></a>

### `<Optional>` onInvoke

**● onInvoke**: *`function`*

*Defined in [context-menu-item/context-menu-item.props.ts:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/context-menu-item/context-menu-item.props.ts#L33)*

Callback for when an item is invoked Returns the prop contract for the invoked context menu item

#### Type declaration
▸(e: *`MouseEvent`<`HTMLDivElement`> \| `KeyboardEvent`<`HTMLDivElement`>*, props: *[ContextMenuItemProps](../modules/_context_menu_item_context_menu_item_props_.md#contextmenuitemprops)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `MouseEvent`<`HTMLDivElement`> \| `KeyboardEvent`<`HTMLDivElement`> |
| props | [ContextMenuItemProps](../modules/_context_menu_item_context_menu_item_props_.md#contextmenuitemprops) |

**Returns:** `void`

___
<a id="role"></a>

### `<Optional>` role

**● role**: *[ContextMenuItemRole](../enums/_context_menu_item_context_menu_item_.contextmenuitemrole.md)*

*Defined in [context-menu-item/context-menu-item.props.ts:22](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/context-menu-item/context-menu-item.props.ts#L22)*

The item's role

___

