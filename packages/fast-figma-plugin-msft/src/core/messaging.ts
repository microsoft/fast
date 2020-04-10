import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { RecipeTypes } from "./recipe-registry";

export enum MessageTypes {
    recipe = "recipe",
    designSystem = "designSystem",
    reset = "reset",
    sync = "sync",
}

interface UIMessageBase<T extends MessageTypes> {
    nodeIds: string[];
    type: T;
}
/**
 * The type of action that a recipe message should perform.
 */
export enum MessageAction {
    assign = "assign",
    delete = "delete",
}

export interface AssignRecipeMessage extends UIMessageBase<MessageTypes.recipe> {
    /**
     * The ID of the recipe
     */
    id: string;

    /**
     * The action to perform
     */
    action: MessageAction.assign;
}

export interface RemoveRecipeMessage extends UIMessageBase<MessageTypes.recipe> {
    recipeType: RecipeTypes;

    action: MessageAction.delete;
}

export interface SetDesignSystemPropertyMessage<T extends keyof DesignSystem>
    extends UIMessageBase<MessageTypes.designSystem> {
    action: MessageAction.assign;
    property: T;
    value: DesignSystem[T];
}

export interface RemoveDesignSystemPropertyMessage<T extends keyof DesignSystem>
    extends UIMessageBase<MessageTypes.designSystem> {
    action: MessageAction.delete;
    property: T;
}

export type DesignSystemMessage =
    | SetDesignSystemPropertyMessage<keyof DesignSystem>
    | RemoveDesignSystemPropertyMessage<keyof DesignSystem>;

export type UIMessage =
    | AssignRecipeMessage
    | RemoveRecipeMessage
    | DesignSystemMessage
    | UIMessageBase<MessageTypes.reset>
    | UIMessageBase<MessageTypes.sync>;
