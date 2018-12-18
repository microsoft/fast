import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { BadgeHandledProps, BadgeUnhandledProps } from "./badge.props";
import { get } from "lodash-es";

class Badge extends Foundation<BadgeHandledProps, BadgeUnhandledProps, {}> {
    public static displayName: string = "Badge";

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
        return super.generateClassNames(get(this.props, "managedClasses.badge", ""));
    }
}

export default Badge;
export * from "./badge.props";
export { BadgeClassNameContract };
