import React from "react";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    ContainerHandledProps,
    ContainerProps,
    ContainerUnhandledProps,
} from "./container.props";

export interface ContainerClassNamesContract {
    container?: string;
}

export const containerStyleSheet: ComponentStyles<
    ContainerClassNamesContract,
    undefined
> = {
    container: {
        display: "flex",
        width: "100vw",
        height: "100vh",
        "flex-direction": "column",
    },
};

/**
 * The Grid Container. This element wraps all other grid elements.
 */
export class Container extends Foundation<
    ContainerHandledProps,
    ContainerUnhandledProps,
    undefined
> {
    public static displayName: string = "Container";

    public static defaultProps: Partial<ContainerProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<ContainerHandledProps> = {
        managedClasses: void 0,
    };

    /**
     * Renders the Container markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={super.generateClassNames(
                    classNames(this.props.managedClasses.container)
                )}
            >
                {this.props.children}
            </div>
        );
    }
}

export * from "./container.props";
