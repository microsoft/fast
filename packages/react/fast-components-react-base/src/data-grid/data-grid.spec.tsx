// import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import DataGrid from "./data-grid";
// import { DataGridCellProps } from "./data-grid-cell.props";
// import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

// interface RowData {
//     name: string;
//     age: number;
// }

/* tslint:disable:no-string-literal */
describe("data grid", (): void => {
    //     const managedClasses: DataGridClassNameContract = {
    //         dataGrid: "dataGrid",
    //         dataGrid_header: "dataGrid_header",
    //         dataGrid_columnHeader: "dataGrid_columnHeader",
    //         dataGrid_row: "dataGrid_viewport",
    //         dataGrid_row__focusWithin: "dataGrid_row__focusWithin",
    //         dataGrid_cell: "dataGrid_cell"
    //     };

    //     const rowData1: RowData = {
    //         name: "Thomas",
    //         age: 25,
    //     };

    //     const rowData2: RowData = {
    //         name: "Richard",
    //         age: 26,
    //     };

    //     const rowData3: RowData = {
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

    //     const columnDefinitionCustomCell: DataGridColumnDefinition = {
    //         columnDataKey: "age",
    //         title: "Age",
    //         columnWidth: "200px",
    //         cell: renderCellWithButton,
    //     };

    // const gridData: RowData[] = [rowData1, rowData2, rowData3];

    // const gridDataShortened: RowData[] = [rowData1, rowData2];

    // const columnDefinitions: DataGridColumnDefinition[] = [
    //     columnDefinition1,
    //     columnDefinition2,
    // ];

    // const columnDefinitionsCustomCell: DataGridColumnDefinition[] = [
    //     columnDefinition1,
    //     columnDefinitionCustomCell,
    // ];

    // function renderCellWithButton(
    //     props: DataGridCellProps,
    //     className: string,
    //     cellId: React.ReactText,
    //     unhandledProps: object,
    //     focusTarget: React.RefObject<any>
    // ): React.ReactNode {
    //     return (
    //         <div
    //             {...unhandledProps}
    //             data-cellid={cellId}
    //             className={className}
    //             style={{
    //                 gridColumn: props.columnIndex,
    //             }}
    //         >
    //             <button ref={focusTarget} role="button" tabIndex={-1}>
    //                 {props.rowData[props.columnDefinition.columnDataKey]}
    //             </button>
    //         </div>
    //     );
    // }

    test("should have a displayName that matches the component name", () => {
        expect((DataGrid as any).name).toBe(DataGrid.displayName);
    });

    // test("role and base class set correctly", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     expect(rendered.children().prop("className")).toContain(managedClasses.dataGrid);
    //     expect(rendered.children().prop("role")).toEqual("grid");
    // });

    // test("data grid header exists and has two column header cells", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     const header: any = rendered.find('[className="dataGrid_header"]');
    //     expect(header.length).toBe(1);
    //     expect(header.prop("role")).toEqual("row");
    //     const columnHeaders: any = header.find('[role="columnheader"]');
    //     expect(columnHeaders.length).toBe(2);
    // });

    // test("viewport element exists", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     const viewport: any = rendered.find('[className="dataGrid_viewport"]');
    //     expect(viewport.length).toBe(1);
    // });

    // test("grid container element exists", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     const container: any = rendered.find('[className="dataGrid_gridContainer"]');
    //     expect(container.length).toBe(1);
    // });

    // test("rendered range is 0 to 2 with a 0 height viewport", (): void => {
    //     const container: HTMLDivElement = document.createElement("div");
    //     document.body.appendChild(container);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />,
    //         {
    //             attachTo: container,
    //         }
    //     );

    //     rendered.instance()["updateLayout"]();
    //     expect(rendered.state("renderedRangeStartIndex")).toBe(0);
    //     expect(rendered.state("renderedRangeEndIndex")).toBe(2);

    //     document.body.removeChild(container);
    // });

    // test("rendered range is changed when buffer is set in props", (): void => {
    //     const container: HTMLDivElement = document.createElement("div");
    //     document.body.appendChild(container);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //             preloadBufferLength={3}
    //         />,
    //         {
    //             attachTo: container,
    //         }
    //     );

    //     rendered.instance()["updateLayout"]();
    //     expect(rendered.state("renderedRangeStartIndex")).toBe(0);
    //     expect(rendered.state("renderedRangeEndIndex")).toBe(2);

    //     document.body.removeChild(container);
    // });

    // test("getColumnIndexByKey returns correct value", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     expect(rendered.instance()["getColumnIndexByKey"]("age")).toBe(1);
    // });

    // test("getRowIndexByKey returns correct value", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     expect(rendered.instance()["getRowIndexByKey"]("Richard")).toBe(1);
    // });

    // test("arrow keys move focus around the grid", (): void => {
    //     const container: HTMLDivElement = document.createElement("div");
    //     document.body.appendChild(container);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />,
    //         {
    //             attachTo: container,
    //         }
    //     );

    //     rendered.instance()["updateLayout"]();

    //     const row1: any = rendered.find('[data-rowid="Thomas"]');
    //     const cell1: any = row1.find('[data-cellid="name"]');

    //     expect(rendered.instance().state.focusRowKey).toBe("Thomas");
    //     expect(rendered.instance().state.focusColumnKey).toBe("name");

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowRight });
    //     expect(rendered.instance().state.focusRowKey).toBe("Thomas");
    //     expect(rendered.instance().state.focusColumnKey).toBe("age");

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowDown });
    //     expect(rendered.instance().state.focusRowKey).toBe("Richard");
    //     expect(rendered.instance().state.focusColumnKey).toBe("age");

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowDown });
    //     expect(rendered.instance().state.focusRowKey).toBe("Harold");
    //     expect(rendered.instance().state.focusColumnKey).toBe("age");

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowDown });
    //     expect(rendered.instance().state.focusRowKey).toBe("Harold");
    //     expect(rendered.instance().state.focusColumnKey).toBe("age");

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowRight });
    //     expect(rendered.instance().state.focusRowKey).toBe("Harold");
    //     expect(rendered.instance().state.focusColumnKey).toBe("age");

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowLeft });
    //     expect(rendered.instance().state.focusRowKey).toBe("Harold");
    //     expect(rendered.instance().state.focusColumnKey).toBe("name");

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowLeft });
    //     expect(rendered.instance().state.focusRowKey).toBe("Harold");
    //     expect(rendered.instance().state.focusColumnKey).toBe("name");

    //     document.body.removeChild(container);
    // });

    // test("Focus and blur events change the state of isFocused", (): void => {
    //     const container: HTMLDivElement = document.createElement("div");
    //     document.body.appendChild(container);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />,
    //         {
    //             attachTo: container,
    //         }
    //     );
    //     rendered.instance()["updateLayout"]();

    //     expect(rendered.instance().isFocused).toBe(false);

    //     const row: any = rendered.find('[data-rowid="Thomas"]');
    //     const cell: any = row.find('[data-cellid="name"]');
    //     cell.simulate("focus");
    //     expect(rendered.instance().isFocused).toBe(true);

    //     rendered.setProps({ gridData: gridDataShortened });
    //     rendered.instance()["updateLayout"]();
    //     expect(row.prop("className")).toContain(managedClasses.dataGrid_row__focusWithin);
    //     expect(rendered.instance().isFocused).toBe(true);

    //     cell.simulate("blur");
    //     expect(rendered.instance().isFocused).toBe(false);

    //     document.body.removeChild(container);
    // });

    // test("itemHeightCallback prop is called and results applied", (): void => {
    //     const heightCallback: any = jest.fn();
    //     heightCallback.mockReturnValue(50);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             itemHeightCallback={heightCallback}
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     expect(heightCallback).toHaveBeenCalledTimes(3);
    //     expect(rendered.instance().state.dataContainerHeight).toBe(150);
    // });

    // test("itemHeightCallback prop is called and variable heights applied", (): void => {
    //     const heightCallback: any = jest.fn();
    //     heightCallback.mockReturnValueOnce(50);
    //     heightCallback.mockReturnValueOnce(100);
    //     heightCallback.mockReturnValueOnce(50);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             itemHeightCallback={heightCallback}
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     expect(heightCallback).toHaveBeenCalledTimes(3);
    //     expect(rendered.instance().state.dataContainerHeight).toBe(200);
    //     expect(rendered.instance().rowPositions.length).toBe(3);
    //     expect(rendered.instance().rowPositions[0].top).toBe(0);
    //     expect(rendered.instance().rowPositions[0].bottom).toBe(50);
    //     expect(rendered.instance().rowPositions[1].top).toBe(50);
    //     expect(rendered.instance().rowPositions[1].bottom).toBe(150);
    //     expect(rendered.instance().rowPositions[2].top).toBe(150);
    //     expect(rendered.instance().rowPositions[2].bottom).toBe(200);
    // });

    // test("reducing length of data array does not throw", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //             preloadBufferLength={3}
    //         />
    //     );

    //     rendered.instance()["updateLayout"]();
    //     expect(rendered.state("renderedRangeEndIndex")).toBe(2);
    //     rendered.setProps({ gridData: gridDataShortened });
    //     rendered.instance()["updateLayout"]();
    //     expect(rendered.state("renderedRangeEndIndex")).toBe(1);
    // });

    // test("getThresholdRowIndex returns correct values", (): void => {
    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );

    //     const rowPositions: RowPosition[] = [
    //         {
    //             top: 0,
    //             bottom: 100,
    //             height: 100,
    //         },
    //         {
    //             top: 100,
    //             bottom: 200,
    //             height: 100,
    //         },
    //         {
    //             top: 200,
    //             bottom: 300,
    //             height: 100,
    //         },
    //         {
    //             top: 300,
    //             bottom: 400,
    //             height: 100,
    //         },
    //         {
    //             top: 0,
    //             bottom: 400,
    //             height: 500,
    //         },
    //         {
    //             top: 0,
    //             bottom: 500,
    //             height: 600,
    //         },
    //         {
    //             top: 0,
    //             bottom: 600,
    //             height: 700,
    //         },
    //     ];

    //     expect(rendered.instance()["getThresholdRowIndex"](rowPositions, 0, 0)).toBe(0);
    //     expect(rendered.instance()["getThresholdRowIndex"](rowPositions, 0, 800)).toBe(6);
    //     expect(rendered.instance()["getThresholdRowIndex"](rowPositions, 0, 250)).toBe(2);
    //     expect(rendered.instance()["getThresholdRowIndex"](rowPositions, 7, 800)).toBe(6);
    //     expect(rendered.instance()["getThresholdRowIndex"](rowPositions, 7, 0)).toBe(6);
    // });

    // test("empty rowdata does not throw", (): void => {
    //     const gridDataEmptyRow: object[] = [{}, rowData1, rowData2, rowData3];

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={[]}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />
    //     );
    // });

    // test("default focus column prop is applied", (): void => {
    //     const container: HTMLDivElement = document.createElement("div");
    //     document.body.appendChild(container);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //             defaultFocusColumnKey="age"
    //         />,
    //         {
    //             attachTo: container,
    //         }
    //     );

    //     rendered.instance()["updateLayout"]();

    //     const row1: any = rendered.find('[data-rowid="Thomas"]');
    //     const cell: any = row1.find('[data-cellid="age"]');

    //     expect(cell.props().tabIndex).toEqual(0);

    //     document.body.removeChild(container);
    // });

    // test("grid cells with focus target set focus the targeted element", (): void => {
    //     const container: HTMLDivElement = document.createElement("div");
    //     document.body.appendChild(container);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitionsCustomCell}
    //             managedClasses={managedClasses}
    //         />,
    //         {
    //             attachTo: container,
    //         }
    //     );

    //     rendered.instance()["updateLayout"]();

    //     const row1: any = rendered.find('[data-rowid="Thomas"]');
    //     const cell1: any = row1.find('[data-cellid="name"]');

    //     cell1.simulate("keydown", { keyCode: KeyCodes.arrowRight });
    //     expect(rendered.instance().state.focusRowKey).toBe("Thomas");
    //     expect(rendered.instance().state.focusColumnKey).toBe("age");
    //     expect((document.activeElement as HTMLElement).innerHTML).toBe("25");

    //     document.body.removeChild(container);
    // });

    // test("grid row focus should stay in the same area as grid data changes", () => {
    //     const container: HTMLDivElement = document.createElement("div");
    //     document.body.appendChild(container);

    //     const rendered: ReactWrapper = mount(
    //         <DataGrid
    //             gridData={gridData}
    //             dataRowKey="name"
    //             columnDefinitions={columnDefinitions}
    //             managedClasses={managedClasses}
    //         />,
    //         {
    //             attachTo: container,
    //         }
    //     );
    //     jest.spyOn(rendered.instance(), "viewportClientHeight").mockImplementation(
    //         () => 100
    //     );
    //     rendered.setProps({}); // force update
    //     /* Focus this element
    //      name age
    //      ---------
    //      |   |   |
    //      |   | x |
    //      |   |   |
    //      ---------
    //     */
    //     const secondRowData: RowData = gridData[1];
    //     const secondRow: ReactWrapper = rendered.find(
    //         `[data-rowid="${secondRowData.name}"]`
    //     );
    //     const secondRowLeftCell: ReactWrapper = secondRow.find('[data-cellid="name"]');
    //     secondRowLeftCell.simulate("keydown", { keyCode: KeyCodes.arrowRight });
    //     secondRowLeftCell.simulate("keydown", { keyCode: KeyCodes.arrowDown });
    //     expect((document.activeElement as HTMLElement).innerHTML).toBe(
    //         secondRowData.age.toString()
    //     );
    //     // Swap the 2nd and 3rd rows, expect focus to follow
    //     const swappedRowData: RowData[] = [gridData[0], gridData[2], gridData[1]];
    //     rendered.setProps({ gridData: swappedRowData });
    //     /* Expect focus to be here
    //      name age
    //      ---------
    //      |   |   |
    //      |   |   |
    //      |   | x | << Old second row
    //      ---------
    //     */
    //     expect((document.activeElement as HTMLElement).innerHTML).toBe(
    //         swappedRowData[2].age.toString()
    //     );

    //     // Remove the last row
    //     const updatedTwoRowData: RowData[] = [gridData[0], gridData[2]];
    //     rendered.setProps({ gridData: updatedTwoRowData });
    //     /* Expect focus to be here
    //      name age
    //      ---------
    //      |   |   |
    //      |   | x |
    //      ---------
    //     */
    //     expect((document.activeElement as HTMLElement).innerHTML).toBe(
    //         updatedTwoRowData[1].age.toString()
    //     );

    //     // Replace the second row, focus should stay there
    //     const replacedTwoRowData: RowData[] = [gridData[0], gridData[1]];
    //     rendered.setProps({ gridData: replacedTwoRowData });
    //     /* Expect focus to be here
    //      name age
    //      ---------
    //      |   |   |
    //      |   | x |
    //      ---------
    //     */
    //     expect((document.activeElement as HTMLElement).innerHTML).toBe(
    //         replacedTwoRowData[1].age.toString()
    //     );

    //     // Remove the top row
    //     const singleRowData: RowData[] = [gridData[1]];
    //     rendered.setProps({ gridData: singleRowData });
    //     /* Expect focus to be here
    //      name age
    //      ---------
    //      |   | x |
    //      ---------
    //     */
    //     expect((document.activeElement as HTMLElement).innerHTML).toBe(
    //         singleRowData[0].age.toString()
    //     );

    //     document.body.removeChild(container);
    // });
});
