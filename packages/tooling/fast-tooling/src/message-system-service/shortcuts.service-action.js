import { MessageSystemServiceAction } from "./message-system.service-action";
export function mapKeyboardEventToKeyConfig(e) {
    const keys = [];
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
export class ShortcutsAction extends MessageSystemServiceAction {
    constructor(config) {
        super(config);
        /**
         * Invokes the action
         */
        this.invoke = () => {
            this.getAction({
                keys: this.keys,
                name: this.name,
            })();
        };
        /**
         * Tests to see if this matches the keyboard event given
         */
        this.matches = e => {
            return this.shouldRunAction(mapKeyboardEventToKeyConfig(e));
        };
        this.shouldRunAction = keys => {
            let matchesKeys = true;
            const keysLength = this.keys.length;
            if (keys.length === keysLength) {
                for (let i = 0; i < keysLength; i++) {
                    if (
                        keys.findIndex(suppliedKey => {
                            // determine if this matches a specified keycode
                            if (
                                typeof suppliedKey.value === "string" &&
                                typeof this.keys[i].value === "string" &&
                                suppliedKey.value === this.keys[i].value
                            ) {
                                return true;
                                // determine if this matches a modifier keycode
                            } else if (
                                typeof suppliedKey.value === "undefined" &&
                                typeof this.keys[i].value === "undefined"
                            ) {
                                return (
                                    (this.keys[i].metaKey && suppliedKey.metaKey) ||
                                    (this.keys[i].shiftKey && suppliedKey.shiftKey) ||
                                    (this.keys[i].ctrlKey && suppliedKey.ctrlKey) ||
                                    (this.keys[i].altKey && suppliedKey.altKey)
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
        this.keys = config.keys;
        this.name = config.name;
    }
}
