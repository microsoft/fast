import { DesignSystem } from "@microsoft/fast-components-styles-msft";
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
export abstract class PluginNode {
    public abstract id: string;
    public abstract type: string;
    public abstract children(): PluginNode[];
    public abstract parent(): PluginNode | null;
    public abstract supports(): Array<RecipeTypes | "designSystem">;

    /**
     * Retrieves the contextual design system for the node
     */
    public get designSystem(): Partial<DesignSystem> {
        let parent: PluginNode | null = this.parent();
        const initialDesignSystem = this.getPluginData("designSystem");

        /**
         * We need to delete the background color if it is set here because
         * we don't want to paint backgrounds on this node relative to
         * the node itself, background colors should always be painted relative
         * to the *parent*
         *
         * There is an issue here though, because *strokes* should be relative to the
         * node BG color, not the parent.
         */
        if (initialDesignSystem.hasOwnProperty("backgroundColor")) {
            delete initialDesignSystem.backgroundColor;
        }

        const designSystems: Array<Partial<DesignSystem>> = [initialDesignSystem];

        while (parent !== null) {
            designSystems.push(parent.getPluginData("designSystem"));

            parent = parent.parent();
        }

        return designSystems.reduceRight((prev, next) => ({ ...prev, ...next }));
    }

    public get recipes(): string[] {
        return this.getPluginData("recipes");
    }

    public set recipes(recipes: string[]) {
        this.setPluginData("recipes", recipes);
    }

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
    }

    public deleteDesignSystemProperty<K extends keyof DesignSystem>(key: K): void {
        const data = this.getPluginData("designSystem");
        delete data[key];
        this.setPluginData("designSystem", data);
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
}
