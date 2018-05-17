import * as React from "react";
import { CanvasProps, ICanvasHandledProps, ICanvasUnhandledProps } from "./canvas.props";
import manageJss, { ComponentStyles, IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import Foundation, { IFoundationProps } from "../foundation";

export interface ICanvasClassNamesContract {
    canvas: string;
}

const styles: ComponentStyles<ICanvasClassNamesContract, undefined> = {
    canvas: {
        flex: "1",
        overflowY: "auto"
    }
};

/**
 * Grid Canvas - this is the main content area of the grid.
 */
class Canvas extends Foundation<CanvasProps, undefined> {
    /**
     * Default props for the Canvas component
     */
    public static defaultProps: ICanvasHandledProps = {
        minWidth: 300
    };

    /**
     * Generate the style attribute object
     */
    public renderStyleAttribute(): object {
        return {
            minWidth: this.props.minWidth
        };
    }

    /**
     * Render the Canvas
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                // TODO: {...this.unhandledProps()}
                className={super.generateClassNames(this.props.managedClasses.canvas)}
                data-grid-app="canvas"
                style={this.renderStyleAttribute()}
            >
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(styles)(Canvas);
