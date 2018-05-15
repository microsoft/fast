import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { ContainerProps } from "./container.props";

export interface IContainerClassNamesContract {
    "@global": string;
    container: string;
}

export const styles: ComponentStyles<IContainerClassNamesContract, undefined> = {
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
class Container extends React.Component<ContainerProps, undefined> {
    /**
     * Renders the Container markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                // TODO {...this.unhandledProps()}
                className={this.props.managedClasses.container}
                data-grid-app="container"
            >
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(styles)(Container);
