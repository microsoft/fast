import React from "react";
import ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    HypertextHandledProps,
    HypertextManagedClasses,
    HypertextUnhandledProps,
} from "./hypertext.props";
import {
    HypertextClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";

class Hypertext extends Foundation<HypertextHandledProps, HypertextUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Hypertext`;

    protected handledProps: HandledProps<HypertextHandledProps> = {
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLAnchorElement> {
        return (
            <a
                {...this.unhandledProps()}
                href={get(this.props, "href", null)}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </a>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.hypertext", ""));
    }
}

export default Hypertext;
export * from "./hypertext.props";
export { HypertextClassNameContract };
