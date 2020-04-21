import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { isNil } from "lodash-es";
import {
    DataGridCellClassNameContract,
    DataGridCellHandledProps,
    DataGridCellManagedClasses,
    DataGridCellProps,
    DataGridCellUnhandledProps,
} from "./data-grid-cell.props";
import { DataGridContext, DataGridContextType } from "./data-grid-context";
import { classNames } from "@microsoft/fast-web-utilities";

class DataGridCell extends Foundation<
    DataGridCellHandledProps,
    DataGridCellUnhandledProps,
    {}
> {
    public static defaultProps: Partial<DataGridCellProps> = {
        rowData: null,
        columnDefinition: null,
        columnIndex: 0,
        managedClasses: {},
    };

    public static displayName: string = "DataGridCell";
    public static contextType: React.Context<DataGridContextType> = DataGridContext;

    protected handledProps: HandledProps<DataGridCellHandledProps> = {
        managedClasses: void 0,
        rowData: void 0,
        columnDefinition: void 0,
        columnIndex: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        if (
            isNil(this.context) ||
            isNil(this.context.dataGridProps) ||
            isNil(this.props.columnDefinition)
        ) {
            return null;
        }

        const unhandledProps: React.HTMLAttributes<HTMLElement> = {
            role: "gridcell",
            tabIndex: this.isFocusCell() ? 0 : -1,
            onKeyDown: this.handleKeyDown,
            onFocus: this.handleFocus,
        };

        if (!isNil(this.props.columnDefinition.cell)) {
            return this.props.columnDefinition.cell(
                this.props,
                this.generateClassNames(),
                this.props.columnDefinition.columnDataKey,
                unhandledProps
            );
        } else {
            return this.defaultCellRenderFunction(
                this.props,
                this.generateClassNames(),
                this.props.columnDefinition.columnDataKey,
                unhandledProps
            );
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(
            classNames(this.props.managedClasses.dataGridCell)
        );
    }

    /**
     * The default function that renders an unstyled content display
     */
    private defaultCellRenderFunction = (
        props: DataGridCellProps,
        className: string,
        cellId: React.ReactText,
        unhandledProps: object
    ): React.ReactNode => {
        return (
            <div
                {...unhandledProps}
                data-cellid={cellId}
                className={className}
                style={{
                    gridColumn: props.columnIndex,
                }}
            >
                {this.props.rowData[this.props.columnDefinition.columnDataKey]}
            </div>
        );
    };

    /**
     * returns true if this is the datagrid's current focus cell
     */
    private isFocusCell = (): boolean => {
        if (this.context === null) {
            return false;
        }
        return this.props.rowData[this.context.dataGridProps.dataRowKey] ===
            this.context.dataGridState.focusRowKey &&
            this.props.columnDefinition.columnDataKey ===
                this.context.dataGridState.focusColumnKey
            ? true
            : false;
    };

    /**
     * Handle the keydown event of the item
     */
    private handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
        this.context.onCellKeyDown(this.props, e);
    };

    /**
     * Handle focus event
     */
    private handleFocus = (e: React.FocusEvent<HTMLElement>): void => {
        this.context.onCellFocused(this.props, e);
    };
}

DataGridCell.contextType = DataGridContext;
export default DataGridCell;
export * from "./data-grid-cell.props";
export { DataGridCellClassNameContract };
