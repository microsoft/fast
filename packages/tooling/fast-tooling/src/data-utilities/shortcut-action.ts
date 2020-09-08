import { MessageSystemUtilityAction } from "./message-system-utility-action";
import { XOR } from "./type.utilities";

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

export type ModifierKey = XOR<XOR<XOR<AltKey, CtrlKey>, ShiftKey>, MetaKey>;

export interface SpecificKey {
    /**
     * The key string value
     */
    value: string;
}

export type KeyConfig = XOR<SpecificKey, ModifierKey>;

export interface ShortcutActionCallbackConfig {
    /**
     * The display name of the shortcut action
     */
    name: string;

    /**
     * The keys needed to execute the action
     */
    keys: KeyConfig[];
}

export function mapKeyboardEventToKeyConfig(e: KeyboardEvent): KeyConfig[] {
    const keys: KeyConfig[] = [];

    // all keys larger than 1 are special keys
    if (typeof e.key === "string" && e.key.length === 1) {
        keys.push({
            value: e.key,
        });
    }

    if (e.metaKey) {
        keys.push({
            metaKey: true,
        });
    }

    if (e.shiftKey) {
        keys.push({
            shiftKey: true,
        });
    }

    if (e.ctrlKey) {
        keys.push({
            ctrlKey: true,
        });
    }

    if (e.altKey) {
        keys.push({
            altKey: true,
        });
    }

    return keys;
}

export class ShortcutAction extends MessageSystemUtilityAction<ShortcutActionCallbackConfig, KeyboardEvent> {
    public keys: KeyConfig[];
    public name: string;

    constructor(config) {
        super(config);

        this.keys = config.keys;
        this.name = config.name;
    }

    /**
     * Invokes the action
     */
    public invoke = (): void => {
        this.getAction({
            keys: this.keys,
            name: this.name,
        })();
    };

    /**
     * Tests to see if this matches the keyboard event given
     */
    public matches = (e: KeyboardEvent): boolean => {
        return this.shouldRunAction(mapKeyboardEventToKeyConfig(e));
    };

    private shouldRunAction = (keys: KeyConfig[]): boolean => {
        let matchesKeys = true;
        const keysLength = this.keys.length;

        if (keys.length === keysLength) {
            for (let i = 0; i < keysLength; i++) {
                if (
                    keys.findIndex((suppliedKey: KeyConfig) => {
                        // determine if this matches a specified keycode
                        if (
                            typeof (suppliedKey as SpecificKey).value === "string" &&
                            typeof (this.keys[i] as SpecificKey).value === "string" &&
                            (suppliedKey as SpecificKey).value ===
                                (this.keys[i] as SpecificKey).value
                        ) {
                            return true;
                            // determine if this matches a modifier keycode
                        } else if (
                            typeof (suppliedKey as SpecificKey).value === "undefined" &&
                            typeof (this.keys[i] as SpecificKey).value === "undefined"
                        ) {
                            return (
                                ((this.keys[i] as MetaKey).metaKey &&
                                    (suppliedKey as MetaKey).metaKey) ||
                                ((this.keys[i] as ShiftKey).shiftKey &&
                                    (suppliedKey as ShiftKey).shiftKey) ||
                                ((this.keys[i] as CtrlKey).ctrlKey &&
                                    (suppliedKey as CtrlKey).ctrlKey) ||
                                ((this.keys[i] as AltKey).altKey &&
                                    (suppliedKey as AltKey).altKey)
                            );
                        }

                        return false;
                    }) === -1
                ) {
                    matchesKeys = false;
                }
            }
        } else {
            matchesKeys = false;
        }

        return matchesKeys;
    };
}
