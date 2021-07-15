import { PluginNode } from "./node";
export declare enum RecipeTypes {
    backgroundFills = "backgroundFills",
    foregroundFills = "foregroundFills",
    strokeFills = "strokeFills",
    cornerRadius = "cornerRadius",
}
/**
 * An interface where all keys of RecipeTypes map to a type
 */
export declare type MappedRecipeTypes<T> = {
    [K in keyof typeof RecipeTypes]: T;
};
/**
 * Defines a generic recipe
 */
export interface RecipeDefinition<T extends {} = any> {
    /**
     * The name of the recipe
     */
    name: string;
    /**
     * Unique ID for the recipe
     */
    id: string;
    /**
     * The type of recipe
     */
    type: RecipeTypes;
    /**
     * Evaluates a recipe
     */
    evaluate: (node: PluginNode) => T;
}
/**
 * Defines all data associated with a recipe
 */
export interface RecipeData<T extends {} = any>
    extends Omit<RecipeDefinition<T>, "evaluate"> {
    value?: T;
}
export declare class RecipeRegistry {
    private entries;
    /**
     * Register a new recipe
     * @param recipe the recipe to register
     */
    register(recipe: RecipeDefinition): void;
    /**
     * Unregister a recipe
     * @param id - the ID of the recipe to unregister
     */
    unregister(id: string): void;
    /**
     * Get a recipe definition by ID
     * @param id the id of the recipe
     */
    get(id: string): RecipeDefinition;
    /**
     * Determines if the recipe has been registered
     * @param id - the id of the recipe
     */
    isRegistered(id: string): boolean;
    /**
     * Returns all entries of a given recipe type
     * @param type the recipe type to return entries of
     */
    find(type: RecipeTypes): RecipeDefinition[];
    /**
     * Returns a serializable object representing the recipe, with all functional
     * data removed.
     *
     * @param id - the ID of the recipe to construct data for
     * @param node - the ID of the node we're constructing for. This will be provided to the evaluate function if it exists
     */
    toData(id: string, node: PluginNode): RecipeData;
}
