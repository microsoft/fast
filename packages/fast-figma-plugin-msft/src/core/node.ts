import { DesignSystem } from "@microsoft/fast-components-styles-msft";

export interface RecipeData {
    name: string;
    value: string;
}

export interface PluginNodeData {
    fills: RecipeData[];
    strokes: RecipeData[];
    designSystem: Partial<DesignSystem>;
}

export const PluginNodeDataKeys: Array<keyof PluginNodeData> = ((): Array<
    keyof PluginNodeData
> => {
    const keyMap: Record<keyof PluginNodeData, void> = {
        fills: void 0,
        strokes: void 0,
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
    public abstract supports: () => Array<keyof PluginNodeData>;
    public abstract designSystem: () => DesignSystem;
}
