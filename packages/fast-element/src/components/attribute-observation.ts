const define = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(customElements),
    "define",
)?.value;
const arrayIterator = Object.getOwnPropertyDescriptor(
    Array.prototype,
    Symbol.iterator,
)?.value;
const observedAttributes = new WeakMap<object, ReadonlySet<string> | null>();
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

function captureObservedAttributes(
    type: CustomElementConstructor,
    registry: CustomElementRegistry,
    options?: ElementDefinitionOptions,
): ReadonlySet<string> | null {
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
        return null;
    }
    const names = findDescriptor(type, "observedAttributes")?.value;
    if (
        !Array.isArray(names) ||
        Object.getPrototypeOf(names) !== Array.prototype ||
        findDescriptor(names, Symbol.iterator)?.value !== arrayIterator
    ) {
        return null;
    }
    const snapshot = new Set<string>();
    for (let i = 0; i < names.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(names, i);
        if (typeof descriptor?.value !== "string") return null;
        snapshot.add(descriptor.value);
    }
    return snapshot;
}

/**
 * Records a conservative platform observation snapshot before synchronous upgrades.
 * @internal
 */
export function defineCustomElement(
    name: string,
    type: CustomElementConstructor,
    options: ElementDefinitionOptions,
    registry: CustomElementRegistry,
): void {
    const prototype = type.prototype;
    const previous = observedAttributes.get(prototype);
    const snapshot = captureObservedAttributes(type, registry, options);
    observedAttributes.set(
        prototype,
        previous === null || snapshot === null
            ? null
            : previous === void 0
              ? snapshot
              : new Set([...previous, ...snapshot]),
    );
    try {
        registry.define(name, type, options);
    } catch (error) {
        if (previous === void 0) observedAttributes.delete(prototype);
        else observedAttributes.set(prototype, previous);
        throw error;
    }
}

/** @internal */
export function isAttributeUnobserved(element: Element, name: string): boolean {
    return observedAttributes.get(Object.getPrototypeOf(element))?.has(name) === false;
}
