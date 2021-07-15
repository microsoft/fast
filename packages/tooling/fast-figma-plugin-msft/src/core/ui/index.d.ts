import React from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { UIMessage } from "../messaging";
import { RecipeData, RecipeTypes } from "../recipe-registry";
export interface PluginUIActiveNodeRecipeSupportOptions {
    label: string;
    options: RecipeData[];
}
export interface PluginUIActiveNodeData {
    /**
     * The ID of the node
     */
    id: string;
    /**
     * The node types
     */
    type: string;
    /**
     * The IDs of all recipes assigned to the item
     */
    recipes: string[];
    /**
     * The recipe types that the node supports
     */
    supports: Array<RecipeTypes | "designSystem">;
    /**
     * Any design system overrides applied to the node
     */
    designSystem: Partial<DesignSystem>;
}
export interface RecipeTypeOptions {
    type: RecipeTypes;
    options: RecipeData[];
}
export interface PluginUIProps {
    selectedNodes: PluginUIActiveNodeData[];
    recipeOptions: RecipeTypeOptions[];
    dispatch: (message: UIMessage) => void;
}
export declare class PluginUI extends React.Component<PluginUIProps> {
    static defaultProps: PluginUIProps;
    render(): JSX.Element;
    private renderFooter;
    private renderBody;
    private renderColorPicker;
    private appliedRecipes;
    private recipeOptionsByType;
    private pageBackgroundIds;
    /**
     * Returns the node ID's in which the recipe is assigned
     * @param id - the recipe ID
     */
    private recipeIsAssigned;
    private removeRecipe;
    private setRecipe;
    private renderThemeSwitcher;
    private setDesignSystemProperty;
    private deleteDesignSystemProperty;
}
