import * as React from "react";
import { throttle } from "lodash-es";
import Canvas from "../canvas";
import rafThrottle from "raf-throttle";
import { RowHandledProps, RowProps, RowResizeDirection } from "./row.props";
import { toPx } from "@microsoft/fast-jss-utilities";
import manageJss, { ComponentStyles, ManagedClasses, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import Foundation, { FoundationProps, HandledProps } from "@microsoft/fast-components-foundation-react";
import { canUseDOM } from "exenv-es6";
import { joinClasses } from "../utilities";

export const east: string  = "east";
export const west: string = "west";
export const north: string  = "north";
export const south: string = "south";

/**
 * The interface for the Row's state object
 */
export interface RowState {
    /**
     * Signifies if the row is currently being resized
     */
    resizing: boolean;

    /**
     * The y-position where users started resizing the row
     */
    dragReference: number;

    /**
     * The height of the row
     */
    height: number;
}

export interface RowClassNamesContract {
    row?: string;
    row__fill?: string;
    row_resizeHandle?: string;
    row__resizeNorth?: string;
    row__resizeSouth?: string;
    row__overlay?: string;
    row__hidden?: string;
}

const rowStyleSheet: ComponentStyles<RowClassNamesContract, undefined> = {
    row: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        flexBasis: "auto"
    },
    row__fill: {
        flex: "1",
        overflow: "hidden"
    },
    row_resizeHandle: {
        position: "absolute",
        padding: "0",
        opacity: "0",
        left: "0",
        height: toPx(8),
        width: "100%",
        zIndex: "1",
        transition: "transform .04s ease-in-out",
        outline: "none",
        transform: "scale(1, .5)",
        "&:hover": {
            cursor: "ns-resize"
        },
        "&:active": {
            opacity: "1", transform: "scale(1)"
        }
    },
    row__resizeNorth: {
        "& $row_resizeHandle": {
            top: "-4px"
        }
    },
    row__resizeSouth: {
        "& $row_resizeHandle": {
            bottom: "-4px"
        }
    },
    row__overlay: {
        position: "absolute",
        width: "100%",
        zIndex: "2"
    },
    row__hidden: {
        display: "none"
    }
};

/**
 * Grid Row - use this to create rows of pane/canvas content or other content.
 */
class Row extends Foundation<
    RowProps,
    React.HTMLAttributes<HTMLDivElement>,
    RowState
> {
    public static defaultProps: RowHandledProps = {
        fill: false,
        minHeight: 40,
        maxHeight: 800,
        resizable: false,
        collapsed: false,
        overlay: false,
        hidden: false,
    };

    /**
     * The height of a row when it is collapsed
     */
    private static collapsedHeight: number = 40;

    protected handledProps: HandledProps<RowProps> = {
        fill: void 0,
        minHeight: void 0,
        maxHeight: void 0,
        height: void 0,
        resizable: void 0,
        id: void 0,
        collapsed: void 0,
        overlay: void 0,
        hidden: void 0,
        resizeFrom: void 0,
        managedClasses: void 0
    };

    /**
     * Stores a reference to the pane HTML element
     */
    private rootElement: React.RefObject<HTMLDivElement>;

    constructor(props: RowProps) {
        super(props);

        this.state = {
            resizing: false,
            dragReference: null,
            height: this.props.minHeight || 300
        };

        this.onMouseMove    = throttle(this.onMouseMove, 16);
        this.rootElement = React.createRef();
    }

    /**
     * Return the height of row. Sources from props first, and then state if props.height is undefined
     */
    public height(): number {
        return this.props.height || this.state.height;
    }

    /**
     * Handle when component updates
     */
    public componentDidUpdate(prevProps: RowProps, prevState: RowState): void {
        if (canUseDOM()) {
            if (this.state.resizing && !prevState.resizing) {
                document.addEventListener("mouseup", this.onMouseUp);
                document.addEventListener("mousemove", this.onMouseMove);
            } else if (!this.state.resizing && prevState.resizing) {
                document.removeEventListener("mouseup", this.onMouseUp);
                document.removeEventListener("mousemove", this.onMouseMove);
            }
        }
    }

    /**
     * Gets the generated height of the grid row depending on minHeight, maxHeight, and collapsed state.
     */
    public getHeight(): number {
        if (this.props.collapsed) {
            return Row.collapsedHeight;
        } else if (this.height() <= this.props.minHeight) {
            return this.props.minHeight;
        } else if (this.height() >= this.props.maxHeight) {
            return this.props.maxHeight;
        } else {
            return this.height();
        }
    }

    /**
     * generates the inline style property
     */
    public generateStyleAttribute(): React.CSSProperties {
        const height: string = toPx(this.getHeight());
        const styles: React.CSSProperties = {};

        styles.minHeight =
            this.props.collapsed
            ? Row.collapsedHeight
            : this.props.resizable
            ? toPx(this.props.minHeight)
            : height;

        if (this.props.overlay) {
            styles.height = height;
        } else {
            styles.flexBasis = height;
        }

        return Object.assign(styles, this.props.style);
    }

    /**
     * Render the resize button
     */
    public renderResizeControl(): React.ReactElement<HTMLButtonElement> {
        if (!this.props.resizable || this.props.collapsed) {
            return null;
        }

        return (
            <button
                className={this.props.managedClasses.row_resizeHandle}
                aria-hidden={true}
                onMouseDown={this.onMouseDown}
            />
        );
    }

    /**
     * Handle mouseDown
     */
    public onMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
        // only listen for left click
        if (e.button !== 0) {
            return;
        }

        this.setState({
            resizing: true,
            dragReference: e.pageY
        });
    }

    /**
     * Handle mouseUp
     */
    public onMouseUp = (e: MouseEvent): void => {
        // only listen for left click
        if (e.button !== 0) {
            return;
        }

        this.setState({
            resizing: false,
            dragReference: null
        });
    }

    public onMouseMove = (e: MouseEvent): void => {
        if (!this.state.resizing) {
            return;
        }

        const offset: number = this.state.dragReference - e.pageY;
        const updatedHeight: number = this.props.resizeFrom === north ? this.height() + offset : this.height() - offset;

        if (updatedHeight <= this.props.minHeight || updatedHeight >= this.props.maxHeight) {
            return;
        }

        this.setState({
            dragReference: e.pageY
        });

        this.setHeight(updatedHeight);
    }

    public setHeight(height: number): void {
        this.setState({
            height
        });
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={this.generateStyleAttribute()}
                ref={this.rootElement}
                id={this.props.id}
                aria-hidden={this.props.hidden}
            >
                {this.props.children}
                {this.renderResizeControl()}
            </div>
        );
    }

    protected generateClassNames(): string {
        const {
            row,
            row__fill,
            row__resizeNorth,
            row__resizeSouth,
            row__overlay,
            row__hidden
        }: RowClassNamesContract = this.props.managedClasses;
        const resizeFrom: RowResizeDirection = this.props.resizeFrom;

        let classes: string = joinClasses(resizeFrom === RowResizeDirection.north, row, row__resizeNorth);
        classes = joinClasses(resizeFrom === RowResizeDirection.south, classes, row__resizeSouth);
        classes = joinClasses(this.props.overlay, classes, row__overlay);
        classes = joinClasses(this.props.hidden, classes, row__hidden);
        classes = joinClasses(this.props.fill, classes, row__fill);

        return super.generateClassNames(classes);
    }

}

export default manageJss(rowStyleSheet)(Row);
