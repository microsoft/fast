---
id: virtual-list
title: virtual-list
sidebar_label: virtual-list
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/virtual-list/README.md
---

A component that uses a template to render an array of objects based on whether each element would be in or near the specified viewport. 

## Usage

```html live
    <fast-virtual-list>
    </fast-virtual-list>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { VirtualList, VirtualListTemplate as template } from "@microsoft/fast-foundation";
import { VirtualListStyles as styles } from "./virtual-list.styles";

@customElement({
    name: "fast-virtual-list",
    template,
    styles,
})
export class FASTVirtualList extends VirtualList{}
```

## API



### class: `FASTVirtualDataGrid`

#### Superclass

| Name           | Module                  | Package |
| -------------- | ----------------------- | ------- |
| `FASTDataGrid` | /src/data-grid/index.js |         |

#### Static Fields

| Name              | Privacy | Type | Default | Description                                                      | Inherited From |
| ----------------- | ------- | ---- | ------- | ---------------------------------------------------------------- | -------------- |
| `generateColumns` | public  |      |         | generates a basic column definition by examining sample row data | FASTDataGrid   |

#### Fields

| Name                     | Privacy   | Type                                                | Default | Description                                                                                                                                                                                                                                                                                     | Inherited From |
| ------------------------ | --------- | --------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `virtualizer`            |           | `Virtualizer`                                       |         |                                                                                                                                                                                                                                                                                                 |                |
| `defaultRowHeight`       | public    | `number`                                            | `30`    | row height to use if one is not specified                                                                                                                                                                                                                                                       |                |
| `rowHeight`              | public    | `number`                                            |         | The size in pixels of each item along the virtualization axis. When auto-resizing this is the amount of space reserved for elements until they actually render and report size.  The default value is 50.                                                                                       |                |
| `viewport`               | public    | `string`                                            | `""`    | The HTML ID of the viewport element. If no viewport is set the default viewport is the element itself. Note that viewportElement can be set directly as well.                                                                                                                                   |                |
| `viewportElement`        | public    | `HTMLElement`                                       |         | The HTML element being used as the viewport                                                                                                                                                                                                                                                     |                |
| `noTabbing`              | public    | `boolean`                                           | `false` | When true the component will not add itself to the tab queue. Default is false.                                                                                                                                                                                                                 | FASTDataGrid   |
| `generateHeader`         | public    | `GenerateHeaderOptions`                             |         | Whether the grid should automatically generate a header row and its type                                                                                                                                                                                                                        | FASTDataGrid   |
| `gridTemplateColumns`    | public    | `string`                                            |         | String that gets applied to the the css gridTemplateColumns attribute of child rows                                                                                                                                                                                                             | FASTDataGrid   |
| `pageSize`               | public    | `number or undefined`                               |         | The number of rows to move selection on page up/down keystrokes. When undefined the grid will use viewport height/the height of the first non-header row. If the grid itself is a scrolling container it will be considered the viewport for this purpose, otherwise the document will be used. | FASTDataGrid   |
| `selectionMode`          | public    | `DataGridSelectionMode`                             |         | Defines how the grid handles row or cell selection.                                                                                                                                                                                                                                             | FASTDataGrid   |
| `selectionBehavior`      | public    | `DataGridSelectionBehavior`                         |         | Controls selection behavior                                                                                                                                                                                                                                                                     | FASTDataGrid   |
| `initialRowSelection`    | public    | `string`                                            |         | The indexes of initially selected grid elements. Includes header rows. In the case of row selection the format should be a comma delimited list of row indexes. ie. "1,3,5"                                                                                                                     | FASTDataGrid   |
| `rowSelectableCallback`  | public    | `(rowIndex: number, grid: FASTDataGrid) => boolean` |         | Callback that determines whether a particular row is selectable or not (depends on selectionMode also) By default all rows except header rows are selectable.                                                                                                                                   | FASTDataGrid   |
| `rowsData`               | public    | `object[]`                                          | `[]`    | The data being displayed in the grid                                                                                                                                                                                                                                                            | FASTDataGrid   |
| `columnDefinitions`      | public    | `ColumnDefinition[] or null`                        | `null`  | The column definitions of the grid                                                                                                                                                                                                                                                              | FASTDataGrid   |
| `rowItemTemplate`        | public    | `ViewTemplate`                                      |         | The template to use for the programmatic generation of rows                                                                                                                                                                                                                                     | FASTDataGrid   |
| `cellItemTemplate`       | public    | `ViewTemplate or undefined`                         |         | The template used to render cells in generated rows.                                                                                                                                                                                                                                            | FASTDataGrid   |
| `headerCellItemTemplate` | public    | `ViewTemplate or undefined`                         |         | The template used to render header cells in generated rows.                                                                                                                                                                                                                                     | FASTDataGrid   |
| `focusRowIndex`          | public    | `number`                                            | `0`     | The index of the row that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified row.                                               | FASTDataGrid   |
| `focusColumnIndex`       | public    | `number`                                            | `0`     | The index of the column that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified column.                                         | FASTDataGrid   |
| `rowElementTag`          | public    | `string`                                            |         | Set by the component templates.                                                                                                                                                                                                                                                                 | FASTDataGrid   |
| `selectedRowIndexes`     | public    |                                                     |         | The selectedRowIndexes property.                                                                                                                                                                                                                                                                | FASTDataGrid   |
| `rowindexUpdateQueued`   | protected | `boolean`                                           | `false` |                                                                                                                                                                                                                                                                                                 | FASTDataGrid   |
| `columnDefinitionsStale` | protected | `boolean`                                           | `true`  |                                                                                                                                                                                                                                                                                                 | FASTDataGrid   |
| `updateRowIndexes`       | protected |                                                     |         |                                                                                                                                                                                                                                                                                                 | FASTDataGrid   |
| `recycle`                | public    | `boolean`                                           | `false` | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear.                                                                                                              | FASTDataList   |
| `positioning`            | public    | `boolean`                                           | `false` | Whether or not positioning (ie. indexing) is available for the items generated by the repeat directive                                                                                                                                                                                          | FASTDataList   |
| `orientation`            | public    | `Orientation`                                       |         | Whether the list is oriented vertically or horizontally. Default is vertical.                                                                                                                                                                                                                   | FASTDataList   |
| `sourceItems`            | public    | `object[]`                                          | `[]`    | The source data array.                                                                                                                                                                                                                                                                          | FASTDataList   |
| `itemTemplate`           | public    | `ViewTemplate`                                      |         | The ViewTemplate used in the items repeat loop                                                                                                                                                                                                                                                  | FASTDataList   |
| `itemContentsTemplate`   | public    | `ViewTemplate`                                      |         | The ViewTemplate used to render list item contents                                                                                                                                                                                                                                              | FASTDataList   |
| `itemsPlaceholder`       | protected | `Node`                                              |         |                                                                                                                                                                                                                                                                                                 | FASTDataList   |
| `behaviorOrchestrator`   | protected | `ViewBehaviorOrchestrator or null`                  | `null`  |                                                                                                                                                                                                                                                                                                 | FASTDataList   |

#### Methods

| Name                          | Privacy   | Description                                                                                                                                         | Parameters       | Return          | Inherited From |
| ----------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------- | -------------- |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior                                                                                                                          |                  | `void`          | FASTDataList   |
| `getRepeatOptions`            | protected |                                                                                                                                                     |                  | `RepeatOptions` | FASTDataList   |
| `noTabbingChanged`            | protected |                                                                                                                                                     |                  | `void`          | FASTDataGrid   |
| `gridTemplateColumnsChanged`  | protected |                                                                                                                                                     |                  | `void`          | FASTDataGrid   |
| `rowsDataChanged`             | protected |                                                                                                                                                     |                  | `void`          | FASTDataGrid   |
| `sourceItemsChanged`          | protected |                                                                                                                                                     |                  | `void`          | FASTDataList   |
| `columnDefinitionsChanged`    | protected |                                                                                                                                                     |                  | `void`          | FASTDataGrid   |
| `rowItemTemplateChanged`      | protected |                                                                                                                                                     |                  | `void`          | FASTDataGrid   |
| `handleRowSelectedChange`     | public    |                                                                                                                                                     | `e: CustomEvent` | `void`          | FASTDataGrid   |
| `getGridTemplateColumns`      | protected |                                                                                                                                                     |                  | `string`        | FASTDataGrid   |
| `updateItemTemplate`          | protected | applies the correct item template. Once an author overrides the item template with a custom one the author must manage template changes themselves. |                  | `void`          | FASTDataList   |
| `orientationChanged`          | protected |                                                                                                                                                     |                  | `void`          | FASTDataList   |
| `itemContentsTemplateChanged` | protected |                                                                                                                                                     |                  | `void`          | FASTDataList   |
| `createPlaceholderElement`    | protected |                                                                                                                                                     |                  | `void`          | FASTDataList   |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `no-tabbing`            | noTabbing           | FASTDataGrid   |
| `generate-header`       | generateHeader      | FASTDataGrid   |
| `grid-template-columns` | gridTemplateColumns | FASTDataGrid   |
| `page-size`             | pageSize            | FASTDataGrid   |
| `selection-mode`        | selectionMode       | FASTDataGrid   |
| `selection-behavior`    | selectionBehavior   | FASTDataGrid   |
| `initial-row-selection` | initialRowSelection | FASTDataGrid   |
| `recycle`               | recycle             | FASTDataList   |
| `positioning`           | positioning         | FASTDataList   |
| `orientation`           | orientation         | FASTDataList   |

<hr/>


