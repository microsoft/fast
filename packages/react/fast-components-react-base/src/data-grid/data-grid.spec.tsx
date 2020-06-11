import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper } from "enzyme";
import { DataGridClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodePageDown,
    keyCodePageUp,
} from "@microsoft/fast-web-utilities";
import { DisplayNamePrefix } from "../utilities";
import DataGrid, { DataGridState } from "./data-grid";
import { DataGridCellRenderConfig, DataGridColumn } from "./data-grid.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("data grid", (): void => {
    interface TestRowData {
        name: string;
        age: number;
    }

    function renderCellWithButton(config: DataGridCellRenderConfig): React.ReactNode {
        return (
            <div
                {...config.unhandledProps}
                ref={config.rootElement}
                data-cellid={config.columnDataKey}
                className={config.classNames}
                style={{
                    gridColumn: config.columnIndex,
                }}
            >
                <button ref={config.focusTarget} role="button" tabIndex={-1}>
                    {config.rowData[config.columnDataKey]}
                </button>
            </div>
        );
    }

    const managedClasses: DataGridClassNameContract = {
        dataGrid: "dataGrid",
        dataGrid__virtualized: "dataGrid__virtualized",
        dataGrid_scrollingPanel: "dataGrid_scrollingPanel",
        dataGrid_scrollingPanelItems: "dataGrid_scrollingPanelItems",
        dataGrid_scrollingPanel__scrollable: "dataGrid_scrollingPanel__scrollable",
        dataGrid_header: "dataGrid_header",
        dataGrid_columnHeader: "dataGrid_columnHeader",
        dataGrid_row: "dataGrid_viewport",
        dataGrid_row__focusedWithin: "dataGrid_row__focusedWithin",
        dataGrid_cell: "dataGrid_cell",
    };

    const rowData1: TestRowData = {
        name: "Thomas",
        age: 25,
    };

    const rowData2: TestRowData = {
        name: "Richard",
        age: 26,
    };

    const rowData3: TestRowData = {
        name: "Harold",
        age: 27,
    };

    function getDataSet(length: number): object[] {
        const dataSet: object[] = [];

        for (let i: number = 0; i < length; i++) {
            dataSet.push({
                name: `id-${i}`,
                age: i,
            });
        }

        return dataSet;
    }

    const column1: DataGridColumn = {
        columnDataKey: "name",
        title: "Name",
        columnWidth: "200px",
    };

    const column2: DataGridColumn = {
        columnDataKey: "age",
        title: "Age",
        columnWidth: "200px",
    };

    const columnCustomCell: DataGridColumn = {
        columnDataKey: "age",
        title: "Age",
        columnWidth: "200px",
        cell: renderCellWithButton,
    };

    const rows: TestRowData[] = [rowData1, rowData2, rowData3];

    const rowsShortened: TestRowData[] = [rowData1, rowData2];

    const columns: DataGridColumn[] = [column1, column2];

    const columnsCustomCell: DataGridColumn[] = [column1, columnCustomCell];

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(DataGrid as any).name}`).toBe(
            DataGrid.displayName
        );
    });

    test("role and base class set correctly", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.children().prop("className")).toContain(managedClasses.dataGrid);
        expect(rendered.children().prop("role")).toEqual("grid");
    });

    test("virtualized classname not applied when in not virtualized mode", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.children().prop("className")).not.toContain(managedClasses.dataGrid__virtualized);
    });


    test("virtualized classname applied when in virtualized mode", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                virtualize={true}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.children().prop("className")).toContain(managedClasses.dataGrid__virtualized);
    });

    test("data grid header exists and has two column header cells", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        const header: any = rendered.find('[className="dataGrid_header"]');
        expect(header.length).toBe(1);
        expect(header.prop("role")).toEqual("row");
        const columnHeaders: any = header.find('[role="columnheader"]');
        expect(columnHeaders.length).toBe(2);
    });

    test("scrolling panel element exists", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        const matches: any = rendered.find(
            '[className="dataGrid_scrollingPanel dataGrid_scrollingPanel__scrollable"]'
        );
        expect(matches.length).toBe(1);
    });

    test("scrolling panel items container element exists", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        const matches: any = rendered.find('[className="dataGrid_scrollingPanelItems"]');
        expect(matches.length).toBe(1);
    });

    test("getColumnIndexByKey returns correct value", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance()["getColumnIndexByKey"]("age", columns)).toBe(1);
    });

    test("getRowIndexByKey returns correct value", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance()["getRowIndexByKey"]("Richard")).toBe(1);
    });

    test("virtualize items reduces number or rendered items", (): void => {
        let container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);
        let rendered: ReactWrapper = mount(
            <DataGrid
                rows={getDataSet(20)}
                dataRowKey="name"
                columns={columns}
                virtualize={false}
                managedClasses={managedClasses}
            />,
            {
                attachTo: container,
            }
        );

        expect(rendered.find("[data-rowid]").length).toBe(20);
        document.body.removeChild(container);

        container = document.createElement("div");
        document.body.appendChild(container);
        rendered = mount(
            <DataGrid
                rows={getDataSet(20)}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />,
            {
                attachTo: container,
            }
        );

        expect(rendered.find("[data-rowid]").length).toBe(1);
        document.body.removeChild(container);
    });

    test("arrow keys move focus around the grid", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={false}
                managedClasses={managedClasses}
            />,
            {
                attachTo: container,
            }
        );

        const row: any = rendered.find("[data-rowid]").first();
        const cell: any = row.find("[data-cellid]").first();

        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Thomas");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("name");

        cell.simulate("keydown", { keyCode: keyCodeArrowRight });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Thomas");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("age");

        cell.simulate("keydown", { keyCode: keyCodeArrowDown });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Richard");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("age");

        cell.simulate("keydown", { keyCode: keyCodeArrowUp });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Thomas");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("age");

        cell.simulate("keydown", { keyCode: keyCodeArrowLeft });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Thomas");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("name");

        document.body.removeChild(container);
    });

    test("page up/down keys move up/down in the grid", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <DataGrid
                rows={getDataSet(20)}
                dataRowKey="name"
                columns={columns}
                virtualize={false}
                managedClasses={managedClasses}
            />,
            {
                attachTo: container,
            }
        );

        rendered.instance().lastReportedViewportSpan = 200;
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("id-0");

        const row: any = rendered.find("[data-rowid]").first();
        const cell: any = row.find("[data-cellid]").first();
        cell.simulate("keydown", { keyCode: keyCodePageDown });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("id-1");

        cell.simulate("keydown", { keyCode: keyCodePageUp });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("id-0");

        document.body.removeChild(container);
    });

    test("Focus and blur events change the state of isFocused", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />,
            {
                attachTo: container,
            }
        );

        expect((rendered.instance() as any).isFocused).toBe(false);

        const row: any = rendered.find('[data-rowid="Thomas"]');
        const cell: any = row.find('[data-cellid="name"]');
        cell.simulate("focus");
        expect((rendered.instance() as any).isFocused).toBe(true);

        rendered.setProps({ rows: rowsShortened });
        expect(row.prop("className")).toContain(
            managedClasses.dataGrid_row__focusedWithin
        );
        expect((rendered.instance() as any).isFocused).toBe(true);

        cell.simulate("blur");
        expect((rendered.instance() as any).isFocused).toBe(false);

        document.body.removeChild(container);
    });

    test("rowHeightCallback prop is called and results applied", (): void => {
        const heightCallback: any = jest.fn();
        heightCallback.mockReturnValue(50);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rowHeightCallback={heightCallback}
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        expect(heightCallback).toHaveBeenCalledTimes(3);
        expect((rendered.instance().state as DataGridState).rowPositions[2].end).toBe(
            150
        );
    });

    test("rowHeightCallback prop is called and variable heights applied", (): void => {
        const heightCallback: any = jest.fn();
        heightCallback.mockReturnValueOnce(50);
        heightCallback.mockReturnValueOnce(300);
        heightCallback.mockReturnValueOnce(50);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rowHeightCallback={heightCallback}
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        expect(heightCallback).toHaveBeenCalledTimes(3);
        expect((rendered.instance().state as DataGridState).rowPositions.length).toBe(3);
        expect((rendered.instance().state as DataGridState).rowPositions[0].start).toBe(
            0
        );
        expect((rendered.instance().state as DataGridState).rowPositions[0].end).toBe(50);
        expect((rendered.instance().state as DataGridState).rowPositions[1].start).toBe(
            50
        );
        expect((rendered.instance().state as DataGridState).rowPositions[1].end).toBe(
            350
        );
        expect((rendered.instance().state as DataGridState).rowPositions[2].start).toBe(
            350
        );
        expect((rendered.instance().state as DataGridState).rowPositions[2].end).toBe(
            400
        );
    });

    test("reducing length of data array does not throw", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        expect((rendered.instance().state as DataGridState).rowPositions.length).toBe(3);
        rendered.setProps({ rows: rowsShortened });
        expect((rendered.instance().state as DataGridState).rowPositions.length).toBe(2);
    });

    test("empty rowdata does not throw", (): void => {
        const rowsEmptyRow: object[] = [{}, rowData1, rowData2, rowData3];

        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        expect(() => {
            rendered.setProps({ rows: rowsEmptyRow });
        }).not.toThrow();
    });

    test("default focus props are applied", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
                defaultFocusRowKey="Thomas"
                defaultFocusColumnKey="age"
                virtualize={true}
            />,
            {
                attachTo: container,
            }
        );

        const row1: any = rendered.find('[data-rowid="Thomas"]');
        const cell: any = row1.find('[data-cellid="age"]');

        expect(cell.props().tabIndex).toEqual(0);

        document.body.removeChild(container);
    });

    test("grid cells with focus target set focus the targeted element", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columnsCustomCell}
                virtualize={false}
                managedClasses={managedClasses}
            />,
            {
                attachTo: container,
            }
        );

        const row: any = rendered.find("[data-rowid]").first();
        const cell: any = row.find("[data-cellid]").first();

        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Thomas");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("name");

        cell.simulate("keydown", { keyCode: keyCodeArrowRight });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Thomas");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("age");

        expect((document.activeElement as HTMLElement).innerHTML).toBe("25");

        document.body.removeChild(container);
    });

    test("grid row focus should stay in the same area as grid data changes", () => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
                virtualize={false}
            />,
            {
                attachTo: container,
            }
        );

        /* Focus this element
         name age
         ---------
         |   |   |
         |   | x |
         |   |   |
         ---------
        */
        const secondRowData: TestRowData = rows[1];
        const secondRow: ReactWrapper = rendered.find(
            `[data-rowid="${secondRowData.name}"]`
        );
        const secondRowLeftCell: ReactWrapper = secondRow.find('[data-cellid="name"]');
        secondRowLeftCell.simulate("keydown", { keyCode: keyCodeArrowRight });
        secondRowLeftCell.simulate("keydown", { keyCode: keyCodeArrowDown });
        expect((document.activeElement as HTMLElement).innerHTML).toBe(
            secondRowData.age.toString()
        );
        // Swap the 2nd and 3rd rows, expect focus to follow
        const swappedRowData: TestRowData[] = [rows[0], rows[2], rows[1]];
        rendered.setProps({ rows: swappedRowData });
        /* Expect focus to be here
         name age
         ---------
         |   |   |
         |   |   |
         |   | x | << Old second row
         ---------
        */
        expect((document.activeElement as HTMLElement).innerHTML).toBe(
            swappedRowData[2].age.toString()
        );

        // Remove the last row
        const updatedTwoRowData: TestRowData[] = [rows[0], rows[2]];
        rendered.setProps({ rows: updatedTwoRowData });
        /* Expect focus to be here
         name age
         ---------
         |   |   |
         |   | x |
         ---------
        */
        // note: because focusing on elements not in the dom at the time of the
        // data change relies on context the actual active element does not change
        // in the test environment, but we can check where focus would go.
        expect(rendered.state("focusRowKey")).toBe(updatedTwoRowData[1].name);

        // Replace the second row, focus should stay there
        const replacedTwoRowData: TestRowData[] = [rows[0], rows[1]];
        rendered.setProps({ rows: replacedTwoRowData });
        /* Expect focus to be here
         name age
         ---------
         |   |   |
         |   | x |
         ---------
        */
        expect(rendered.state("focusRowKey")).toBe(replacedTwoRowData[1].name);

        // Remove the top row
        const singleRowData: TestRowData[] = [rows[1]];
        rendered.setProps({ rows: singleRowData });
        /* Expect focus to be here
         name age
         ---------
         |   | x |
         ---------
        */
        expect(rendered.state("focusRowKey")).toBe(singleRowData[0].name);

        document.body.removeChild(container);
    });

    test("setting an invalid row key does not throw", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        expect(() => {
            rendered.setProps({ defaultFocusRowKey: "invalid" });
        }).not.toThrow();
    });

    test("setting an invalid focus column does not throw", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        expect(() => {
            rendered.setProps({ defaultFocusColumnKey: "invalid" });
        }).not.toThrow();
    });

    test("getRowIndexByKey returns expected index value", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance()["getRowIndexByKey"]("Richard")).toBe(1);
    });

    test("getRowIndexByKey does not throw with an invalid index", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                rows={rows}
                dataRowKey="name"
                columns={columns}
                managedClasses={managedClasses}
            />
        );

        expect(() => {
            rendered.instance()["getRowIndexByKey"]("invalid");
        }).not.toThrow();
    });

    test("getIndexOfRowAtScrollPosition returns expected index values", (): void => {
        const heightCallback: any = jest.fn();
        heightCallback.mockReturnValueOnce(50);
        heightCallback.mockReturnValueOnce(300);
        heightCallback.mockReturnValueOnce(50);

        const rendered: ReactWrapper = mount(
            <DataGrid
                rowHeightCallback={heightCallback}
                rows={rows}
                dataRowKey="name"
                columns={columns}
                virtualize={true}
                managedClasses={managedClasses}
            />
        );

        const rowPositions: any = rendered.state("rowPositions");
        expect(
            rendered.instance()["getIndexOfRowAtScrollPosition"](0, rowPositions)
        ).toBe(0);
        expect(
            rendered.instance()["getIndexOfRowAtScrollPosition"](51, rowPositions)
        ).toBe(1);
        expect(
            rendered.instance()["getIndexOfRowAtScrollPosition"](200, rowPositions)
        ).toBe(1);
        expect(
            rendered.instance()["getIndexOfRowAtScrollPosition"](349, rowPositions)
        ).toBe(1);
        expect(
            rendered.instance()["getIndexOfRowAtScrollPosition"](350, rowPositions)
        ).toBe(2);
        expect(
            rendered.instance()["getIndexOfRowAtScrollPosition"](400, rowPositions)
        ).toBe(2);
    });
});
