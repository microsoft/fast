/**
 * The FAST global.
 * @public
 */
export interface FASTGlobal {
    /**
     * Gets a kernel value.
     * @param id - The id to get the value for.
     * @param initialize - Creates the initial value for the id if not already existing.
     */
    getById<T>(id: string | number): T | null;
    getById<T>(id: string | number, initialize: () => T): T;

    /**
     * Sends a warning to the developer.
     * @param code - The warning code to send.
     * @param values - Values relevant for the warning message.
     */
    warn(code: number, values?: Record<string, any>): void;

    /**
     * Creates an error.
     * @param code - The error code to send.
     * @param values - Values relevant for the error message.
     */
    error(code: number, values?: Record<string, any>): Error;

    /**
     * Adds debug messages for errors and warnings.
     * @param messages - The message dictionary to add.
     * @remarks
     * Message can include placeholders like $\{name\} which can be
     * replaced by values passed at runtime.
     */
    addMessages(messages: Record<number, string>): void;
}

let kernelMode;
const kernelAttr = "fast-kernel";

try {
    if (document.currentScript) {
        kernelMode = document.currentScript.getAttribute(kernelAttr);
    } else {
        const scripts = document.getElementsByTagName("script");
        const currentScript = scripts[scripts.length - 1];
        kernelMode = currentScript.getAttribute(kernelAttr);
    }
} catch {
    kernelMode = "isolate";
}

/**
 * Core services that can be shared across FAST instances.
 * @internal
 */
type KernelServiceIdShape = {
    readonly updateQueue: string | number;
    readonly observable: string | number;
    readonly contextEvent: string | number;
    readonly elementRegistry: string | number;
};

/**
 * Core services that can be shared across FAST instances.
 * @internal
 */
export const KernelServiceId: KernelServiceIdShape = (() => {
    switch (kernelMode) {
        case "share":
            return Object.freeze({
                updateQueue: 1,
                observable: 2,
                contextEvent: 3,
                elementRegistry: 4,
            });
        case "share-v2":
            return Object.freeze({
                updateQueue: 1.2,
                observable: 2.2,
                contextEvent: 3.2,
                elementRegistry: 4.2,
            });
        default: {
            const postfix = `-${Math.random().toString(36).substring(2, 8)}`;
            return Object.freeze({
                updateQueue: `1.2${postfix}`,
                observable: `2.2${postfix}`,
                contextEvent: `3.2${postfix}`,
                elementRegistry: `4.2${postfix}`,
            });
        }
    }
})();
