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
 * @alpha
 */
export type ResolveCallback<T = any> = (
    handler: Container,
    requestor: Container,
    resolver: Resolver<T>
) => T;

/**
 * @alpha
 */
export type InterfaceSymbol<K = any> = (
    target: any,
    property: string,
    index?: number
) => void;

// This interface exists only to break a circular type referencing issue in the IServiceLocator interface.
// Otherwise IServiceLocator references IResolver, which references IContainer, which extends IServiceLocator.
interface ResolverLike<C, K = any> {
    readonly $isResolver: true;
    resolve(handler: C, requestor: C): Resolved<K>;
    getFactory?(container: C): (K extends Constructable ? Factory<K> : never) | null;
}

/**
 * @alpha
 */
/* eslint-disable-next-line */
export interface Resolver<K = any> extends ResolverLike<Container, K> {}

/**
 * @alpha
 */
export interface Registration<K = any> {
    register(container: Container, key?: Key): Resolver<K>;
}

/**
 * @alpha
 */
export type Transformer<K> = (instance: Resolved<K>) => Resolved<K>;

/**
 * @alpha
 */
export interface Factory<T extends Constructable = any> {
    readonly Type: T;
    registerTransformer(transformer: Transformer<T>): void;
    construct(container: Container, dynamicDependencies?: Key[]): Resolved<T>;
}

/**
 * @alpha
 */
export interface ServiceLocator {
    has<K extends Key>(key: K | Key, searchAncestors: boolean): boolean;
    get<K extends Key>(key: K): Resolved<K>;
    get<K extends Key>(key: Key): Resolved<K>;
    get<K extends Key>(key: K | Key): Resolved<K>;
    getAll<K extends Key>(key: K, searchAncestors?: boolean): readonly Resolved<K>[];
    getAll<K extends Key>(key: Key, searchAncestors?: boolean): readonly Resolved<K>[];
    getAll<K extends Key>(
        key: K | Key,
        searchAncestors?: boolean
    ): readonly Resolved<K>[];
}

/**
 * @alpha
 */
export interface Registry {
    register(container: Container, ...params: unknown[]): void | Resolver | Container;
}

/**
 * @alpha
 */
export interface Container extends ServiceLocator {
    register(...params: any[]): Container;
    registerResolver<K extends Key, T = K>(
        key: K,
        resolver: Resolver<T>,
        isDisposable?: boolean
    ): Resolver<T>;
    registerTransformer<K extends Key, T = K>(
        key: K,
        transformer: Transformer<T>
    ): boolean;
    getResolver<K extends Key, T = K>(
        key: K | Key,
        autoRegister?: boolean
    ): Resolver<T> | null;
    registerFactory<T extends Constructable>(key: T, factory: Factory<T>): void;
    getFactory<T extends Constructable>(key: T): Factory<T>;
    createChild(
        config?: Partial<Omit<ContainerConfiguration, "parentLocator">>
    ): Container;
}

/**
 * @alpha
 */
export class ResolverBuilder<K> {
    public constructor(private container: Container, private key: Key) {}

    public instance(value: K): Resolver<K> {
        return this.registerResolver(ResolverStrategy.instance, value);
    }

    public singleton(value: Constructable): Resolver<K> {
        return this.registerResolver(ResolverStrategy.singleton, value);
    }

    public transient(value: Constructable): Resolver<K> {
        return this.registerResolver(ResolverStrategy.transient, value);
    }

    public callback(value: ResolveCallback<K>): Resolver<K> {
        return this.registerResolver(ResolverStrategy.callback, value);
    }

    public cachedCallback(value: ResolveCallback<K>): Resolver<K> {
        return this.registerResolver(
            ResolverStrategy.callback,
            cacheCallbackResult(value)
        );
    }

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
 * @alpha
 */
export type RegisterSelf<T extends Constructable> = {
    register(container: Container): Resolver<InstanceType<T>>;
    registerInRequestor: boolean;
};

/**
 * @alpha
 */
export type Key = PropertyKey | object | InterfaceSymbol | Constructable | Resolver;

/**
 * @alpha
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
 * @alpha
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
 * @alpha
 */
export type ParentLocator = (owner: any) => Container | null;

/**
 * @alpha
 */
export interface ContainerConfiguration {
    parentLocator: ParentLocator;
    responsibleForOwnerRequests: boolean;
    defaultResolver(key: Key, handler: Container): Resolver;
}

/**
 * @alpha
 */
export const DefaultResolver = Object.freeze({
    none(key: Key): Resolver {
        throw Error(
            `${key.toString()} not registered, did you forget to add @singleton()?`
        );
    },
    singleton(key: Key): Resolver {
        return new ResolverImpl(key, ResolverStrategy.singleton, key);
    },
    transient(key: Key): Resolver {
        return new ResolverImpl(key, ResolverStrategy.transient, key);
    },
});

/**
 * @alpha
 */
export const ContainerConfiguration = Object.freeze({
    default: Object.freeze({
        parentLocator: () => null,
        responsibleForOwnerRequests: false,
        defaultResolver: DefaultResolver.singleton,
    } as ContainerConfiguration),
});

/**
 * @alpha
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
 * @alpha
 */
export const DI = Object.freeze({
    createContainer(config?: Partial<ContainerConfiguration>): Container {
        return new ContainerImpl(
            null,
            Object.assign({}, ContainerConfiguration.default, config)
        );
    },

    findResponsibleContainer(element: HTMLElement): Container {
        const owned = (element as any).$container as ContainerImpl;

        if (owned && owned.responsibleForOwnerRequests) {
            return owned;
        }

        return DI.findParentContainer(element);
    },

    findParentContainer(element: HTMLElement) {
        const event = new CustomEvent<DOMParentLocatorEventDetail>(
            DILocateParentEventType,
            {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: { container: void 0 },
            }
        );

        element.dispatchEvent(event);

        return event.detail.container || DI.getOrCreateDOMContainer();
    },

    getOrCreateDOMContainer(
        element: HTMLElement = document.body,
        config?: Partial<Omit<ContainerConfiguration, "parentLocator">>
    ): Container {
        return (
            (element as any).$container ||
            new ContainerImpl(
                element,
                Object.assign({}, ContainerConfiguration.default, config, {
                    parentLocator:
                        element === document.body ? () => null : DI.findParentContainer,
                })
            )
        );
    },
    getDesignParamtypes: getParamTypes("design:paramtypes"),
    getAnnotationParamtypes: getParamTypes("di:paramtypes"),

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
     * @alpha
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
 * @alpha
 */
export const Container = DI.createInterface<Container>("Container");

/**
 * @alpha
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
 * @alpha
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
 * @alpha
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
 * @alpha
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
 * @alpha
 */
export function singleton<T extends Constructable>(): typeof singletonDecorator;
/**
 * @alpha
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
 * @alpha
 */
export function singleton<T extends Constructable>(
    target: T & Partial<RegisterSelf<T>>
): T & RegisterSelf<T>;
/**
 * @alpha
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
 * @alpha
 */
export const all = createAllResolver(
    (key: any, handler: Container, requestor: Container, searchAncestors: boolean) =>
        requestor.getAll(key, searchAncestors)
);

/**
 * Lazily inject a dependency depending on whether the [[`Key`]] is present at the time of function call.
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
 * @param key - [[`Key`]]
 * see {@link DI.createInterface} on interactions with interfaces
 *
 * @alpha
 */
export const lazy = createResolver(
    (key: Key, handler: Container, requestor: Container) => {
        return () => requestor.get(key);
    }
);

/**
 * Allows you to optionally inject a dependency depending on whether the [[`Key`]] is present, for example
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
 * if you use it without a default it will inject `undefined`, so rember to mark your input type as
 * possibly `undefined`!
 *
 * @param key - [[`Key`]]
 *
 * see {@link DI.createInterface} on interactions with interfaces
 *
 * @alpha
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
 * Ignore tells the container not to try to inject a dependency.
 *
 * @alpha
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
 * @alpha
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
 * @alpha
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

/**
 * @alpha
 */
export interface Invoker<T extends Constructable = any> {
    invoke(container: Container, fn: T, dependencies: Key[]): Resolved<T>;
    invokeWithDynamicDependencies(
        container: Container,
        fn: T,
        staticDependencies: Key[],
        dynamicDependencies: Key[]
    ): Resolved<T>;
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
 * @alpha
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
            owner.$container = this;
        }

        this.resolvers = new Map();
        this.resolvers.set(Container, containerResolver);

        if (owner instanceof HTMLElement) {
            owner.addEventListener(
                DILocateParentEventType,
                (e: CustomEvent<DOMParentLocatorEventDetail>) => {
                    if (e.target !== this.owner) {
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
                `Attempted to jitRegister something that is not a constructor: '${keyAsValue}'. Did you forget to register this resource?`
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
 * to register with the container, e.g.
 * ```
 * class Foo {}
 * const container = DI.createContainer();
 * container.register(Registration.instance(Foo, new Foo()));
 * container.get(Foo);
 * ```
 *
 * @alpha
 */
export const Registration = Object.freeze({
    /**
     * allows you to pass an instance.
     * Every time you request this {@link Key} you will get this instance back.
     * ```
     * Registration.instance(Foo, new Foo()));
     * ```
     *
     * @param key -
     * @param value -
     */
    instance<T>(key: Key, value: T): Registration<T> {
        return new ResolverImpl(key, ResolverStrategy.instance, value);
    },
    /**
     * Creates an instance from the class.
     * Every time you request this {@link Key} you will get the same one back.
     * ```
     * Registration.singleton(Foo, Foo);
     * ```
     *
     * @param key -
     * @param value -
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
     * ```
     * Registration.instance(Foo, Foo);
     * ```
     *
     * @param key -
     * @param value -
     */
    transient<T extends Constructable>(
        key: Key,
        value: T
    ): Registration<InstanceType<T>> {
        return new ResolverImpl(key, ResolverStrategy.transient, value);
    },
    /**
     * Creates an instance from the method passed.
     * Every time you request this {@link Key} you will get a new instance.
     * ```
     * Registration.callback(Foo, () => new Foo());
     * Registration.callback(Bar, (c: IContainer) => new Bar(c.get(Foo)));
     * ```
     *
     * @param key -
     * @param callback -
     */
    callback<T>(key: Key, callback: ResolveCallback<T>): Registration<Resolved<T>> {
        return new ResolverImpl(key, ResolverStrategy.callback, callback);
    },
    /**
     * Creates an instance from the method passed.
     * On the first request for the {@link Key} your callback is called and returns an instance.
     * subsequent requests for the {@link Key}, the initial instance returned will be returned.
     * If you pass the same Registration to another container the same cached value will be used.
     * Should all references to the resolver returned be removed, the cache will expire.
     * ```
     * Registration.cachedCallback(Foo, () => new Foo());
     * Registration.cachedCallback(Bar, (c: IContainer) => new Bar(c.get(Foo)));
     * ```
     *
     * @param key -
     * @param callback -
     */
    cachedCallback<T>(key: Key, callback: ResolveCallback<T>): Registration<Resolved<T>> {
        return new ResolverImpl(
            key,
            ResolverStrategy.callback,
            cacheCallbackResult(callback)
        );
    },
    /**
     * creates an alternate {@link Key} to retrieve an instance by.
     * Returns the same scope as the original {@link Key}.
     * ```
     * Register.singleton(Foo, Foo)
     * Register.aliasTo(Foo, MyFoos);
     *
     * container.getAll(MyFoos) // contains an instance of Foo
     * ```
     *
     * @param originalKey -
     * @param aliasKey -
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

/**
 * @alpha
 */
export interface DOMParentLocatorEventDetail {
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
