import React from "react";
import { GroupProps } from "./group.props";

/**
 * This component is used as a container to group child components together
 */
export class Group extends React.Component<GroupProps, {}> {
    public render(): React.ReactNode {
        return <div style={this.props.style}>{this.props.children}</div>;
    }
}
