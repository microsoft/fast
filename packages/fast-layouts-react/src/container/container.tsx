import * as React from "react";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    ContainerHandledProps,
    ContainerProps,
    ContainerUnhandledProps
} from "./container.props";
import Foundation, {
    FoundationProps,
    HandledProps
} from "@microsoft/fast-components-foundation-react";

export interface ContainerClassNamesContract {
    container?: string;
}

export const containerStyleSheet: ComponentStyles<
    ContainerClassNamesContract,
    undefined
> = {
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
export class Container extends Foundation<
    ContainerHandledProps,
    ContainerUnhandledProps,
    undefined
> {
    protected handledProps: HandledProps<ContainerHandledProps> = {
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

export * from "./container.props";
