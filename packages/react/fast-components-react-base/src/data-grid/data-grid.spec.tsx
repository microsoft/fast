import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper } from "enzyme";
import { DataGridClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
} from "@microsoft/fast-web-utilities";
import DataGrid, { DataGridState } from "./data-grid";
import { DataGridContext } from "./data-grid-context";
import { DataGridColumnDefinition, DataGridProps } from "./data-grid.props";
import { DataGridCellProps } from "./data-grid-cell.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

/* tslint:disable:no-string-literal */
describe("data grid", (): void => {
    interface TestRowData {
        name: string;
        age: number;
    }

    function renderCellWithButton(
        props: DataGridCellProps,
        className: string,
        cellId: React.ReactText,
        rootElement: React.RefObject<any>,
        focusTarget: React.RefObject<any>,
        unhandledProps: object
    ): React.ReactNode {
        return (
            <div
                {...unhandledProps}
                ref={rootElement}
                data-cellid={cellId}
                className={className}
                style={{
                    gridColumn: props.columnIndex,
                }}
            >
                <button ref={focusTarget} role="button" tabIndex={-1}>
                    {props.rowData[props.columnDefinition.columnDataKey]}
                </button>
            </div>
        );
    }

    const managedClasses: DataGridClassNameContract = {
        dataGrid: "dataGrid",
        dataGrid_scrollingPanel: "dataGrid_scrollingPanel",
        dataGrid_scrollingPanel_items: "dataGrid_scrollingPanel_items",
        dataGrid_scrollingPanel__scrollable: "dataGrid_scrollingPanel__scrollable",
        dataGrid_header: "dataGrid_header",
        dataGrid_columnHeader: "dataGrid_columnHeader",
        dataGrid_row: "dataGrid_viewport",
        dataGrid_row__focusWithin: "dataGrid_row__focusWithin",
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

    const columnDefinition1: DataGridColumnDefinition = {
        columnDataKey: "name",
        title: "Name",
        columnWidth: "200px",
    };

    const columnDefinition2: DataGridColumnDefinition = {
        columnDataKey: "age",
        title: "Age",
        columnWidth: "200px",
    };

    const columnDefinitionCustomCell: DataGridColumnDefinition = {
        columnDataKey: "age",
        title: "Age",
        columnWidth: "200px",
        cell: renderCellWithButton,
    };

    const gridData: TestRowData[] = [rowData1, rowData2, rowData3];

    const gridDataShortened: TestRowData[] = [rowData1, rowData2];

    const columnDefinitions: DataGridColumnDefinition[] = [
        columnDefinition1,
        columnDefinition2,
    ];

    const columnDefinitionsCustomCell: DataGridColumnDefinition[] = [
        columnDefinition1,
        columnDefinitionCustomCell,
    ];

    test("should have a displayName that matches the component name", () => {
        expect((DataGrid as any).name).toBe(DataGrid.displayName);
    });

    test("role and base class set correctly", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.children().prop("className")).toContain(managedClasses.dataGrid);
        expect(rendered.children().prop("role")).toEqual("grid");
    });

    test("data grid header exists and has two column header cells", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
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
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
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
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
            />
        );

        const matches: any = rendered.find('[className="dataGrid_scrollingPanel_items"]');
        expect(matches.length).toBe(1);
    });

    test("getColumnIndexByKey returns correct value", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance()["getColumnIndexByKey"]("age")).toBe(1);
    });

    test("getRowIndexByKey returns correct value", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance()["getRowIndexByKey"]("Richard")).toBe(1);
    });

    test("arrow keys move focus around the grid", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                virtualizeItems={false}
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

        cell.simulate("keydown", { keyCode: keyCodeArrowDown });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Harold");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("age");

        cell.simulate("keydown", { keyCode: keyCodeArrowDown });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Harold");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("age");

        cell.simulate("keydown", { keyCode: keyCodeArrowRight });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Harold");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("age");

        cell.simulate("keydown", { keyCode: keyCodeArrowLeft });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Harold");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("name");

        cell.simulate("keydown", { keyCode: keyCodeArrowLeft });
        expect((rendered.instance().state as DataGridState).focusRowKey).toBe("Harold");
        expect((rendered.instance().state as DataGridState).focusColumnKey).toBe("name");

        document.body.removeChild(container);
    });

    /* tslint:disable:no-string-literal */
    test("Focus and blur events change the state of isFocused", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
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

        rendered.setProps({ gridData: gridDataShortened });
        expect(row.prop("className")).toContain(managedClasses.dataGrid_row__focusWithin);
        expect((rendered.instance() as any).isFocused).toBe(true);

        cell.simulate("blur");
        expect((rendered.instance() as any).isFocused).toBe(false);

        document.body.removeChild(container);
    });

    test("itemHeightCallback prop is called and results applied", (): void => {
        const heightCallback: any = jest.fn();
        heightCallback.mockReturnValue(50);

        const rendered: ReactWrapper = mount(
            <DataGrid
                itemHeightCallback={heightCallback}
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
            />
        );

        expect(heightCallback).toHaveBeenCalledTimes(3);
        expect((rendered.instance().state as DataGridState).rowPositions[2].end).toBe(
            150
        );
    });

    test("itemHeightCallback prop is called and variable heights applied", (): void => {
        const heightCallback: any = jest.fn();
        heightCallback.mockReturnValueOnce(50);
        heightCallback.mockReturnValueOnce(100);
        heightCallback.mockReturnValueOnce(50);

        const rendered: ReactWrapper = mount(
            <DataGrid
                itemHeightCallback={heightCallback}
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
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
            150
        );
        expect((rendered.instance().state as DataGridState).rowPositions[2].start).toBe(
            150
        );
        expect((rendered.instance().state as DataGridState).rowPositions[2].end).toBe(
            200
        );
    });

    test("reducing length of data array does not throw", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
            />
        );

        expect((rendered.instance().state as DataGridState).rowPositions.length).toBe(3);
        rendered.setProps({ gridData: gridDataShortened });
        expect((rendered.instance().state as DataGridState).rowPositions.length).toBe(2);
    });

    test("empty rowdata does not throw", (): void => {
        const gridDataEmptyRow: object[] = [{}, rowData1, rowData2, rowData3];

        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
            />
        );

        expect(() => {
            rendered.setProps({ gridData: gridDataEmptyRow });
        }).not.toThrow();
    });

    test("default focus props are applied", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: ReactWrapper = mount(
            <DataGrid
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
                defaultFocusRowKey="Thomas"
                defaultFocusColumnKey="age"
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
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitionsCustomCell}
                virtualizeItems={false}
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
                gridData={gridData}
                dataRowKey="name"
                columnDefinitions={columnDefinitions}
                managedClasses={managedClasses}
                virtualizeItems={false}
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
        const secondRowData: TestRowData = gridData[1];
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
        const swappedRowData: TestRowData[] = [gridData[0], gridData[2], gridData[1]];
        rendered.setProps({ gridData: swappedRowData });
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
        const updatedTwoRowData: TestRowData[] = [gridData[0], gridData[2]];
        rendered.setProps({ gridData: updatedTwoRowData });
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
        expect(rendered.state("focusRowKey")).toBe(updatedTwoRowData[1].name)

        // Replace the second row, focus should stay there
        const replacedTwoRowData: TestRowData[] = [gridData[0], gridData[1]];
        rendered.setProps({ gridData: replacedTwoRowData });
        /* Expect focus to be here
         name age
         ---------
         |   |   |
         |   | x |
         ---------
        */
        expect(rendered.state("focusRowKey")).toBe(replacedTwoRowData[1].name)

        // Remove the top row
        const singleRowData: TestRowData[] = [gridData[1]];
        rendered.setProps({ gridData: singleRowData });
        /* Expect focus to be here
         name age
         ---------
         |   | x |
         ---------
        */
        expect(rendered.state("focusRowKey")).toBe(singleRowData[0].name)

        document.body.removeChild(container);
    });
});
