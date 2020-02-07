import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { RecipeRegistry, RecipeTypes } from "./recipe-registry";

export enum MessageTypes {
    recipe = "recipe",
    designSystem = "designSystem",
}

interface UIMessageBase<T extends MessageTypes> {
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
    nodeIds: string[];
}
export interface RemoveDesignSystemPropertyMessage<T extends keyof DesignSystem>
    extends UIMessageBase<MessageTypes.designSystem> {
    action: MessageAction.delete;
    property: T;
    nodeIds: string[];
}

export type DesignSystemMessage =
    | SetDesignSystemPropertyMessage<keyof DesignSystem>
    | RemoveDesignSystemPropertyMessage<keyof DesignSystem>;
export type UIMessage = RecipeMessage | DesignSystemMessage;
