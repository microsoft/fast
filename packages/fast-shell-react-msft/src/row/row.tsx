import * as React from "react";
import Pane from "../pane";
import Canvas from "../canvas";
import { IRowHandledProps, IRowUnhandledProps, RowProps } from "./row.props";
import manageJss, { ComponentStyles, IJSSManagerProps } from "@microsoft/fast-jss-manager-react";

export const east: string  = "east";
export const west: string = "west";

export interface IRowClassNamesContract {
    row: string;
    row__fill: string;
}

const styles: ComponentStyles<IRowClassNamesContract, undefined> = {
    row: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        flexBasis: "auto"
    },
    row__fill: {
        flex: "1",
        overflow: "hidden"
    }
};

/**
 * Grid Row - use this to create rows of pane/canvas content or other content.
 */
class Row extends React.Component<RowProps, undefined> {
    public static defaultProps: IRowHandledProps = {
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
                className={this.generateClassNames()}
            >
                {this.renderChildren()}
            </div>
        );
    }

    private generateClassNames(): string {
        return this.props.fill
            ?  `${this.props.managedClasses.row} ${this.props.managedClasses.row__fill}`
            : this.props.managedClasses.row;
    }
}

export default manageJss(styles)(Row);
