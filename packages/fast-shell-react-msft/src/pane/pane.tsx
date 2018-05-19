import * as React from "react";
import { throttle } from "lodash";
import { IPaneHandledProps, IPaneUnhandledProps, PaneProps, PaneResizeDirection } from "./pane.props";
import { west } from "../row";
import rafThrottle from "raf-throttle";
import { toPx } from "../utilities";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Foundation, { IFoundationProps } from "../foundation";

/**
 * The interface for the Pane's state object
 */
export interface IPaneState {
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

export interface IPaneClassNamesContract {
    pane: string;
    pane_resizeHandle: string;
    pane__resizeWest: string;
    pane__resizeEast: string;
    pane__overlay: string;
    pane__hidden: string;
}

const paneStyleSheet: ComponentStyles<IPaneClassNamesContract, undefined> = {
    pane: {
        position: "relative",
        flex: "0 1 auto",
        display: "flex",
        flexDirection: "column"
    },
    pane_resizeHandle: {
        position: "absolute",
        padding: "0",
        opacity: "0",
        top: "0",
        width: "8px",
        height: "100%",
        zIndex: "1",
        transition: "transform .04s ease-in-out",
        outline: "none",
        transform: "scale(.5, 1)",
        "&:hover": {
            cursor: "ew-resize"
        },
        "&:active": {
            opacity: "1", transform: "scale(1)"
        }
    },
    pane__resizeWest: {
        "& $pane_resizeHandle": {
            left: "-4px"
        }
    },
    pane__resizeEast: {
        "& $pane_resizeHandle": {
            right: "-4px"
        }
    },
    pane__overlay: {
        position: "absolute",
        height: "100%",
        zIndex: "2"
    },
    pane__hidden: {
        display: "none"
    }
};

class Pane extends Foundation<PaneProps, IPaneState> {
    /**
     * The default props of the Pane component
     */
    public static defaultProps: IPaneHandledProps = {
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
    protected handledProps: IPaneHandledProps & IManagedClasses<IPaneClassNamesContract> = {
        minWidth: void 0,
        maxWidth: void 0,
        width: void 0,
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

    constructor(props: PaneProps) {
        super(props);

        this.state = {
            resizing: false,
            dragReference: null,
            width: 300
        };

        this.onMouseMove    = throttle(this.onMouseMove, 16);
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
        window.addEventListener("resize", this.onWindowResize);
    }

    /**
     * Handle when component is removed from the DOM
     */
    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.onWindowResize);
    }

    /**
     * Handle when component updates
     */
    public componentDidUpdate(prevProps: PaneProps, prevState: IPaneState): void {
        if ( this.state.resizing && !prevState.resizing ) {
            document.addEventListener("mouseup", this.onMouseUp);
            document.addEventListener("mousemove", this.onMouseMove);
        } else if ( !this.state.resizing && prevState.resizing ) {
            document.removeEventListener("mouseup", this.onMouseUp);
            document.removeEventListener("mousemove", this.onMouseMove);
        }
    }

    /**
     * Gets the generated width of the grid pane depending on minWidth, maxWidth, and collapsed state.
     */
    public getWidth(): number {
        if ( this.props.collapsed) {
            return Pane.collapsedWidth;
        } else if ( this.width() < this.props.minWidth ) {
            return this.props.minWidth;
        } else if ( this.width() > this.props.maxWidth ) {
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

        if (this.props.collapsed) {
            styles.minWidth = toPx(Pane.collapsedWidth);
        } else if (this.props.resizable) {
            styles.minWidth = toPx(this.props.minWidth);
        } else {
            styles.minWidth = width;
        }

        if (this.props.overlay) {
            styles.width = width;
        } else {
            styles.flexBasis = width;
        }

        return this.props.style
            ? Object.assign(styles, this.props.style)
            : styles;
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
        if ( e.button !== 0 ) {
            return;
        }

        this.setState({
            resizing: true,
            dragReference: e.pageX
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

        const offset: number = this.state.dragReference - e.pageX;
        const updatedWidth: number = this.props.resizeFrom === west ? this.width() + offset : this.width() - offset;

        if (updatedWidth <= this.props.minWidth || updatedWidth >= this.props.maxWidth) {
            return;
        }

        this.setState({
            dragReference: e.pageX
        });

        this.setWidth(updatedWidth);
    }

    public onWindowResize = (e: UIEvent): void => {
        this.setWidth(this.rootElement.current.clientWidth);
    }

    public setWidth(width: number): void {
        this.setState({
            width
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
        let classes: string = this.props.managedClasses.pane;

        if (this.props.resizeFrom === PaneResizeDirection.east) {
            classes = `${classes} ${this.props.managedClasses.pane__resizeEast}`;
        } else if (this.props.resizeFrom === PaneResizeDirection.west) {
            classes = `${classes} ${this.props.managedClasses.pane__resizeWest}`;
        }

        if (this.props.overlay) {
            classes = `${classes} ${this.props.managedClasses.pane__overlay}`;
        }

        if (this.props.hidden) {
            classes = `${classes} ${this.props.managedClasses.pane__hidden}`;
        }

        return super.generateClassNames(classes);
    }
}

export default manageJss(paneStyleSheet)(Pane);
