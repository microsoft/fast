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

        if (!isNil(this.props.columnDefinition.cell)) {
            return this.props.columnDefinition.cell(
                this.props,
                this.generateClassNames(),
                this.props.columnDefinition.columnDataKey,
                this.rootElement,
                this.focusTarget,
                unhandledProps
            );
        } else {
            return this.defaultCellRenderFunction(
                this.props,
                this.generateClassNames(),
                this.props.columnDefinition.columnDataKey,
                this.rootElement,
                this.focusTarget,
                unhandledProps
            );
        }
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        if (this.isDesiredFocusCell() && this.rootElement.current !== null) {
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
     * The default function that renders an unstyled content display
     */
    public defaultCellRenderFunction = (
        props: DataGridCellProps,
        className: string,
        cellId: React.ReactText,
        rootElement: React.RefObject<any>,
        focusTarget: React.RefObject<any>,
        unhandledProps: object
    ): React.ReactNode => {
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
                {props.rowData[props.columnDefinition.columnDataKey]}
            </div>
        );
    };

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
                this.context.desiredFocusColumnKey
            ? true
            : false;
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
