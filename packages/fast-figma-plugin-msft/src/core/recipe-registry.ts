import { PluginNode } from "./node";
import { intersection } from "lodash-es";

export interface RecipeDefinition {
    /**
     * The name of the recipe
     */
    name: string;

    /**
     * Unique ID for the recipe
     */
    id: string;

    /**
     * Arbitrary categories to associate the recipe to
     */
    categories: string[];

    /**
     * Applies the recipe to a node
     */
    evaluate: (node: PluginNode) => void;
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
     * Applies a recipe to node
     * @param id - the ID of the recipe to apply
     * @param node - the node to evaluate the plugin on
     */
    public apply(id: string, node: PluginNode): void {
        this.get(id).evaluate(node);
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

    public find(...categories: string[]): RecipeDefinition[] {
        return Object.values(this.entries).filter(
            value => intersection(value.categories, categories).length
        );
    }
}
