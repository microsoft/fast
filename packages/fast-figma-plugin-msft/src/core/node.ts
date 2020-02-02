import { DesignSystem } from "@microsoft/fast-components-styles-msft";

export interface RecipeData {
    name: string;
    value: string;
}

export interface PluginNodeData {
    backgroundFills: RecipeData[];
    strokeFills: RecipeData[];
    textFills: RecipeData[];
    designSystem: DesignSystem;
}

export const PluginNodeDataKeys: Array<keyof PluginNodeData> = (() => {
    const keyMap: Record<keyof PluginNodeData, void> = {
        backgroundFills: void 0,
        strokeFills: void 0,
        textFills: void 0,
        designSystem: void 0,
    };
    return Object.keys(keyMap) as Array<keyof PluginNodeData>;
})();

export interface PluginNode {
    id: string;
    type: string;
    getPluginData: <K extends keyof PluginNodeData>(key: K) => PluginNodeData[K];
    setPluginData: <K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ) => void;
    children: () => PluginNode[];
    supports: () => Array<keyof PluginNodeData>;
}
