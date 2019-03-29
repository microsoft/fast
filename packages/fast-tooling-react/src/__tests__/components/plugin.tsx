import React from "react";

interface PluginProps {
    renderProp: (className: string) => React.ReactNode;
}

export default class Plugin extends React.Component<PluginProps, {}> {
    public render(): React.ReactNode {
        return <div>{this.props.renderProp("foo")}</div>;
    }
}
