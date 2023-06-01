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
    [1101 /* needsArrayObservation */]:
        "Must call enableArrayObservation before observing arrays.",
    [1201 /* onlySetDOMPolicyOnce */]: "The DOM Policy can only be set once.",
    [1202 /* bindingInnerHTMLRequiresTrustedTypes */]:
        "To bind innerHTML, you must use a TrustedTypesPolicy.",
    [1203 /* twoWayBindingRequiresObservables */]:
        "View=>Model update skipped. To use twoWay binding, the target property must be observable.",
    [1204 /* hostBindingWithoutHost */]:
        "No host element is present. Cannot bind host with ${name}.",
    [1205 /* unsupportedBindingBehavior */]:
        "The requested binding behavior is not supported by the binding engine.",
    [1206 /* directCallToHTMLTagNotAllowed */]:
        "Calling html`` as a normal function invalidates the security guarantees provided by FAST.",
    [1207 /* onlySetTemplatePolicyOnce */]:
        "The DOM Policy for an HTML template can only be set once.",
    [1208 /* cannotSetTemplatePolicyAfterCompilation */]:
        "The DOM Policy cannot be set after a template is compiled.",
    [1209 /* blockedByDOMPolicy */]:
        "'${aspectName}' on '${tagName}' is blocked by the current DOMPolicy.",
    [1401 /* missingElementDefinition */]: "Missing FASTElement definition.",
    [1501 /* noRegistrationForContext */]:
        "No registration for Context/Interface '${name}'.",
    [1502 /* noFactoryForResolver */]:
        "Dependency injection resolver for '${key}' returned a null factory.",
    [1503 /* invalidResolverStrategy */]:
        "Invalid dependency injection resolver strategy specified '${strategy}'.",
    [1504 /* cannotAutoregisterDependency */]: "Unable to autoregister dependency.",
    [1505 /* cannotResolveKey */]: "Unable to resolve dependency injection key '${key}'.",
    [1506 /* cannotConstructNativeFunction */]:
        "'${name}' is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.",
    [1507 /* cannotJITRegisterNonConstructor */]:
        "Attempted to jitRegister something that is not a constructor '${value}'. Did you forget to register this dependency?",
    [1508 /* cannotJITRegisterIntrinsic */]:
        "Attempted to jitRegister an intrinsic type '${value}'. Did you forget to add @inject(Key)?",
    [1509 /* cannotJITRegisterInterface */]:
        "Attempted to jitRegister an interface '${value}'.",
    [1510 /* invalidResolver */]:
        "A valid resolver was not returned from the register method.",
    [1511 /* invalidKey */]:
        "Key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?",
    [1512 /* noDefaultResolver */]:
        "'${key}' not registered. Did you forget to add @singleton()?",
    [1513 /* cyclicDependency */]: "Cyclic dependency found '${name}'.",
    [1514 /* connectUpdateRequiresController */]:
        "Injected properties that are updated on changes to DOM connectivity require the target object to be an instance of FASTElement.",
};

const allPlaceholders = /(\$\{\w+?})/g;
const placeholder = /\$\{(\w+?)}/g;
const noValues: Record<string, string> = Object.freeze({});

function formatMessage(message: string, values: Record<string, any>) {
    return message
        .split(allPlaceholders)
        .map(v => {
            const replaced = v.replace(placeholder, "$1");
            return String(values[replaced] ?? v);
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
