import { DesignTokenType } from "./ui/design-token-registry";

/**
 * Optional scoping for a design token value. For instance, apply a token to a particular component or all "rest" states of any component.
 */
export class DesignTokenScope {
    public component?: string;
    public part?: string;
    public state?: string;
    public appearance?: string;
}

/**
 * A design token value applied to a node and optionally scoped.
 */
export class AppliedDesignToken<T> extends DesignTokenScope {
    public value?: T;
}

/**
 * A recipe applied to a node and optionally scoped.
 */
export class AppliedRecipe extends DesignTokenScope {}

/**
 * An attribute + value pair from an evaluated recipe.
 */
export class RecipeEvaluation {
    public type: DesignTokenType;
    public value: string;

    constructor(type: DesignTokenType, value: string) {
        this.type = type;
        this.value = value;
    }
}

function mapReplacer(key: string, value: any) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: [...value],
        };
    } else {
        return value;
    }
}

function mapReviver(key: string, value: any) {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }
    }
    return value;
}

/**
 * A Map that can be serialized to JSON and deserialized with correct typing.
 */
export class SerializableMap<K, V> extends Map<K, V> {
    public deserialize(json: string | undefined): void {
        if (this.size > 0) {
            throw "There are already entries in this Map. Expected empty Map.";
        }

        if (json) {
            try {
                const map = JSON.parse(json as string, mapReviver) as Map<K, V>;
                map.forEach((v, k) => {
                    this.set(k, v);
                });
            } catch (e) {
                // console.warn(e);
                // Ignore, empty string
            }
        }
    }

    public serialize(): string {
        const json = JSON.stringify(this, mapReplacer);
        return json;
    }
}

/**
 * Map of design tokens applied to a node. The key is the design token ID.
 */
export class AppliedDesignTokens extends SerializableMap<
    string,
    AppliedDesignToken<any>
> {}

/**
 * Readonly Map of design tokens applied to a node. The key is the design token ID.
 */
export type ReadonlyAppliedDesignTokens = ReadonlyMap<string, AppliedDesignToken<any>>;

/**
 * Map of recipes applied to a node. The key is the recipe ID.
 */
export class AppliedRecipes extends SerializableMap<string, AppliedRecipe> {}

/**
 * Readonly Map of recipes applied to a node. The key is the recipe ID.
 */
export type ReadonlyAppliedRecipes = ReadonlyMap<string, AppliedRecipe>;

/**
 * Map of recipe evaluations applied to a node. The key is the recipe ID.
 */
export class RecipeEvaluations extends SerializableMap<string, Array<RecipeEvaluation>> {}

/**
 * Readonly Map of recipe evaluations applied to a node. The key is the recipe ID.
 */
export type ReadonlyRecipeEvaluations = ReadonlyMap<string, Array<RecipeEvaluation>>;

/**
 * Defines the data stored by the plugin on a node instance.
 */
export interface PluginNodeData {
    /**
     * Design token overrides applied directly to the node.
     */
    designTokens: AppliedDesignTokens;

    /**
     * Recipes applied directly to the node.
     */
    recipes: AppliedRecipes;

    /**
     * Attribute and value pairs applied to the node evaluated from local and inherited recipes.
     */
    recipeEvaluations: RecipeEvaluations;
}
