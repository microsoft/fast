# Data Grid

## Overview

The `data grid` component enables authors to display an array of data in a tabular layout. The layout can include a "header" region where a title can be displayed for each column. 

![](./images/grid.png)

`Data grid` actually consists of three components that work together:
- `<fast-data-grid>`: The top level container element
- `<fast-data-grid-row>`: Displays a single row of data associated with a single record or a header row
- `<fast-data-grid-cell>`: Displays a single cell of data within a row

### Use Cases
Any time an author wants to display tabular data.

### Non-goals
- The initial version of the component will not support virtualization or pagination to display large data sets but should be architected to support both in the future.

### Features
- Generates a data grid layout based on provided data.
- Authors can take advantage of multiple customization points to control the grid display.
- Manages keyboard navigation across the grid.

### Risks and Challenges
- Unique identifiers are not required per row/data item, this may cause an unstable relationships between data rows and component representations. Authors should be cautious about storing references to grid elements as the data associated with a particular cell or row can change as data is updated.

### Prior Art/Examples

[FAST React](https://github.com/microsoft/fast-react/tree/master/packages/react/fast-components-react-msft/src/data-grid)

[Infragistics](https://www.infragistics.com/products/ignite-ui-web-components/web-components/components/data-grid.html#:~:text=%20Data%20Grid%20Overview%20%201%20Demo.%20,Components%20data%20grid%20to%20the%20above...%20More%20)

[Smart](https://www.htmlelements.com/docs/grid/)

[Vaadin](https://vaadin.com/components/vaadin-grid)

[Open UI](https://open-ui.org/components/table)


---

## Design

The Fast **data grid** component is highly customizable. In addition to the base css styling that can be applied to the grid and its sub-components, authors can choose the templates applied to grid and header cells on a per column basis using the properties of the associated `ColumnDefinition`. Additionally, authors can specify the templates to be used for the creation of rows and cells through the item template properties of the grid and row components (`rowItemTemplate` and `cellItemTemplate`).

The column layout is controlled by the grid's `grid-template-columns` attribute which maps directly to the css `grid-template-columns` attribute applied within each row (rows use a [css grid display](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) internally). Cells within each row are positioned in the row by setting their `grid-column` css attribute to match the index of their associated `columnDefinition` in the `columnDefinitions` array unless there is a custom `gridColumn` value set in the `columnDefinition`.

Note: using a custom `gridColumn` property allows authors to place cells anywhere in the row, but the order of elements in the dom is what determines the order elements are selected in keyboard navigation. The order of cells in the DOM is determined by the order of columns in the `columnDefinitions` property.

### Component Roles

`<fast-data-grid>`:
- Creates grid row elements based on provided data array and adds/removes rows as objects are added/removed from the array.
- Can create a header row if specified.
- Sets the column layout properties (`columnsData` and `grid-template-columns`) of each child row and updates them if they are changed.
- Sets the `row-index` attribute of child rows.
- Manages keyboard navigation between rows.
- Supports rendering of slotted elements and will include any slotted row elements in keyboard navigation and column layout updates.

`<fast-data-grid-row>`: 
- Creates cell elements based on provided column layout properties.
- Creates header cell elements if specified.
- Manages keyboarding within the row.
- Supports rendering of slotted elements and will include any slotted cell elements in keyboard navigation.

`<fast-data-grid-cell>`:
- Can render as either a data cell or a header cell.
- Can render based on a custom template included in the provided `columnDefinition`.
- Manages keyboard interactions to pass focus in/out of custom cells with focusable elements.
- Supports rendering of slotted elements.

### API

#### The ColumnDefinition interface

Most **data grid** components use the `ColumnDefinition` interface. A `ColumnDefinition` is an object that describes the properties of a single column in the grid as follows:

- `columnDataKey`: A string that identifies which data item should be shown in the column. For example, if the source data had a field called "Name" the `columnDataKey` for the column that displays the values for "Name" would be "Name".

- `title`: The title of the column, if not provided the `columnDataKey` is used instead.

- `headerCellTemplate`: Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use for header cells of this column.

- `headerCellInternalFocusQueue`: Indicates whether the header cell has in internal focus queue. This should be set to `true` for header cells that host controls that need to use arrow keys or have multiple focusable internal elements. When the user hits the Enter or F2 key the element specified by the `cellFocusTargetCallback` function will be focused (see keyboard interactions described [here](https://w3c.github.io/aria-practices/#grid)).

- `headerCellFocusTargetCallback`: Callback function that takes the cell node as a parameter and returns the HTMLElement to focus in a custom cell. This enables authors to direct focus in a custom cell with interactive elements. When `headerCellInternalFocusQueue` is `false` this function is called when the cell is first focused to immediately move focus to a cell element, for example a cell that contains a button could move focus directly to the button when focused. When `cellInternalFocusQueue` is `true` this function is called when the user hits Enter or F2.

- `cellTemplate`: Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use for data cells of this column.

- `cellInternalFocusQueue`: Indicates whether the cell has in internal focus queue. This should be set to `true` for cells that host controls that need to use arrow keys or have multiple focusable internal elements. When the user hits the Enter or F2 key the element specified by the `cellFocusTargetCallback` function will be focused (see keyboard interactions descrived [here](https://w3c.github.io/aria-practices/#grid)).

- `cellFocusTargetCallback`: Callback function that takes the cell node as a parameter and returns the `HTMLElement` to focus in a custom cell. This enables authors to direct focus in a custom cell with interactive elements. When `cellInternalFocusQueue` is `false` this function is called when the cell is first focused to immediately move focus to a cell element, for example a cell that contains a button could move focus directly to the button when focused. When `cellInternalFocusQueue` is `true` this function is called when the user hits Enter or F2.

Authors can hook up custom events to html elements within cell templates in order to enable user interaction with grid data.

For example a button handler on a `cellTemplate` could be implemented with a click event that calls back to the author's own function:

```html
    <template>
        <fast-button @click="${x => cellTemplateButtonClick(x)}">
            ${x =>
                x.rowData === null ||
                x.columnDefinition === null ||
                x.columnDefinition.columnDataKey === null
                    ? null
                    : x.rowData[x.columnDefinition.columnDataKey]}
        </fast-button>
    </template>
```

- `isRowHeader`: A boolean that indicates whether this column contains row header cells.  When true cells in this column that are not in a header row will render with a role of 'rowheader'.

**Data grid**
- `<fast-data-grid>`

*Attributes:*
- `generate-header`  
Can be either "none", "default" or "sticky" (the `GeneratHeaderOptions` enum). Automatically generate a header element based on provided columns. The default is `true`. Authors who wish to not have a header row or wish to generate their own can set this to `false`.

- `grid-template-columns`  
String that gets applied to the the css gridTemplateColumns attribute of child rows. Corresponds to the [grid-template-columns css attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)

- `no-tabbing`
Boolean, defaults to false.  When true the grid does not add itself to the tab queue.
Useful when a grid is nested within a parent grid cell.

*properties:*
- `rowsData`  
An array of objects that contain the data to be displayed. Each object corresponds to one row.

- `columnDefinitions`  
An array of `ColumnDefinition` objects that define what columns will be displayed in the grid. The order of the columns determines their order in the grid.

- `rowItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating rows by iterating over data. The default template uses `fast-data-grid-row`, this is where authors change that.

- `cellItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating cells by iterating over data. The default template uses `fast-data-grid-cell`, this is where authors can change that.  The component applies this to generated rows only.

- `headerCellItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating header cells by iterating over data. The default template uses `fast-data-grid-cell`, this is where authors can change that. The component applies this to generated rows only.


- `focusRowIndex`
The index of the row that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid. Changing this value when focus is already within the grid moves focus to the specified row. Note that the header row if there is one is typically at index 0.

- `focusColumnIndex`
The index of the column that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid. Changing this value when focus is already within the grid moves focus to the specified column.

*Slots:*
- `default`  
Custom generated rows can be placed here

*Functions:*
- `generateColumns(object): ColumnDefinition`   
Static function that creates a basic set of columns from an object representing a row.

*Events*
- none

*parts:*
- none

*enums:*
- `GenerateHeaderOptions` - Enumerates available options that control what kind of header the grid should automatically generate: "none, "default" or "sticky". 

**Data grid row**
- `<fast-data-grid-row>`

*Attributes:*
- `grid-template-columns`  
String that gets applied to the the css `gridTemplateColumns` attribute for the row. This is typically set by the parent grid.

- `row-index`  
The index of the row in the parent grid. This is typically set by the parent grid.

- `row-type`  
The row can either be either "default", "header" or "sticky-header" type according to the `DataGridRowTypes` enum. This determines the type of cells the row generates and what css classes get applied to it.

- `page-size`  
The number of rows to move selection on page up/down keystrokes.
When undefined the grid will use viewport height/the height of the first non-header row. If the grid itself is a scrolling container it will be considered the viewport for this purpose, otherwise the document will be used.

*properties:*
- `rowData`  
The object that contains the data to be displayed in this row.

- `columnDefinitions`  
An array of `ColumnDefinition` objects that define what columns will be displayed in the grid. The order of the columns determines their order in the grid.

- `cellItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating cells by iterating over data. The default template uses `fast-data-grid-cell`, this is where authors can change that.

- `headerCellItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating header cells by iterating over data. The default template uses `fast-data-grid-cell`, this is where authors can change that.

*Slots:*
- `default`  
Default slot for items

*Events*
- `row-focused` - Event triggered when a row or one of its internal elements is focused.

*parts:*
- `cellsSlot`

*enums:*
- `DataGridRowTypes` - Enumerates available row types: "default, "header" and "sticky-header". 

**Data grid cell**
- `<fast-data-grid-cell>`

*Attributes:*
- `grid-column`  
The grid column this cell is placed in.

- `cell-type`  
A cell can either be either "default", "columnheader" or "rowheader" type.

*properties:*
- `rowData`  
The object that contains the data to be displayed in this row. Cells have access to the data object associated with the entire row because custom cells could render based on multiple values.

- `columnDefiniton`  
The `ColumnDefinition` this associated with this cell.

- `columnDefiniton`  
The `ColumnDefinition` this associated with this cell.

*Slots:*
- `default`  
Default slot for items

*Events*
- `cell-focused` - Event triggered when a cell or one of its internal elements is focused.

*parts:*
- `cellSlot`

*enums:*
- `cellTypes` - Enumerates available cell types: "default and "header". 

## Implementation

The most basic use case for this component would be to just pass it an array of objects for it to render.

For example given a grid component:
```html
 <fast-data-grid id="defaultGrid"></fast-data-grid>
 ```

 And some data:
 ```js
const baseRows: object[] = [
    { name: "Rob", age: "19" },
    { name: "Bob", age: "20" },
];
 ```

 An author could pass the data to the component from a javascript function:

```js
onLoad(): void {
   const defaultGrid: DataGrid | null = document.getElementById(
        "defaultGrid"
    ) as DataGrid;
    if (defaultGrid !== null) {
        defaultGrid.rowsData = baseRows;
    }
}
```

This renders a basic grid with a column titled "name" and another titled "age" in addition to the two rows of data populated with the values. 

![](./images/ex1.png)

The next level of customization involves changing the default columns that are created by the component when none are provided.

And author would define the columns by providing an array of `ColumnDefinition` objects to the component's `columnsData` property:

```js
const baseColumns: ColumnDefinition[] = [
    { columnDataKey: "name", title:"Player name" },
    { columnDataKey: "age", title:"Age"},
];

...
    defaultGrid.columnDefinitions = baseColumns;
...
```

Applying these columns to our previous example results in our columns having the new titles applied as well as having a fixed width for the "Player age" column.

![](./images/ex2.png)

- Programmatically generated rows/cells will will be created using [repeat directives](https://fast.design/docs/fast-element/using-directives#the-repeat-directive).

- Individual cells can be customized using by passing a custom `ViewTemplate` through the `ColumnDefinition` interface for the column in question. These templates are rendered in the light DOM within the cell so that authors can create custom cells with interactive elements.

### Accessibility

The `data grid` should align to the interaction model provided by the [W3C](https://w3c.github.io/aria-practices/#grid).

### Globalization

The order of grid columns is inverted in RTL layouts.

### Security

NA

### Performance

We want to take full advantage of fast-element templating and directives for fast rendering.

### Dependencies

None

### Test Plan
This component should have component testing in the @microsoft/fast-foundation package.

## Next Steps

- Virtualization and/or Pagination for large data sets.
- Add support for cell selection.
- Investigate a horizontal grid layout?
- Stable data/element relationships.
