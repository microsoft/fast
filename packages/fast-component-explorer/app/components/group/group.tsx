import React from "react";
import { GroupProps } from "./group.props";

export class Group extends React.Component<GroupProps, {}> {
    public render(): React.ReactNode {
        return <div style={this.props.style}>{this.props.children}</div>;
    }
}
