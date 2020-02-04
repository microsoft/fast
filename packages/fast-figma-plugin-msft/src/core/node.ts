import { MappedRecipeTypes, RecipeData, RecipeTypes } from "./recipes";

export interface PluginNodeData<T = any>
    extends Partial<MappedRecipeTypes<Omit<RecipeData, "type">>> {
    id: string;
    type: string;
    contextOverrides: Partial<T>;
}

export abstract class PluginNode<T = any> {
    public abstract id: string;
    public abstract type: string;
    public abstract getPluginData: <K extends keyof PluginNodeData>(
        key: K
    ) => PluginNodeData[K];
    public abstract setPluginData: <K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ) => void;
    public abstract children: () => PluginNode[];
    public abstract recipeSupport: () => Array<keyof typeof RecipeTypes>;
    public abstract contextOverrides: () => T;
}
