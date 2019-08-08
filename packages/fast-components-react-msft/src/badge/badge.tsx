import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    BadgeHandledProps,
    BadgeProps,
    BadgeSize,
    BadgeUnhandledProps,
} from "./badge.props";
import { Badge as BaseBadge } from "@microsoft/fast-components-react-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";
import { BadgeClassNameContract } from "./index";
import { classNames } from "@microsoft/fast-web-utilities";

class Badge extends Foundation<BadgeHandledProps, BadgeUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Badge`;

    public static defaultProps: Partial<BadgeProps> = {
        size: BadgeSize.small,
        filled: true,
        managedClasses: {}
    };

    protected handledProps: HandledProps<BadgeHandledProps> = {
        filled: void 0,
        size: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <BaseBadge
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                managedClasses={this.props.managedClasses}
            >
                {this.props.children}
            </BaseBadge>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            badge__filled,
            badge__small,
            badge__large
        }: Partial<BadgeClassNameContract> = this.props.managedClasses;

        return super.generateClassNames(classNames(
            [badge__filled, this.props.filled],
            [badge__large, this.props.size === BadgeSize.large],
            [badge__small, this.props.size === BadgeSize.small]
        ));
    }
}

export default Badge;
export * from "./badge.props";
