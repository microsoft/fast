import React from "react";

export default class Children extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return <div>{this.props.children}</div>;
    }
}
