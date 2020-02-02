import { DesignSystem } from "@microsoft/fast-components-styles-msft";

interface RecipeProduct {
    name: string;
    value: string;
}

export interface PluginNodeData {
    backgrounds: RecipeProduct[];
    strokes: RecipeProduct[];
    colors: RecipeProduct[];
    designSystem: DesignSystem;
}

export interface PluginNode {
    id: string;
    type: string;
    getPluginData: <K extends keyof PluginNodeData>(key: K) => PluginNodeData[K];
    setPluginData: <K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ) => void;
    children: () => PluginNode[];
    supports: <K extends keyof PluginNodeData>(key: K) => boolean;
}
