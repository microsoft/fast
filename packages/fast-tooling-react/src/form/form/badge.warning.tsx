import React from "react";
import BaseBadge from "./badge.base";
import { BadgeProps } from "./badge.props";

export default class WarningBadge extends BaseBadge<BadgeProps, {}> {
    public static displayName: string = "WarningBadge";

    public render(): React.ReactNode {
        return (
            <svg
                className={this.props.className}
                width="15"
                height="15"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
            >
                {this.renderTitle()}
                <path d="M15 15H0L7.5 0L15 15ZM1.61719 14H13.3828L7.5 2.23438L1.61719 14ZM8 6V11H7V6H8ZM7 12H8V13H7V12Z" />
            </svg>
        );
    }
}
