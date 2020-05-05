import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import DataGridRow from "./data-grid-row";
//import { DataGridContext } from "./data-grid-context";
//import { DataGridColumnDefinition } from "./data-grid.props";
//import { DataGridProps, DataGridState } from "./data-grid";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("data grid row", (): void => {
    //     const managedClasses: DataGridRowClassNameContract = {
    //         dataGridRow: "dataGridRow",
    //         dataGridRow__focusWithin: "dataGridRow__focusWithin",
    //     };

    //     const rowData1: object = {
    //         name: "Thomas",
    //         age: 25,
    //     };

    //     const rowData2: object = {
    //         name: "Richard",
    //         age: 26,
    //     };

    //     const rowData3: object = {
    //         name: "Harold",
    //         age: 27,
    //     };

    //     const columnDefinition1: DataGridColumnDefinition = {
    //         columnDataKey: "name",
    //         title: "Name",
    //         columnWidth: "200px",
    //     };

    //     const columnDefinition2: DataGridColumnDefinition = {
    //         columnDataKey: "age",
    //         title: "Age",
    //         columnWidth: "200px",
    //     };

    // const gridState: DataGridState = {
    //     dataContainerHeight: 100,
    //     renderedRangeStartIndex: 0,
    //     renderedRangeEndIndex: 100,
    //     focusColumnKey: "name",
    //     focusRowKey: "Thomas",
    //     isScrolling: false,
    //     scrollBarWidth: 0,
    // };

    // const gridProps: DataGridProps = {
    //     dataRowKey: "name",
    //     gridData: [rowData1, rowData2, rowData3],
    //     columnDefinitions: [columnDefinition1, columnDefinition2],
    //     itemHeight: 60,
    // };

    // const gridRowPosition: RowPosition = {
    //     top: 0,
    //     bottom: 33,
    //     height: 33,
    // };

    test("should have a displayName that matches the component name", () => {
        expect((DataGridRow as any).name).toBe(DataGridRow.displayName);
    });

    // test("rowId, role and base class gets written to dom element", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     onCellFocused: null,
    //                     onCellKeyDown: null,
    //                     dataGridState: gridState,
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridRow
    //                 rowData={rowData1}
    //                 gridRowPosition={gridRowPosition}
    //                 gridTemplateColumns="200px 200px"
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     const row: any = rendered.children();
    //     expect(row.prop("data-rowid")).toEqual("Thomas");
    //     expect(row.prop("role")).toEqual("row");
    //     expect(row.prop("className")).toContain(managedClasses.dataGridRow);
    //     expect(row.prop("className")).toContain(managedClasses.dataGridRow__focusWithin);
    // });

    // test("focus within class applied when focus is whithin the row", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     onCellFocused: null,
    //                     onCellKeyDown: null,
    //                     dataGridState: gridState,
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridRow
    //                 rowData={rowData1}
    //                 gridRowPosition={gridRowPosition}
    //                 gridTemplateColumns="200px 200px"
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     const row: any = rendered.children();
    //     expect(row.prop("className")).toContain(managedClasses.dataGridRow__focusWithin);
    // });

    // test("cells are rendered as children", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     onCellFocused: null,
    //                     onCellKeyDown: null,
    //                     dataGridState: gridState,
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridRow
    //                 rowData={rowData1}
    //                 gridRowPosition={gridRowPosition}
    //                 gridTemplateColumns="200px 200px"
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     const row: any = rendered.children();
    //     expect(row.find("DataGridCell").length).toBe(2);
    // });
});
