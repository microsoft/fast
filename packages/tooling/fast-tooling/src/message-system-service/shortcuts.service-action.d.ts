import { XOR } from "../data-utilities/type.utilities";
import { MessageSystemServiceAction } from "./message-system.service-action";
import { ActionNotFound } from "./message-system.service";
export interface MetaKey {
    metaKey: true;
}
export interface ShiftKey {
    shiftKey: true;
}
export interface CtrlKey {
    ctrlKey: true;
}
export interface AltKey {
    altKey: true;
}
export declare type ModifierKey = XOR<XOR<XOR<AltKey, CtrlKey>, ShiftKey>, MetaKey>;
export interface SpecificKey {
    /**
     * The key string value
     */
    value: string;
}
export declare type KeyConfig = XOR<SpecificKey, ModifierKey>;
export interface ShortcutsActionCallbackConfigSuccess {
    /**
     * The display name of the shortcut action
     */
    name: string;
    /**
     * The keys needed to execute the action
     */
    keys: KeyConfig[];
}
export declare type ShortcutsActionCallbackConfig = XOR<
    ShortcutsActionCallbackConfigSuccess,
    ActionNotFound
>;
export declare function mapKeyboardEventToKeyConfig(e: KeyboardEvent): KeyConfig[];
export declare class ShortcutsAction extends MessageSystemServiceAction<
    ShortcutsActionCallbackConfig,
    KeyboardEvent
> {
    keys: KeyConfig[];
    name: string;
    constructor(config: any);
    /**
     * Invokes the action
     */
    invoke: () => void;
    /**
     * Tests to see if this matches the keyboard event given
     */
    matches: (e: KeyboardEvent) => boolean;
    private shouldRunAction;
}
