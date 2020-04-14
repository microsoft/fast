import React from "react";
import { GroupProps } from "./group.props";

/**
 * This component is used as a container to group child components together
 */
export class Group extends React.Component<GroupProps, {}> {
    public static defaultProps: GroupProps = {
        tag: "div",
        slot: undefined,
    };

    public render(): JSX.Element {
        const props: any = Object.assign({}, this.props);

        delete props.tag;
        delete props.slot;
        delete props.children;

        return (
            <this.tag style={this.props.style} {...props}>
                {this.props.children}
            </this.tag>
        );
    }

    private get tag(): any {
        return this.props.tag;
    }
}
