# Data grid
The *data grid* component enables a display of tabular data in a scrolling grid with fixed column headers. 

## Usage

Authors provide the data the component will display through the `rows` prop.  This data must take the form of an array of objects, each object in the array corresponds to one row of data in the grid.  Additionally, each object in the array must have a property which uniquely identifies it that is passed to the component through the `dataRowKey` prop. 

A simple data set using a "clientId" attribute as a unique identifier  could look like this.

```ts
myData = [
    {clientId: a1, name: Bob, age: 50},
    {clientId: a2, name: Doug, age: 51},
    etc...
]
```

What data is displayed in each row is controlled by the component's  `columns` prop which consists of an array of `column` objects - one for each column of data to be displayed.  A `column` requires authors to specify a `columnDataKey` which identifies the particular field in the datarow to be displayed in the column, a `title` which describes what goes in the fixed column header cell, and a `columnWidth` which is string that sets the width of the column as for a css grid column (i.e. "50px", "1fr", "20%", etc...). The order in which columns appear is determined by the order of the `columns` in the array.  If `columns` are not provided the component will infer uniform width columns from the properties in the row data.

In order to display the simple data set described previously the `columns` could look like this:

```ts
myColumns: DataGridColumn[] = [
    {
        columnDataKey: "clientId",
        title: "Client #",
        columnWidth: "120px",
    },
    {
        columnDataKey: "name",
        title: "Name",
        columnWidth: "auto",
    },
        {
        columnDataKey: "age",
        title: "Age",
        columnWidth: "1fr",
    },
];
```

And the markup for the simple data grid to display the above:

```ts
<DataGrid
    rows={myData}
    dataRowKey="clientId"
    columns={myColumns}
/>
```

### Virtualized content

*Data grid* rendering performance is enhanced because it does not render all of the data to the DOM all the time, but rather limits what is rendered to those items that are near the visible area of the grid. 

There are two mechanisms that govern this in the component:

- limiting how many data rows are converted to React Nodes and passed to the underlying display panel.  Only one "page" worth of data is passed to the display panel at one time and is centered on the data currently in view.  When the user scrolls near the end of a page a new page of data centered on the current scroll position is generated.  How many items get passed to the display panel is controlled by the grid's `pageSize` prop.  A page size greater than the number of items in the dataset ensures all items are passed to the display at all times if that is desired.

- the underlying panel also virtualizes nodes that are not currently in view

Both of these features are controlled by the `virtualizeItems` prop of the *data grid* component.  When virtualization is turned off all rows are rendered to the dom and are sized by html/css.

## Accessibility
*Data grid* implements the recommended keyboard navigation scheme described [here](https://www.w3.org/TR/wai-aria-practices/#grid)