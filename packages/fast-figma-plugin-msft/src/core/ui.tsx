import React from "react";
import { PluginNodeData } from "./node";
import { MappedRecipeTypes, RecipeTypes } from "./recipes";

/**
 * Defines all data associated with a recipe
 */
export interface RecipeOptionData {
    name: string;
    value: string;
    id: string;
}

export interface PluginUIActiveNodeRecipeSupportOptions {
    label: string;
    options: RecipeOptionData[];
}

export interface PluginUIActiveNodeData extends PluginNodeData {
    id: string;
    type: string;
    supports: Partial<MappedRecipeTypes<PluginUIActiveNodeRecipeSupportOptions>>;
}

export interface PluginUIProps {
    selectedNodes: PluginUIActiveNodeData[];
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
    };

    public render(): JSX.Element {
        return <pre>{JSON.stringify(this.props, null, 2)}</pre>;
    }
}
