import * as React from "react";
import manageJss, { ComponentStyles, IManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ContainerProps } from "./container.props";
import Foundation, { HandledProps, IFoundationProps } from "@microsoft/fast-components-foundation-react";

export interface IContainerClassNamesContract {
    container?: string;
}

const styles: ComponentStyles<IContainerClassNamesContract, undefined> = {
    "@global": {
        "html, body": {
            padding: 0,
            margin: 0
        }
    },
    container: {
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column"
    }
};

/**
 * The Grid Container. This element wraps all other grid elements.
 */
class Container extends Foundation<
    ContainerProps,
    React.HTMLAttributes<HTMLDivElement>,
    undefined
> {
    protected handledProps: HandledProps<ContainerProps> = {
        managedClasses: void 0
    };

    /**
     * Renders the Container markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={super.generateClassNames(this.props.managedClasses.container)}
            >
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(styles)(Container);
