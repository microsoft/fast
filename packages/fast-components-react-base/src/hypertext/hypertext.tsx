import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    HypertextHandledProps,
    HypertextProps,
    HypertextUnhandledProps,
} from "./hypertext.props";

class Hypertext extends Foundation<HypertextHandledProps, HypertextUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Hypertext`;

    public static defaultProps: Partial<HypertextProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<HypertextHandledProps> = {
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLAnchorElement> {
        return (
            <a {...this.unhandledProps()} className={this.generateClassNames()}>
                {this.props.children}
            </a>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.hypertext);
    }
}

export default Hypertext;
export * from "./hypertext.props";
export { HypertextClassNameContract };
