import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { MappedRecipeTypes, RecipeTypes } from "./recipes";

export interface RecipeData {
    name: string;
    value: string;
    id: string;
}

export interface PluginNodeData extends MappedRecipeTypes<RecipeData[]> {
    designSystem: Partial<DesignSystem>;
}

export const PluginNodeDataKeys: Array<keyof PluginNodeData> = ((): Array<
    keyof PluginNodeData
> => {
    const keyMap: Record<keyof PluginNodeData, void> = {
        backgroundFills: void 0,
        strokeFills: void 0,
        foregroundFills: void 0,
        designSystem: void 0,
    };
    return Object.keys(keyMap) as Array<keyof PluginNodeData>;
})();

export abstract class PluginNode {
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
    public abstract supports: () => Array<keyof typeof RecipeTypes>;
    public abstract designSystem: () => DesignSystem;
}
