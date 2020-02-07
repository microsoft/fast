import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { RecipeData, RecipeTypes } from "./recipe-registry";

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
    private static purgeDesignSystemCache(node: PluginNode): void {
        if (cache.has(node.id)) {
            cache.delete(node.id);
        }

        node.children().map(PluginNode.purgeDesignSystemCache);
    }
    public abstract id: string;
    public abstract type: string;
    public abstract children(): PluginNode[];
    public abstract parent(): PluginNode | null;
    public abstract supports(): Array<RecipeTypes | "designSystem">;

    /**
     * Set a property of the design system on this node
     * @param key - the design system property name
     * @param value - the design system property value
     */
    public setDesignSystemProperty<K extends keyof DesignSystem>(
        key: K,
        value: DesignSystem[K]
    ): void {
        this.setPluginData("designSystem", {
            ...this.getPluginData("designSystem"),
            [key]: value,
        });

        PluginNode.purgeDesignSystemCache(this);
    }

    public deleteDesignSystemProperty<K extends keyof DesignSystem>(key: K): void {
        const data = this.getPluginData("designSystem");
        delete data[key];
        this.setPluginData("designSystem", data);

        PluginNode.purgeDesignSystemCache(this);
    }

    /**
     * Returns all design system overrides applied to the node
     */
    public get designSystemOverrides(): Partial<DesignSystem> {
        return this.getPluginData("designSystem");
    }

    public abstract paint(data: RecipeData): void;
    protected abstract getPluginData<K extends keyof PluginNodeData>(
        key: K
    ): PluginNodeData[K];
    protected abstract setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ): void;

    /**
     * Resolves the contextual design system for a node.
     * This will combine design system properties on this node
     * with any design system properties enumerated on *parent* nodes
     */
    private resolveDesignSystemContext(): Partial<DesignSystem> {
        let node: PluginNode | null = this.parent();
        const initialDesignSystem = this.getPluginData("designSystem");

        /**
         * We need to delete the background color if it is set here because
         * we don't want to paint backgrounds on this node relative to
         * the node itself, background colors should always be painted relative
         * to the *parent*
         */
        if (initialDesignSystem.hasOwnProperty("backgroundColor")) {
            delete initialDesignSystem.backgroundColor;
        }

        const designSystems: Array<Partial<DesignSystem>> = [initialDesignSystem];

        while (node !== null) {
            designSystems.push(node.getPluginData("designSystem"));

            node = node.parent();
        }

        return designSystems.reduceRight((prev, next) => ({ ...prev, ...next }));
    }
}
