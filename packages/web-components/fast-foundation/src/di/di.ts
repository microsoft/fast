/**
 * Big thanks to https://github.com/fkleuver and the https://github.com/aurelia/aurelia project
 * for the bulk of this code and many of the associated tests.
 */
import { Constructable, emptyArray, FASTElement } from "@microsoft/fast-element";
import type { Class } from "../interfaces";

// Tiny polyfill for TypeScript's Reflect metadata API.
const metadataByTarget = new Map<any, Map<any, any>>();

if (!("metadata" in Reflect)) {
    (Reflect as any).metadata = function (key: any, value: any) {
        return function (target: any) {
            (Reflect as any).defineMetadata(key, value, target);
        };
    };

    (Reflect as any).defineMetadata = function (key: any, value: any, target: any) {
        let metadata = metadataByTarget.get(target);

        if (metadata === void 0) {
            metadataByTarget.set(target, (metadata = new Map()));
        }

        metadata.set(key, value);
    };

    (Reflect as any).getOwnMetadata = function (key: any, target: any): any {
        const metadata = metadataByTarget.get(target);

        if (metadata !== void 0) {
            return metadata.get(key);
        }

        return void 0;
    };
}

/**
 * Represents a custom callback for resolving a request from the container.
 * The handler is the container that is invoking the callback. The requestor
 * is the original container that made the request. The handler and the requestor
 * may not be the same if the request has bubbled up to a parent container in the DI hierarchy.
 * The resolver is the instance of the resolver that stores the callback. This is provided in case
 * the callback needs a place or key against which to store state across resolutions.
 * @public
 */
export type ResolveCallback<T = any> = (
    handler: Container,
    requestor: Container,
    resolver: Resolver<T>
) => T;

/**
 * A constant key that can be used to represent an interface to a registered dependency.
 * The key can be used in DI registrations but also doubles as a decorator for
 * resolving the associated, registered dependency.
 * @public
 */
export type InterfaceSymbol<K = any> = (
    target: any,
    property: string,
    index?: number
) => void;

// This interface exists only to break a circular type referencing issue in the ServiceLocator interface.
// Otherwise ServiceLocator references Resolver, which references Container, which extends ServiceLocator.
interface ResolverLike<C, K = any> {
    readonly $isResolver: true;
    resolve(handler: C, requestor: C): Resolved<K>;
    getFactory?(container: C): (K extends Constructable ? Factory<K> : never) | null;
}

/**
 * Internally, the DI system maps "keys" to "resolvers". A resolver controls
 * how a dependency is resolved. Resolvers for transient, singleton, etc. are
 * provided out of the box, but you can also implement Resolver yourself and supply
 * custom logic for resolution.
 * @public
 */
/* eslint-disable-next-line */
export interface Resolver<K = any> extends ResolverLike<Container, K> {}

/**
 * Implemented by objects that wish to register dependencies in the container
 * by creating resolvers.
 * @public
 */
export interface Registration<K = any> {
    /**
     * Creates a resolver for a desired dependency.
     * @param container - The container to register the dependency within.
     * @param key - The key to register dependency under, if overridden.
     */
    register(container: Container, key?: Key): Resolver<K>;
}

/**
 * Transforms an object after it is created but before it is returned
 * to the requestor.
 * @public
 */
export type Transformer<K> = (instance: Resolved<K>) => Resolved<K>;

/**
 * Used by the default Resolver to create instances of objects when needed.
 * @public
 */
export interface Factory<T extends Constructable = any> {
    /**
     * The concrete type this factory creates.
     */
    readonly Type: T;

    /**
     * Registers a transformer function to alter the object after instantiation but before
     * returning the final constructed instance.
     * @param transformer - The transformer function.
     */
    registerTransformer(transformer: Transformer<T>): void;

    /**
     * Constructs an instance of the factory's object.
     * @param container - The container the object is being constructor for.
     * @param dynamicDependencies - Dynamic dependencies supplied to the constructor.
     */
    construct(container: Container, dynamicDependencies?: Key[]): Resolved<T>;
}

/**
 * Implemented by objects capable of resolving services and other dependencies.
 * @public
 */
export interface ServiceLocator {
    /**
     * Determines whether the locator has the ability to provide an implementation
     * for the requested key.
     * @param key - The dependency key to lookup.
     * @param searchAncestors - Indicates whether to search the entire hierarchy of service locators.
     */
    has<K extends Key>(key: K | Key, searchAncestors: boolean): boolean;

    /**
     * Gets a dependency by key.
     * @param key - The key to lookup.
     */
    get<K extends Key>(key: K): Resolved<K>;

    /**
     * Gets a dependency by key.
     * @param key - The key to lookup.
     */
    get<K extends Key>(key: Key): Resolved<K>;

    /**
     * Gets a dependency by key.
     * @param key - The key to lookup.
     */
    get<K extends Key>(key: K | Key): Resolved<K>;

    /**
     * Gets an array of all dependencies by key.
     * @param key - The key to lookup.
     * @param searchAncestors - Indicates whether to search the entire hierarchy of service locators.
     */
    getAll<K extends Key>(key: K, searchAncestors?: boolean): readonly Resolved<K>[];

    /**
     * Gets an array of all dependencies by key.
     * @param key - The key to lookup.
     * @param searchAncestors - Indicates whether to search the entire hierarchy of service locators.
     */
    getAll<K extends Key>(key: Key, searchAncestors?: boolean): readonly Resolved<K>[];

    /**
     * Gets an array of all dependencies by key.
     * @param key - The key to lookup.
     * @param searchAncestors - Indicates whether to search the entire hierarchy of service locators.
     */
    getAll<K extends Key>(
        key: K | Key,
        searchAncestors?: boolean
    ): readonly Resolved<K>[];
}

/**
 * Implemented by objects that which to register dependencies in a container.
 * @public
 */
export interface Registry {
    /**
     * Registers dependencies in the specified container.
     * @param container - The container to register dependencies in.
     * @param params - Parameters that affect the registration process.
     * @remarks
     * If this registry doubles as a Registration, it should return a Resolver
     * for the registered dependency.
     */
    register(container: Container, ...params: unknown[]): void | Resolver;
}

/**
 * Implemented by dependency injection containers.
 * @public
 */
export interface Container extends ServiceLocator {
    /**
     * Registers dependencies with the container via registration objects.
     * @param params - The registration objects.
     */
    register(...params: any[]): Container;

    /**
     * Registers a resolver with the container for the specified key.
     * @param key - The key to register the resolver under.
     * @param resolver - The resolver to register.
     */
    registerResolver<K extends Key, T = K>(key: K, resolver: Resolver<T>): Resolver<T>;

    /**
     * Registers a transformer with the container for the specified key.
     * @param key - The key to resolved to register the transformer with.
     * @param transformer - The transformer to register.
     */
    registerTransformer<K extends Key, T = K>(
        key: K,
        transformer: Transformer<T>
    ): boolean;

    /**
     * Gets a resolver for the specified key.
     * @param key - The key to get the resolver for.
     * @param autoRegister - Indicates whether or not to try to auto-register a dependency for
     * the key if one is not explicitly registered.
     */
    getResolver<K extends Key, T = K>(
        key: K | Key,
        autoRegister?: boolean
    ): Resolver<T> | null;

    /**
     * Registers a factory with the container for the specified key.
     * @param key - The key to register the factory under.
     * @param factory - The factory to register.
     */
    registerFactory<T extends Constructable>(key: T, factory: Factory<T>): void;

    /**
     * Gets the factory for the specified key.
     * @param key - The key to get the factory for.
     */
    getFactory<T extends Constructable>(key: T): Factory<T>;

    /**
     * Creates a child dependency injection container parented to this container.
     * @param config - The configuration for the new container.
     */
    createChild(
        config?: Partial<Omit<ContainerConfiguration, "parentLocator">>
    ): Container;
}

/**
 * A utility class used that constructs and registers resolvers for a dependency
 * injection container. Supports a standard set of object lifetimes.
 * @public
 */
export class ResolverBuilder<K> {
    /**
     *
     * @param container - The container to create resolvers for.
     * @param key - The key to register resolvers under.
     */
    public constructor(private container: Container, private key: Key) {}

    /**
     * Creates a resolver for an existing object instance.
     * @param value - The instance to resolve.
     * @returns The resolver.
     */
    public instance(value: K): Resolver<K> {
        return this.registerResolver(ResolverStrategy.instance, value);
    }

    /**
     * Creates a resolver that enforces a singleton lifetime.
     * @param value - The type to create and cache the singleton for.
     * @returns The resolver.
     */
    public singleton(value: Constructable): Resolver<K> {
        return this.registerResolver(ResolverStrategy.singleton, value);
    }

    /**
     * Creates a resolver that creates a new instance for every dependency request.
     * @param value - The type to create instances of.
     * @returns - The resolver.
     */
    public transient(value: Constructable): Resolver<K> {
        return this.registerResolver(ResolverStrategy.transient, value);
    }

    /**
     * Creates a resolver that invokes a callback function for every dependency resolution
     * request, allowing custom logic to return the dependency.
     * @param value - The callback to call during resolution.
     * @returns The resolver.
     */
    public callback(value: ResolveCallback<K>): Resolver<K> {
        return this.registerResolver(ResolverStrategy.callback, value);
    }

    /**
     * Creates a resolver that invokes a callback function the first time that a dependency
     * resolution is requested. The returned value is then cached and provided for all
     * subsequent requests.
     * @param value - The callback to call during the first resolution.
     * @returns The resolver.
     */
    public cachedCallback(value: ResolveCallback<K>): Resolver<K> {
        return this.registerResolver(
            ResolverStrategy.callback,
            cacheCallbackResult(value)
        );
    }

    /**
     * Aliases the current key to a different key.
     * @param destinationKey - The key to point the alias to.
     * @returns The resolver.
     */
    public aliasTo(destinationKey: Key): Resolver<K> {
        return this.registerResolver(ResolverStrategy.alias, destinationKey);
    }

    private registerResolver(strategy: ResolverStrategy, state: unknown): Resolver<K> {
        const { container, key } = this;
        this.container = this.key = (void 0)!;
        return container.registerResolver(key, new ResolverImpl(key, strategy, state));
    }
}

/**
 * Represents an object that can register itself.
 * @public
 */
export type RegisterSelf<T extends Constructable> = {
    /**
     * Registers itself with the container.
     * @param container - The container to register with.
     */
    register(container: Container): Resolver<InstanceType<T>>;

    /**
     * Indicates whether during auto registration the object should be
     * registered in the requesting container rather than the handling container.
     */
    registerInRequestor: boolean;
};

/**
 * A key that is used to register dependencies with a dependency injection container.
 * @public
 */
export type Key = PropertyKey | object | InterfaceSymbol | Constructable | Resolver;

/**
 * Represents something resolved from a service locator.
 * @public
 */
export type Resolved<K> = K extends InterfaceSymbol<infer T>
    ? T
    : K extends Constructable
    ? InstanceType<K>
    : K extends ResolverLike<any, infer T1>
    ? T1 extends Constructable
        ? InstanceType<T1>
        : T1
    : K;

/**
 * A class that declares constructor injected dependencies through
 * a static "inject" field array of keys.
 * @public
 */
export type Injectable<T = {}> = Constructable<T> & { inject?: Key[] };

function cloneArrayWithPossibleProps<T>(source: readonly T[]): T[] {
    const clone = source.slice();
    const keys = Object.keys(source);
    const len = keys.length;
    let key: string;
    for (let i = 0; i < len; ++i) {
        key = keys[i];
        if (!isArrayIndex(key)) {
            clone[key] = source[key];
        }
    }
    return clone;
}

/**
 * A function capable of locating the parent container based on a container's owner.
 * @remarks
 * A container owner is usually an HTMLElement instance.
 * @public
 */
export type ParentLocator = (owner: any) => Container | null;

/**
 * Configuration for a dependency injection container.
 * @public
 */
export interface ContainerConfiguration {
    /**
     * The locator function used to find the parent of the container.
     */
    parentLocator: ParentLocator;

    /**
     * Indicates whether this container should resolve dependencies that are directly made
     * by its owner. The default is "false" which results in the parent container being used.
     */
    responsibleForOwnerRequests: boolean;

    /**
     * Gets the default resolver to use during auto-registration.
     * @param key - The key to register the dependency with.
     * @param handler - The container that is handling the auto-registration request.
     */
    defaultResolver(key: Key, handler: Container): Resolver;
}

/**
 * A set of default resolvers useful in configuring a container.
 * @public
 */
export const DefaultResolver = Object.freeze({
    /**
     * Disables auto-registration and throws for all un-registered dependencies.
     * @param key - The key to create the resolver for.
     */
    none(key: Key): Resolver {
        throw Error(
            `${key.toString()} not registered, did you forget to add @singleton()?`
        );
    },

    /**
     * Provides default singleton resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    singleton(key: Key): Resolver {
        return new ResolverImpl(key, ResolverStrategy.singleton, key);
    },

    /**
     * Provides default transient resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    transient(key: Key): Resolver {
        return new ResolverImpl(key, ResolverStrategy.transient, key);
    },
});

/**
 * Configuration for a dependency injection container.
 * @public
 */
export const ContainerConfiguration = Object.freeze({
    /**
     * The default configuration used when creating a DOM-disconnected container.
     * @remarks
     * The default creates a root container, with no parent container. It does not handle
     * owner requests and it uses singleton resolution behavior for auto-registration.
     */
    default: Object.freeze({
        parentLocator: () => null,
        responsibleForOwnerRequests: false,
        defaultResolver: DefaultResolver.singleton,
    } as ContainerConfiguration),
});

/**
 * Used to configure a dependency injection interface key.
 * @public
 */
export interface InterfaceConfiguration {
    /**
     * The friendly name for the interface. Useful for debugging.
     */
    friendlyName?: string;

    /**
     * When true, the dependency will be re-resolved when FASTElement connection changes.
     * If the resolved value changes due to connection change, a {@link @microsoft/fast-element#Observable.notify | notification }
     * will be emitted for the property, with the previous and next values provided to any subscriber.
     */
    respectConnection?: boolean;
}

const dependencyLookup = new Map<Constructable | Injectable, Key[]>();

function getParamTypes(
    key: string
): (Type: Constructable | Injectable) => readonly Key[] | undefined {
    return (Type: Constructable | Injectable) => {
        return (Reflect as any).getOwnMetadata(key, Type);
    };
}

/**
 * The gateway to dependency injection APIs.
 * @public
 */
export const DI = Object.freeze({
    /**
     * Creates a new dependency injection container.
     * @param config - The configuration for the container.
     * @returns A newly created dependency injection container.
     */
    createContainer(config?: Partial<ContainerConfiguration>): Container {
        return new ContainerImpl(
            null,
            Object.assign({}, ContainerConfiguration.default, config)
        );
    },

    /**
     * Finds the dependency injection container responsible for providing dependencies
     * to the specified node.
     * @param node - The node to find the responsible container for.
     * @returns The container responsible for providing dependencies to the node.
     * @remarks
     * This will be the same as the parent container if the specified node
     * does not itself host a container configured with responsibleForOwnerRequests.
     */
    findResponsibleContainer(node: Node): Container {
        const owned = (node as any).$$container$$ as ContainerImpl;

        if (owned && owned.responsibleForOwnerRequests) {
            return owned;
        }

        return DI.findParentContainer(node);
    },

    /**
     * Find the dependency injection container up the DOM tree from this node.
     * @param node - The node to find the parent container for.
     * @returns The parent container of this node.
     * @remarks
     * This will be the same as the responsible container if the specified node
     * does not itself host a container configured with responsibleForOwnerRequests.
     */
    findParentContainer(node: Node) {
        const event = new CustomEvent<DOMParentLocatorEventDetail>(
            DILocateParentEventType,
            {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: { container: void 0 },
            }
        );

        node.dispatchEvent(event);

        return event.detail.container || DI.getOrCreateDOMContainer();
    },

    /**
     * Returns a dependency injection container if one is explicitly owned by the specified
     * node. If one is not owned, then a new container is created and assigned to the node.
     * @param node - The node to find or create the container for.
     * @param config - The configuration for the container if one needs to be created.
     * @returns The located or created container.
     * @remarks
     * This API does not search for a responsible or parent container. It looks only for a container
     * directly defined on the specified node and creates one at that location if one does not
     * already exist.
     */
    getOrCreateDOMContainer(
        node: Node = document.body,
        config?: Partial<Omit<ContainerConfiguration, "parentLocator">>
    ): Container {
        return (
            (node as any).$$container$$ ||
            new ContainerImpl(
                node,
                Object.assign({}, ContainerConfiguration.default, config, {
                    parentLocator:
                        node === document.body ? () => null : DI.findParentContainer,
                })
            )
        );
    },

    /**
     * Gets the "design:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getDesignParamtypes: getParamTypes("design:paramtypes"),

    /**
     * Gets the "di:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getAnnotationParamtypes: getParamTypes("di:paramtypes"),

    /**
     *
     * @param Type - Gets the "di:paramtypes" metadata for the specified type. If none is found,
     * an empty metadata array is created and added.
     * @returns The metadata array.
     */
    getOrCreateAnnotationParamTypes(Type: Constructable | Injectable): Key[] {
        let annotationParamtypes = this.getAnnotationParamtypes(Type);

        if (annotationParamtypes === void 0) {
            (Reflect as any).defineMetadata(
                "di:paramtypes",
                (annotationParamtypes = []),
                Type
            );
        }

        return annotationParamtypes;
    },

    /**
     * Gets the dependency keys representing what is needed to instantiate the specified type.
     * @param Type - The type to get the dependencies for.
     * @returns An array of dependency keys.
     */
    getDependencies(Type: Constructable | Injectable): Key[] {
        // Note: Every detail of this getDependencies method is pretty deliberate at the moment, and probably not yet 100% tested from every possible angle,
        // so be careful with making changes here as it can have a huge impact on complex end user apps.
        // Preferably, only make changes to the dependency resolution process via a RFC.

        let dependencies = dependencyLookup.get(Type);

        if (dependencies === void 0) {
            // Type.length is the number of constructor parameters. If this is 0, it could mean the class has an empty constructor
            // but it could also mean the class has no constructor at all (in which case it inherits the constructor from the prototype).

            // Non-zero constructor length + no paramtypes means emitDecoratorMetadata is off, or the class has no decorator.
            // We're not doing anything with the above right now, but it's good to keep in mind for any future issues.

            const inject = (Type as Injectable).inject;

            if (inject === void 0) {
                // design:paramtypes is set by tsc when emitDecoratorMetadata is enabled.
                const designParamtypes = DI.getDesignParamtypes(Type);
                // di:paramtypes is set by the parameter decorator from DI.createInterface or by @inject
                const annotationParamtypes = DI.getAnnotationParamtypes(Type);
                if (designParamtypes === void 0) {
                    if (annotationParamtypes === void 0) {
                        // Only go up the prototype if neither static inject nor any of the paramtypes is defined, as
                        // there is no sound way to merge a type's deps with its prototype's deps
                        const Proto = Object.getPrototypeOf(Type);
                        if (typeof Proto === "function" && Proto !== Function.prototype) {
                            dependencies = cloneArrayWithPossibleProps(
                                DI.getDependencies(Proto)
                            );
                        } else {
                            dependencies = [];
                        }
                    } else {
                        // No design:paramtypes so just use the di:paramtypes
                        dependencies = cloneArrayWithPossibleProps(annotationParamtypes);
                    }
                } else if (annotationParamtypes === void 0) {
                    // No di:paramtypes so just use the design:paramtypes
                    dependencies = cloneArrayWithPossibleProps(designParamtypes);
                } else {
                    // We've got both, so merge them (in case of conflict on same index, di:paramtypes take precedence)
                    dependencies = cloneArrayWithPossibleProps(designParamtypes);
                    let len = annotationParamtypes.length;
                    let auAnnotationParamtype: Key;
                    for (let i = 0; i < len; ++i) {
                        auAnnotationParamtype = annotationParamtypes[i];
                        if (auAnnotationParamtype !== void 0) {
                            dependencies[i] = auAnnotationParamtype;
                        }
                    }

                    const keys = Object.keys(annotationParamtypes);
                    len = keys.length;
                    let key: string;
                    for (let i = 0; i < len; ++i) {
                        key = keys[i];
                        if (!isArrayIndex(key)) {
                            dependencies[key] = annotationParamtypes[key];
                        }
                    }
                }
            } else {
                // Ignore paramtypes if we have static inject
                dependencies = cloneArrayWithPossibleProps(inject);
            }

            dependencyLookup.set(Type, dependencies);
        }

        return dependencies;
    },

    /**
     * Defines a property on a web component class. The value of this property will
     * be resolved from the dependency injection container responsible for the element
     * instance, based on where it is connected in the DOM.
     * @param target - The target to define the property on.
     * @param propertyName - The name of the property to define.
     * @param key - The dependency injection key.
     * @param respectConnection - Indicates whether or not to update the property value if the
     * hosting component is disconnected and then re-connected at a different location in the DOM.
     * @remarks
     * The respectConnection option is only applicable to elements that descend from FASTElement.
     */
    defineProperty(
        target: {},
        propertyName: string,
        key: Key,
        respectConnection = false
    ) {
        const diPropertyKey = `$di_${propertyName}`;

        Reflect.defineProperty(target, propertyName, {
            get: function (this: any) {
                let value = this[diPropertyKey];

                if (value === void 0) {
                    const container: Container =
                        this instanceof HTMLElement
                            ? DI.findResponsibleContainer(this)
                            : DI.getOrCreateDOMContainer();

                    value = container.get(key);
                    this[diPropertyKey] = value;

                    if (respectConnection && this instanceof FASTElement) {
                        const notifier = (this as FASTElement).$fastController;
                        const handleChange = () => {
                            const newContainer = DI.findResponsibleContainer(this);
                            const newValue = newContainer.get(key) as any;
                            const oldValue = this[diPropertyKey];

                            if (newValue !== oldValue) {
                                this[diPropertyKey] = value;
                                notifier.notify(propertyName);
                            }
                        };

                        notifier.subscribe({ handleChange }, "isConnected");
                    }
                }
                return value;
            },
        });
    },

    /**
     * Creates a dependency injection key.
     * @param nameConfigOrCallback - A friendly name for the key or a lambda that configures a
     * default resolution for the dependency.
     * @param configuror - If a friendly name was provided for the first parameter, then an optional
     * lambda that configures a default resolution for the dependency can be provided second.
     * @returns The created key.
     * @remarks
     * The created key can be used as a property decorator or constructor parameter decorator,
     * in addition to its standard use in an inject array or through direct container APIs.
     */
    createInterface<K extends Key>(
        nameConfigOrCallback?:
            | string
            | ((builder: ResolverBuilder<K>) => Resolver<K>)
            | InterfaceConfiguration,
        configuror?: (builder: ResolverBuilder<K>) => Resolver<K>
    ): InterfaceSymbol<K> {
        const configure =
            typeof nameConfigOrCallback === "function"
                ? nameConfigOrCallback
                : configuror;
        const friendlyName: string =
            typeof nameConfigOrCallback === "string"
                ? nameConfigOrCallback
                : nameConfigOrCallback && "friendlyName" in nameConfigOrCallback
                ? nameConfigOrCallback.friendlyName || defaultFriendlyName
                : defaultFriendlyName;
        const respectConnection: boolean =
            typeof nameConfigOrCallback === "string"
                ? false
                : nameConfigOrCallback && "respectConnection" in nameConfigOrCallback
                ? nameConfigOrCallback.respectConnection || false
                : false;

        const Interface = function (
            target: Injectable<K>,
            property: string,
            index: number
        ): void {
            if (target == null || new.target !== undefined) {
                throw new Error(
                    `No registration for interface: '${Interface.friendlyName}'`
                );
            }

            if (property) {
                DI.defineProperty(target, property, Interface, respectConnection);
            } else {
                const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target);
                annotationParamtypes[index] = Interface;
            }
        };

        Interface.$isInterface = true;
        Interface.friendlyName = friendlyName == null ? "(anonymous)" : friendlyName;

        if (configure != null) {
            Interface.register = function (container: Container, key?: Key): Resolver<K> {
                return configure(new ResolverBuilder(container, key ?? Interface));
            };
        }

        Interface.toString = function toString(): string {
            return `InterfaceSymbol<${Interface.friendlyName}>`;
        };

        return Interface;
    },

    /**
     * A decorator that specifies what to inject into its target.
     * @param dependencies - The dependencies to inject.
     * @returns The decorator to be applied to the target class.
     * @remarks
     * The decorator can be used to decorate a class, listing all of the classes dependencies.
     * Or it can be used to decorate a constructor paramter, indicating what to inject for that
     * parameter.
     * Or it can be used for a web component property, indicating what that property should resolve to.
     */
    inject(
        ...dependencies: Key[]
    ): (
        target: any,
        key?: string | number,
        descriptor?: PropertyDescriptor | number
    ) => void {
        return function (
            target: any,
            key?: string | number,
            descriptor?: PropertyDescriptor | number
        ): void {
            if (typeof descriptor === "number") {
                // It's a parameter decorator.
                const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target);
                const dep = dependencies[0];
                if (dep !== void 0) {
                    annotationParamtypes[descriptor] = dep;
                }
            } else if (key) {
                DI.defineProperty(target, key as string, dependencies[0]);
            } else {
                const annotationParamtypes = descriptor
                    ? DI.getOrCreateAnnotationParamTypes(descriptor.value)
                    : DI.getOrCreateAnnotationParamTypes(target);
                let dep: Key;
                for (let i = 0; i < dependencies.length; ++i) {
                    dep = dependencies[i];
                    if (dep !== void 0) {
                        annotationParamtypes[i] = dep;
                    }
                }
            }
        };
    },

    /**
     * Registers the `target` class as a transient dependency; each time the dependency is resolved
     * a new instance will be created.
     *
     * @param target - The class / constructor function to register as transient.
     * @returns The same class, with a static `register` method that takes a container and returns the appropriate resolver.
     *
     * @example
     * ```ts
     * // On an existing class
     * class Foo { }
     * DI.transient(Foo);
     *
     * // Inline declaration
     * const Foo = DI.transient(class { });
     * // Foo is now strongly typed with register
     * Foo.register(container);
     * ```
     *
     * @public
     */
    transient<T extends Constructable>(
        target: T & Partial<RegisterSelf<T>>
    ): T & RegisterSelf<T> {
        target.register = function register(
            container: Container
        ): Resolver<InstanceType<T>> {
            const registration = Registration.transient(target as T, target as T);
            return registration.register(container, target);
        };
        target.registerInRequestor = false;
        return target as T & RegisterSelf<T>;
    },

    /**
     * Registers the `target` class as a singleton dependency; the class will only be created once. Each
     * consecutive time the dependency is resolved, the same instance will be returned.
     *
     * @param target - The class / constructor function to register as a singleton.
     * @returns The same class, with a static `register` method that takes a container and returns the appropriate resolver.
     * @example
     * ```ts
     * // On an existing class
     * class Foo { }
     * DI.singleton(Foo);
     *
     * // Inline declaration
     * const Foo = DI.singleton(class { });
     * // Foo is now strongly typed with register
     * Foo.register(container);
     * ```
     *
     * @public
     */
    singleton<T extends Constructable>(
        target: T & Partial<RegisterSelf<T>>,
        options: SingletonOptions = defaultSingletonOptions
    ): T & RegisterSelf<T> {
        target.register = function register(
            container: Container
        ): Resolver<InstanceType<T>> {
            const registration = Registration.singleton(target, target);
            return registration.register(container, target);
        };
        target.registerInRequestor = options.scoped;
        return target as T & RegisterSelf<T>;
    },
});

/**
 * The interface key that resolves the dependency injection container itself.
 * @public
 */
export const Container = DI.createInterface<Container>("Container");

/**
 * The interface key that resolves the service locator itself.
 * @public
 */
export const ServiceLocator = (Container as unknown) as InterfaceSymbol<ServiceLocator>;

function createResolver(
    getter: (key: any, handler: Container, requestor: Container) => any
): (key: any) => any {
    return function (key: any): ReturnType<typeof DI.inject> {
        const resolver: ReturnType<typeof DI.inject> &
            Partial<Pick<Resolver, "resolve">> & { $isResolver: true } = function (
            target: Injectable,
            property?: string | number,
            descriptor?: PropertyDescriptor | number
        ): void {
            DI.inject(resolver)(target, property, descriptor);
        };

        resolver.$isResolver = true;
        resolver.resolve = function (handler: Container, requestor: Container): any {
            return getter(key, handler, requestor);
        };

        return resolver;
    };
}

/**
 * A decorator that specifies what to inject into its target.
 * @param dependencies - The dependencies to inject.
 * @returns The decorator to be applied to the target class.
 * @remarks
 * The decorator can be used to decorate a class, listing all of the classes dependencies.
 * Or it can be used to decorate a constructor paramter, indicating what to inject for that
 * parameter.
 * Or it can be used for a web component property, indicating what that property should resolve to.
 *
 * @public
 */
export const inject = DI.inject;

function transientDecorator<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T> {
    return DI.transient(target);
}

/**
 * Registers the decorated class as a transient dependency; each time the dependency is resolved
 * a new instance will be created.
 *
 * @example
 * ```ts
 * &#64;transient()
 * class Foo { }
 * ```
 *
 * @public
 */
export function transient<T extends Constructable>(): typeof transientDecorator;

/**
 * Registers the `target` class as a transient dependency; each time the dependency is resolved
 * a new instance will be created.
 *
 * @param target - The class / constructor function to register as transient.
 *
 * @example
 * ```ts
 * &#64;transient()
 * class Foo { }
 * ```
 *
 * @public
 */
export function transient<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T>;

export function transient<T extends Constructable>(
    target?: T & Partial<RegisterSelf<T>>
): (T & RegisterSelf<T>) | typeof transientDecorator {
    return target == null ? transientDecorator : transientDecorator(target);
}

type SingletonOptions = { scoped: boolean };
const defaultSingletonOptions = { scoped: false };

function singletonDecorator<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T> {
    return DI.singleton(target);
}

/**
 * Registers the decorated class as a singleton dependency; the class will only be created once. Each
 * consecutive time the dependency is resolved, the same instance will be returned.
 *
 * @example
 * ```ts
 * &#64;singleton()
 * class Foo { }
 * ```
 *
 * @public
 */
export function singleton<T extends Constructable>(): typeof singletonDecorator;

/**
 * @public
 */
export function singleton<T extends Constructable>(
    options?: SingletonOptions
): typeof singletonDecorator;

/**
 * Registers the `target` class as a singleton dependency; the class will only be created once. Each
 * consecutive time the dependency is resolved, the same instance will be returned.
 *
 * @param target - The class / constructor function to register as a singleton.
 *
 * @example
 * ```ts
 * &#64;singleton()
 * class Foo { }
 * ```
 *
 * @public
 */
export function singleton<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T>;

/**
 * @public
 */
export function singleton<T extends Constructable>(
    targetOrOptions?: (T & Partial<RegisterSelf<T>>) | SingletonOptions
): (T & RegisterSelf<T>) | typeof singletonDecorator {
    if (typeof targetOrOptions === "function") {
        return DI.singleton(targetOrOptions);
    }
    return function <T extends Constructable>($target: T) {
        return DI.singleton($target, targetOrOptions as SingletonOptions | undefined);
    };
}

function createAllResolver(
    getter: (
        key: any,
        handler: Container,
        requestor: Container,
        searchAncestors: boolean
    ) => readonly any[]
): (key: any, searchAncestors?: boolean) => ReturnType<typeof DI.inject> {
    return function (key: any, searchAncestors?: boolean): ReturnType<typeof DI.inject> {
        searchAncestors = !!searchAncestors;
        const resolver: ReturnType<typeof DI.inject> &
            Required<Pick<Resolver, "resolve">> & { $isResolver: true } = function (
            target: Injectable,
            property?: string | number,
            descriptor?: PropertyDescriptor | number
        ): void {
            DI.inject(resolver)(target, property, descriptor);
        };

        resolver.$isResolver = true;
        resolver.resolve = function (handler: Container, requestor: Container): any {
            return getter(key, handler, requestor, searchAncestors!);
        };

        return resolver;
    };
}

/**
 * A decorator and DI resolver that will resolve an array of all dependencies
 * registered with the specified key.
 * @param key - The key to resolve all dependencies for.
 * @param searchAncestors - [optional] Indicates whether to search ancestor containers.
 * @public
 */
export const all = createAllResolver(
    (key: any, handler: Container, requestor: Container, searchAncestors: boolean) =>
        requestor.getAll(key, searchAncestors)
);

/**
 * A decorator that lazily injects a dependency depending on whether the [[`Key`]] is present at the time of function call.
 *
 * You need to make your argument a function that returns the type, for example
 * ```ts
 * class Foo {
 *   constructor( @lazy('random') public random: () => number )
 * }
 * const foo = container.get(Foo); // instanceof Foo
 * foo.random(); // throws
 * ```
 * would throw an exception because you haven't registered `'random'` before calling the method. This, would give you a
 * new [['Math.random()']] number each time.
 * ```ts
 * class Foo {
 *   constructor( @lazy('random') public random: () => random )
 * }
 * container.register(Registration.callback('random', Math.random ));
 * container.get(Foo).random(); // some random number
 * container.get(Foo).random(); // another random number
 * ```
 * `@lazy` does not manage the lifecycle of the underlying key. If you want a singleton, you have to register as a
 * `singleton`, `transient` would also behave as you would expect, providing you a new instance each time.
 *
 * @param key - The key to lazily resolve.
 * see {@link DI.createInterface} on interactions with interfaces
 *
 * @public
 */
export const lazy = createResolver(
    (key: Key, handler: Container, requestor: Container) => {
        return () => requestor.get(key);
    }
);

/**
 * A decorator that allows you to optionally inject a dependency depending on whether the [[`Key`]] is present, for example
 * ```ts
 * class Foo {
 *   constructor( @inject('mystring') public str: string = 'somestring' )
 * }
 * container.get(Foo); // throws
 * ```
 * would fail
 * ```ts
 * class Foo {
 *   constructor( @optional('mystring') public str: string = 'somestring' )
 * }
 * container.get(Foo).str // somestring
 * ```
 * if you use it without a default it will inject `undefined`, so remember to mark your input type as
 * possibly `undefined`!
 *
 * @param key - The key to optionally resolve.
 * see {@link DI.createInterface} on interactions with interfaces
 *
 * @public
 */
export const optional = createResolver(
    (key: Key, handler: Container, requestor: Container) => {
        if (requestor.has(key, true)) {
            return requestor.get(key);
        } else {
            return undefined;
        }
    }
);

/**
 * A decorator that tells the container not to try to inject a dependency.
 *
 * @public
 */
export function ignore(
    target: Injectable,
    property?: string | number,
    descriptor?: PropertyDescriptor | number
): void {
    DI.inject(ignore)(target, property, descriptor);
}

// Hack: casting below used to prevent TS from generate a namespace which can't be commented
// and results in documentation validation errors.
(ignore as any).$isResolver = true;
(ignore as any).resolve = () => undefined;

/**
 * A decorator that indicates that a new instance should be injected scoped to the
 * container that requested the instance.
 * @param key - The dependency key for the new instance.
 * @remarks
 * This creates a resolver with an instance strategy pointing to the new instance, effectively
 * making this a singleton, scoped to the container or DOM's subtree.
 *
 * @public
 */
export const newInstanceForScope = createResolver(
    (key: any, handler: Container, requestor: Container) => {
        const instance = createNewInstance(key, handler);
        const resolver = new ResolverImpl(key, ResolverStrategy.instance, instance);
        requestor.registerResolver(key, resolver);
        return instance;
    }
);

/**
 * A decorator that indicates that a new instance should be injected.
 * @param key - The dependency key for the new instance.
 * @remarks
 * The instance is not internally cached with a resolver as newInstanceForScope does.
 *
 * @public
 */
export const newInstanceOf = createResolver(
    (key: any, handler: Container, _requestor: Container) =>
        createNewInstance(key, handler)
);

function createNewInstance(key: any, handler: Container) {
    return handler.getFactory(key)!.construct(handler);
}

/** @internal */
export const enum ResolverStrategy {
    instance = 0,
    singleton = 1,
    transient = 2,
    callback = 3,
    array = 4,
    alias = 5,
}

/** @internal */
export class ResolverImpl implements Resolver, Registration {
    public constructor(
        public key: Key,
        public strategy: ResolverStrategy,
        public state: any
    ) {}

    public get $isResolver(): true {
        return true;
    }

    private resolving: boolean = false;

    public register(container: Container, key?: Key): Resolver {
        return container.registerResolver(key || this.key, this);
    }

    public resolve(handler: Container, requestor: Container): any {
        switch (this.strategy) {
            case ResolverStrategy.instance:
                return this.state;
            case ResolverStrategy.singleton: {
                if (this.resolving) {
                    throw new Error(`Cyclic dependency found: ${this.state.name}`);
                }
                this.resolving = true;
                this.state = handler
                    .getFactory(this.state as Constructable)
                    .construct(requestor);
                this.strategy = ResolverStrategy.instance;
                this.resolving = false;
                return this.state;
            }
            case ResolverStrategy.transient: {
                // Always create transients from the requesting container
                const factory = handler.getFactory(this.state as Constructable);
                if (factory === null) {
                    throw new Error(
                        `Resolver for ${String(this.key)} returned a null factory`
                    );
                }
                return factory.construct(requestor);
            }
            case ResolverStrategy.callback:
                return (this.state as ResolveCallback)(handler, requestor, this);
            case ResolverStrategy.array:
                return (this.state as Resolver[])[0].resolve(handler, requestor);
            case ResolverStrategy.alias:
                return requestor.get(this.state);
            default:
                throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`);
        }
    }

    public getFactory(container: Container): Factory | null {
        switch (this.strategy) {
            case ResolverStrategy.singleton:
            case ResolverStrategy.transient:
                return container.getFactory(this.state as Constructable);
            case ResolverStrategy.alias:
                return container.getResolver(this.state)?.getFactory?.(container) ?? null;
            default:
                return null;
        }
    }
}

function containerGetKey(this: Container, d: Key) {
    return this.get(d);
}

function transformInstance<T>(inst: Resolved<T>, transform: (instance: any) => any) {
    return transform(inst);
}

/** @internal */
export class FactoryImpl<T extends Constructable = any> implements Factory<T> {
    private transformers: ((instance: any) => any)[] | null = null;
    public constructor(public Type: T, private readonly dependencies: Key[]) {}

    public construct(container: Container, dynamicDependencies?: Key[]): Resolved<T> {
        let instance: Resolved<T>;

        if (dynamicDependencies === void 0) {
            instance = new this.Type(
                ...this.dependencies.map(containerGetKey, container)
            ) as Resolved<T>;
        } else {
            instance = new this.Type(
                ...this.dependencies.map(containerGetKey, container),
                ...dynamicDependencies
            ) as Resolved<T>;
        }

        if (this.transformers == null) {
            return instance;
        }

        return this.transformers.reduce(transformInstance, instance);
    }

    public registerTransformer(transformer: (instance: any) => any): void {
        (this.transformers || (this.transformers = [])).push(transformer);
    }
}

const containerResolver: Resolver = {
    $isResolver: true,
    resolve(handler: Container, requestor: Container): Container {
        return requestor;
    },
};

function isRegistry(obj: Registry | Record<string, Registry>): obj is Registry {
    return typeof obj.register === "function";
}

function isSelfRegistry<T extends Constructable>(
    obj: RegisterSelf<T>
): obj is RegisterSelf<T> {
    return isRegistry(obj) && typeof obj.registerInRequestor === "boolean";
}

function isRegisterInRequester<T extends Constructable>(
    obj: RegisterSelf<T>
): obj is RegisterSelf<T> {
    return isSelfRegistry(obj) && obj.registerInRequestor;
}

function isClass<T extends { prototype?: any }>(obj: T): obj is Class<any, T> {
    return obj.prototype !== void 0;
}

const InstrinsicTypeNames = new Set<string>([
    "Array",
    "ArrayBuffer",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "Float32Array",
    "Float64Array",
    "Function",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Map",
    "Number",
    "Object",
    "Promise",
    "RangeError",
    "ReferenceError",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "SyntaxError",
    "TypeError",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "URIError",
    "WeakMap",
    "WeakSet",
]);

const DILocateParentEventType = "__DI_LOCATE_PARENT__";
const factories = new Map<Key, Factory>();

/**
 * @internal
 */
export class ContainerImpl implements Container {
    private _parent: ContainerImpl | null | undefined = void 0;
    private registerDepth: number = 0;
    private resolvers: Map<Key, Resolver>;

    public get parent() {
        if (this._parent === void 0) {
            this._parent = this.config.parentLocator(this.owner) as ContainerImpl;
        }

        return this._parent;
    }

    public get depth(): number {
        return this.parent === null ? 0 : this.parent.depth + 1;
    }

    public get responsibleForOwnerRequests(): boolean {
        return this.config.responsibleForOwnerRequests;
    }

    constructor(protected owner: any, protected config: ContainerConfiguration) {
        if (owner !== null) {
            owner.$$container$$ = this;
        }

        this.resolvers = new Map();
        this.resolvers.set(Container, containerResolver);

        if (owner instanceof Node) {
            owner.addEventListener(
                DILocateParentEventType,
                (e: CustomEvent<DOMParentLocatorEventDetail>) => {
                    if (e.composedPath()[0] !== this.owner) {
                        e.detail.container = this;
                        e.stopImmediatePropagation();
                    }
                }
            );
        }
    }

    public register(...params: any[]): Container {
        if (++this.registerDepth === 100) {
            throw new Error("Unable to autoregister dependency");
            // Most likely cause is trying to register a plain object that does not have a
            // register method and is not a class constructor
        }

        let current: Registry | Record<string, Registry>;
        let keys: string[];
        let value: Registry;
        let j: number;
        let jj: number;

        for (let i = 0, ii = params.length; i < ii; ++i) {
            current = params[i];

            if (!isObject(current)) {
                continue;
            }

            if (isRegistry(current)) {
                current.register(this);
            } else if (isClass(current)) {
                Registration.singleton(current, current as Constructable).register(this);
            } else {
                keys = Object.keys(current);
                j = 0;
                jj = keys.length;
                for (; j < jj; ++j) {
                    value = current[keys[j]];
                    if (!isObject(value)) {
                        continue;
                    }
                    // note: we could remove this if-branch and call this.register directly
                    // - the extra check is just a perf tweak to create fewer unnecessary arrays by the spread operator
                    if (isRegistry(value)) {
                        value.register(this);
                    } else {
                        this.register(value);
                    }
                }
            }
        }

        --this.registerDepth;
        return this;
    }

    public registerResolver<K extends Key, T = K>(
        key: K,
        resolver: Resolver<T>
    ): Resolver<T> {
        validateKey(key);

        const resolvers = this.resolvers;
        const result = resolvers.get(key);

        if (result == null) {
            resolvers.set(key, resolver);
        } else if (
            result instanceof ResolverImpl &&
            result.strategy === ResolverStrategy.array
        ) {
            (result.state as Resolver[]).push(resolver);
        } else {
            resolvers.set(
                key,
                new ResolverImpl(key, ResolverStrategy.array, [result, resolver])
            );
        }

        return resolver;
    }

    public registerTransformer<K extends Key, T = K>(
        key: K,
        transformer: Transformer<T>
    ): boolean {
        const resolver = this.getResolver(key);

        if (resolver == null) {
            return false;
        }

        if (resolver.getFactory) {
            const factory = resolver.getFactory(this);

            if (factory == null) {
                return false;
            }

            // This type cast is a bit of a hacky one, necessary due to the duplicity of IResolverLike.
            // Problem is that that interface's type arg can be of type Key, but the getFactory method only works on
            // type Constructable. So the return type of that optional method has this additional constraint, which
            // seems to confuse the type checker.
            factory.registerTransformer(
                (transformer as unknown) as Transformer<Constructable>
            );

            return true;
        }

        return false;
    }

    public getResolver<K extends Key, T = K>(
        key: K | Key,
        autoRegister: boolean = true
    ): Resolver<T> | null {
        validateKey(key);

        if (((key as unknown) as Resolver).resolve !== void 0) {
            return (key as unknown) as Resolver;
        }

        /* eslint-disable-next-line */
        let current: ContainerImpl = this;
        let resolver: Resolver | undefined;

        while (current != null) {
            resolver = current.resolvers.get(key);

            if (resolver == null) {
                if (current.parent == null) {
                    const handler = isRegisterInRequester(
                        (key as unknown) as RegisterSelf<Constructable>
                    )
                        ? this
                        : current;
                    return autoRegister ? this.jitRegister(key, handler) : null;
                }

                current = current.parent;
            } else {
                return resolver;
            }
        }

        return null;
    }

    public has<K extends Key>(key: K, searchAncestors: boolean = false): boolean {
        return this.resolvers.has(key)
            ? true
            : searchAncestors && this.parent != null
            ? this.parent.has(key, true)
            : false;
    }

    public get<K extends Key>(key: K): Resolved<K> {
        validateKey(key);

        if ((key as Resolver).$isResolver) {
            return (key as Resolver).resolve(this, this);
        }

        /* eslint-disable-next-line */
        let current: ContainerImpl = this;
        let resolver: Resolver | undefined;

        while (current != null) {
            resolver = current.resolvers.get(key);

            if (resolver == null) {
                if (current.parent == null) {
                    const handler = isRegisterInRequester(
                        (key as unknown) as RegisterSelf<Constructable>
                    )
                        ? this
                        : current;
                    resolver = this.jitRegister(key, handler);
                    return resolver.resolve(current, this);
                }

                current = current.parent;
            } else {
                return resolver.resolve(current, this);
            }
        }

        throw new Error(`Unable to resolve key: ${key}`);
    }

    public getAll<K extends Key>(
        key: K,
        searchAncestors: boolean = false
    ): readonly Resolved<K>[] {
        validateKey(key);

        /* eslint-disable-next-line */
        const requestor = this;
        let current: ContainerImpl | null = requestor;
        let resolver: Resolver | undefined;

        if (searchAncestors) {
            let resolutions: any[] = emptyArray as any;

            while (current != null) {
                resolver = current.resolvers.get(key);

                if (resolver != null) {
                    resolutions = resolutions.concat(
                        buildAllResponse(resolver, current, requestor)
                    );
                }

                current = current.parent;
            }

            return resolutions;
        } else {
            while (current != null) {
                resolver = current.resolvers.get(key);

                if (resolver == null) {
                    current = current.parent;

                    if (current == null) {
                        return emptyArray;
                    }
                } else {
                    return buildAllResponse(resolver, current, requestor);
                }
            }
        }

        return emptyArray;
    }

    public getFactory<K extends Constructable>(Type: K): Factory<K> {
        let factory = factories.get(Type);

        if (factory === void 0) {
            if (isNativeFunction(Type)) {
                throw new Error(
                    `${Type.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`
                );
            }

            factories.set(
                Type,
                (factory = new FactoryImpl<K>(Type, DI.getDependencies(Type)))
            );
        }

        return factory;
    }

    public registerFactory<K extends Constructable>(key: K, factory: Factory<K>): void {
        factories.set(key, factory);
    }

    public createChild(
        config?: Partial<Omit<ContainerConfiguration, "parentLocator">>
    ): Container {
        return new ContainerImpl(
            null,
            Object.assign({}, this.config, config, { parentLocator: () => this })
        );
    }

    private jitRegister(keyAsValue: any, handler: ContainerImpl): Resolver {
        if (typeof keyAsValue !== "function") {
            throw new Error(
                `Attempted to jitRegister something that is not a constructor: '${keyAsValue}'. Did you forget to register this dependency?`
            );
        }

        if (InstrinsicTypeNames.has(keyAsValue.name)) {
            throw new Error(
                `Attempted to jitRegister an intrinsic type: ${keyAsValue.name}. Did you forget to add @inject(Key)`
            );
        }

        if (isRegistry(keyAsValue)) {
            const registrationResolver = keyAsValue.register(handler, keyAsValue);
            if (
                !(registrationResolver instanceof Object) ||
                (registrationResolver as Resolver).resolve == null
            ) {
                const newResolver = handler.resolvers.get(keyAsValue);

                if (newResolver != void 0) {
                    return newResolver;
                }

                throw new Error(
                    "A valid resolver was not returned from the static register method"
                );
            }

            return registrationResolver as Resolver;
        } else if (keyAsValue.$isInterface) {
            throw new Error(
                `Attempted to jitRegister an interface: ${keyAsValue.friendlyName}`
            );
        } else {
            const resolver = this.config.defaultResolver(keyAsValue, handler);
            handler.resolvers.set(keyAsValue, resolver);
            return resolver;
        }
    }
}

const cache = new WeakMap<Resolver>();

function cacheCallbackResult<T>(fun: ResolveCallback<T>): ResolveCallback<T> {
    return function (handler: Container, requestor: Container, resolver: Resolver): T {
        if (cache.has(resolver)) {
            return cache.get(resolver);
        }
        const t = fun(handler, requestor, resolver);
        cache.set(resolver, t);
        return t;
    };
}

/**
 * You can use the resulting Registration of any of the factory methods
 * to register with the container.
 *
 * @example
 * ```
 * class Foo {}
 * const container = DI.createContainer();
 * container.register(Registration.instance(Foo, new Foo()));
 * container.get(Foo);
 * ```
 *
 * @public
 */
export const Registration = Object.freeze({
    /**
     * Allows you to pass an instance.
     * Every time you request this {@link Key} you will get this instance back.
     *
     * @example
     * ```
     * Registration.instance(Foo, new Foo()));
     * ```
     *
     * @param key - The key to register the instance under.
     * @param value - The instance to return when the key is requested.
     */
    instance<T>(key: Key, value: T): Registration<T> {
        return new ResolverImpl(key, ResolverStrategy.instance, value);
    },

    /**
     * Creates an instance from the class.
     * Every time you request this {@link Key} you will get the same one back.
     *
     * @example
     * ```
     * Registration.singleton(Foo, Foo);
     * ```
     *
     * @param key - The key to register the singleton under.
     * @param value - The class to instantiate as a singleton when first requested.
     */
    singleton<T extends Constructable>(
        key: Key,
        value: T
    ): Registration<InstanceType<T>> {
        return new ResolverImpl(key, ResolverStrategy.singleton, value);
    },

    /**
     * Creates an instance from a class.
     * Every time you request this {@link Key} you will get a new instance.
     *
     * @example
     * ```
     * Registration.instance(Foo, Foo);
     * ```
     *
     * @param key - The key to register the instance type under.
     * @param value - The class to instantiate each time the key is requested.
     */
    transient<T extends Constructable>(
        key: Key,
        value: T
    ): Registration<InstanceType<T>> {
        return new ResolverImpl(key, ResolverStrategy.transient, value);
    },

    /**
     * Delegates to a callback function to provide the dependency.
     * Every time you request this {@link Key} the callback will be invoked to provide
     * the dependency.
     *
     * @example
     * ```
     * Registration.callback(Foo, () => new Foo());
     * Registration.callback(Bar, (c: Container) => new Bar(c.get(Foo)));
     * ```
     *
     * @param key - The key to register the callback for.
     * @param callback - The function that is expected to return the dependency.
     */
    callback<T>(key: Key, callback: ResolveCallback<T>): Registration<Resolved<T>> {
        return new ResolverImpl(key, ResolverStrategy.callback, callback);
    },

    /**
     * Delegates to a callback function to provide the dependency and then caches the
     * dependency for future requests.
     *
     * @example
     * ```
     * Registration.cachedCallback(Foo, () => new Foo());
     * Registration.cachedCallback(Bar, (c: Container) => new Bar(c.get(Foo)));
     * ```
     *
     * @param key - The key to register the callback for.
     * @param callback - The function that is expected to return the dependency.
     * @remarks
     * If you pass the same Registration to another container, the same cached value will be used.
     * Should all references to the resolver returned be removed, the cache will expire.
     */
    cachedCallback<T>(key: Key, callback: ResolveCallback<T>): Registration<Resolved<T>> {
        return new ResolverImpl(
            key,
            ResolverStrategy.callback,
            cacheCallbackResult(callback)
        );
    },

    /**
     * Creates an alternate {@link Key} to retrieve an instance by.
     *
     * @example
     * ```
     * Register.singleton(Foo, Foo)
     * Register.aliasTo(Foo, MyFoos);
     *
     * container.getAll(MyFoos) // contains an instance of Foo
     * ```
     *
     * @param originalKey - The original key that has been registered.
     * @param aliasKey - The alias to the original key.
     */
    aliasTo<T>(originalKey: T, aliasKey: Key): Registration<Resolved<T>> {
        return new ResolverImpl(aliasKey, ResolverStrategy.alias, originalKey);
    },
});

/** @internal */
export function validateKey(key: any): void {
    if (key === null || key === void 0) {
        throw new Error(
            "key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?"
        );
    }
}

function buildAllResponse(
    resolver: Resolver,
    handler: Container,
    requestor: Container
): any[] {
    if (
        resolver instanceof ResolverImpl &&
        resolver.strategy === ResolverStrategy.array
    ) {
        const state = resolver.state as Resolver[];
        let i = state.length;
        const results = new Array(i);

        while (i--) {
            results[i] = state[i].resolve(handler, requestor);
        }

        return results;
    }

    return [resolver.resolve(handler, requestor)];
}

const defaultFriendlyName = "(anonymous)";

// making this private because I think we may want to
// refactor to use the new proposed community context standard
interface DOMParentLocatorEventDetail {
    container: Container | void;
}

/* eslint-disable-next-line */
function isObject<T extends object = Object | Function>(value: unknown): value is T {
    return (typeof value === "object" && value !== null) || typeof value === "function";
}

/**
 * Determine whether the value is a native function.
 *
 * @param fn - The function to check.
 * @returns `true` is the function is a native function, otherwise `false`
 */
const isNativeFunction = (function () {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const lookup: WeakMap<Function, boolean> = new WeakMap();

    let isNative = false as boolean | undefined;
    let sourceText = "";
    let i = 0;

    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (fn: Function) {
        isNative = lookup.get(fn);
        if (isNative === void 0) {
            sourceText = fn.toString();
            i = sourceText.length;

            // http://www.ecma-international.org/ecma-262/#prod-NativeFunction
            isNative =
                // 29 is the length of 'function () { [native code] }' which is the smallest length of a native function string
                i >= 29 &&
                // 100 seems to be a safe upper bound of the max length of a native function. In Chrome and FF it's 56, in Edge it's 61.
                i <= 100 &&
                // This whole heuristic *could* be tricked by a comment. Do we need to care about that?
                sourceText.charCodeAt(i - 1) === 0x7d && // }
                // TODO: the spec is a little vague about the precise constraints, so we do need to test this across various browsers to make sure just one whitespace is a safe assumption.
                sourceText.charCodeAt(i - 2) <= 0x20 && // whitespace
                sourceText.charCodeAt(i - 3) === 0x5d && // ]
                sourceText.charCodeAt(i - 4) === 0x65 && // e
                sourceText.charCodeAt(i - 5) === 0x64 && // d
                sourceText.charCodeAt(i - 6) === 0x6f && // o
                sourceText.charCodeAt(i - 7) === 0x63 && // c
                sourceText.charCodeAt(i - 8) === 0x20 && //
                sourceText.charCodeAt(i - 9) === 0x65 && // e
                sourceText.charCodeAt(i - 10) === 0x76 && // v
                sourceText.charCodeAt(i - 11) === 0x69 && // i
                sourceText.charCodeAt(i - 12) === 0x74 && // t
                sourceText.charCodeAt(i - 13) === 0x61 && // a
                sourceText.charCodeAt(i - 14) === 0x6e && // n
                sourceText.charCodeAt(i - 15) === 0x58; // [

            lookup.set(fn, isNative);
        }
        return isNative;
    };
})();

const isNumericLookup: Record<string, boolean> = {};

function isArrayIndex(value: unknown): value is number | string {
    switch (typeof value) {
        case "number":
            return value >= 0 && (value | 0) === value;
        case "string": {
            const result = isNumericLookup[value];
            if (result !== void 0) {
                return result;
            }
            const length = value.length;
            if (length === 0) {
                return (isNumericLookup[value] = false);
            }
            let ch = 0;
            for (let i = 0; i < length; ++i) {
                ch = value.charCodeAt(i);
                if (
                    (i === 0 && ch === 0x30 && length > 1) /* must not start with 0 */ ||
                    ch < 0x30 /* 0 */ ||
                    ch > 0x39 /* 9 */
                ) {
                    return (isNumericLookup[value] = false);
                }
            }
            return (isNumericLookup[value] = true);
        }
        default:
            return false;
    }
}
