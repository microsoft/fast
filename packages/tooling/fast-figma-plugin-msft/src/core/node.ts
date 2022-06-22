import { ColorRGBA64 } from "@microsoft/fast-colors";
import {
    AdditionalData,
    AppliedDesignTokens,
    AppliedRecipes,
    PluginNodeData,
    ReadonlyAppliedDesignTokens,
    ReadonlyAppliedRecipes,
    ReadonlyRecipeEvaluations,
    RecipeEvaluation,
    RecipeEvaluations,
    TOOL_FILL_COLOR_TOKEN,
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
    protected _componentDesignTokens?: AppliedDesignTokens;
    protected _componentRecipes?: AppliedRecipes;
    protected _localDesignTokens: AppliedDesignTokens = new AppliedDesignTokens();
    protected _recipeEvaluations: RecipeEvaluations = new RecipeEvaluations();
    protected _additionalData: AdditionalData = new AdditionalData();

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
            designTokens = new AppliedDesignTokens([
                ...parent.inheritedDesignTokens,
                ...(parent.componentDesignTokens
                    ? parent.componentDesignTokens
                    : new AppliedDesignTokens()),
                ...parent.localDesignTokens,
            ]);
        }

        // console.log("  PluginNode.inheritedDesignTokens", this.id, this.type, designTokens.entries());

        DesignTokenCache.set(this.id, designTokens);

        return designTokens;
    }

    protected loadRecipes(): void {
        const json = this.getPluginData("recipes");
        // console.log("  loadRecipes", this.id, this.type, json);
        this._recipes.deserialize(json);
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
        this._recipes = recipes;
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

    protected loadLocalDesignTokens(): void {
        const json = this.getPluginData("designTokens");
        // console.log("  loadLocalDesignTokens", this.id, this.type, json);
        this._localDesignTokens.deserialize(json);
    }

    /**
     * Gets a readonly map of design token overrides applied to this node.
     */
    public get localDesignTokens(): ReadonlyAppliedDesignTokens {
        return this._localDesignTokens;
    }

    public get componentDesignTokens(): ReadonlyAppliedDesignTokens {
        return this._componentDesignTokens as ReadonlyAppliedDesignTokens;
    }

    public abstract id: string;
    public abstract type: string;
    public abstract canHaveChildren(): boolean;
    public abstract children(): PluginNode[];
    public abstract parent(): PluginNode | null;
    public abstract supports(): Array<DesignTokenType>;

    /**
     * Sets the design tokens to the node and design tool.
     * @param tokens The complete design tokens override map.
     */
    public setDesignTokens(tokens: AppliedDesignTokens) {
        this._localDesignTokens = tokens;
        if (tokens.size) {
            const json = tokens.serialize();
            this.setPluginData("designTokens", json);
        } else {
            this.deletePluginData("designTokens");
        }

        this.invalidateDesignTokenCache();
    }

    protected loadRecipeEvaluations(): void {
        const json = this.getPluginData("recipeEvaluations");
        this._recipeEvaluations.deserialize(json);
    }

    /**
     * Gets a readonly map of recipe evaluations applied to this node.
     */
    public get recipeEvaluations(): ReadonlyRecipeEvaluations {
        return this._recipeEvaluations;
    }

    public setRecipeEvaluations(evaluations: RecipeEvaluations) {
        this._recipeEvaluations = evaluations;
        if (evaluations.size) {
            const json = evaluations.serialize();
            this.setPluginData("recipeEvaluations", json);
        } else {
            this.deletePluginData("recipeEvaluations");
        }
    }

    public get additionalData(): AdditionalData {
        return this._additionalData;
    }

    public abstract paint(data: RecipeEvaluation): void;

    /**
     * Retrieve the effective fill color for the node.
     * This color is communicated to color recipes as the fillColor context for a node.
     */
    public abstract getEffectiveFillColor(): ColorRGBA64 | null;

    /**
     * Handle components that have custom dark mode configuration, like logos or illustration.
     */
    public abstract handleManualDarkMode(): boolean;

    /**
     * Setup special handling for fill color. It should either be a recipe or a fixed color applied in the design tool.
     * Must be called after design tokens and recipe evaluations are loaded.
     */
    protected setupFillColor(): void {
        if (this.canHaveChildren()) {
            // console.log("  PluginNode.setupFillColor - checking", this.id, this.type);
            // If the fill color comes from a recipe, don't pass it again.
            let foundFill = false;
            this._recipeEvaluations.forEach(evaluations => {
                evaluations.forEach(evaluation => {
                    // console.log("    evaluation", evaluation.type, "value", evaluation.value);
                    if (
                        evaluation.type === DesignTokenType.backgroundFill ||
                        evaluation.type === DesignTokenType.layerFill
                    ) {
                        foundFill = true;
                    }
                });
            });
            if (!foundFill) {
                const nodeFillColor = this.getEffectiveFillColor();
                // console.log("    fill not found - effective color", nodeFillColor?.toStringHexRGB());
                if (nodeFillColor) {
                    // console.log("      PluginNode.setupFillColor - setting", TOOL_FILL_COLOR_TOKEN, this.id, this.type, nodeFillColor.toStringHexRGB());
                    this._additionalData.set(
                        TOOL_FILL_COLOR_TOKEN,
                        nodeFillColor.toStringHexRGB()
                    );
                }
            }
        }
    }

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
