import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64 } from "@microsoft/fast-colors";
import { RecipeData, RecipeTypes } from "./recipe-registry";
/**
 * Defines the data stored by the plugin on a node instance
 */
export interface PluginNodeData {
    /**
     * A set of recipe IDs applied to the node
     */
    recipes: string[];
    /**
     * Design system overrides applied to the node
     */
    designSystem: Partial<DesignSystem>;
}
/**
 * The abstract class the plugin controller interacts with
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export declare abstract class PluginNode {
    /**
     * Retrieves the contextual design system for the node
     */
    get designSystem(): Partial<DesignSystem>;
    get recipes(): string[];
    set recipes(recipes: string[]);
    /**
     * Returns all design system overrides applied to the node
     */
    get designSystemOverrides(): Partial<DesignSystem>;
    abstract id: string;
    abstract type: string;
    abstract children(): PluginNode[];
    abstract parent(): PluginNode | null;
    abstract supports(): Array<RecipeTypes | "designSystem">;
    /**
     * Set a property of the design system on this node
     * @param key - the design system property name
     * @param value - the design system property value
     */
    setDesignSystemProperty<K extends keyof DesignSystem>(
        key: K,
        value: DesignSystem[K]
    ): void;
    /**
     * Remove a property from the design system on this node
     * @param key The key of the design system to remove
     */
    deleteDesignSystemProperty<K extends keyof DesignSystem>(key: K): void;
    abstract paint(data: RecipeData): void;
    /**
     * Retrieve the effective background color for the node.
     * This color is communicated to color recipes as the
     * backgroundColor context for a node
     */
    abstract getEffectiveBackgroundColor(): ColorRGBA64;
    /**
     * Delete entries in the design system cache for this node
     * and any child nodes
     */
    invalidateDesignSystemCache(): void;
    protected abstract getPluginData<K extends keyof PluginNodeData>(
        key: K
    ): PluginNodeData[K];
    protected abstract setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ): void;
}
