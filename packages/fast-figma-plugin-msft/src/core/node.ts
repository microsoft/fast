import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { RecipeTypes, RecipeData } from "./recipe-registry";

const cache: Map<string, Partial<DesignSystem>> = new Map();
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
export abstract class PluginNode {
    private static purgeDesignSystemCache(node: PluginNode) {
        if (cache.has(node.id)) {
            cache.delete(node.id);
        }

        node.children().map(PluginNode.purgeDesignSystemCache);
    }
    public abstract id: string;
    public abstract type: string;
    protected abstract getPluginData<K extends keyof PluginNodeData>(
        key: K
    ): PluginNodeData[K];
    protected abstract setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ): void;
    public abstract children(): PluginNode[];
    public abstract parent(): PluginNode | null;
    public abstract supports(): RecipeTypes[];

    /**
     * Set a property of the design system on this node
     * @param key - the design system property name
     * @param value - the design system property value
     */
    public setDesignSystemPropety<K extends keyof DesignSystem>(
        key: K,
        value: DesignSystem[K]
    ) {
        this.setPluginData("designSystem", {
            ...this.getPluginData("designSystem"),
            [key]: value,
        });

        PluginNode.purgeDesignSystemCache(this);
    }

    /**
     * Retrieves the contextual design system for the node
     */
    public get designSystem(): Partial<DesignSystem> {
        if (cache.has(this.id)) {
            return cache.get(this.id)!;
        } else {
            cache.set(this.id, this.resolveDesignSystemContext());
            return this.designSystem;
        }
    }

    public get recipes(): string[] {
        return this.getPluginData("recipes");
    }

    public set recipes(recipes: string[]) {
        this.setPluginData("recipes", recipes);
    }

    public abstract paint(data: RecipeData): void;

    /**
     * Resolves the contextual design system for a node.
     * This will combine design system properties on this node
     * with any design system properties enumerated on *parent* nodes
     */
    private resolveDesignSystemContext(): Partial<DesignSystem> {
        let node: PluginNode | null = this.parent();
        const intialDesignSystem = this.getPluginData("designSystem");

        /**
         * We need to delete the background color if it is set here because
         * we don't want to paint backgrounds on this node relative to
         * the node itself, background colors should always be painted relative
         * to the *parent*
         */
        if (intialDesignSystem.hasOwnProperty("backgroundColor")) {
            delete intialDesignSystem.backgroundColor;
        }

        let designSystems: Partial<DesignSystem>[] = [intialDesignSystem];

        while (node !== null) {
            designSystems.push(node.getPluginData("designSystem"));

            node = node.parent();
        }

        return designSystems.reduceRight((prev, next) => ({ ...prev, ...next }));
    }
}
