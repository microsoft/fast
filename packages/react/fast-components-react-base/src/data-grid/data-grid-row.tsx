import React from "react";
import { get, isNil } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import { DataGridRowClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { DisplayNamePrefix } from "../utilities";
import {
    DataGridRowHandledProps,
    DataGridRowProps,
    DataGridRowUnhandledProps,
} from "./data-grid-row.props";
import { DataGridColumn } from "./data-grid.props";
import DataGridCell from "./data-grid-cell";
import { DataGridContext, DataGridContextType } from "./data-grid-context";

class DataGridRow extends Foundation<
    DataGridRowHandledProps,
    DataGridRowUnhandledProps,
    {}
> {
    public static defaultProps: Partial<DataGridRowProps> = {
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}DataGridRow`;

    public static contextType: React.Context<DataGridContextType> = DataGridContext;

    protected handledProps: HandledProps<DataGridRowHandledProps> = {
        rowData: void 0,
        gridTemplateColumns: void 0,
        rowIndex: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        if (isNil(this.context)) {
            return null;
        }

        const rowKey: React.ReactText = !isNil(
            this.props.rowData[this.context.dataRowKey]
        )
            ? this.props.rowData[this.context.dataRowKey]
            : this.props.rowIndex;

        // Check if there is already a style object being passed as props
        const styleProps: React.CSSProperties = get(this.props, "style");

        return (
            <div
                {...this.unhandledProps()}
                role="row"
                className={this.generateClassNames()}
                data-rowid={rowKey}
                style={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: this.props.gridTemplateColumns,
                    ...styleProps,
                }}
            >
                {this.renderCells()}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            dataGridRow,
            dataGridRow__focusedWithin,
        }: DataGridRowClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(dataGridRow, [
                dataGridRow__focusedWithin,
                this.props.rowData[this.context.dataRowKey] === this.context.focusRowKey,
            ])
        );
    }

    /**
     *  render all cells
     */
    private renderCells(): React.ReactNode[] {
        if (this.context === null || this.context.columns === null) {
            return;
        }
        return this.context.columns.map(this.renderCell);
    }

    /**
     *  renders a cell
     */
    private renderCell = (column: DataGridColumn, index: number): React.ReactNode => {
        return (
            <DataGridCell
                key={column.columnDataKey}
                column={column}
                rowData={this.props.rowData}
                columnIndex={index + 1}
                managedClasses={{
                    dataGridCell: this.props.managedClasses.dataGridRow_cell,
                }}
            />
        );
    };
}

DataGridRow.contextType = DataGridContext;
export default DataGridRow;
export * from "./data-grid-row.props";
export { DataGridRowClassNameContract };
