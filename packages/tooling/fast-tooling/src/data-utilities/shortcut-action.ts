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

export type ModifierKey = AltKey | CtrlKey | ShiftKey | MetaKey;

export interface SpecificKey {
    /**
     * The key string value
     */
    value: string;
}

export type KeyConfig = SpecificKey | ModifierKey;

export interface ShortcutActionConfig {
    /**
     * The display name of the shortcut action
     */
    name: string;

    /**
     * The keys needed to execute the action
     */
    keys: KeyConfig[];

    /**
     * The action to take when the keycodes have been pressed
     */
    action: () => void;
}

export class ShortcutAction {
    private action: () => void;
    public keys: KeyConfig[];
    public name: string;

    constructor(config: ShortcutActionConfig) {
        this.action = config.action;
        this.keys = config.keys;
        this.name = config.name;
    }

    public runAction = (keys: KeyConfig[]): void => {
        if (this.shouldRunAction(keys)) {
            this.action();
        }
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
