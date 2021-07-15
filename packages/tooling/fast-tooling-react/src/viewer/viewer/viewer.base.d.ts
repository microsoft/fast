/// <reference types="react" />
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ResizeHandleLocation,
    ViewerHandledProps,
    ViewerUnhandledProps,
} from "./viewer.props";
export interface ViewerState {
    /**
     * Signifies if the content region is currently being resized
     */
    resizing: boolean;
    /**
     * The y-position where users started resizing the content region
     */
    dragReferenceY: number;
    /**
     * The x-position where users started resizing the content region
     */
    dragReferenceX: number;
    /**
     * The drag handle location
     */
    dragHandleLocation: ResizeHandleLocation;
}
export declare class Viewer extends Foundation<
    ViewerHandledProps,
    ViewerUnhandledProps,
    ViewerState
> {
    static displayName: string;
    protected handledProps: HandledProps<ViewerHandledProps>;
    private messageSystemConfig;
    private iframeRef;
    constructor(props: ViewerHandledProps);
    /**
     * Handle when component updates
     */
    componentDidUpdate(prevProps: ViewerHandledProps, prevState: ViewerState): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): JSX.Element;
    private renderResponsiveLeftHandle;
    private renderResponsiveRightHandle;
    private renderResponsiveBottomRow;
    private shouldUpdateResizingEventListeners;
    private getHeight;
    private getWidth;
    private generateContentRegionClassNames;
    private postMessage;
    private handleIframeMessage;
    private handleMessageSystem;
    /**
     * Handle mouseUp
     */
    private handleMouseUp;
    private handleMouseMove;
    private handleMouseDown;
    private handleBottomMouseDown;
    private handleBottomRightMouseDown;
    private handleBottomLeftMouseDown;
    private handleLeftMouseDown;
    private handleRightMouseDown;
    private handleUpdateHeight;
    private handleUpdateWidth;
}
