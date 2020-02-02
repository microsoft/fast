import React from "react";
import { RecipeData, PluginNodeData } from "./node";

export interface PluginUIEditableRecipeData {
    name: keyof PluginNodeData;
    label: string;
    options: RecipeData[];
}

export type PluginUIEditablePropertyData = PluginUIEditableRecipeData;

export interface PluginUIProps {
    selectedNodes: string[];
    selectedNodeTypes: string[];
    editableProperties: PluginUIEditablePropertyData[];
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        selectedNodeTypes: [],
        editableProperties: [],
    };

    public render(): JSX.Element {
        return <pre>{JSON.stringify(this.props, null, 2)}</pre>;
    }
}
