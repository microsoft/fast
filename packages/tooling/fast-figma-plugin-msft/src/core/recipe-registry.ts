import { PluginNode } from "./node";

export enum RecipeTypes {
    backgroundFills = "backgroundFills",
    foregroundFills = "foregroundFills",
    strokeFills = "strokeFills",
    cornerRadius = "cornerRadius",
}

/**
 * An interface where all keys of RecipeTypes map to a type
 */
export type MappedRecipeTypes<T> = { [K in keyof typeof RecipeTypes]: T };

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

export class RecipeRegistry {
    private entries: { [id: string]: RecipeDefinition } = {};

    /**
     * Register a new recipe
     * @param recipe the recipe to register
     */
    public register(recipe: RecipeDefinition): void {
        const { id } = recipe;

        if (this.isRegistered(id)) {
            throw new Error(
                `Recipe of id ${id} has already been registered. You must unregister the registered recipe before registering with that ID.`
            );
        } else {
            this.entries[id] = recipe;
        }
    }

    /**
     * Unregister a recipe
     * @param id - the ID of the recipe to unregister
     */
    public unregister(id: string): void {
        delete this.register[id];
    }

    /**
     * Get a recipe definition by ID
     * @param id the id of the recipe
     */
    public get(id: string): RecipeDefinition {
        if (this.isRegistered(id)) {
            return this.entries[id];
        }

        throw new Error(`Recipe of id ${id} does not exist`);
    }

    /**
     * Determines if the recipe has been registered
     * @param id - the id of the recipe
     */
    public isRegistered(id: string): boolean {
        return this.entries.hasOwnProperty(id);
    }

    /**
     * Returns all entries of a given recipe type
     * @param type the recipe type to return entries of
     */
    public find(type: RecipeTypes): RecipeDefinition[] {
        return Object.values(this.entries).filter(value => value.type === type);
    }

    /**
     * Returns a serializable object representing the recipe, with all functional
     * data removed.
     *
     * @param id - the ID of the recipe to construct data for
     * @param node - the ID of the node we're constructing for. This will be provided to the evaluate function if it exists
     */
    public toData(id: string, node: PluginNode): RecipeData {
        const recipe = this.get(id);
        const { name, type, evaluate } = recipe;

        return {
            name,
            type,
            id,
            value: evaluate(node),
        };
    }
}
