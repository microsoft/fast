export var RecipeTypes;
(function (RecipeTypes) {
    RecipeTypes["backgroundFills"] = "backgroundFills";
    RecipeTypes["foregroundFills"] = "foregroundFills";
    RecipeTypes["strokeFills"] = "strokeFills";
    RecipeTypes["cornerRadius"] = "cornerRadius";
})(RecipeTypes || (RecipeTypes = {}));
export class RecipeRegistry {
    constructor() {
        this.entries = {};
    }
    /**
     * Register a new recipe
     * @param recipe the recipe to register
     */
    register(recipe) {
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
    unregister(id) {
        delete this.register[id];
    }
    /**
     * Get a recipe definition by ID
     * @param id the id of the recipe
     */
    get(id) {
        if (this.isRegistered(id)) {
            return this.entries[id];
        }
        throw new Error(`Recipe of id ${id} does not exist`);
    }
    /**
     * Determines if the recipe has been registered
     * @param id - the id of the recipe
     */
    isRegistered(id) {
        return this.entries.hasOwnProperty(id);
    }
    /**
     * Returns all entries of a given recipe type
     * @param type the recipe type to return entries of
     */
    find(type) {
        return Object.values(this.entries).filter(value => value.type === type);
    }
    /**
     * Returns a serializable object representing the recipe, with all functional
     * data removed.
     *
     * @param id - the ID of the recipe to construct data for
     * @param node - the ID of the node we're constructing for. This will be provided to the evaluate function if it exists
     */
    toData(id, node) {
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
