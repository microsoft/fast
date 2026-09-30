import { Observable } from "../observation/observable.js";
import { createTypeRegistry, type TypeRegistry } from "../platform.js";
import type { FASTElementDefinition } from "./fast-definitions.js";

const globalRegisteredTypes: Record<string, Function> = {};

const registeredTypesByRegistry = new WeakMap<
    CustomElementRegistry,
    Record<string, Function>
>();

const typeRegistry = createTypeRegistry<FASTElementDefinition>();

/**
 * A WeakRef tagged with its owning Set, so the shared FinalizationRegistry
 * can remove it without a second lookup.
 */
type TrackedInstanceRef = WeakRef<object> & { owner: Set<TrackedInstanceRef> };

/**
 * Elements awaiting a definition's one-time template resolution, held weakly
 * and keyed by their definition. See {@link trackedFASTElementInstances}.
 */
const definitionInstances = new WeakMap<FASTElementDefinition, Set<TrackedInstanceRef>>();

/**
 * Guards against tracking the same instance twice, and gives constant-time
 * access to an instance's own ref.
 */
const instanceRefs = new WeakMap<object, TrackedInstanceRef>();

/**
 * Prunes a tracked instance once it is garbage collected. Not tied to
 * disconnection, since a pooled/virtualized element can reconnect without
 * being tracked again.
 */
const instanceCleanupRegistry = new FinalizationRegistry<TrackedInstanceRef>(ref =>
    ref.owner.delete(ref),
);

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
    register(definition: FASTElementDefinition): boolean {
        if (!typeRegistry.register(definition)) {
            return false;
        }

        const registeredTypes = getRegisteredTypes(definition.registry);

        if (!Object.prototype.hasOwnProperty.call(registeredTypes, definition.name)) {
            Observable.defineProperty(registeredTypes, definition.name);
        }

        registeredTypes[definition.name] = definition.type;

        return true;
    },
    getByType: typeRegistry.getByType,
    getForInstance: typeRegistry.getForInstance,
    whenRegistered,
});

function getRegisteredTypes(
    registry: CustomElementRegistry = customElements,
): Record<string, Function> {
    if (registry === customElements) {
        return globalRegisteredTypes;
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

/**
 * Tracks a live instance against its definition for later enumeration by
 * {@link trackedFASTElementInstances}. A no-op if already tracked; weakly
 * held, and auto-untracked on GC.
 * @param definition - The definition the instance was constructed from.
 * @param instance - The element instance to track.
 * @returns `true` if this is the definition's first tracked instance.
 * @internal
 */
export function trackFASTElementInstance(
    definition: FASTElementDefinition,
    instance: object,
): boolean {
    if (instanceRefs.has(instance)) {
        return false;
    }

    let instances = definitionInstances.get(definition);
    const isFirstInstance = instances === void 0;

    if (instances === void 0) {
        instances = new Set<TrackedInstanceRef>();
        definitionInstances.set(definition, instances);
    }

    const ref = new WeakRef(instance) as TrackedInstanceRef;
    ref.owner = instances;
    instances.add(ref);
    instanceRefs.set(instance, ref);
    instanceCleanupRegistry.register(instance, ref, ref);

    return isFirstInstance;
}

/**
 * Invokes the callback for every live instance tracked against the
 * definition, then forgets the definition entirely — safe since a
 * definition's template only resolves once.
 * @param definition - The definition to enumerate tracked instances for.
 * @param callback - Invoked once per live instance.
 * @internal
 */
export function trackedFASTElementInstances(
    definition: FASTElementDefinition,
    callback: (instance: any) => void,
): void {
    const instances = definitionInstances.get(definition);

    if (instances === void 0) {
        return;
    }

    definitionInstances.delete(definition);

    for (const ref of instances) {
        const instance = ref.deref();

        if (instance !== void 0) {
            callback(instance);
        }
    }
}
