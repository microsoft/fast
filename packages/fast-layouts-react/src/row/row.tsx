import * as React from "react";
import Pane from "../pane";
import Canvas from "../canvas";
import { IRowHandledProps, IRowUnhandledProps, RowProps } from "./row.props";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Foundation, { IFoundationProps } from "../foundation";
import { joinClasses } from "../utilities";

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
class Row extends Foundation<RowProps, undefined> {
    public static defaultProps: IRowHandledProps = {
        fill: false
    };

    protected handledProps: IRowHandledProps & IManagedClasses<IRowClassNamesContract> = {
        fill: void 0,
        managedClasses: void 0
    };

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </div>
        );
    }

    protected generateClassNames(): string {
        const { row, row__fill }: IRowClassNamesContract = this.props.managedClasses;

        return super.generateClassNames(joinClasses(this.props.fill, row, row__fill));
    }
}

export default manageJss(styles)(Row);
