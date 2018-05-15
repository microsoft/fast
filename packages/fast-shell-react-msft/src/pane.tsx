import * as React from "react";
import { throttle } from "lodash";
import { IPaneProps } from "./pane.props";
import { west } from "./row";
import rafThrottle from "raf-throttle";
import { toPx } from "./utilities";

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

class Pane extends React.Component<IPaneProps, IPaneState> {
    /**
     * The default props of the Pane component
     */
    public static defaultProps: IPaneProps = {
        minWidth: 100,
        maxWidth: 800,
        width: void(0),
        id: void(0),
        resizable: false,
        collapsed: false,
        onWidthChange: void(0),
        overlay: false,
        hidden: false,
        resizeFrom: void(0),
    };

    /**
     * The width of a pane when it is collapsed
     */
    private static collapsedWidth: number = 48;

    /**
     * Stores a reference to the pane HTML element
     */
    private ref: HTMLElement;

    constructor(props: IPaneProps) {
        super(props);

        this.state = {
            resizing: false,
            dragReference: null,
            width: 300
        };

        this.onMouseMove    = throttle(this.onMouseMove, 16);
        this.onWindowResize = rafThrottle(this.onWindowResize);
    }

    /**
     * Return the width of Pane. Sources from props first, and then state if props.width is undefined
     * @name width
     * @type {function}
     * @returns {number}
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
    public componentDidUpdate(prevProps: IPaneProps, prevState: IPaneState): void {
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

        return styles;
    }

    /**
     * Render the resize button
     */
    public renderResizeControl(): React.ReactElement<HTMLButtonElement> {
        if (!this.props.resizable || this.props.collapsed) {
            return null;
        }

        return ( <button aria-hidden={true} onMouseDown={this.onMouseDown}/>);
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
        this.setWidth(this.ref.clientWidth);
    }

    // TODO: update this with react refs
    public storeRef = (ref: any): void => {
        if (!!ref) {
            this.ref = ref;
        }
    }

    public setWidth(width: number): void {
        this.setState({
            width
        });
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                // TODO: {...this.unhandledProps()}
                data-grid-app="pane"
                data-grid-app-resize-from={this.props.resizeFrom}
                data-grid-app-collapsed={this.props.collapsed}
                data-grid-app-overlay={this.props.overlay}
                style={this.generateStyleAttribute()}
                ref={this.storeRef}
                id={this.props.id}
                arai-hidden={this.props.hidden}
            >
                {this.props.children}
                {this.renderResizeControl()}
            </div>
        );
    }
}

export default Pane;
export { IPaneProps };
