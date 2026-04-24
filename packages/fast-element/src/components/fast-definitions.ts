import {
    type Constructable,
    isFunction,
    isString,
    KernelServiceId,
} from "../interfaces.js";
import { Observable } from "../observation/observable.js";
import { createTypeRegistry, FAST, type TypeRegistry } from "../platform.js";
import { type ComposableStyles, ElementStyles } from "../styles/element-styles.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { type AttributeConfiguration, AttributeDefinition } from "./attributes.js";

const defaultShadowOptions: ShadowRootInit = { mode: "open" };
const defaultElementOptions: ElementDefinitionOptions = {};
const fastElementBaseTypes = new Set<Function>();

/**
 * The FAST custom element registry
 * @internal
 */
export const fastElementRegistry: TypeRegistry<FASTElementDefinition> = FAST.getById(
    KernelServiceId.elementRegistry,
    () => createTypeRegistry<FASTElementDefinition>(),
);

export type { TypeRegistry };

/**
 * Shadow root initialization options.
 * @public
 */
export interface ShadowRootOptions extends ShadowRootInit {
    /**
     * A registry that provides the custom elements visible
     * from within this shadow root.
     * @beta
     */
    registry?: CustomElementRegistry;
}

/**
 * Lifecycle callbacks for template events.
 * @public
 */
export interface TemplateLifecycleCallbacks {
    /**
     * Called after the template has been assigned to the definition
     */
    templateDidUpdate?(name: string): void;

    /**
     * Called after the custom element has been defined
     */
    elementDidDefine?(name: string): void;
}

/**
 * A callback that receives a FASTElementDefinition during element registration.
 * Extensions are invoked before the element is registered with the platform,
 * allowing plugins to inspect or act on the resolved definition.
 * @public
 */
export type FASTElementExtension = (definition: FASTElementDefinition) => void;

/**
 * Resolves an element template from a composed definition.
 * @public
 */
export type FASTElementTemplateResolver<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
> = (
    definition: FASTElementDefinition<TType>,
) =>
    | ElementViewTemplate<InstanceType<TType>>
    | Promise<ElementViewTemplate<InstanceType<TType>>>;

type FASTElementTemplateSource<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
> = ElementViewTemplate<InstanceType<TType>> | FASTElementTemplateResolver<TType>;

const templateResolvers = new WeakMap<
    FASTElementDefinition<Constructable<HTMLElement>>,
    FASTElementTemplateResolver<Constructable<HTMLElement>>
>();

const pendingTemplateResolutions = new WeakMap<
    FASTElementDefinition<Constructable<HTMLElement>>,
    Promise<ElementViewTemplate<HTMLElement> | undefined>
>();

const templateResolutionErrors = new WeakMap<
    FASTElementDefinition<Constructable<HTMLElement>>,
    unknown
>();

const registeredTypesByRegistry = new WeakMap<
    CustomElementRegistry,
    Record<string, Function>
>();

const extensionRegistries = new WeakMap<
    FASTElementDefinition<Constructable<HTMLElement>>,
    WeakSet<CustomElementRegistry>
>();

const lateAttributeLookups = new WeakMap<
    FASTElementDefinition<Constructable<HTMLElement>>,
    Record<string, AttributeDefinition>
>();

function isFASTElementTemplateResolver<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
>(
    value: FASTElementTemplateSource<TType> | undefined,
): value is FASTElementTemplateResolver<TType> {
    return isFunction(value);
}

function isPromiseLike<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
    return typeof (value as PromiseLike<T> | undefined)?.then === "function";
}

function getRegisteredTypes(
    registry: CustomElementRegistry = customElements,
): Record<string, Function> {
    if (registry === customElements) {
        return FASTElementDefinition.isRegistered;
    }

    let registeredTypes = registeredTypesByRegistry.get(registry);

    if (!registeredTypes) {
        registeredTypes = {};
        registeredTypesByRegistry.set(registry, registeredTypes);
    }

    return registeredTypes;
}

function finalizeResolvedTemplate<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
>(
    definition: FASTElementDefinition<TType>,
    template?: ElementViewTemplate<InstanceType<TType>>,
): ElementViewTemplate<InstanceType<TType>> | undefined {
    pendingTemplateResolutions.delete(
        definition as FASTElementDefinition<Constructable<HTMLElement>>,
    );

    if (definition.template === void 0 && template !== void 0) {
        definition.template = template;
        definition.lifecycleCallbacks?.templateDidUpdate?.(definition.name);
    }

    if (definition.template !== void 0) {
        templateResolutionErrors.delete(
            definition as FASTElementDefinition<Constructable<HTMLElement>>,
        );
        templateResolvers.delete(
            definition as FASTElementDefinition<Constructable<HTMLElement>>,
        );

        return definition.template;
    }

    return void 0;
}

/**
 * Applies extension callbacks to a FAST element definition.
 * @internal
 */
export function applyFASTElementExtensions(
    definition: FASTElementDefinition,
    registry: CustomElementRegistry = definition.registry,
    extensions?: FASTElementExtension[],
): void {
    if (!extensions?.length) {
        return;
    }

    const typedDefinition = definition as FASTElementDefinition<
        Constructable<HTMLElement>
    >;
    let registries = extensionRegistries.get(typedDefinition);

    if (registries?.has(registry)) {
        return;
    }

    if (registries === void 0) {
        registries = new WeakSet<CustomElementRegistry>();
        extensionRegistries.set(typedDefinition, registries);
    }

    registries.add(registry);

    for (const extension of extensions) {
        extension(definition);
    }
}

/**
 * Tracks attribute definitions that were added after the element was already
 * registered with the platform and therefore are not covered by the browser's
 * static observedAttributes snapshot.
 * @internal
 */
export function trackLateAttributeDefinition(
    definition: FASTElementDefinition,
    attribute: AttributeDefinition,
): void {
    const typedDefinition = definition as FASTElementDefinition<
        Constructable<HTMLElement>
    >;
    let lateAttributeLookup = lateAttributeLookups.get(typedDefinition);

    if (lateAttributeLookup === void 0) {
        const lookup: Record<string, AttributeDefinition> = Object.create(null);
        lateAttributeLookups.set(typedDefinition, lookup);
        lateAttributeLookup = lookup;
    }

    lateAttributeLookup[attribute.attribute] = attribute;
}

/**
 * Gets the attribute definitions that were added after platform registration.
 * @internal
 */
export function getLateAttributeLookup(
    definition: FASTElementDefinition,
): Readonly<Record<string, AttributeDefinition>> | null {
    return (
        lateAttributeLookups.get(
            definition as FASTElementDefinition<Constructable<HTMLElement>>,
        ) ?? null
    );
}

/**
 * Resolves the concrete template for a FAST element definition when the
 * definition was composed with a template resolver.
 * @internal
 */
export function resolveFASTElementTemplate<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
>(
    definition: FASTElementDefinition<TType>,
):
    | ElementViewTemplate<InstanceType<TType>>
    | Promise<ElementViewTemplate<InstanceType<TType>> | undefined>
    | undefined {
    if (definition.template !== void 0) {
        templateResolutionErrors.delete(
            definition as FASTElementDefinition<Constructable<HTMLElement>>,
        );
        return definition.template;
    }

    const pendingResolution = pendingTemplateResolutions.get(
        definition as FASTElementDefinition<Constructable<HTMLElement>>,
    ) as Promise<ElementViewTemplate<InstanceType<TType>> | undefined> | undefined;

    if (pendingResolution) {
        return pendingResolution;
    }

    const templateResolver = templateResolvers.get(
        definition as FASTElementDefinition<Constructable<HTMLElement>>,
    ) as FASTElementTemplateResolver<TType> | undefined;

    if (!templateResolver) {
        return void 0;
    }

    templateResolutionErrors.delete(
        definition as FASTElementDefinition<Constructable<HTMLElement>>,
    );

    let template:
        | ElementViewTemplate<InstanceType<TType>>
        | Promise<ElementViewTemplate<InstanceType<TType>>>;

    try {
        template = templateResolver(definition);
    } catch (error) {
        templateResolutionErrors.set(
            definition as FASTElementDefinition<Constructable<HTMLElement>>,
            error,
        );
        throw error;
    }

    if (isPromiseLike(template)) {
        const resolution = Promise.resolve(template)
            .then(resolvedTemplate =>
                finalizeResolvedTemplate(definition, resolvedTemplate),
            )
            .catch(error => {
                pendingTemplateResolutions.delete(
                    definition as FASTElementDefinition<Constructable<HTMLElement>>,
                );
                templateResolutionErrors.set(
                    definition as FASTElementDefinition<Constructable<HTMLElement>>,
                    error,
                );

                throw error;
            });

        pendingTemplateResolutions.set(
            definition as FASTElementDefinition<Constructable<HTMLElement>>,
            resolution as Promise<ElementViewTemplate<HTMLElement> | undefined>,
        );

        return resolution;
    }

    return finalizeResolvedTemplate(definition, template);
}

/**
 * Indicates whether a definition still has a pending template resolver.
 * @internal
 */
export function hasFASTElementTemplateResolver<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
>(definition: FASTElementDefinition<TType>): boolean {
    return templateResolvers.has(
        definition as FASTElementDefinition<Constructable<HTMLElement>>,
    );
}

/**
 * Gets any pending template resolution error for a FAST element definition.
 * @internal
 */
export function getFASTElementTemplateError<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
>(definition: FASTElementDefinition<TType>): unknown {
    return templateResolutionErrors.get(
        definition as FASTElementDefinition<Constructable<HTMLElement>>,
    );
}

/**
 * Sets or clears the template resolution error for a FAST element definition.
 * @internal
 */
export function setFASTElementTemplateError<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
>(definition: FASTElementDefinition<TType>, error?: unknown): void {
    const typedDefinition = definition as FASTElementDefinition<
        Constructable<HTMLElement>
    >;

    if (error === void 0) {
        templateResolutionErrors.delete(typedDefinition);
        return;
    }

    templateResolutionErrors.set(typedDefinition, error);
}

/**
 * Represents metadata configuration for a custom element.
 * @public
 */
export interface PartialFASTElementDefinition<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
> {
    /**
     * The name of the custom element.
     */
    readonly name: string;

    /**
     * The template, or template resolver, for the custom element.
     */
    readonly template?:
        | ElementViewTemplate<InstanceType<TType>>
        | FASTElementTemplateResolver<TType>;

    /**
     * The styles to associate with the custom element.
     */
    readonly styles?: ComposableStyles | ComposableStyles[];

    /**
     * The custom attributes of the custom element.
     */
    readonly attributes?: (AttributeConfiguration | string)[];

    /**
     * Options controlling the creation of the custom element's shadow DOM.
     * @remarks
     * If not provided, defaults to an open shadow root. Provide null
     * to render to the associated template to the light DOM instead.
     */
    readonly shadowOptions?: Partial<ShadowRootOptions> | null;

    /**
     * Options controlling how the custom element is defined with the platform.
     */
    readonly elementOptions?: ElementDefinitionOptions;

    /**
     * The registry to register this component in by default.
     * @remarks
     * If not provided, defaults to the global registry.
     */
    readonly registry?: CustomElementRegistry;

    /**
     * Lifecycle callbacks for template events.
     */
    readonly lifecycleCallbacks?: TemplateLifecycleCallbacks;
}

/**
 * Defines metadata for a FASTElement.
 * @public
 */
export class FASTElementDefinition<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
> {
    private platformDefined = false;

    /**
     * The type this element definition describes.
     */
    public readonly type: TType;

    /**
     * Indicates if this element has been defined in at least one registry.
     */
    public get isDefined(): boolean {
        return this.platformDefined;
    }

    /**
     * The name of the custom element.
     */
    public readonly name: string;

    /**
     * The custom attributes of the custom element.
     */
    public readonly attributes: ReadonlyArray<AttributeDefinition>;

    /**
     * A map enabling lookup of attribute by associated property name.
     */
    public readonly propertyLookup: Record<string, AttributeDefinition>;

    /**
     * A map enabling lookup of property by associated attribute name.
     */
    public readonly attributeLookup: Record<string, AttributeDefinition>;

    /**
     * The template to render for the custom element.
     */
    public template?: ElementViewTemplate<InstanceType<TType>>;

    /**
     * The styles to associate with the custom element.
     */
    public readonly styles?: ElementStyles;

    /**
     * Options controlling the creation of the custom element's shadow DOM.
     */
    public shadowOptions?: ShadowRootOptions;

    /**
     * Options controlling how the custom element is defined with the platform.
     */
    public readonly elementOptions: ElementDefinitionOptions;

    /**
     * The registry to register this component in by default.
     */
    readonly registry: CustomElementRegistry;

    /**
     * Lifecycle callbacks for template events.
     */
    public readonly lifecycleCallbacks?: TemplateLifecycleCallbacks;

    /**
     * The definition has been registered to the FAST element registry.
     */
    public static isRegistered: Record<string, Function> = {};

    private constructor(
        type: TType,
        nameOrConfig: PartialFASTElementDefinition<TType> | string = (type as any)
            .definition,
    ) {
        if (isString(nameOrConfig)) {
            nameOrConfig = { name: nameOrConfig };
        }

        this.type = type;
        this.name = nameOrConfig.name;
        this.registry = nameOrConfig.registry ?? customElements;

        if (isFASTElementTemplateResolver(nameOrConfig.template)) {
            templateResolvers.set(
                this as FASTElementDefinition<Constructable<HTMLElement>>,
                nameOrConfig.template as FASTElementTemplateResolver<
                    Constructable<HTMLElement>
                >,
            );
        } else {
            this.template = nameOrConfig.template;
        }

        const proto = type.prototype;
        const attributes = AttributeDefinition.collect(type, nameOrConfig.attributes);
        const observedAttributes = new Array<string>(attributes.length);
        const propertyLookup = {};
        const attributeLookup = {};

        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
            Observable.defineProperty(proto, current);
        }

        Reflect.defineProperty(type, "observedAttributes", {
            value: observedAttributes,
            enumerable: true,
        });

        this.attributes = attributes;
        this.propertyLookup = propertyLookup;
        this.attributeLookup = attributeLookup;

        this.shadowOptions =
            nameOrConfig.shadowOptions === void 0
                ? defaultShadowOptions
                : nameOrConfig.shadowOptions === null
                  ? void 0
                  : { ...defaultShadowOptions, ...nameOrConfig.shadowOptions };

        this.elementOptions =
            nameOrConfig.elementOptions === void 0
                ? defaultElementOptions
                : { ...defaultElementOptions, ...nameOrConfig.elementOptions };

        this.styles = ElementStyles.normalize(nameOrConfig.styles);

        fastElementRegistry.register(this);
        const registeredTypes = getRegisteredTypes(this.registry);

        if (!Object.prototype.hasOwnProperty.call(registeredTypes, this.name)) {
            Observable.defineProperty(registeredTypes, this.name);
        }

        registeredTypes[this.name] = this.type;
    }

    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     * @param extensions - An optional array of extension callbacks to invoke
     * with this definition before platform registration.
     * @remarks
     * This operation is idempotent per registry.
     */
    public define(
        registry: CustomElementRegistry = this.registry,
        extensions?: FASTElementExtension[],
    ): this {
        const type = this.type;

        if (!registry.get(this.name)) {
            applyFASTElementExtensions(this, registry, extensions);

            if (this.template === void 0 && templateResolvers.has(this)) {
                void Promise.resolve()
                    .then(() => resolveFASTElementTemplate(this))
                    .then(template => {
                        if (template !== void 0 && !registry.get(this.name)) {
                            this.platformDefined = true;
                            registry.define(this.name, type as any, this.elementOptions);
                            this.lifecycleCallbacks?.elementDidDefine?.(this.name);
                        }
                    })
                    .catch(error => {
                        setFASTElementTemplateError(this, error);
                        Observable.notify(this, "template");
                    });

                return this;
            }

            this.platformDefined = true;
            registry.define(this.name, type as any, this.elementOptions);
            this.lifecycleCallbacks?.elementDidDefine?.(this.name);
        }

        return this;
    }

    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrDef - The name of the element to define or a config object
     * that describes the element to define.
     */
    public static compose<
        TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
    >(
        type: TType,
        nameOrDef?: string | PartialFASTElementDefinition<TType>,
    ): Promise<FASTElementDefinition<TType>> {
        const definition =
            fastElementBaseTypes.has(type) || fastElementRegistry.getByType(type)
                ? new FASTElementDefinition<TType>(class extends type {}, nameOrDef)
                : new FASTElementDefinition<TType>(type, nameOrDef);

        return Promise.resolve(definition);
    }

    /**
     * Registers a FASTElement base type.
     * @param type - The type to register as a base type.
     * @internal
     */
    public static registerBaseType(type: Function) {
        fastElementBaseTypes.add(type);
    }

    /**
     * Gets the element definition associated with the specified type.
     * @param type - The custom element type to retrieve the definition for.
     */
    static readonly getByType = fastElementRegistry.getByType;

    /**
     * Gets the element definition associated with the instance.
     * @param instance - The custom element instance to retrieve the definition for.
     */
    static readonly getForInstance = fastElementRegistry.getForInstance;

    /**
     * Indicates when a custom elements definition has been registered with the fastElementRegistry.
     * @param name - The name of the defined custom element.
     * @alpha
     */
    public static register = async (
        name: string,
        registry: CustomElementRegistry = customElements,
    ): Promise<Function> => {
        const registeredTypes = getRegisteredTypes(registry);

        if (!Object.prototype.hasOwnProperty.call(registeredTypes, name)) {
            Observable.defineProperty(registeredTypes, name);
        }

        return new Promise(resolve => {
            if (registeredTypes[name]) {
                resolve(registeredTypes[name]);
                return;
            }

            const notifier = Observable.getNotifier(registeredTypes);
            const subscriber = {
                handleChange: () => {
                    const value = registeredTypes[name];

                    if (!value) {
                        return;
                    }

                    notifier.unsubscribe(subscriber, name);
                    resolve(value);
                },
            };

            notifier.subscribe(subscriber, name);
        });
    };
}

Observable.defineProperty(FASTElementDefinition.prototype, "template");
