import * as React from "react";
import manageJss, { ComponentStyles, ICSSRules, IManagedJSSProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import BreakpointTracker from "../utilities/breakpoint-tracker";
import { Breakpoint, getValueByBreakpoint, identifyBreakpoint } from "../utilities/breakpoints";
import { canUseDOM, canUseViewport } from "exenv-es6";
import Foundation, { HandledProps, IFoundationProps } from "@microsoft/fast-components-foundation-react";
import { ColumnProps, IColumnHandledProps } from "./column.props";

export interface IColumnClassNamesContract {
    column: string;
}

const styles: ComponentStyles<IColumnClassNamesContract, undefined> = {
    column: {
        // Fixes issue found in firefox where columns that have overflow
        // or full width content cause scroll bars
        minWidth: "0"
    }
};

class Column extends Foundation<
    ColumnProps,
    React.HTMLAttributes<HTMLDivElement>,
    {}
> {
    /**
     * Define default props
     */
    public static defaultProps: Partial<IColumnHandledProps> = {
        span: 12
    };

    protected handledProps: HandledProps<ColumnProps> = {
        managedClasses: void 0,
        span: void 0,
        position: void 0,
        row: void 0,
        order: void 0,
        gutter: void 0
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
        if (this.shouldTrackBreakpoints(this.props) && !this.shouldTrackBreakpoints(previousProps)) {
            // If we should be tracking breakpoints but previously weren't, subscribe to changes
            BreakpointTracker.subscribe(this.update);
        } else if (!this.shouldTrackBreakpoints(this.props) && this.shouldTrackBreakpoints(previousProps)) {
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
        return super.generateClassNames(this.props.managedClasses.column);
    }

    /**
     * Gets a value from an array where the index retrieved is either the current break-point
     * or the nearest preceding break-point if no entry exists for the current break-point
     */
    private getValueByBreakpoint<T>(breakpointSet: T[]): T {
        if (!canUseDOM()) {
            return breakpointSet[0];
        }

        const breakpoint: Breakpoint = identifyBreakpoint(window.innerWidth);

        return breakpointSet.slice(0, breakpoint + 1).pop();
    }

    /**
     * Generates the column-span value
     */
    private generateColumnSpan(): number {
        if (typeof this.props.span === "number") {
            return this.props.span;
        }

        if (!canUseViewport() || !Array.isArray(this.props.span)) {
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

        return value === 1 ? 1 : (value * 2) - 1;
    }

    /**
     * Generates the style attribute of the column
     */
    private generateStyleAttribute(): React.CSSProperties {
        const position: number = this.generateColumnPosition();
        const row: string = this.generateRow();
        const span: number = this.generateColumnSpan();
        const gridColumnValue: string = [position, `span ${span}`].filter((item: string | number) => Boolean(item)).join(" / ");
        let order: number | null;

        if (!canUseDOM()) {
            order = Array.isArray(this.props.order) ? this.props.order[0] : this.props.order;
        } else {
            order = Array.isArray(this.props.order) ? this.getValueByBreakpoint(this.props.order) : this.props.order;
        }

        return Object.assign({}, this.unhandledProps().style, {
            gridColumn: gridColumnValue,
            gridRowStart: row,
            msGridColumn: this.augmentMsGrid(position),
            msGridColumnSpan: this.augmentMsGrid(span),
            msGridRow: row,
            order: typeof order === "number" ? order : null
        });
    }

    /**
     * Determines if we should be tracking breakpoints based on a set of props
     */
    private shouldTrackBreakpoints(props: ColumnProps): boolean {
        return Array.isArray(props.span) && props.span.length > 1 || Array.isArray(props.position) && props.position.length > 1;
    }

    /**
     * Force the component to update
     */
    private update = (): void => {
        this.forceUpdate();
    }
}

export default manageJss(styles)(Column);
