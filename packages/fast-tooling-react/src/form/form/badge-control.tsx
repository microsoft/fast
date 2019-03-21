import React from "react";
import { BadgeControlProps } from "./badge.props";
import InfoBadge from "./badge.info";
import LockedBadge from "./badge.locked";
import WarningBadge from "./badge.warning";
import { BadgeType } from "./form-item.props";

export default class BadgeControl extends React.Component<BadgeControlProps, {}> {
    public render(): React.ReactNode {
        switch (this.props.type) {
            case BadgeType.info:
                return (
                    <InfoBadge
                        className={this.props.className}
                        description={this.props.description}
                    />
                );
            case BadgeType.warning:
                return (
                    <WarningBadge
                        className={this.props.className}
                        description={this.props.description}
                    />
                );
            case BadgeType.locked:
                return (
                    <LockedBadge
                        className={this.props.className}
                        description={this.props.description}
                    />
                );
            default:
                return null;
        }
    }
}
