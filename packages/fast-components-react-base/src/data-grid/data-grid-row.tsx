import React from "react";
import { get, isNil } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    DataGridRowClassNameContract,
    DataGridRowHandledProps,
    DataGridRowManagedClasses,
    DataGridRowProps,
    DataGridRowUnhandledProps,
} from "./data-grid-row.props";
import { DataGridColumnDefinition } from "./data-grid.props";
import DataGridCell from "./data-grid-cell";
import { DataGridContext, DataGridContextType } from "./data-grid-context";
import { classNames } from "@microsoft/fast-web-utilities";
import { toPx } from "@microsoft/fast-jss-utilities";

class DataGridRow extends Foundation<
    DataGridRowHandledProps,
    DataGridRowUnhandledProps,
    {}
> {
    public static defaultProps: Partial<DataGridRowProps> = {
        managedClasses: {},
    };

    public static displayName: string = "DataGridRow";

    public static contextType: React.Context<DataGridContextType> = DataGridContext;

    protected handledProps: HandledProps<DataGridRowHandledProps> = {
        rowData: void 0,
        gridTemplateColumns: void 0,
        gridRowPosition: void 0,
        rowIndex: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        if (isNil(this.context) || isNil(this.context.dataGridProps)) {
            return null;
        }

        const rowKey: React.ReactText = !isNil(
            this.props.rowData[this.context.dataGridProps.dataRowKey]
        )
            ? this.props.rowData[this.context.dataGridProps.dataRowKey]
            : this.props.rowIndex;

        // Check if there is already a style object being passed as props
        const styleProps: React.CSSProperties = get(this.props, "style");

        /* tslint:disable:no-string-literal */
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
            dataGridRow__focusWithin,
        }: DataGridRowClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(dataGridRow, [
                dataGridRow__focusWithin,
                this.props.rowData[this.context.dataGridProps.dataRowKey] ===
                    this.context.dataGridState.focusRowKey,
            ])
        );
    }

    /**
     *  render all cells
     */
    private renderCells(): React.ReactNode[] {
        return this.context.dataGridProps.columnDefinitions.map(this.renderCell);
    }

    /**
     *  renders a cell
     */
    private renderCell = (
        columnDefinition: DataGridColumnDefinition,
        index: number
    ): React.ReactNode => {
        return (
            <DataGridCell
                key={columnDefinition.columnDataKey}
                columnDefinition={columnDefinition}
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
