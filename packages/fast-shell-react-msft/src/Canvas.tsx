import * as React from "react";
import { ICanvasProps } from "./Canvas.props";

/**
 * Grid Canvas - this is the main content area of the grid.
 */
class Canvas extends React.Component<ICanvasProps, undefined> {
    /**
     * Default props for the Canvas component
     * @type {Partial<ICanvasProps>}
     */
    public static defaultProps: ICanvasProps = {
        minWidth: 300
    };

    /**
     * Generate the style attribute object
     * @returns {object}
     */
    public renderStyleAttribute(): object {
        return {
            minWidth: this.props.minWidth
        };
    }

    /**
     * Render the Canvas
     */
    public render() {
        return (
            <div
                // TODO: {...this.unhandledProps()}
                data-grid-app="canvas"
                style={this.renderStyleAttribute()}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Canvas;
export { ICanvasProps };
