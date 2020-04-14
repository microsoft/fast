import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import { BadgeHandledProps, BadgeProps, BadgeUnhandledProps } from "./badge.props";

class Badge extends Foundation<BadgeHandledProps, BadgeUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Badge`;

    public static defaultProps: Partial<BadgeProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<BadgeHandledProps> = {
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <span {...this.unhandledProps()} className={this.generateClassNames()}>
                {this.props.children}
            </span>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.badge));
    }
}

export default Badge;
export * from "./badge.props";
export { BadgeClassNameContract };
