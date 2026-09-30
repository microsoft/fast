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
 * A WeakRef tagged with the Set it belongs to, so the single shared
 * FinalizationRegistry below can remove it without a second lookup structure.
 */
type TrackedInstanceRef = WeakRef<object> & { owner: Set<TrackedInstanceRef> };

/**
 * Elements awaiting a template change, held weakly and keyed by their definition.
 * A definition outlives every element it describes, so tracking them strongly here
 * would keep each one alive for the lifetime of the page.
 */
const definitionInstances = new WeakMap<FASTElementDefinition, Set<TrackedInstanceRef>>();

/**
 * Guards against tracking the same instance twice for a definition, and gives
 * constant-time access to an instance's own ref.
 */
const instanceRefs = new WeakMap<object, TrackedInstanceRef>();

/**
 * Prunes a definition's tracked instance once it is actually garbage collected.
 * This keeps long-lived definitions (in particular declarative ones, whose template
 * is set once and never notifies again) from accumulating dead refs indefinitely as
 * elements are created and discarded over the page's life. Pruning is intentionally
 * not tied to element disconnection, since a disconnected element can be reconnected
 * later (e.g. pooled/virtualized rows) without being tracked again, and would then
 * be wrongly dropped from future template updates.
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
 * Tracks a live element instance against its definition, so
 * {@link forEachTrackedFASTElementInstance} can later enumerate it. Tracking the
 * same instance more than once for the same definition is a no-op. The instance is
 * held weakly and is automatically untracked once it is garbage collected.
 * @param definition - The definition the instance was constructed from.
 * @param instance - The element instance to track.
 * @internal
 */
export function trackFASTElementInstance(
    definition: FASTElementDefinition,
    instance: object,
): void {
    if (instanceRefs.has(instance)) {
        return;
    }

    let instances = definitionInstances.get(definition);

    if (instances === void 0) {
        instances = new Set<TrackedInstanceRef>();
        definitionInstances.set(definition, instances);
    }

    const ref = new WeakRef(instance) as TrackedInstanceRef;
    ref.owner = instances;
    instances.add(ref);
    instanceRefs.set(instance, ref);
    instanceCleanupRegistry.register(instance, ref, ref);
}

/**
 * Invokes the callback once for every currently live element instance tracked
 * against the specified definition, pruning any dead references encountered along
 * the way.
 * @param definition - The definition to enumerate tracked instances for.
 * @param callback - Invoked once per live instance.
 * @internal
 */
export function forEachTrackedFASTElementInstance(
    definition: FASTElementDefinition,
    callback: (instance: any) => void,
): void {
    const instances = definitionInstances.get(definition);

    if (instances === void 0) {
        return;
    }

    for (const ref of Array.from(instances)) {
        const instance = ref.deref();

        if (instance === void 0) {
            instances.delete(ref);
            continue;
        }

        callback(instance);
    }
}
