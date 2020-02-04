import React from "react";
import { PluginNodeData } from "./node";
import { MappedRecipeTypes, RecipeData, RecipeTypes } from "./recipes";

export interface PluginUIActiveNodeData extends PluginNodeData {
    id: string;
    type: string;
    supports: Partial<MappedRecipeTypes<RecipeData[]>>;
}

export interface PluginUIProps {
    selectedNodes: PluginUIActiveNodeData[];
    // recipeOptions: PluginUIPropsNodeRecipeOptions;
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        // recipeOptions: {},
    };

    public render(): JSX.Element {
        return <pre>{JSON.stringify(this.props, null, 2)}</pre>;
    }
}
