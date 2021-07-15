import { CustomMessage } from "../message-system";
import { ShortcutsActionCallbackConfig } from "./shortcuts.service-action";
import { MessageSystemService } from "./message-system.service";
export declare type shortcutsMessageSystemAction = "initialize";
export declare type shortcutsMessageSystemListenerType = "keypress";
export declare type shortcutsMessageId = "fast-tooling::shortcuts-service";
export declare const shortcutsId: shortcutsMessageId;
export interface ShortcutOptions {
    originatorId: shortcutsMessageId;
}
export interface ShortcutMessageOutgoing extends CustomMessage<{}, ShortcutOptions> {
    /**
     * The custom message id
     */
    id: shortcutsMessageId;
    /**
     * The action string
     */
    action: shortcutsMessageSystemAction;
    /**
     * The callback config returned when a shortcut is called
     */
    shortcuts: ShortcutsActionCallbackConfig[];
}
export interface ShortcutsConfig {
    /**
     * The shortcut event listener used to attach to a DOM node
     */
    eventListener: (e: KeyboardEvent) => void;
    /**
     * The event listener type used to define the listener type when
     * attaching the event listener to a DOM node
     */
    eventListenerType: shortcutsMessageSystemListenerType;
}
export interface ShortcutsRegisterConfig {
    id: shortcutsMessageId;
    config: ShortcutsConfig;
}
export declare class Shortcuts extends MessageSystemService<
    ShortcutsActionCallbackConfig,
    ShortcutsRegisterConfig
> {
    constructor(config: any);
    /**
     * The listener to attach to HTML elements
     */
    private listener;
    /**
     * Handles messages from the message system
     */
    handleMessageSystem: (e: MessageEvent) => void;
    getActionConfig: (id: string) => ShortcutsActionCallbackConfig;
}
