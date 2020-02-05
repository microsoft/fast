export enum MessageTypes {
    recipe = "recipe",
}
/**
 * The type of action that a recipe message should perform.
 */
export enum RecipeMessageAction {
    /**
     * Assign a recipe to a node, removing all other recipes of the same type
     */
    assign = "assign",
}

export interface RecipeMessage {
    /**
     * Define this as a recipe message
     */
    type: MessageTypes.recipe;

    /**
     * The ID of the recipe
     */
    id: string;

    /**
     * The ID of the nodes in which the message is contextual to
     */
    nodeIds: string[];

    /**
     * The action to perfom
     */
    action: RecipeMessageAction;
}

export type UIMessage = RecipeMessage;
