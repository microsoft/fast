import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper } from "enzyme";
import { DataGridRowClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import DataGridRow from "./data-grid-row";
import { DataGridContext } from "./data-grid-context";
import { DataGridColumnDefinition } from "./data-grid.props";
import { DataGridProps } from "./data-grid";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("data grid row", (): void => {
    const managedClasses: DataGridRowClassNameContract = {
        dataGridRow: "dataGridRow",
        dataGridRow__focusWithin: "dataGridRow__focusWithin",
    };

    const rowData1: object = {
        name: "Thomas",
        age: 25,
    };

    const rowData2: object = {
        name: "Richard",
        age: 26,
    };

    const rowData3: object = {
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

    const gridProps: DataGridProps = {
        dataRowKey: "name",
        gridData: [rowData1, rowData2, rowData3],
        columnDefinitions: [columnDefinition1, columnDefinition2],
        itemHeight: 60,
    };

    test("should have a displayName that matches the component name", () => {
        expect((DataGridRow as any).name).toBe(DataGridRow.displayName);
    });

    test("rowId, role and base class gets written to dom element", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGridContext.Provider
                value={
                    {
                        focusRowKey: "Thomas",
                        focusColumnKey: "name",
                        dataGridProps: gridProps,
                    } as any
                }
            >
                <DataGridRow
                    rowData={rowData1}
                    gridTemplateColumns="200px 200px"
                    managedClasses={managedClasses}
                />
            </DataGridContext.Provider>
        );

        const row: any = rendered.children();
        expect(row.prop("data-rowid")).toEqual("Thomas");
        expect(row.prop("role")).toEqual("row");
        expect(row.prop("className")).toContain(managedClasses.dataGridRow);
    });

    test("focus within class applied when focus is whithin the row", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGridContext.Provider
                value={
                    {
                        focusRowKey: "Thomas",
                        focusColumnKey: "name",
                        dataGridProps: gridProps,
                    } as any
                }
            >
                <DataGridRow
                    rowData={rowData1}
                    gridTemplateColumns="200px 200px"
                    managedClasses={managedClasses}
                />
            </DataGridContext.Provider>
        );

        const row: any = rendered.children();
        expect(row.prop("className")).toContain(managedClasses.dataGridRow__focusWithin);
    });

    test("cells are rendered as children", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGridContext.Provider
                value={
                    {
                        dataGridProps: gridProps,
                    } as any
                }
            >
                <DataGridRow
                    rowData={rowData1}
                    gridTemplateColumns="200px 200px"
                    managedClasses={managedClasses}
                />
            </DataGridContext.Provider>
        );

        const row: any = rendered.children();
        expect(row.find("DataGridCell").length).toBe(2);
    });
});
