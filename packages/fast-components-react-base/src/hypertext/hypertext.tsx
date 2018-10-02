import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { IHypertextHandledProps, IHypertextManagedClasses, IHypertextUnhandledProps } from "./hypertext.props";
import { IHypertextClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

class Hypertext extends Foundation<
    IHypertextHandledProps & IManagedClasses<IHypertextClassNameContract>,
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    {}
> {
    public static displayName: string = "Hypertext";

    protected handledProps: HandledProps<IHypertextHandledProps & IManagedClasses<IHypertextClassNameContract>> = {
        href: void 0,
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLAnchorElement> {
        return (
            <a
                {...this.unhandledProps()}
                href={this.props.href || null}
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
        return super.generateClassNames(get(this.props, "managedClasses.hypertext"));
    }
}

export default Hypertext;
export * from "./hypertext.props";
export { IHypertextClassNameContract };
