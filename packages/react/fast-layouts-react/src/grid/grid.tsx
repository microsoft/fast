import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { canUseCssGrid, classNames } from "@microsoft/fast-web-utilities";
import { toPx } from "@microsoft/fast-jss-utilities";
import BreakpointTracker from "../utilities/breakpoint-tracker";
import { getValueByBreakpoint } from "../utilities/breakpoints";
import { GridDisplay } from "../utilities";
import { Column } from "../column";
import {
    GridAlignment,
    GridHandledProps,
    GridProps,
    GridTag,
    GridUnhandledProps,
} from "./grid.props";

export interface GridClassNamesContract {
    grid?: string;
}

export class Grid extends Foundation<GridHandledProps, GridUnhandledProps, {}> {
    /**
     * Stores HTML tag for use in render
     */
    private get tag(): any {
        return this.generateHTMLTag();
    }
    public static displayName: string = "Grid";

    public static defaultProps: Partial<GridProps> = {
        tag: GridTag.div,
        gridColumn: 2,
        gutter: 8,
        verticalAlign: GridAlignment.stretch,
        horizontalAlign: GridAlignment.stretch,
        columnCount: 12,
        managedClasses: {},
    };

    private static display: GridDisplay = canUseCssGrid() ? "grid" : "-ms-grid";

    protected handledProps: HandledProps<GridHandledProps> = {
        columnCount: void 0,
        gridColumn: void 0,
        gutter: void 0,
        horizontalAlign: void 0,
        managedClasses: void 0,
        tag: void 0,
        verticalAlign: void 0,
        cssGridPropertyName: void 0,
    };

    /**
     * Renders the Grid markup
     */
    public render(): JSX.Element {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={this.generateStyleAttributes()}
            >
                {this.renderChildren()}
            </this.tag>
        );
    }

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
    public componentDidUpdate(previousProps: GridProps): void {
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

    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.grid));
    }

    /**
     * Determines if we should be tracking breakpoints based on a set of props
     */
    private shouldTrackBreakpoints(props: GridProps): boolean {
        return Array.isArray(props.gutter) && props.gutter.length > 1;
    }

    /**
     * Generates the column-span value
     */
    private generateGutter(): number {
        if (typeof this.props.gutter === "number") {
            return this.props.gutter;
        } else if (Array.isArray(this.props.gutter)) {
            return getValueByBreakpoint(this.props.gutter);
        }

        return null;
    }

    private generateAlignment(alignment: GridAlignment): string {
        return GridAlignment[alignment];
    }

    /**
     * Force the component to update
     */
    private update = (): void => {
        this.forceUpdate();
    };

    private generateStyleAttributes(): React.CSSProperties {
        const displayStyle: GridDisplay = this.props.cssGridPropertyName || Grid.display;
        return {
            display: displayStyle,
            ...(displayStyle === "grid" ? this.cssGridStyles() : this.msGridStyles()),
            ...this.unhandledProps().style,
        };
    }

    private cssGridStyles(): React.CSSProperties {
        return {
            alignItems: this.generateAlignment(this.props.verticalAlign),
            gridAutoRows: "auto",
            gridColumn: this.props.gridColumn,
            gridColumnGap: `${this.generateGutter()}px`,
            gridRow: this.props.row,
            gridTemplateColumns: `repeat(${this.props.columnCount}, 1fr)`,
            justifyItems: this.generateAlignment(this.props.horizontalAlign),
        };
    }

    private msGridStyles(): React.CSSProperties {
        return {
            msGridColumns: `1fr (${toPx(this.generateGutter())} 1fr)[${
                this.props.columnCount - 1
            }]`,
            ["msGridRow" as any]: this.props.row,
            ["msGridColumn" as any]: this.props.gridColumn,
        };
    }

    /**
     * Creates tags for rendering based on href
     */
    private generateHTMLTag(): string {
        return GridTag[this.props.tag] || GridTag.div;
    }

    private renderChildren(): React.ReactNode | React.ReactNode[] {
        // We only need to communicate gutters size to ms-grid columns because
        // css grid gives us a css property to set for gutter. If we support
        // css grid, we can safely return children w/o gutter augmentation.
        if (canUseCssGrid()) {
            return this.props.children;
        }

        return React.Children.map(
            this.props.children,
            (child: React.ReactNode | React.ReactNode[]) => {
                if (
                    !child ||
                    (child as any).type !== Column ||
                    (child as any).props.gutter
                ) {
                    return child;
                }

                return React.cloneElement(
                    child as any,
                    { gutter: this.props.gutter },
                    (child as any).props.children
                );
            }
        );
    }
}

export * from "./grid.props";
