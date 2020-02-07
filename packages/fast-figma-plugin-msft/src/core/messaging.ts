import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { RecipeRegistry, RecipeTypes } from "./recipe-registry";

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

export interface RecipeMessage extends UIMessageBase<MessageTypes.recipe> {
    /**
     * The ID of the recipe
     */
    id: string;

    /**
     * The ID of the nodes in which the message is contextual to
     */
    nodeIds: string[];

    /**
     * The action to perform
     */
    action: MessageAction;
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
    | RecipeMessage
    | DesignSystemMessage
    | UIMessageBase<MessageTypes.reset>
    | UIMessageBase<MessageTypes.sync>;
