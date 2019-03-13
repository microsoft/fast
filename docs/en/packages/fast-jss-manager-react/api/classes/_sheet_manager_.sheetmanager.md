[@microsoft/fast-jss-manager-react](../README.md) > ["sheet-manager"](../modules/_sheet_manager_.md) > [SheetManager](../classes/_sheet_manager_.sheetmanager.md)

# Class: SheetManager

A class for managing instance of stylesheets. The SheetManager tracks and associates compiled stylesheets with their style/design-system inputs, as well as tracking number of times a style/design-system combination has been used. Tracking this allows us to memoize compiled stylesheets and only compile a new sheet when one does not already exist.

## Hierarchy

**SheetManager**

## Index

### Properties

* [registry](_sheet_manager_.sheetmanager.md#registry)

### Methods

* [add](_sheet_manager_.sheetmanager.md#add)
* [clean](_sheet_manager_.sheetmanager.md#clean)
* [count](_sheet_manager_.sheetmanager.md#count)
* [createStyleSheet](_sheet_manager_.sheetmanager.md#createstylesheet)
* [get](_sheet_manager_.sheetmanager.md#get)
* [getTracker](_sheet_manager_.sheetmanager.md#gettracker)
* [remove](_sheet_manager_.sheetmanager.md#remove)
* [update](_sheet_manager_.sheetmanager.md#update)

---

## Properties

<a id="registry"></a>

### `<Private>` registry

**● registry**: *[SheetRegistry](../modules/_sheet_manager_.md#sheetregistry)* =  new WeakMap()

*Defined in [sheet-manager.ts:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L25)*

___

## Methods

<a id="add"></a>

###  add

▸ **add**(styles: *`ComponentStyles`<`unknown`, `unknown`>*, designSystem: *`any`*, options?: *[JSSSheetOptions](../interfaces/_sheet_manager_.jsssheetoptions.md)*): `void`

*Defined in [sheet-manager.ts:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L32)*

Creates a new JSS stylesheet from a stylesheet and design-system. If a JSS style sheet has been created with this stylesheet and design system already, then simply track that another instance has been added

**Parameters:**

| Name | Type |
| ------ | ------ |
| styles | `ComponentStyles`<`unknown`, `unknown`> |
| designSystem | `any` |
| `Optional` options | [JSSSheetOptions](../interfaces/_sheet_manager_.jsssheetoptions.md) |

**Returns:** `void`

___
<a id="clean"></a>

###  clean

▸ **clean**(): `void`

*Defined in [sheet-manager.ts:153](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L153)*

Removes all entries

**Returns:** `void`

___
<a id="count"></a>

###  count

▸ **count**(styles: *`ComponentStyles`<`unknown`, `unknown`>*, designSystem: *`object`*): `number`

*Defined in [sheet-manager.ts:137](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L137)*

Returns the number of components using a stylesheet with a designSystem

**Parameters:**

| Name | Type |
| ------ | ------ |
| styles | `ComponentStyles`<`unknown`, `unknown`> |
| designSystem | `object` |

**Returns:** `number`

___
<a id="createstylesheet"></a>

### `<Private>` createStyleSheet

▸ **createStyleSheet**(styles: *`ComponentStyles`<`unknown`, `unknown`>*, designSystem: *`any`*, options?: *[JSSSheetOptions](../interfaces/_sheet_manager_.jsssheetoptions.md)*): [JSSStyleSheet](../interfaces/_jss_manager_.jssstylesheet.md)

*Defined in [sheet-manager.ts:180](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L180)*

Creates a JSS StyleSheet and attaches it to the DOM

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| styles | `ComponentStyles`<`unknown`, `unknown`> | - |
| designSystem | `any` | - |
| `Default value` options | [JSSSheetOptions](../interfaces/_sheet_manager_.jsssheetoptions.md) |  {} |

**Returns:** [JSSStyleSheet](../interfaces/_jss_manager_.jssstylesheet.md)

___
<a id="get"></a>

###  get

▸ **get**(styles: *`ComponentStyles`<`unknown`, `unknown`>*, designSystem: *`any`*): [JSSStyleSheet](../interfaces/_jss_manager_.jssstylesheet.md) \| `void`

*Defined in [sheet-manager.ts:62](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L62)*

Return the compiled jss stylesheet associated with a given style object and design system

**Parameters:**

| Name | Type |
| ------ | ------ |
| styles | `ComponentStyles`<`unknown`, `unknown`> |
| designSystem | `any` |

**Returns:** [JSSStyleSheet](../interfaces/_jss_manager_.jssstylesheet.md) \| `void`

___
<a id="gettracker"></a>

### `<Private>` getTracker

▸ **getTracker**(styles: *`ComponentStyles`<`unknown`, `unknown`>*, designSystem: *`object`*): [SheetTracker](../modules/_sheet_manager_.md#sheettracker) \| `void`

*Defined in [sheet-manager.ts:160](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L160)*

Retrieve the sheet tracker tracking the styles and design system

**Parameters:**

| Name | Type |
| ------ | ------ |
| styles | `ComponentStyles`<`unknown`, `unknown`> |
| designSystem | `object` |

**Returns:** [SheetTracker](../modules/_sheet_manager_.md#sheettracker) \| `void`

___
<a id="remove"></a>

###  remove

▸ **remove**(styles: *`ComponentStyles`<`unknown`, `unknown`>*, designSystem: *`any`*): `void`

*Defined in [sheet-manager.ts:118](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L118)*

Reduces the internal count for a stylesheet and designsystem. If the count becomes zero, the sheet will be detached

**Parameters:**

| Name | Type |
| ------ | ------ |
| styles | `ComponentStyles`<`unknown`, `unknown`> |
| designSystem | `any` |

**Returns:** `void`

___
<a id="update"></a>

###  update

▸ **update**(styles: *`ComponentStyles`<`unknown`, `unknown`>*, previousDesignSystem: *`any`*, nextDesignSystem: *`any`*): `void`

*Defined in [sheet-manager.ts:80](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jss-manager-react/src/sheet-manager.ts#L80)*

Removes a reference for a stylesheet and designSystem and adds a new reference. Useful when the design system changes and the stylesheet should be associated with a new design system

**Parameters:**

| Name | Type |
| ------ | ------ |
| styles | `ComponentStyles`<`unknown`, `unknown`> |
| previousDesignSystem | `any` |
| nextDesignSystem | `any` |

**Returns:** `void`

___

