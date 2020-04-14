import React from "react";
import { canUseDOM } from "exenv-es6";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { canUseCssGrid, classNames } from "@microsoft/fast-web-utilities";
import BreakpointTracker from "../utilities/breakpoint-tracker";
import { Breakpoint, identifyBreakpoint } from "../utilities/breakpoints";
import { ColumnHandledProps, ColumnProps, ColumnUnhandledProps } from "./column.props";

export interface ColumnClassNamesContract {
    column?: string;
}
export class Column extends Foundation<ColumnHandledProps, ColumnUnhandledProps, {}> {
    public static displayName: string = "Column";

    /**
     * Define default props
     */
    public static defaultProps: Partial<ColumnProps> = {
        managedClasses: {},
        span: 12,
        defaultBreakpoint: 0,
    };

    protected handledProps: HandledProps<ColumnHandledProps> = {
        managedClasses: void 0,
        span: void 0,
        position: void 0,
        row: void 0,
        order: void 0,
        gutter: void 0,
        cssGridPropertyName: void 0,
        defaultBreakpoint: void 0,
    };

    /**
     * Component has mounted
     */
    public componentDidMount(): void {
        if (this.shouldTrackBreakpoints(this.props)) {
            BreakpointTracker.subscribe(this.update);
        }
    }

    /**
     * Component will be unmounted
     */
    public componentWillUnmount(): void {
        BreakpointTracker.unsubscribe(this.update);
    }

    /**
     * Component has updated
     */
    public componentDidUpdate(previousProps: ColumnProps): void {
        if (
            this.shouldTrackBreakpoints(this.props) &&
            !this.shouldTrackBreakpoints(previousProps)
        ) {
            // If we should be tracking breakpoints but previously weren't, subscribe to changes
            BreakpointTracker.subscribe(this.update);
        } else if (
            !this.shouldTrackBreakpoints(this.props) &&
            this.shouldTrackBreakpoints(previousProps)
        ) {
            // If we were tracking breakpoints but we shouldn't be now, unsubscribe from changes
            BreakpointTracker.unsubscribe(this.update);
        }
    }

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={this.generateStyleAttribute()}
            >
                {this.props.children}
            </div>
        );
    }
    /**
     * Generates the column classes
     */
    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.column));
    }

    /**
     * Gets a value from an array where the index retrieved is either the current break-point
     * or the nearest preceding break-point if no entry exists for the current break-point
     */
    private getValueByBreakpoint<T>(breakpointSet: T[]): T {
        const breakpoint: Breakpoint = canUseDOM()
            ? identifyBreakpoint(window.innerWidth)
            : this.props.defaultBreakpoint;

        return breakpointSet.slice(0, breakpoint + 1).pop();
    }

    /**
     * Generates the column-span value
     */
    private generateColumnSpan(): number {
        if (typeof this.props.span === "number") {
            return this.props.span;
        }

        if (!Array.isArray(this.props.span)) {
            return Column.defaultProps.span as number;
        }

        return this.getValueByBreakpoint(this.props.span);
    }

    /**
     * Generates the position of a column
     */
    private generateColumnPosition(): number | null {
        if (typeof this.props.position === "number") {
            return this.props.position;
        } else if (Array.isArray(this.props.position)) {
            return this.getValueByBreakpoint(this.props.position);
        }

        return null;
    }

    /**
     * Generates the row that a column should be placed in
     */
    private generateRow(): string | null {
        if (typeof this.props.row === "number") {
            return this.props.row.toString();
        } else if (Array.isArray(this.props.row)) {
            return this.getValueByBreakpoint(this.props.row).toString();
        }

        return null;
    }

    private augmentMsGrid(value: number | null): number {
        if (this.props.gutter === 0 || value === null) {
            return value;
        }

        return value === 1 ? 1 : value * 2 - 1;
    }

    /**
     * Generates the style attribute of the column
     */
    private generateStyleAttribute(): React.CSSProperties {
        const position: number = this.generateColumnPosition();
        const row: string = this.generateRow();
        const span: number = this.generateColumnSpan();
        const gridColumnValue: string = [position, `span ${span}`]
            .filter((item: string | number) => Boolean(item))
            .join(" / ");

        const order: number | null = Array.isArray(this.props.order)
            ? this.getValueByBreakpoint(this.props.order)
            : this.props.order;

        const canUseCssGridStyle: boolean =
            this.props.cssGridPropertyName === "grid"
                ? true
                : this.props.cssGridPropertyName === "-ms-grid"
                ? false
                : canUseCssGrid();

        const gridStyles: React.CSSProperties = canUseCssGridStyle
            ? {
                  gridColumn: gridColumnValue,
                  gridRowStart: row,
              }
            : {
                  ["msGridColumn" as any]: this.augmentMsGrid(position),
                  ["msGridColumnSpan" as any]: this.augmentMsGrid(span),
                  ["msGridRow" as any]: row,
              };

        return {
            ...gridStyles,
            order: typeof order === "number" ? order : null,
            // Fixes issue found in firefox where columns that have overflow
            // or full width content cause scroll bars
            minWidth: "0",
            ...this.unhandledProps().style,
        };
    }

    /**
     * Determines if we should be tracking breakpoints based on a set of props
     */
    private shouldTrackBreakpoints(props: ColumnProps): boolean {
        return (
            (Array.isArray(props.span) && props.span.length > 1) ||
            (Array.isArray(props.position) && props.position.length > 1)
        );
    }

    /**
     * Force the component to update
     */
    private update = (): void => {
        this.forceUpdate();
    };
}

export * from "./column.props";
