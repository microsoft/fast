import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import rafThrottle from "raf-throttle";
import { ResizeHandleLocation, ViewerCustomAction } from "./viewer.props";
import { MessageSystemType } from "@microsoft/fast-tooling";
export class Viewer extends Foundation {
    constructor(props) {
        super(props);
        this.handledProps = {
            managedClasses: void 0,
            iframeSrc: void 0,
            height: void 0,
            width: void 0,
            responsive: void 0,
            messageSystem: void 0,
            preview: void 0,
        };
        this.handleIframeMessage = e => {
            if (
                e.data &&
                e.data.type === MessageSystemType.custom &&
                e.data.action === ViewerCustomAction.call
            ) {
                e.stopImmediatePropagation();
                this.props.messageSystem.postMessage(
                    Object.assign(Object.assign({}, e.data), {
                        action: ViewerCustomAction.response,
                    })
                );
            }
        };
        this.handleMessageSystem = e => {
            this.postMessage(e.data);
        };
        /**
         * Handle mouseUp
         */
        this.handleMouseUp = e => {
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
        this.handleMouseMove = e => {
            if (!this.state.resizing) {
                return;
            }
            const heightOffset = this.state.dragReferenceY - e.pageY;
            const widthOffset = (this.state.dragReferenceX - e.pageX) * 2;
            const updatedHeight = this.props.height - heightOffset;
            const updatedWidthLeft = this.props.width + widthOffset;
            const updatedWidthRight = this.props.width - widthOffset;
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
        this.handleMouseDown = handleLocation => {
            return e => {
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
        this.handleBottomMouseDown = e => {
            this.setState({
                resizing: true,
                dragReferenceY: e.pageY,
                dragHandleLocation: ResizeHandleLocation.bottom,
            });
        };
        this.handleBottomRightMouseDown = e => {
            this.setState({
                resizing: true,
                dragReferenceY: e.pageY,
                dragReferenceX: e.pageX,
                dragHandleLocation: ResizeHandleLocation.bottomRight,
            });
        };
        this.handleBottomLeftMouseDown = e => {
            this.setState({
                resizing: true,
                dragReferenceY: e.pageY,
                dragReferenceX: e.pageX,
                dragHandleLocation: ResizeHandleLocation.bottomLeft,
            });
        };
        this.handleLeftMouseDown = e => {
            this.setState({
                resizing: true,
                dragReferenceX: e.pageX,
                dragHandleLocation: ResizeHandleLocation.left,
            });
        };
        this.handleRightMouseDown = e => {
            this.setState({
                resizing: true,
                dragReferenceX: e.pageX,
                dragHandleLocation: ResizeHandleLocation.right,
            });
        };
        this.state = {
            resizing: false,
            dragReferenceY: null,
            dragReferenceX: null,
            dragHandleLocation: null,
        };
        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
        };
        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
        }
        this.iframeRef = React.createRef();
        this.handleMouseMove = rafThrottle(this.handleMouseMove);
    }
    /**
     * Handle when component updates
     */
    componentDidUpdate(prevProps, prevState) {
        if (canUseDOM()) {
            this.shouldUpdateResizingEventListeners(prevState);
        }
    }
    componentWillUnmount() {
        if (this.props.messageSystem !== undefined) {
            this.props.messageSystem.remove(this.messageSystemConfig);
        }
        if (canUseDOM() && get(this.iframeRef, "current.contentWindow")) {
            this.iframeRef.current.contentWindow.removeEventListener(
                "message",
                this.handleIframeMessage
            );
        }
    }
    componentDidMount() {
        if (canUseDOM() && get(this.iframeRef, "current.contentWindow")) {
            this.iframeRef.current.contentWindow.addEventListener(
                "message",
                this.handleIframeMessage
            );
        }
    }
    render() {
        return (
            <div className={this.props.managedClasses.viewer}>
                <div
                    className={this.generateContentRegionClassNames()}
                    style={Object.assign(
                        Object.assign({}, this.getHeight()),
                        this.getWidth()
                    )}
                >
                    {this.renderResponsiveLeftHandle()}
                    <base target="_blank" />
                    <iframe
                        ref={this.iframeRef}
                        className={get(this.props, "managedClasses.viewer_iframe", "")}
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
    renderResponsiveLeftHandle() {
        if (this.props.responsive) {
            return (
                <button
                    className={`${this.props.managedClasses.handle} ${this.props.managedClasses.handle__left}`}
                    onMouseDown={this.handleMouseDown(ResizeHandleLocation.left)}
                />
            );
        }
    }
    renderResponsiveRightHandle() {
        if (this.props.responsive) {
            return (
                <button
                    className={`${this.props.managedClasses.handle} ${this.props.managedClasses.handle__right}`}
                    onMouseDown={this.handleMouseDown(ResizeHandleLocation.right)}
                />
            );
        }
    }
    renderResponsiveBottomRow() {
        if (this.props.responsive) {
            return (
                <React.Fragment>
                    <button
                        className={`${this.props.managedClasses.handle} ${this.props.managedClasses.handle__bottomLeft}`}
                        onMouseDown={this.handleMouseDown(
                            ResizeHandleLocation.bottomLeft
                        )}
                    />
                    <button
                        className={`${this.props.managedClasses.handle} ${this.props.managedClasses.handle__bottom}`}
                        aria-hidden={true}
                        onMouseDown={this.handleMouseDown(ResizeHandleLocation.bottom)}
                    />
                    <button
                        className={`${this.props.managedClasses.handle} ${this.props.managedClasses.handle__bottomRight}`}
                        onMouseDown={this.handleMouseDown(
                            ResizeHandleLocation.bottomRight
                        )}
                    />
                </React.Fragment>
            );
        }
    }
    shouldUpdateResizingEventListeners(prevState) {
        if (this.state.resizing && !prevState.resizing) {
            document.addEventListener("mouseup", this.handleMouseUp);
            document.addEventListener("mousemove", this.handleMouseMove);
        } else if (!this.state.resizing && prevState.resizing) {
            document.removeEventListener("mouseup", this.handleMouseUp);
            document.removeEventListener("mousemove", this.handleMouseMove);
        }
    }
    getHeight() {
        if (this.props.height) {
            return {
                height: `${this.props.height}px`,
            };
        }
    }
    getWidth() {
        if (this.props.width) {
            return {
                width: `${this.props.width}px`,
            };
        }
    }
    generateContentRegionClassNames() {
        let classes = this.props.managedClasses.viewer_contentRegion;
        if (this.props.preview) {
            classes += ` ${this.props.managedClasses.viewer_contentRegion__preview}`;
        }
        if (this.state.resizing) {
            classes += ` ${this.props.managedClasses.viewer_contentRegion__disabled}`;
        }
        return classes;
    }
    postMessage(message) {
        if (canUseDOM() && get(this.iframeRef, "current.contentWindow")) {
            this.iframeRef.current.contentWindow.postMessage(
                JSON.stringify(message),
                "*"
            );
        }
    }
    handleUpdateHeight(height) {
        if (this.props.onUpdateHeight) {
            this.props.onUpdateHeight(height);
        }
    }
    handleUpdateWidth(width) {
        if (this.props.onUpdateWidth) {
            this.props.onUpdateWidth(width);
        }
    }
}
Viewer.displayName = "Viewer";
