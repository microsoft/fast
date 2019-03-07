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

class Badge extends Foundation<BadgeHandledProps, BadgeUnhandledProps, {}> {
    public static displayName: string = "Badge";

    public static defaultProps: Partial<BadgeProps> = {
        size: BadgeSize.small,
        filled: true,
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
        let classNames: string = "";

        if (this.props.filled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.badge__filled",
                ""
            )}`;
        }

        switch (this.props.size) {
            case BadgeSize.small:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.badge__small",
                    ""
                )}`;
                break;
            case BadgeSize.large:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.badge__large",
                    ""
                )}`;
                break;
        }

        return super.generateClassNames(classNames);
    }
}

export default Badge;
export * from "./badge.props";
