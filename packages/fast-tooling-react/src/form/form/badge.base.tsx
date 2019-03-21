import React from "react";
import { BadgeProps } from "./badge.props";

export default abstract class BaseBadge<P extends BadgeProps, S> extends React.Component<
    P,
    S
> {
    public renderTitle(): React.ReactNode {
        if (this.props.description) {
            return <title>{this.props.description}</title>;
        }
    }
}
