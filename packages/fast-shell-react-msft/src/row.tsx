import * as React from "react";
import Pane from "./Pane";
import Canvas from "./Canvas";
import { IRowProps } from "./Row.props";

export const east: string  = "east";
export const west: string = "west";

/**
 * Grid Row - use this to create rows of pane/canvas content or other content.
 */
class Row extends React.Component<IRowProps, undefined> {
    public static defaultProps: IRowProps = {
        justify: void(0),
        fill: false
    };

    /**
     * We need to manipulate props based on where Pane components are in relation to the Canvas.
     * This is because the Panes resize from the right when they are to the left of the Canvas,
     * and vice-versa when they are on the right of the canvas.
     */
    public renderChildren(): React.ReactChild[] {
        let canvasFound: boolean = false; // Flag for if canvas is found

        return React.Children.map(this.props.children, (child: React.ReactChild) => {
            const PaneName: string = "Pane";
            const CanvasName: string = "Canvas";

            if (typeof child === "string" || typeof child === "number" || !child) {
                return child;
            }

            // If we find a canvas, all Panes after it need to be changed,
            // so flip a bit so we know we've found it
            if (child.type === (Canvas as any)) {
                canvasFound = true;
                return child;
            }

            // Add prop to resizable Panes so we know which side to put the resize
            // control on
            if (child.type === (Pane as any) && child.props.resizable) {
                return React.cloneElement(child, { resizeFrom: canvasFound ? west : east });
            }

            // always return child by default
            return child;
        });
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                // TODO: {...this.unhandledProps()}
                data-grid-app="row"
                data-grid-app-fill={this.props.fill}
                data-grid-app-justify={this.props.justify}
            >
                {this.renderChildren()}
            </div>
        );
    }
}

export default Row;
export { IRowProps };
