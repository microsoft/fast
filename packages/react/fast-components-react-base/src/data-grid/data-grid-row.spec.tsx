import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper } from "enzyme";
import { DataGridRowClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { DisplayNamePrefix } from "../utilities";
import DataGridRow from "./data-grid-row";
import { DataGridContext } from "./data-grid-context";
import { DataGridColumn } from "./data-grid.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("data grid row", (): void => {
    const managedClasses: DataGridRowClassNameContract = {
        dataGridRow: "dataGridRow",
        dataGridRow__focusedWithin: "dataGridRow__focusWithin",
    };

    const rowData1: object = {
        name: "Thomas",
        age: 25,
    };

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

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(DataGridRow as any).name}`).toBe(
            DataGridRow.displayName
        );
    });

    test("rowId, role and base class gets written to dom element", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGridContext.Provider
                value={
                    {
                        focusRowKey: "Thomas",
                        focusColumnKey: "name",
                        dataRowKey: "name",
                        columns: [column1, column2],
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
                        dataRowKey: "name",
                        columns: [column1, column2],
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
        expect(row.prop("className")).toContain(managedClasses.dataGridRow__focusedWithin);
    });

    test("cells are rendered as children", (): void => {
        const rendered: ReactWrapper = mount(
            <DataGridContext.Provider
                value={
                    {
                        dataRowKey: "name",
                        columns: [column1, column2],
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
        expect(row.find("BaseDataGridCell").length).toBe(2);
    });
});
