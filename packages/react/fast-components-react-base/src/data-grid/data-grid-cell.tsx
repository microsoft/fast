import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { isNil } from "lodash-es";
import { classNames } from "@microsoft/fast-web-utilities";
import { extractHtmlElement } from "@microsoft/fast-react-utilities";
import { DataGridCellClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    DataGridCellHandledProps,
    DataGridCellProps,
    DataGridCellUnhandledProps,
} from "./data-grid-cell.props";
import { DataGridContext, DataGridContextType } from "./data-grid-context";
import { DataGridCellRenderConfig } from "./data-grid.props";

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

    /**
     * The default function that renders a cell
     */
    public static renderCell = (
        config: DataGridCellRenderConfig
    ): React.ReactNode => {
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
                {config.rowData[config.columnDataKey]}
            </div>
        );
    };

    protected handledProps: HandledProps<DataGridCellHandledProps> = {
        managedClasses: void 0,
        rowData: void 0,
        columnDefinition: void 0,
        columnIndex: void 0,
    };

    private focusTarget: React.RefObject<any> = React.createRef();
    private rootElement: React.RefObject<any> = React.createRef();

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

        const config: DataGridCellRenderConfig = {
            rowData: this.props.rowData,
            columnDataKey: this.props.columnDefinition.columnDataKey,
            columnIndex: this.props.columnIndex,
            classNames: this.generateClassNames(),
            rootElement: this.rootElement,
            focusTarget: this.focusTarget,
            unhandledProps: unhandledProps
        };

        return !isNil(this.props.columnDefinition.cell)
          ? this.props.columnDefinition.cell(config)
          : DataGridCell.renderCell(config);
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        if (this.isDesiredFocusCell() && !isNil(this.rootElement.current)) {
            this.rootElement.current.focus();
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
     * returns true if this is the datagrid's current focus cell
     */
    private isDesiredFocusCell = (): boolean => {
        if (this.context === null) {
            return false;
        }
        return this.props.rowData[this.context.dataGridProps.dataRowKey] ===
            this.context.desiredFocusRowKey &&
            this.props.columnDefinition.columnDataKey ===
                this.context.desiredFocusColumnKey;
    };

    /**
     * returns true if this is the datagrid's current focus cell
     */
    private isFocusCell = (): boolean => {
        if (this.context === null) {
            return false;
        }
        return this.props.rowData[this.context.dataGridProps.dataRowKey] ===
            this.context.focusRowKey &&
            this.props.columnDefinition.columnDataKey === this.context.focusColumnKey
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
        const focusTargetElement: HTMLElement | Text = extractHtmlElement(
            this.focusTarget
        );
        if (focusTargetElement !== null && focusTargetElement instanceof HTMLElement) {
            focusTargetElement.focus();
        }
        this.context.onCellFocused(this.props, e);
    };
}

DataGridCell.contextType = DataGridContext;
export default DataGridCell;
export * from "./data-grid-cell.props";
export { DataGridCellClassNameContract };
