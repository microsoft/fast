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

const DesignSystemCache: Map<string, Partial<DesignSystem>> = new Map();

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
        // Retrun value from the cache if we have it
        if (DesignSystemCache.has(this.id)) {
            return DesignSystemCache.get(this.id) as Partial<DesignSystem>;
        }

        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        let node: PluginNode | null = this;
        const designSystems: Array<Partial<DesignSystem>> = [];

        while (node !== null) {
            designSystems.push(node.getPluginData("designSystem"));
            node = node.parent();
        }

        const designSystem = designSystems.reduceRight(
            (prev: Partial<DesignSystem>, next: Partial<DesignSystem>) => ({
                ...prev,
                ...next,
            })
        );
        DesignSystemCache.set(this.id, designSystem);

        return designSystem;
    }

    public get recipes(): string[] {
        const recipes = this.getPluginData("recipes");
        return recipes;
    }

    public set recipes(recipes: string[]) {
        this.setPluginData("recipes", recipes);
    }

    /**
     * Returns all design system overrides applied to the node
     */
    public get designSystemOverrides(): Partial<DesignSystem> {
        return this.getPluginData("designSystem");
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

        this.invalidateDesignSystemCache();
    }

    /**
     * Remove a property from the design system on this node
     * @param key The key of the design system to remove
     */
    public deleteDesignSystemProperty<K extends keyof DesignSystem>(key: K): void {
        const data = this.getPluginData("designSystem");
        delete data[key];
        this.setPluginData("designSystem", data);
        this.invalidateDesignSystemCache();
    }

    public abstract paint(data: RecipeData): void;

    /**
     * Retrieve the effective background color for the node.
     * This color is communicated to color recipes as the
     * backgroundColor context for a node
     */
    public abstract getEffectiveBackgroundColor(): ColorRGBA64;

    /**
     * Delete entries in the design system cache for this node
     * and any child nodes
     */
    public invalidateDesignSystemCache(): void {
        function getIds(node: PluginNode): string[] {
            let found = [node.id];

            node.children().forEach((child: PluginNode) => {
                found = found.concat(getIds(child));
            });

            return found;
        }

        getIds(this).forEach((id: string) => DesignSystemCache.delete(id));
    }
    protected abstract getPluginData<K extends keyof PluginNodeData>(
        key: K
    ): PluginNodeData[K];
    protected abstract setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ): void;
}
