import React from "react";

export interface PluginUIProps {
    selectedNodes: string[];
    selectedNodeTypes: string[];
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        selectedNodeTypes: [],
    };

    public render(): JSX.Element {
        return <div>{JSON.stringify(this.props, null, 2)}</div>;
    }
}
