# Data Grid

## Overview

The `data grid` component enables authors to display an array of data in a tabular layout.  The layout can include a "header" region where a title can be displayed for each column.  

`Data grid` actually consists of a number of components that work together:
- `data grid`:  The top level container element
- `data grid header`: Displays column titles
- `data grid header cell`: Displays the title for a single column of cells
- `data grid row`: Displays a single row of data associated with a single record
- `data grid cell`: Displays a single cell of data within a row

### Background

*Relevant historical or background information, related existing issues, etc.*

### Use Cases
Any time an author wants to display tabular data.

### Non-goals
- The initial version of the component will not support virtualization or pagination to display large data sets but should be architected to support both in the future.
  
### Features
- Generates a data grid layout based on provided data.
- Authors can choose to generate elements themselves (ie. create their own rows elements instead of generated ones)
- manages keyboard navigation across the grid

### Risks and Challenges
- not yet clear how cells with focusable children work 
- is it easy enough for authors to hook up to events from cell?
- we're not requiring unique identifiers per row/data item, do we need to to ensure stable relationships between data rows and component representations?

### Prior Art/Examples

[FAST React](https://github.com/microsoft/fast-react/tree/master/packages/react/fast-components-react-msft/src/data-grid)

[Infragistics](https://www.infragistics.com/products/ignite-ui-web-components/web-components/components/data-grid.html#:~:text=%20Data%20Grid%20Overview%20%201%20Demo.%20,Components%20data%20grid%20to%20the%20above...%20More%20)

[Smart](https://www.htmlelements.com/docs/grid/)

[Vaadin](https://vaadin.com/components/vaadin-grid)

[Open UI](https://open-ui.org/components/table)


---

## Design

`Data grid` enables a high degree of customizability in addition to the component's base styles. Authors can choose the templates applied to grid and header cells on a per column basis using the cell and header cell template properties of `DataGridColumn`, additionally authors can specify the templates used during the creation of rows and cells from data sources.  Additionally authors can add elements they create and manage themselves through slots.

### API

#### The DataGridColumn interface

Most `data grid` components use the `DataGridColumn` interface.  A `DataGridColumn` is an object that describes the properties of a single column in the grid as follows:

- `columnDataKey`: A string that identifies which data item should be shown in the column.  For example if the source data had a field called "Name" the `columnDataKey` for the column that displays the values for "Name" would be "Name".

- `title`:  The title of the column, if not provided the `columnDataKey` is used instead.

- `columnWidth`:  The width of the column as they would be expressed for a [CSS grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns).  Under the covers `data-grid` uses these values to construct the rows using css grid layout.

- `headerCellTemplate`:  Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use for header cells of this column.

- `cellTemplate`:  Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use for data cells of this column.


**Data grid**
- `fast-data-grid`

*Attributes:*
- `generateHeader`  
Boolean.  Automatically generate a header element based on provided columns. Default is true.  Authors who wish to not have a header row or wish to generate their own can set this to false.

*properties:*
- `rowsData`  
An array of objects that contain the data to be displayed.  Each object corresponds to one row.

- `columnsData`  
An array of `DataGridColumn` objects that define what columns will be displayed in the grid.  The order of the columns determines their order in the grid.

- `rowItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating rows by iterating over data.  The default template uses `fast-data-grid-row`, this is where authors change that.

*Slots:*
- `default`  
Custom generated rows can be placed here

- `header`
Items added here are added to the header region of the component.

*Functions:*
- `generateColumns(object): DataGridColumn`   
Static function that creates a basic set of columns from an object representing a row.  

*Events*
- none

*parts:*
- `headerSlot`

- `rowsSlot`


**Data grid header**
- `fast-data-grid-header`

*Attributes:*
- none

*properties:*
- `columnsData`  
An array of `DataGridColumn` objects that define what columns will be displayed in the grid.  The order of the columns determines their order in the grid.

- `headerCellItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating header cells by iterating over data.  The default template uses `fast-data-grid-header-cell`, this is where authors change that.

*Slots:*
- `default`  
Default slot for items

*Events*
- none

*parts:*
- `headerCellsSlot`


**Data grid header cell**
- `fast-data-grid-header-cell`

*Attributes:*
- extends HTML Element attributes

*properties:*
- `columnData`  
The `DataGridColumn` this column header represents.

*Slots:*
- `default`  
Default slot for items

*Events*
- none

*parts:*
- `headerCellsSlot`


**Data grid row**
- `fast-data-grid-row`

*Attributes:*
- `gridTemplateColumns`  
String that gets applied to the the css gridTemplateColumns attribute for the row

*properties:*
- `rowData`  
The objects that contains the data to be displayed in this row.

- `columnsData`  
An array of `DataGridColumn` objects that define what columns will be displayed in the grid.  The order of the columns determines their order in the grid.

- `cellItemTemplate`  
Custom [template](https://fast.design/docs/fast-element/declaring-templates) to use when generating cells by iterating over data.  The default template uses `fast-data-grid-cell`, this is where authors change that.

*Slots:*
- `default`  
Default slot for items

*Events*
- none

*parts:*
- `cellsSlot`

**Data grid cell**
*Component name:*
- `fast-data-grid-cell`

*Attributes:*
- `gridColumnIndex`  
The grid column this cell appears in.

*properties:*
- `rowData`  
The object that contains the data to be displayed in this row.

- `columnData`  
The `DataGridColumn` this cell represents.

*Slots:*
- `default`  
Default slot for items

*Events*
- none

*parts:*
- `cellSlot`

## Implementation

- programmatically generated rows/cells will will be created using [repeat directives](https://fast.design/docs/fast-element/using-directives#the-repeat-directive)

- individual cells can be customized using by passing a custom ViewTemplate through the `DataGridColumn` interface for the column in question. These templates are rendered in the light dom within the cell so that authors can create custom cells with interactive elements.

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

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.

## Next Steps

Virtualization and/or Pagination for large data sets.
