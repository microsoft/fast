import React from "react";
import { PluginNodeData } from "./node";
import { MappedRecipeTypes, RecipeData } from "./recipes";

export type PluginUIPropsNodeRecipeOptions = {
    [id: string]: Partial<MappedRecipeTypes<RecipeData>>;
};
export interface PluginUIProps {
    selectedNodes: PluginNodeData[];
    recipeOptions: PluginUIPropsNodeRecipeOptions;
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        recipeOptions: {},
    };

    public render(): JSX.Element {
        return <pre>{JSON.stringify(this.props, null, 2)}</pre>;
    }
}
