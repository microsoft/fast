import React from "react";

export interface PluginUIProps {
    selectedNodes: string[];
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
    };

    public render(): JSX.Element {
        console.log("RENDERING", this.props);
        return <div>{JSON.stringify(this.props, null, 2)}</div>;
    }
}
