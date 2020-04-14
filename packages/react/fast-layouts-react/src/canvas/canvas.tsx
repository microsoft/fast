import React from "react";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import { CanvasHandledProps, CanvasProps, CanvasUnhandledProps } from "./canvas.props";

export interface CanvasClassNamesContract {
    canvas?: string;
}

export const canvasStyleSheet: ComponentStyles<CanvasClassNamesContract, undefined> = {
    canvas: {
        flex: "1",
        overflow: "hidden",
    },
};

/**
 * Grid Canvas - this is the main content area of the grid.
 */
export class Canvas extends Foundation<CanvasHandledProps, CanvasUnhandledProps, {}> {
    public static displayName: string = "Canvas";

    /**
     * Default props for the Canvas component
     */
    public static defaultProps: CanvasHandledProps = {
        managedClasses: {},
        minWidth: 300,
    };

    /**
     * Handled prop enumeration
     */
    protected handledProps: HandledProps<CanvasProps> = {
        minWidth: void 0,
        managedClasses: void 0,
    };

    /**
     * Generate the style attribute object
     */
    public renderStyleAttribute(): object {
        return {
            minWidth: `${this.props.minWidth}px`,
        };
    }

    /**
     * Render the Canvas
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={super.generateClassNames(
                    classNames(this.props.managedClasses.canvas)
                )}
                data-grid-app="canvas"
                style={this.renderStyleAttribute()}
            >
                {this.props.children}
            </div>
        );
    }
}

export * from "./canvas.props";
