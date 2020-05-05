// import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { DataGridCellClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { configure } from "enzyme";
import DataGridCell from "./data-grid-cell";
// import { DataGridContext } from "./data-grid-context";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("data grid cell", (): void => {
    const managedClasses: DataGridCellClassNameContract = {
        dataGridCell: "dataGridCell",
    };

    // const rowData1: object = {
    //     name: "Thomas",
    //     age: 25,
    // };

    // const rowData2: object = {
    //     name: "Richard",
    //     age: 26,
    // };

    // const rowData3: object = {
    //     name: "Harold",
    //     age: 27,
    // };

    // const columnDefinition1: DataGridColumnDefinition = {
    //     columnDataKey: "name",
    //     title: "Name",
    //     columnWidth: "200px",
    // };

    // const columnDefinition2: DataGridColumnDefinition = {
    //     columnDataKey: "age",
    //     title: "Age",
    //     columnWidth: "200px",
    // };

    // const gridState: DataGridState = {
    //     estimatedTotalHeight: 100,
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

    test("should have a displayName that matches the component name", () => {
        expect((DataGridCell as any).name).toBe(DataGridCell.displayName);
    });

    // test("cellId, role and base class gets written to dom element", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     onCellFocused: null,
    //                     onCellKeyDown: null,
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridCell
    //                 rowData={rowData1}
    //                 columnDefinition={columnDefinition1}
    //                 columnIndex={0}
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     const cell: any = rendered.children();
    //     expect(cell.prop("data-cellid")).toEqual("name");
    //     expect(cell.prop("role")).toEqual("gridcell");
    //     expect(cell.prop("className")).toContain(managedClasses.dataGridCell);
    // });

    // test("tab index is 1 when data grid state indicates cell has focus", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridCell
    //                 rowData={rowData1}
    //                 columnDefinition={columnDefinition1}
    //                 columnIndex={0}
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     const cell: any = rendered.children();
    //     expect(cell.prop("tabIndex")).toEqual(0);
    // });

    // test("tab index is -1 when data grid state indicates cell does not have focus", (): void => {
    //     const updatedGridState: DataGridState = merge({}, gridState, {
    //         focusRowKey: "someOtherRow",
    //     });
    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridCell
    //                 rowData={rowData1}
    //                 columnDefinition={columnDefinition1}
    //                 columnIndex={0}
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     const cell: any = rendered.children();
    //     expect(cell.prop("tabIndex")).toEqual(-1);
    // });

    // test("onCellKeyDown callback is called on keydown", (): void => {
    //     const onCellKeyDown: any = jest.fn();

    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     onCellKeyDown,
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridCell
    //                 rowData={rowData1}
    //                 columnDefinition={columnDefinition1}
    //                 columnIndex={0}
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     expect(onCellKeyDown).toHaveBeenCalledTimes(0);
    //     const cell: any = rendered.children();
    //     cell.simulate("keyDown", { keyCode: KeyCodes.arrowDown });
    //     expect(onCellKeyDown).toHaveBeenCalledTimes(1);
    // });

    // test("onCellKeyDown callback is called on keydown", (): void => {
    //     const onCellKeyDown: any = jest.fn();

    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     onCellKeyDown,
    //                     dataGridState: gridState,
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridCell
    //                 rowData={rowData1}
    //                 columnDefinition={columnDefinition1}
    //                 columnIndex={0}
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     expect(onCellKeyDown).toHaveBeenCalledTimes(0);
    //     const cell: any = rendered.children();
    //     cell.simulate("keyDown", { keyCode: KeyCodes.arrowDown });
    //     expect(onCellKeyDown).toHaveBeenCalledTimes(1);
    // });

    // test("onFocus callback is called on on focus", (): void => {
    //     const onCellFocused: any = jest.fn();

    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     onCellFocused,
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridCell
    //                 rowData={rowData1}
    //                 columnDefinition={columnDefinition1}
    //                 columnIndex={0}
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     expect(onCellFocused).toHaveBeenCalledTimes(0);
    //     const cell: any = rendered.children();
    //     cell.simulate("focus");
    //     expect(onCellFocused).toHaveBeenCalledTimes(1);
    // });

    // test("Custom cell render function is called", (): void => {
    //     const cellRenderFunction: any = jest.fn();
    //     cellRenderFunction.mockReturnValue("Test");
    //     const updatedColumnDefinition: DataGridColumnDefinition = merge(
    //         {},
    //         columnDefinition1,
    //         { cell: cellRenderFunction }
    //     );

    //     const rendered: ReactWrapper = mount(
    //         <DataGridContext.Provider
    //             value={
    //                 {
    //                     dataGridProps: gridProps,
    //                 } as any
    //             }
    //         >
    //             <DataGridCell
    //                 rowData={rowData1}
    //                 columnDefinition={updatedColumnDefinition}
    //                 columnIndex={0}
    //                 managedClasses={managedClasses}
    //             />
    //         </DataGridContext.Provider>
    //     );

    //     expect(cellRenderFunction).toHaveBeenCalledTimes(1);
    // });
});
