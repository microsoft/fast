import { Observable } from "../observation/observable.js";
import {
    createTypeRegistry,
    type TypeDefinition,
    type TypeRegistry,
} from "../platform.js";
import type { FASTElementDefinition } from "./fast-definitions.js";

export type { TypeDefinition, TypeRegistry };

export const globalFASTElementRegisteredTypes: Record<string, Function> = {};

const registeredTypesByRegistry = new WeakMap<
    CustomElementRegistry,
    Record<string, Function>
>();

/**
 * The FAST custom element registry.
 * @public
 */
export interface FASTElementRegistry extends TypeRegistry<FASTElementDefinition> {
    /**
     * Resolves when a FAST element definition has been registered for the tag name.
     * @param name - The custom element tag name.
     * @param registry - The custom element registry to observe.
     */
    whenRegistered(
        name: string,
        registry?: CustomElementRegistry,
    ): Promise<FASTElementDefinition>;
}

/**
 * The FAST custom element registry.
 * @remarks
 * This registry stores FAST element definitions by constructor so consumers can
 * look up the `FASTElementDefinition` associated with an element type, instance,
 * or registered tag name.
 * @public
 */
export const fastElementRegistry: FASTElementRegistry = Object.freeze({
    ...createTypeRegistry<FASTElementDefinition>(),
    whenRegistered,
});

/**
 * Gets the observable custom-element registration map for a registry.
 * @internal
 */
export function getRegisteredTypes(
    registry: CustomElementRegistry = customElements,
): Record<string, Function> {
    if (registry === customElements) {
        return globalFASTElementRegisteredTypes;
    }

    let registeredTypes = registeredTypesByRegistry.get(registry);

    if (!registeredTypes) {
        registeredTypes = {};
        registeredTypesByRegistry.set(registry, registeredTypes);
    }

    return registeredTypes;
}

function getDefinitionForType(
    type: Function | undefined,
): FASTElementDefinition | undefined {
    return type === void 0 ? void 0 : fastElementRegistry.getByType(type);
}

function whenRegistered(
    name: string,
    registry: CustomElementRegistry = customElements,
): Promise<FASTElementDefinition> {
    const registeredTypes = getRegisteredTypes(registry);

    if (!Object.prototype.hasOwnProperty.call(registeredTypes, name)) {
        Observable.defineProperty(registeredTypes, name);
    }

    const definition = getDefinitionForType(registeredTypes[name]);

    if (definition !== void 0) {
        return Promise.resolve(definition);
    }

    return new Promise(resolve => {
        const notifier = Observable.getNotifier(registeredTypes);
        const subscriber = {
            handleChange: () => {
                const definition = getDefinitionForType(registeredTypes[name]);

                if (definition === void 0) {
                    return;
                }

                notifier.unsubscribe(subscriber, name);
                resolve(definition);
            },
        };

        notifier.subscribe(subscriber, name);
    });
}
