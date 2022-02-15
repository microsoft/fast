import { ColorRGBA64 } from "@microsoft/fast-colors";
import {
    AppliedDesignToken,
    AppliedDesignTokens,
    AppliedRecipes,
    PluginNodeData,
    ReadonlyAppliedDesignTokens,
    ReadonlyAppliedRecipes,
    ReadonlyRecipeEvaluations,
    RecipeEvaluation,
    RecipeEvaluations,
} from "./model";
import { DesignTokenType } from "./ui/design-token-registry";

const DesignTokenCache: Map<string, ReadonlyAppliedDesignTokens> = new Map();

/**
 * The abstract class the plugin Controller interacts with.
 * Acts as a basic intermediary for node structure and data storage only.
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export abstract class PluginNode {
    protected _recipes: AppliedRecipes = new AppliedRecipes();
    protected _componentRecipes?: AppliedRecipes;

    /**
     * Retrieves the design token overrides on ancestor nodes.
     */
    public get inheritedDesignTokens(): ReadonlyAppliedDesignTokens {
        // Return value from the cache if we have it
        if (DesignTokenCache.has(this.id)) {
            return DesignTokenCache.get(this.id) as ReadonlyAppliedDesignTokens;
        }

        let designTokens = new AppliedDesignTokens();
        const parent = this.parent();
        if (parent !== null) {
            // This is a bit fragile, but seems like the best way to incorporate this under the current model.
            const fillColorMap = new AppliedDesignTokens();
            const parentFillColor = parent.getEffectiveFillColor();
            if (parentFillColor) {
                const fillColorToken = new AppliedDesignToken<string>();
                fillColorToken.value = parentFillColor.toStringHexRGB();
                // console.log("  PluginNode.inheritedDesignTokens - parent fillColor", parent.id, parent.type, fillColorToken.value);
                fillColorMap.set("fillColor", fillColorToken);
            }
            designTokens = new AppliedDesignTokens([
                ...parent.inheritedDesignTokens,
                ...fillColorMap,
                ...parent.localDesignTokens,
            ]);
        }

        // console.log("  PluginNode.inheritedDesignTokens", this.id, this.type, designTokens.entries());

        DesignTokenCache.set(this.id, designTokens);

        return designTokens;
    }

    /**
     * Gets a readonly map of recipes applied to this node.
     */
    public get recipes(): ReadonlyAppliedRecipes {
        return this._recipes as ReadonlyAppliedRecipes;
    }

    /**
     * Sets the recipes to the node and design tool.
     * @param recipes The complete applied recipes map.
     */
    public setRecipes(recipes: AppliedRecipes) {
        if (recipes.size) {
            const json = recipes.serialize();
            this.setPluginData("recipes", json);
        } else {
            this.deletePluginData("recipes");
        }
    }

    public get componentRecipes(): ReadonlyAppliedRecipes | undefined {
        return this._componentRecipes as ReadonlyAppliedRecipes;
    }

    /**
     * Gets a readonly map of design token overrides applied to this node.
     */
    public get localDesignTokens(): ReadonlyAppliedDesignTokens {
        const json = this.getPluginData("designTokens");
        const map = new AppliedDesignTokens();
        map.deserialize(json);
        return map;
    }

    public get componentDesignTokens(): ReadonlyAppliedDesignTokens {
        return new AppliedDesignTokens();
    }

    public abstract id: string;
    public abstract type: string;
    public abstract children(): PluginNode[];
    public abstract parent(): PluginNode | null;
    public abstract supports(): Array<DesignTokenType>;

    /**
     * Sets the design tokens to the node and design tool.
     * @param tokens The complete design tokens override map.
     */
    public setDesignTokens(tokens: AppliedDesignTokens) {
        if (tokens.size) {
            const json = tokens.serialize();
            this.setPluginData("designTokens", json);
        } else {
            this.deletePluginData("designTokens");
        }

        this.invalidateDesignTokenCache();
    }

    /**
     * Gets a readonly map of recipe evaluations applied to this node.
     */
    public get recipeEvaluations(): ReadonlyRecipeEvaluations {
        const json = this.getPluginData("recipeEvaluations");
        const map = new RecipeEvaluations();
        map.deserialize(json);
        return map;
    }

    public setRecipeEvaluations(evaluations: RecipeEvaluations) {
        if (evaluations.size) {
            const json = evaluations.serialize();
            this.setPluginData("recipeEvaluations", json);
        } else {
            this.deletePluginData("recipeEvaluations");
        }
    }

    public abstract paint(data: RecipeEvaluation): void;

    /**
     * Retrieve the effective fill color for the node.
     * This color is communicated to color recipes as the fillColor context for a node.
     */
    public abstract getEffectiveFillColor(): ColorRGBA64 | null;

    /**
     * Delete entries in the design token cache for this node and any child nodes.
     */
    private invalidateDesignTokenCache(): void {
        function getIds(node: PluginNode): string[] {
            let found = [node.id];

            node.children().forEach((child: PluginNode) => {
                found = found.concat(getIds(child));
            });

            return found;
        }

        getIds(this).forEach((id: string) => DesignTokenCache.delete(id));
    }

    /**
     * Gets custom data from the design tool storage.
     * @param key The data storage key.
     */
    protected abstract getPluginData<K extends keyof PluginNodeData>(
        key: K
    ): string | undefined;

    /**
     * Sets custom data to the design tool storage.
     * @param key The data storage key.
     * @param value The new serialized value.
     */
    protected abstract setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: string
    ): void;

    /**
     * Deletes custom data from the design tool storage.
     * @param key The data storage key.
     */
    protected abstract deletePluginData<K extends keyof PluginNodeData>(key: K): void;
}
