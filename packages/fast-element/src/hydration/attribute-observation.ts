import { ElementRegistration } from "../components/element-registration.js";

const define = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(customElements),
    "define",
)?.value;
const arrayIterator = Object.getOwnPropertyDescriptor(
    Array.prototype,
    Symbol.iterator,
)?.value;
const unobservedMarkers = new WeakMap<object, boolean>();
const lifecycleCallbacks = [
    "connectedCallback",
    "disconnectedCallback",
    "connectedMoveCallback",
    "adoptedCallback",
    "attributeChangedCallback",
    "formAssociatedCallback",
    "formDisabledCallback",
    "formResetCallback",
    "formStateRestoreCallback",
];

function findDescriptor(
    object: object | null,
    key: PropertyKey,
): PropertyDescriptor | undefined {
    while (object !== null) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);
        if (descriptor !== void 0) return descriptor;
        object = Object.getPrototypeOf(object);
    }
}

function isMarkerUnobserved(
    type: CustomElementConstructor,
    registry: CustomElementRegistry,
    options?: ElementDefinitionOptions,
): boolean {
    if (
        typeof define !== "function" ||
        typeof arrayIterator !== "function" ||
        findDescriptor(registry, "define")?.value !== define ||
        findDescriptor(type, "formAssociated")?.get !== void 0 ||
        findDescriptor(type, "disabledFeatures") !== void 0 ||
        (options !== void 0 && findDescriptor(options, "extends")?.get !== void 0) ||
        lifecycleCallbacks.some(
            name => findDescriptor(type.prototype, name)?.get !== void 0,
        )
    ) {
        return false;
    }
    const names = findDescriptor(type, "observedAttributes")?.value;
    if (
        !Array.isArray(names) ||
        Object.getPrototypeOf(names) !== Array.prototype ||
        findDescriptor(names, Symbol.iterator)?.value !== arrayIterator
    ) {
        return false;
    }
    for (let i = 0; i < names.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(names, i);
        if (typeof descriptor?.value !== "string" || descriptor.value === "data-fe")
            return false;
    }
    return true;
}

function defineCustomElement(
    name: string,
    type: CustomElementConstructor,
    options: ElementDefinitionOptions,
    registry: CustomElementRegistry,
    wasDefined: boolean,
): void {
    const prototype = type.prototype;
    const previous = unobservedMarkers.get(prototype);
    // Earlier untracked registrations cannot acquire proof retroactively.
    unobservedMarkers.set(
        prototype,
        (previous === void 0 ? !wasDefined : previous) &&
            isMarkerUnobserved(type, registry, options),
    );
    try {
        registry.define(name, type, options);
    } catch (error) {
        if (previous === void 0) unobservedMarkers.delete(prototype);
        else unobservedMarkers.set(prototype, previous);
        throw error;
    }
}

/**
 * Installs registration-time marker tracking before synchronous upgrades.
 * @internal
 */
export function installAttributeObservation(): void {
    ElementRegistration.define = defineCustomElement;
}

/** @internal */
export function isHydrationMarkerUnobserved(element: Element): boolean {
    return unobservedMarkers.get(Object.getPrototypeOf(element)) === true;
}
