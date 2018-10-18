import * as React from "react";
import { throttle } from "lodash-es";
import {
    PaneHandledProps,
    PaneProps,
    PaneResizeDirection,
    PaneUnhandledProps,
} from "./pane.props";
import { west } from "../row";
import rafThrottle from "raf-throttle";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { canUseDOM } from "exenv-es6";
import { joinClasses } from "../utilities";

/**
 * The interface for the Pane's state object
 */
export interface PaneState {
    /**
     * Signifies if the pane is currently being resized
     */
    resizing: boolean;

    /**
     * The x-position where users started resizing the pane
     */
    dragReference: number;

    /**
     * The width of the pane
     */
    width: number;
}

export interface PaneClassNamesContract {
    pane?: string;
    pane_resizeHandle?: string;
    pane__resizeWest?: string;
    pane__resizeEast?: string;
    pane__overlay?: string;
    pane__hidden?: string;
}

export const paneStyleSheet: ComponentStyles<PaneClassNamesContract, undefined> = {
    pane: {
        position: "relative",
        flex: "0 1 auto",
        display: "flex",
        flexDirection: "column",
    },
    pane_resizeHandle: {
        position: "absolute",
        padding: "0",
        opacity: "0",
        top: "0",
        width: toPx(8),
        height: "100%",
        zIndex: "1",
        transition: "transform .04s ease-in-out",
        outline: "none",
        transform: "scale(.5, 1)",
        "&:hover": {
            cursor: "ew-resize",
        },
        "&:active": {
            opacity: "1",
            transform: "scale(1)",
        },
    },
    pane__resizeWest: {
        "& $pane_resizeHandle": {
            left: "-4px",
        },
    },
    pane__resizeEast: {
        "& $pane_resizeHandle": {
            right: "-4px",
        },
    },
    pane__overlay: {
        position: "absolute",
        height: "100%",
        zIndex: "2",
    },
    pane__hidden: {
        display: "none",
    },
};

export class Pane extends Foundation<PaneHandledProps, PaneUnhandledProps, PaneState> {
    /**
     * The default props of the Pane component
     */
    public static defaultProps: Partial<PaneProps> = {
        minWidth: 100,
        maxWidth: 800,
        resizable: false,
        collapsed: false,
        overlay: false,
        hidden: false,
    };

    /**
     * The width of a pane when it is collapsed
     */
    private static collapsedWidth: number = 40;

    /**
     * All handled props
     */
    protected handledProps: HandledProps<PaneHandledProps> = {
        minWidth: void 0,
        maxWidth: void 0,
        width: void 0,
        resizable: void 0,
        id: void 0,
        collapsed: void 0,
        overlay: void 0,
        hidden: void 0,
        resizeFrom: void 0,
        managedClasses: void 0,
    };
    /**
     * Stores a reference to the pane HTML element
     */
    private rootElement: React.RefObject<HTMLDivElement>;

    constructor(props: PaneProps) {
        super(props);

        this.state = {
            resizing: false,
            dragReference: null,
            width: 300,
        };

        this.onMouseMove = throttle(this.onMouseMove, 16);
        this.onWindowResize = rafThrottle(this.onWindowResize);
        this.rootElement = React.createRef();
    }

    /**
     * Return the width of Pane. Sources from props first, and then state if props.width is undefined
     */
    public width(): number {
        return this.props.width || this.state.width;
    }

    /**
     * Handle when component is mounted to the DOM
     */
    public componentDidMount(): void {
        if (canUseDOM()) {
            window.addEventListener("resize", this.onWindowResize);
        }
    }

    /**
     * Handle when component is removed from the DOM
     */
    public componentWillUnmount(): void {
        if (canUseDOM()) {
            window.removeEventListener("resize", this.onWindowResize);
        }
    }

    /**
     * Handle when component updates
     */
    public componentDidUpdate(prevProps: PaneProps, prevState: PaneState): void {
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
     * Gets the generated width of the grid pane depending on minWidth, maxWidth, and collapsed state.
     */
    public getWidth(): number {
        if (this.props.collapsed) {
            return Pane.collapsedWidth;
        } else if (this.width() < this.props.minWidth) {
            return this.props.minWidth;
        } else if (this.width() > this.props.maxWidth) {
            return this.props.maxWidth;
        } else {
            return this.width();
        }
    }

    /**
     * generates the inline style property
     */
    public generateStyleAttribute(): React.CSSProperties {
        const width: string = toPx(this.getWidth());
        const styles: React.CSSProperties = {};

        styles.minWidth = this.props.collapsed
            ? Pane.collapsedWidth
            : this.props.resizable
                ? toPx(this.props.minWidth)
                : width;

        if (this.props.overlay) {
            styles.width = width;
        } else {
            styles.flexBasis = width;
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
                className={this.props.managedClasses.pane_resizeHandle}
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
            dragReference: e.pageX,
        });
    };

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
            dragReference: null,
        });
    };

    public onMouseMove = (e: MouseEvent): void => {
        if (!this.state.resizing) {
            return;
        }

        const offset: number = this.state.dragReference - e.pageX;
        const updatedWidth: number =
            this.props.resizeFrom === west
                ? this.width() + offset
                : this.width() - offset;

        if (updatedWidth <= this.props.minWidth || updatedWidth >= this.props.maxWidth) {
            return;
        }

        this.setState({
            dragReference: e.pageX,
        });

        this.setWidth(updatedWidth);
    };

    public onWindowResize = (e: UIEvent): void => {
        this.setWidth(this.rootElement.current.clientWidth);
    };

    public setWidth(width: number): void {
        this.setState({
            width,
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
            pane,
            pane__resizeEast,
            pane__resizeWest,
            pane__overlay,
            pane__hidden,
        }: PaneClassNamesContract = this.props.managedClasses;
        const resizeFrom: PaneResizeDirection = this.props.resizeFrom;

        let classes: string = joinClasses(
            resizeFrom === PaneResizeDirection.east,
            pane,
            pane__resizeEast
        );
        classes = joinClasses(
            resizeFrom === PaneResizeDirection.west,
            classes,
            pane__resizeWest
        );
        classes = joinClasses(this.props.overlay, classes, pane__overlay);
        classes = joinClasses(this.props.hidden, classes, pane__hidden);

        return super.generateClassNames(classes);
    }
}

export * from "./pane.props";
