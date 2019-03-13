[@microsoft/fast-layouts-react](../README.md) > ["column/column.props"](../modules/_column_column_props_.md) > [ColumnHandledProps](../interfaces/_column_column_props_.columnhandledprops.md)

# Interface: ColumnHandledProps

## Hierarchy

↳  [ColumnManagedClasses](_column_column_props_.columnmanagedclasses.md)

**↳ ColumnHandledProps**

## Index

### Properties

* [gutter](_column_column_props_.columnhandledprops.md#gutter)
* [managedClasses](_column_column_props_.columnhandledprops.md#managedclasses)
* [order](_column_column_props_.columnhandledprops.md#order)
* [position](_column_column_props_.columnhandledprops.md#position)
* [row](_column_column_props_.columnhandledprops.md#row)
* [span](_column_column_props_.columnhandledprops.md#span)

---

## Properties

<a id="gutter"></a>

### `<Optional>` gutter

**● gutter**: *[GridGutter](../modules/_grid_grid_props_.md#gridgutter)*

*Defined in [column/column.props.ts:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.props.ts#L33)*

The gutter size of the parent Grid component

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-layouts-react/node_modules/@microsoft/fast-jss-manager-react/node_modules/@microsoft/fast-jss-manager/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="order"></a>

### `<Optional>` order

**● order**: *`number` \| `number`[]*

*Defined in [column/column.props.ts:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.props.ts#L28)*

The order of a column relative to all other columns in the grid

___
<a id="position"></a>

### `<Optional>` position

**● position**: *`number` \| `number`[]*

*Defined in [column/column.props.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.props.ts#L18)*

The column position the column should occupy

___
<a id="row"></a>

### `<Optional>` row

**● row**: *`number` \| `number`[]*

*Defined in [column/column.props.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.props.ts#L23)*

The row that the column should occupy. Use this option to support -ms-grid

___
<a id="span"></a>

### `<Optional>` span

**● span**: *`number` \| `number`[]*

*Defined in [column/column.props.ts:13](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/column/column.props.ts#L13)*

The number of columns a column should span. If an array is passed, each index of the array corresponds to a break-point in ascending order.

___

