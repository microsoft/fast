import type { FASTGlobal } from "./interfaces.js";

if (globalThis.FAST === void 0) {
    Reflect.defineProperty(globalThis, "FAST", {
        value: Object.create(null),
        configurable: false,
        enumerable: false,
        writable: false,
    });
}

const FAST: FASTGlobal = globalThis.FAST;

const debugMessages = {
    [1101 /* needsArrayObservation */]: "Must call enableArrayObservation before observing arrays.",
    [1201 /* onlySetHTMLPolicyOnce */]: "The HTML policy can only be set once.",
    [1202 /* bindingInnerHTMLRequiresTrustedTypes */]: "To bind innerHTML, you must use a TrustedTypesPolicy.",
    [1203 /* twoWayBindingRequiresObservables */]: "View=>Model update skipped. To use twoWay binding, the target property must be observable.",
    [1204 /* hostBindingWithoutHost */]: "No host element is present. Cannot bind host with ${name}.",
    [1205 /* unsupportedBindingBehavior */]: "The requested binding behavior is not supported by the binding engine.",
    [1401 /* missingElementDefinition */]: "Missing FASTElement definition.",
};

const allPlaceholders = /(\$\{\w+?})/g;
const placeholder = /\$\{(\w+?)}/g;
const noValues: Record<string, string> = Object.freeze({});

function formatMessage(message: string, values: Record<string, any>) {
    return message
        .split(allPlaceholders)
        .map(v => {
            const replaced = v.replace(placeholder, "$1");
            return values[replaced] || v;
        })
        .join("");
}

Object.assign(FAST, {
    addMessages(messages: Record<number, string>) {
        Object.assign(debugMessages, messages);
    },
    warn(code: number, values: Record<string, any> = noValues) {
        const message = debugMessages[code] ?? "Unknown Warning";
        console.warn(formatMessage(message, values));
    },
    error(code: number, values: Record<string, any> = noValues) {
        const message = debugMessages[code] ?? "Unknown Error";
        return new Error(formatMessage(message, values));
    },
});
