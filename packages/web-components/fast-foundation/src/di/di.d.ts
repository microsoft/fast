/**
 * Big thanks to https://github.com/fkleuver and the https://github.com/aurelia/aurelia project
 * for the bulk of this code and many of the associated tests.
 */
import { Constructable } from "@microsoft/fast-element";
/**
 * Represents a custom callback for resolving a request from the container.
 * The handler is the container that is invoking the callback. The requestor
 * is the original container that made the request. The handler and the requestor
 * may not be the same if the request has bubbled up to a parent container in the DI hierarchy.
 * The resolver is the instance of the resolver that stores the callback. This is provided in case
 * the callback needs a place or key against which to store state across resolutions.
 * @public
 */
export declare type ResolveCallback<T = any> = (
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
export declare type InterfaceSymbol<K = any> = (
    target: any,
    property: string,
    index?: number
) => void;
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
export declare type Transformer<K> = (instance: Resolved<K>) => Resolved<K>;
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
export declare class ResolverBuilder<K> {
    private container;
    private key;
    /**
     *
     * @param container - The container to create resolvers for.
     * @param key - The key to register resolvers under.
     */
    constructor(container: Container, key: Key);
    /**
     * Creates a resolver for an existing object instance.
     * @param value - The instance to resolve.
     * @returns The resolver.
     */
    instance(value: K): Resolver<K>;
    /**
     * Creates a resolver that enforces a singleton lifetime.
     * @param value - The type to create and cache the singleton for.
     * @returns The resolver.
     */
    singleton(value: Constructable): Resolver<K>;
    /**
     * Creates a resolver that creates a new instance for every dependency request.
     * @param value - The type to create instances of.
     * @returns - The resolver.
     */
    transient(value: Constructable): Resolver<K>;
    /**
     * Creates a resolver that invokes a callback function for every dependency resolution
     * request, allowing custom logic to return the dependency.
     * @param value - The callback to call during resolution.
     * @returns The resolver.
     */
    callback(value: ResolveCallback<K>): Resolver<K>;
    /**
     * Creates a resolver that invokes a callback function the first time that a dependency
     * resolution is requested. The returned value is then cached and provided for all
     * subsequent requests.
     * @param value - The callback to call during the first resolution.
     * @returns The resolver.
     */
    cachedCallback(value: ResolveCallback<K>): Resolver<K>;
    /**
     * Aliases the current key to a different key.
     * @param destinationKey - The key to point the alias to.
     * @returns The resolver.
     */
    aliasTo(destinationKey: Key): Resolver<K>;
    private registerResolver;
}
/**
 * Represents an object that can register itself.
 * @public
 */
export declare type RegisterSelf<T extends Constructable> = {
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
export declare type Key =
    | PropertyKey
    | object
    | InterfaceSymbol
    | Constructable
    | Resolver;
/**
 * Represents something resolved from a service locator.
 * @public
 */
export declare type Resolved<K> = K extends InterfaceSymbol<infer T>
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
export declare type Injectable<T = {}> = Constructable<T> & {
    inject?: Key[];
};
/**
 * A function capable of locating the parent container based on a container's owner.
 * @remarks
 * A container owner is usually an HTMLElement instance.
 * @public
 */
export declare type ParentLocator = (owner: any) => Container | null;
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
export declare const DefaultResolver: Readonly<{
    /**
     * Disables auto-registration and throws for all un-registered dependencies.
     * @param key - The key to create the resolver for.
     */
    none(key: Key): Resolver;
    /**
     * Provides default singleton resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    singleton(key: Key): Resolver;
    /**
     * Provides default transient resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    transient(key: Key): Resolver;
}>;
/**
 * Configuration for a dependency injection container.
 * @public
 */
export declare const ContainerConfiguration: Readonly<{
    /**
     * The default configuration used when creating a DOM-disconnected container.
     * @remarks
     * The default creates a root container, with no parent container. It does not handle
     * owner requests and it uses singleton resolution behavior for auto-registration.
     */
    default: Readonly<ContainerConfiguration>;
}>;
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
/**
 * The gateway to dependency injection APIs.
 * @public
 */
export declare const DI: Readonly<{
    /**
     * Creates a new dependency injection container.
     * @param config - The configuration for the container.
     * @returns A newly created dependency injection container.
     */
    createContainer(config?: Partial<ContainerConfiguration>): Container;
    /**
     * Finds the dependency injection container responsible for providing dependencies
     * to the specified node.
     * @param node - The node to find the responsible container for.
     * @returns The container responsible for providing dependencies to the node.
     * @remarks
     * This will be the same as the parent container if the specified node
     * does not itself host a container configured with responsibleForOwnerRequests.
     */
    findResponsibleContainer(node: Node): Container;
    /**
     * Find the dependency injection container up the DOM tree from this node.
     * @param node - The node to find the parent container for.
     * @returns The parent container of this node.
     * @remarks
     * This will be the same as the responsible container if the specified node
     * does not itself host a container configured with responsibleForOwnerRequests.
     */
    findParentContainer(node: Node): Container;
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
        node?: Node,
        config?: Partial<Omit<ContainerConfiguration, "parentLocator">>
    ): Container;
    /**
     * Gets the "design:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getDesignParamtypes: (Type: Constructable | Injectable) => readonly Key[] | undefined;
    /**
     * Gets the "di:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getAnnotationParamtypes: (
        Type: Constructable | Injectable
    ) => readonly Key[] | undefined;
    /**
     *
     * @param Type - Gets the "di:paramtypes" metadata for the specified type. If none is found,
     * an empty metadata array is created and added.
     * @returns The metadata array.
     */
    getOrCreateAnnotationParamTypes(Type: Constructable | Injectable): Key[];
    /**
     * Gets the dependency keys representing what is needed to instantiate the specified type.
     * @param Type - The type to get the dependencies for.
     * @returns An array of dependency keys.
     */
    getDependencies(Type: Constructable | Injectable): Key[];
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
        respectConnection?: boolean
    ): void;
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
            | InterfaceConfiguration
            | ((builder: ResolverBuilder<K>) => Resolver<K>),
        configuror?: (builder: ResolverBuilder<K>) => Resolver<K>
    ): InterfaceSymbol<K>;
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
    ) => void;
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
    transient<T extends Constructable<{}>>(
        target: T & Partial<RegisterSelf<T>>
    ): T & RegisterSelf<T>;
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
    singleton<T_1 extends Constructable<{}>>(
        target: T_1 & Partial<RegisterSelf<T_1>>,
        options?: SingletonOptions
    ): T_1 & RegisterSelf<T_1>;
}>;
/**
 * The interface key that resolves the dependency injection container itself.
 * @public
 */
export declare const Container: InterfaceSymbol<Container>;
/**
 * The interface key that resolves the service locator itself.
 * @public
 */
export declare const ServiceLocator: InterfaceSymbol<ServiceLocator>;
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
export declare const inject: (
    ...dependencies: Key[]
) => (
    target: any,
    key?: string | number,
    descriptor?: PropertyDescriptor | number
) => void;
declare function transientDecorator<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T>;
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
export declare function transient<T extends Constructable>(): typeof transientDecorator;
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
export declare function transient<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T>;
declare type SingletonOptions = {
    scoped: boolean;
};
declare function singletonDecorator<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T>;
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
export declare function singleton<T extends Constructable>(): typeof singletonDecorator;
/**
 * @public
 */
export declare function singleton<T extends Constructable>(
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
export declare function singleton<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T>;
/**
 * A decorator and DI resolver that will resolve an array of all dependencies
 * registered with the specified key.
 * @param key - The key to resolve all dependencies for.
 * @param searchAncestors - [optional] Indicates whether to search ancestor containers.
 * @public
 */
export declare const all: (
    key: any,
    searchAncestors?: boolean
) => ReturnType<typeof DI.inject>;
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
export declare const lazy: (key: any) => any;
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
export declare const optional: (key: any) => any;
/**
 * A decorator that tells the container not to try to inject a dependency.
 *
 * @public
 */
export declare function ignore(
    target: Injectable,
    property?: string | number,
    descriptor?: PropertyDescriptor | number
): void;
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
export declare const newInstanceForScope: (key: any) => any;
/**
 * A decorator that indicates that a new instance should be injected.
 * @param key - The dependency key for the new instance.
 * @remarks
 * The instance is not internally cached with a resolver as newInstanceForScope does.
 *
 * @public
 */
export declare const newInstanceOf: (key: any) => any;
/** @internal */
export declare const enum ResolverStrategy {
    instance = 0,
    singleton = 1,
    transient = 2,
    callback = 3,
    array = 4,
    alias = 5,
}
/** @internal */
export declare class ResolverImpl implements Resolver, Registration {
    key: Key;
    strategy: ResolverStrategy;
    state: any;
    constructor(key: Key, strategy: ResolverStrategy, state: any);
    get $isResolver(): true;
    private resolving;
    register(container: Container, key?: Key): Resolver;
    resolve(handler: Container, requestor: Container): any;
    getFactory(container: Container): Factory | null;
}
/** @internal */
export declare class FactoryImpl<T extends Constructable = any> implements Factory<T> {
    Type: T;
    private readonly dependencies;
    private transformers;
    constructor(Type: T, dependencies: Key[]);
    construct(container: Container, dynamicDependencies?: Key[]): Resolved<T>;
    registerTransformer(transformer: (instance: any) => any): void;
}
/**
 * @internal
 */
export declare class ContainerImpl implements Container {
    protected owner: any;
    protected config: ContainerConfiguration;
    private _parent;
    private registerDepth;
    private resolvers;
    get parent(): ContainerImpl;
    get depth(): number;
    get responsibleForOwnerRequests(): boolean;
    constructor(owner: any, config: ContainerConfiguration);
    register(...params: any[]): Container;
    registerResolver<K extends Key, T = K>(key: K, resolver: Resolver<T>): Resolver<T>;
    registerTransformer<K extends Key, T = K>(
        key: K,
        transformer: Transformer<T>
    ): boolean;
    getResolver<K extends Key, T = K>(
        key: K | Key,
        autoRegister?: boolean
    ): Resolver<T> | null;
    has<K extends Key>(key: K, searchAncestors?: boolean): boolean;
    get<K extends Key>(key: K): Resolved<K>;
    getAll<K extends Key>(key: K, searchAncestors?: boolean): readonly Resolved<K>[];
    getFactory<K extends Constructable>(Type: K): Factory<K>;
    registerFactory<K extends Constructable>(key: K, factory: Factory<K>): void;
    createChild(
        config?: Partial<Omit<ContainerConfiguration, "parentLocator">>
    ): Container;
    private jitRegister;
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
export declare const Registration: Readonly<{
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
    instance<T>(key: Key, value: T): Registration<T>;
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
    singleton<T_1 extends Constructable<{}>>(
        key: Key,
        value: T_1
    ): Registration<InstanceType<T_1>>;
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
    transient<T_2 extends Constructable<{}>>(
        key: Key,
        value: T_2
    ): Registration<InstanceType<T_2>>;
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
    callback<T_3>(key: Key, callback: ResolveCallback<T_3>): Registration<Resolved<T_3>>;
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
    cachedCallback<T_4>(
        key: Key,
        callback: ResolveCallback<T_4>
    ): Registration<Resolved<T_4>>;
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
    aliasTo<T_5>(originalKey: T_5, aliasKey: Key): Registration<Resolved<T_5>>;
}>;
/** @internal */
export declare function validateKey(key: any): void;
export {};
