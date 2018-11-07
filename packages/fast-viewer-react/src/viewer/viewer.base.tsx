import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import rafThrottle from "raf-throttle";
import {
    ResizeHandleLocation,
    ViewerHandledProps,
    ViewerUnhandledProps,
} from "./viewer.props";
import {
    ViewerMessage,
    ViewerMessageTarget,
    ViewerMessageType,
} from "../utilities/message-system";

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

export default class Viewer extends Foundation<
    ViewerHandledProps,
    ViewerUnhandledProps,
    ViewerState
> {
    public static displayName: string = "Viewer";

    protected handledProps: HandledProps<ViewerHandledProps> = {
        managedClasses: void 0,
        iframeSrc: void 0,
        height: void 0,
        width: void 0,
        responsive: void 0,
    };

    private iframeRef: React.RefObject<HTMLIFrameElement>;

    constructor(props: ViewerHandledProps) {
        super(props);

        this.state = {
            resizing: false,
            dragReferenceY: null,
            dragReferenceX: null,
            dragHandleLocation: null,
        };

        this.iframeRef = React.createRef();
        this.handleMouseMove = rafThrottle(this.handleMouseMove);
    }

    /**
     * Handle when component updates
     */
    public componentDidUpdate(
        prevProps: ViewerHandledProps,
        prevState: ViewerState
    ): void {
        if (canUseDOM()) {
            if (this.state.resizing && !prevState.resizing) {
                document.addEventListener("mouseup", this.handleMouseUp);
                document.addEventListener("mousemove", this.handleMouseMove);
            } else if (!this.state.resizing && prevState.resizing) {
                document.removeEventListener("mouseup", this.handleMouseUp);
                document.removeEventListener("mousemove", this.handleMouseMove);
            }

            this.updateMessage();
        }
    }

    public componentDidMount(): void {
        if (canUseDOM() && this.props.viewerContentProps) {
            this.iframeRef.current.contentWindow.addEventListener(
                "message",
                this.handleMessage
            );
        }
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.viewer}>
                <div
                    className={this.generateContentRegionClassNames()}
                    style={{
                        ...this.getHeight(),
                        ...this.getWidth(),
                    }}
                >
                    {this.renderResponsiveLeftHandle()}
                    <base target="_blank" />
                    <iframe
                        ref={this.iframeRef}
                        style={{ border: "none", width: "100%", height: "100%" }}
                        src={this.props.iframeSrc}
                    >
                        Your browser does not support iframes.
                    </iframe>
                    {this.renderResponsiveRightHandle()}
                    {this.renderResponsiveBottomRow()}
                </div>
            </div>
        );
    }

    private renderResponsiveLeftHandle(): JSX.Element {
        if (this.props.responsive) {
            return (
                <button
                    className={`${this.props.managedClasses.handle} ${
                        this.props.managedClasses.handle__left
                    }`}
                    onMouseDown={this.handleMouseDown(ResizeHandleLocation.left)}
                />
            );
        }
    }

    private renderResponsiveRightHandle(): JSX.Element {
        if (this.props.responsive) {
            return (
                <button
                    className={`${this.props.managedClasses.handle} ${
                        this.props.managedClasses.handle__right
                    }`}
                    onMouseDown={this.handleMouseDown(ResizeHandleLocation.right)}
                />
            );
        }
    }

    private renderResponsiveBottomRow(): JSX.Element {
        if (this.props.responsive) {
            return (
                <React.Fragment>
                    <button
                        className={`${this.props.managedClasses.handle} ${
                            this.props.managedClasses.handle__bottomLeft
                        }`}
                        onMouseDown={this.handleMouseDown(
                            ResizeHandleLocation.bottomLeft
                        )}
                    />
                    <button
                        className={`${this.props.managedClasses.handle} ${
                            this.props.managedClasses.handle__bottom
                        }`}
                        aria-hidden={true}
                        onMouseDown={this.handleMouseDown(ResizeHandleLocation.bottom)}
                    />
                    <button
                        className={`${this.props.managedClasses.handle} ${
                            this.props.managedClasses.handle__bottomRight
                        }`}
                        onMouseDown={this.handleMouseDown(
                            ResizeHandleLocation.bottomRight
                        )}
                    />
                </React.Fragment>
            );
        }
    }

    private updateMessage(): void {
        const updateMessage: ViewerMessage = {
            type: ViewerMessageType.updateComponentData,
            target: ViewerMessageTarget.viewerContent,
            componentData: this.props.viewerContentProps,
        };

        this.postMessage(updateMessage);
    }

    private getHeight(): any {
        if (this.props.height) {
            return {
                height: `${this.props.height}px`,
            };
        }
    }

    private getWidth(): any {
        if (this.props.width) {
            return {
                width: `${this.props.width}px`,
            };
        }
    }

    private generateContentRegionClassNames(): string {
        let classes: string = this.props.managedClasses.viewer_contentRegion;

        if (this.state.resizing) {
            classes += ` ${this.props.managedClasses.viewer_contentRegion__disabled}`;
        }

        return classes;
    }

    private postMessage(message: ViewerMessage): void {
        if (canUseDOM() && get(this.iframeRef, "current.contentWindow")) {
            this.iframeRef.current.contentWindow.postMessage(
                JSON.stringify(message),
                "*"
            );
        }
    }

    private handleMessage = (e: MessageEvent): void => {
        const message: ViewerMessage =
            typeof e.data === "string" ? JSON.parse(e.data) : undefined;

        if (message && message.target === ViewerMessageTarget.viewer) {
            switch (message.type) {
                case ViewerMessageType.initializeComponent:
                    const initMessage: ViewerMessage = {
                        type: ViewerMessageType.initializeComponent,
                        target: ViewerMessageTarget.viewerContent,
                        componentData: this.props.viewerContentProps,
                    };

                    this.postMessage(initMessage);
                    break;
            }
        }
    };

    /**
     * Handle mouseUp
     */
    private handleMouseUp = (e: MouseEvent): void => {
        // only listen for left click
        if (e.button !== 0) {
            return;
        }

        this.setState({
            resizing: false,
            dragReferenceY: null,
            dragReferenceX: null,
            dragHandleLocation: null,
        });
    };

    private handleMouseMove = (e: MouseEvent): void => {
        if (!this.state.resizing) {
            return;
        }

        const heightOffset: number = this.state.dragReferenceY - e.pageY;
        const widthOffset: number = (this.state.dragReferenceX - e.pageX) * 2;
        const updatedHeight: number = this.props.height - heightOffset;
        const updatedWidthLeft: number = this.props.width + widthOffset;
        const updatedWidthRight: number = this.props.width - widthOffset;

        switch (this.state.dragHandleLocation) {
            case ResizeHandleLocation.bottom:
                this.setState({
                    dragReferenceY: e.pageY,
                });

                this.handleUpdateHeight(updatedHeight);
                break;
            case ResizeHandleLocation.bottomLeft:
                this.setState({
                    dragReferenceY: e.pageY,
                    dragReferenceX: e.pageX,
                });

                this.handleUpdateHeight(updatedHeight);
                this.handleUpdateWidth(updatedWidthLeft);
                break;
            case ResizeHandleLocation.bottomRight:
                this.setState({
                    dragReferenceY: e.pageY,
                    dragReferenceX: e.pageX,
                });

                this.handleUpdateHeight(updatedHeight);
                this.handleUpdateWidth(updatedWidthRight);
                break;
            case ResizeHandleLocation.left:
                this.setState({
                    dragReferenceX: e.pageX,
                });

                this.handleUpdateWidth(updatedWidthLeft);
                break;
            case ResizeHandleLocation.right:
                this.setState({
                    dragReferenceX: e.pageX,
                });

                this.handleUpdateWidth(updatedWidthRight);
                break;
        }
    };

    private handleMouseDown = (
        handleLocation: ResizeHandleLocation
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            // only listen for left click
            if (e.button !== 0) {
                return;
            }

            switch (handleLocation) {
                case ResizeHandleLocation.bottom:
                    this.handleBottomMouseDown(e);
                    break;
                case ResizeHandleLocation.bottomRight:
                    this.handleBottomRightMouseDown(e);
                    break;
                case ResizeHandleLocation.bottomLeft:
                    this.handleBottomLeftMouseDown(e);
                    break;
                case ResizeHandleLocation.left:
                    this.handleLeftMouseDown(e);
                    break;
                case ResizeHandleLocation.right:
                    this.handleRightMouseDown(e);
                    break;
            }
        };
    };

    private handleBottomMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
        this.setState({
            resizing: true,
            dragReferenceY: e.pageY,
            dragHandleLocation: ResizeHandleLocation.bottom,
        });
    };

    private handleBottomRightMouseDown = (
        e: React.MouseEvent<HTMLButtonElement>
    ): void => {
        this.setState({
            resizing: true,
            dragReferenceY: e.pageY,
            dragReferenceX: e.pageX,
            dragHandleLocation: ResizeHandleLocation.bottomRight,
        });
    };

    private handleBottomLeftMouseDown = (
        e: React.MouseEvent<HTMLButtonElement>
    ): void => {
        this.setState({
            resizing: true,
            dragReferenceY: e.pageY,
            dragReferenceX: e.pageX,
            dragHandleLocation: ResizeHandleLocation.bottomLeft,
        });
    };

    private handleLeftMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
        this.setState({
            resizing: true,
            dragReferenceX: e.pageX,
            dragHandleLocation: ResizeHandleLocation.left,
        });
    };

    private handleRightMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
        this.setState({
            resizing: true,
            dragReferenceX: e.pageX,
            dragHandleLocation: ResizeHandleLocation.right,
        });
    };

    private handleUpdateHeight(height: number): void {
        if (this.props.onUpdateHeight) {
            this.props.onUpdateHeight(height);
        }
    }

    private handleUpdateWidth(width: number): void {
        if (this.props.onUpdateWidth) {
            this.props.onUpdateWidth(width);
        }
    }
}
