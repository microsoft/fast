/**
 * Big thanks to https://github.com/fkleuver and the https://github.com/aurelia/aurelia project
 * for the bulk of this code and many of the associated tests.
 */
import { emptyArray, FASTElement } from "@microsoft/fast-element";
// Tiny polyfill for TypeScript's Reflect metadata API.
const metadataByTarget = new Map();
if (!("metadata" in Reflect)) {
    Reflect.metadata = function (key, value) {
        return function (target) {
            Reflect.defineMetadata(key, value, target);
        };
    };
    Reflect.defineMetadata = function (key, value, target) {
        let metadata = metadataByTarget.get(target);
        if (metadata === void 0) {
            metadataByTarget.set(target, (metadata = new Map()));
        }
        metadata.set(key, value);
    };
    Reflect.getOwnMetadata = function (key, target) {
        const metadata = metadataByTarget.get(target);
        if (metadata !== void 0) {
            return metadata.get(key);
        }
        return void 0;
    };
}
/**
 * A utility class used that constructs and registers resolvers for a dependency
 * injection container. Supports a standard set of object lifetimes.
 * @public
 */
export class ResolverBuilder {
    /**
     *
     * @param container - The container to create resolvers for.
     * @param key - The key to register resolvers under.
     */
    constructor(container, key) {
        this.container = container;
        this.key = key;
    }
    /**
     * Creates a resolver for an existing object instance.
     * @param value - The instance to resolve.
     * @returns The resolver.
     */
    instance(value) {
        return this.registerResolver(0 /* instance */, value);
    }
    /**
     * Creates a resolver that enforces a singleton lifetime.
     * @param value - The type to create and cache the singleton for.
     * @returns The resolver.
     */
    singleton(value) {
        return this.registerResolver(1 /* singleton */, value);
    }
    /**
     * Creates a resolver that creates a new instance for every dependency request.
     * @param value - The type to create instances of.
     * @returns - The resolver.
     */
    transient(value) {
        return this.registerResolver(2 /* transient */, value);
    }
    /**
     * Creates a resolver that invokes a callback function for every dependency resolution
     * request, allowing custom logic to return the dependency.
     * @param value - The callback to call during resolution.
     * @returns The resolver.
     */
    callback(value) {
        return this.registerResolver(3 /* callback */, value);
    }
    /**
     * Creates a resolver that invokes a callback function the first time that a dependency
     * resolution is requested. The returned value is then cached and provided for all
     * subsequent requests.
     * @param value - The callback to call during the first resolution.
     * @returns The resolver.
     */
    cachedCallback(value) {
        return this.registerResolver(3 /* callback */, cacheCallbackResult(value));
    }
    /**
     * Aliases the current key to a different key.
     * @param destinationKey - The key to point the alias to.
     * @returns The resolver.
     */
    aliasTo(destinationKey) {
        return this.registerResolver(5 /* alias */, destinationKey);
    }
    registerResolver(strategy, state) {
        const { container, key } = this;
        this.container = this.key = void 0;
        return container.registerResolver(key, new ResolverImpl(key, strategy, state));
    }
}
function cloneArrayWithPossibleProps(source) {
    const clone = source.slice();
    const keys = Object.keys(source);
    const len = keys.length;
    let key;
    for (let i = 0; i < len; ++i) {
        key = keys[i];
        if (!isArrayIndex(key)) {
            clone[key] = source[key];
        }
    }
    return clone;
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
    none(key) {
        throw Error(
            `${key.toString()} not registered, did you forget to add @singleton()?`
        );
    },
    /**
     * Provides default singleton resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    singleton(key) {
        return new ResolverImpl(key, 1 /* singleton */, key);
    },
    /**
     * Provides default transient resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    transient(key) {
        return new ResolverImpl(key, 2 /* transient */, key);
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
    }),
});
const dependencyLookup = new Map();
function getParamTypes(key) {
    return Type => {
        return Reflect.getOwnMetadata(key, Type);
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
    createContainer(config) {
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
    findResponsibleContainer(node) {
        const owned = node.$$container$$;
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
    findParentContainer(node) {
        const event = new CustomEvent(DILocateParentEventType, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: { container: void 0 },
        });
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
    getOrCreateDOMContainer(node = document.body, config) {
        return (
            node.$$container$$ ||
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
    getOrCreateAnnotationParamTypes(Type) {
        let annotationParamtypes = this.getAnnotationParamtypes(Type);
        if (annotationParamtypes === void 0) {
            Reflect.defineMetadata("di:paramtypes", (annotationParamtypes = []), Type);
        }
        return annotationParamtypes;
    },
    /**
     * Gets the dependency keys representing what is needed to instantiate the specified type.
     * @param Type - The type to get the dependencies for.
     * @returns An array of dependency keys.
     */
    getDependencies(Type) {
        // Note: Every detail of this getDependencies method is pretty deliberate at the moment, and probably not yet 100% tested from every possible angle,
        // so be careful with making changes here as it can have a huge impact on complex end user apps.
        // Preferably, only make changes to the dependency resolution process via a RFC.
        let dependencies = dependencyLookup.get(Type);
        if (dependencies === void 0) {
            // Type.length is the number of constructor parameters. If this is 0, it could mean the class has an empty constructor
            // but it could also mean the class has no constructor at all (in which case it inherits the constructor from the prototype).
            // Non-zero constructor length + no paramtypes means emitDecoratorMetadata is off, or the class has no decorator.
            // We're not doing anything with the above right now, but it's good to keep in mind for any future issues.
            const inject = Type.inject;
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
                    let auAnnotationParamtype;
                    for (let i = 0; i < len; ++i) {
                        auAnnotationParamtype = annotationParamtypes[i];
                        if (auAnnotationParamtype !== void 0) {
                            dependencies[i] = auAnnotationParamtype;
                        }
                    }
                    const keys = Object.keys(annotationParamtypes);
                    len = keys.length;
                    let key;
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
    defineProperty(target, propertyName, key, respectConnection = false) {
        const diPropertyKey = `$di_${propertyName}`;
        Reflect.defineProperty(target, propertyName, {
            get: function () {
                let value = this[diPropertyKey];
                if (value === void 0) {
                    const container =
                        this instanceof HTMLElement
                            ? DI.findResponsibleContainer(this)
                            : DI.getOrCreateDOMContainer();
                    value = container.get(key);
                    this[diPropertyKey] = value;
                    if (respectConnection && this instanceof FASTElement) {
                        const notifier = this.$fastController;
                        const handleChange = () => {
                            const newContainer = DI.findResponsibleContainer(this);
                            const newValue = newContainer.get(key);
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
    createInterface(nameConfigOrCallback, configuror) {
        const configure =
            typeof nameConfigOrCallback === "function"
                ? nameConfigOrCallback
                : configuror;
        const friendlyName =
            typeof nameConfigOrCallback === "string"
                ? nameConfigOrCallback
                : nameConfigOrCallback && "friendlyName" in nameConfigOrCallback
                ? nameConfigOrCallback.friendlyName || defaultFriendlyName
                : defaultFriendlyName;
        const respectConnection =
            typeof nameConfigOrCallback === "string"
                ? false
                : nameConfigOrCallback && "respectConnection" in nameConfigOrCallback
                ? nameConfigOrCallback.respectConnection || false
                : false;
        const Interface = function (target, property, index) {
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
            Interface.register = function (container, key) {
                return configure(
                    new ResolverBuilder(
                        container,
                        key !== null && key !== void 0 ? key : Interface
                    )
                );
            };
        }
        Interface.toString = function toString() {
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
    inject(...dependencies) {
        return function (target, key, descriptor) {
            if (typeof descriptor === "number") {
                // It's a parameter decorator.
                const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target);
                const dep = dependencies[0];
                if (dep !== void 0) {
                    annotationParamtypes[descriptor] = dep;
                }
            } else if (key) {
                DI.defineProperty(target, key, dependencies[0]);
            } else {
                const annotationParamtypes = descriptor
                    ? DI.getOrCreateAnnotationParamTypes(descriptor.value)
                    : DI.getOrCreateAnnotationParamTypes(target);
                let dep;
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
    transient(target) {
        target.register = function register(container) {
            const registration = Registration.transient(target, target);
            return registration.register(container, target);
        };
        target.registerInRequestor = false;
        return target;
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
    singleton(target, options = defaultSingletonOptions) {
        target.register = function register(container) {
            const registration = Registration.singleton(target, target);
            return registration.register(container, target);
        };
        target.registerInRequestor = options.scoped;
        return target;
    },
});
/**
 * The interface key that resolves the dependency injection container itself.
 * @public
 */
export const Container = DI.createInterface("Container");
/**
 * The interface key that resolves the service locator itself.
 * @public
 */
export const ServiceLocator = Container;
function createResolver(getter) {
    return function (key) {
        const resolver = function (target, property, descriptor) {
            DI.inject(resolver)(target, property, descriptor);
        };
        resolver.$isResolver = true;
        resolver.resolve = function (handler, requestor) {
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
function transientDecorator(target) {
    return DI.transient(target);
}
export function transient(target) {
    return target == null ? transientDecorator : transientDecorator(target);
}
const defaultSingletonOptions = { scoped: false };
function singletonDecorator(target) {
    return DI.singleton(target);
}
/**
 * @public
 */
export function singleton(targetOrOptions) {
    if (typeof targetOrOptions === "function") {
        return DI.singleton(targetOrOptions);
    }
    return function ($target) {
        return DI.singleton($target, targetOrOptions);
    };
}
function createAllResolver(getter) {
    return function (key, searchAncestors) {
        searchAncestors = !!searchAncestors;
        const resolver = function (target, property, descriptor) {
            DI.inject(resolver)(target, property, descriptor);
        };
        resolver.$isResolver = true;
        resolver.resolve = function (handler, requestor) {
            return getter(key, handler, requestor, searchAncestors);
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
export const all = createAllResolver((key, handler, requestor, searchAncestors) =>
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
export const lazy = createResolver((key, handler, requestor) => {
    return () => requestor.get(key);
});
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
export const optional = createResolver((key, handler, requestor) => {
    if (requestor.has(key, true)) {
        return requestor.get(key);
    } else {
        return undefined;
    }
});
/**
 * A decorator that tells the container not to try to inject a dependency.
 *
 * @public
 */
export function ignore(target, property, descriptor) {
    DI.inject(ignore)(target, property, descriptor);
}
// Hack: casting below used to prevent TS from generate a namespace which can't be commented
// and results in documentation validation errors.
ignore.$isResolver = true;
ignore.resolve = () => undefined;
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
export const newInstanceForScope = createResolver((key, handler, requestor) => {
    const instance = createNewInstance(key, handler);
    const resolver = new ResolverImpl(key, 0 /* instance */, instance);
    requestor.registerResolver(key, resolver);
    return instance;
});
/**
 * A decorator that indicates that a new instance should be injected.
 * @param key - The dependency key for the new instance.
 * @remarks
 * The instance is not internally cached with a resolver as newInstanceForScope does.
 *
 * @public
 */
export const newInstanceOf = createResolver((key, handler, _requestor) =>
    createNewInstance(key, handler)
);
function createNewInstance(key, handler) {
    return handler.getFactory(key).construct(handler);
}
/** @internal */
export class ResolverImpl {
    constructor(key, strategy, state) {
        this.key = key;
        this.strategy = strategy;
        this.state = state;
        this.resolving = false;
    }
    get $isResolver() {
        return true;
    }
    register(container, key) {
        return container.registerResolver(key || this.key, this);
    }
    resolve(handler, requestor) {
        switch (this.strategy) {
            case 0 /* instance */:
                return this.state;
            case 1 /* singleton */: {
                if (this.resolving) {
                    throw new Error(`Cyclic dependency found: ${this.state.name}`);
                }
                this.resolving = true;
                this.state = handler.getFactory(this.state).construct(requestor);
                this.strategy = 0 /* instance */;
                this.resolving = false;
                return this.state;
            }
            case 2 /* transient */: {
                // Always create transients from the requesting container
                const factory = handler.getFactory(this.state);
                if (factory === null) {
                    throw new Error(
                        `Resolver for ${String(this.key)} returned a null factory`
                    );
                }
                return factory.construct(requestor);
            }
            case 3 /* callback */:
                return this.state(handler, requestor, this);
            case 4 /* array */:
                return this.state[0].resolve(handler, requestor);
            case 5 /* alias */:
                return requestor.get(this.state);
            default:
                throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`);
        }
    }
    getFactory(container) {
        var _a, _b, _c;
        switch (this.strategy) {
            case 1 /* singleton */:
            case 2 /* transient */:
                return container.getFactory(this.state);
            case 5 /* alias */:
                return (_c =
                    (_b =
                        (_a = container.getResolver(this.state)) === null || _a === void 0
                            ? void 0
                            : _a.getFactory) === null || _b === void 0
                        ? void 0
                        : _b.call(_a, container)) !== null && _c !== void 0
                    ? _c
                    : null;
            default:
                return null;
        }
    }
}
function containerGetKey(d) {
    return this.get(d);
}
function transformInstance(inst, transform) {
    return transform(inst);
}
/** @internal */
export class FactoryImpl {
    constructor(Type, dependencies) {
        this.Type = Type;
        this.dependencies = dependencies;
        this.transformers = null;
    }
    construct(container, dynamicDependencies) {
        let instance;
        if (dynamicDependencies === void 0) {
            instance = new this.Type(
                ...this.dependencies.map(containerGetKey, container)
            );
        } else {
            instance = new this.Type(
                ...this.dependencies.map(containerGetKey, container),
                ...dynamicDependencies
            );
        }
        if (this.transformers == null) {
            return instance;
        }
        return this.transformers.reduce(transformInstance, instance);
    }
    registerTransformer(transformer) {
        (this.transformers || (this.transformers = [])).push(transformer);
    }
}
const containerResolver = {
    $isResolver: true,
    resolve(handler, requestor) {
        return requestor;
    },
};
function isRegistry(obj) {
    return typeof obj.register === "function";
}
function isSelfRegistry(obj) {
    return isRegistry(obj) && typeof obj.registerInRequestor === "boolean";
}
function isRegisterInRequester(obj) {
    return isSelfRegistry(obj) && obj.registerInRequestor;
}
function isClass(obj) {
    return obj.prototype !== void 0;
}
const InstrinsicTypeNames = new Set([
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
const factories = new Map();
/**
 * @internal
 */
export class ContainerImpl {
    constructor(owner, config) {
        this.owner = owner;
        this.config = config;
        this._parent = void 0;
        this.registerDepth = 0;
        if (owner !== null) {
            owner.$$container$$ = this;
        }
        this.resolvers = new Map();
        this.resolvers.set(Container, containerResolver);
        if (owner instanceof Node) {
            owner.addEventListener(DILocateParentEventType, e => {
                if (e.composedPath()[0] !== this.owner) {
                    e.detail.container = this;
                    e.stopImmediatePropagation();
                }
            });
        }
    }
    get parent() {
        if (this._parent === void 0) {
            this._parent = this.config.parentLocator(this.owner);
        }
        return this._parent;
    }
    get depth() {
        return this.parent === null ? 0 : this.parent.depth + 1;
    }
    get responsibleForOwnerRequests() {
        return this.config.responsibleForOwnerRequests;
    }
    register(...params) {
        if (++this.registerDepth === 100) {
            throw new Error("Unable to autoregister dependency");
            // Most likely cause is trying to register a plain object that does not have a
            // register method and is not a class constructor
        }
        let current;
        let keys;
        let value;
        let j;
        let jj;
        for (let i = 0, ii = params.length; i < ii; ++i) {
            current = params[i];
            if (!isObject(current)) {
                continue;
            }
            if (isRegistry(current)) {
                current.register(this);
            } else if (isClass(current)) {
                Registration.singleton(current, current).register(this);
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
    registerResolver(key, resolver) {
        validateKey(key);
        const resolvers = this.resolvers;
        const result = resolvers.get(key);
        if (result == null) {
            resolvers.set(key, resolver);
        } else if (result instanceof ResolverImpl && result.strategy === 4 /* array */) {
            result.state.push(resolver);
        } else {
            resolvers.set(key, new ResolverImpl(key, 4 /* array */, [result, resolver]));
        }
        return resolver;
    }
    registerTransformer(key, transformer) {
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
            factory.registerTransformer(transformer);
            return true;
        }
        return false;
    }
    getResolver(key, autoRegister = true) {
        validateKey(key);
        if (key.resolve !== void 0) {
            return key;
        }
        /* eslint-disable-next-line */
        let current = this;
        let resolver;
        while (current != null) {
            resolver = current.resolvers.get(key);
            if (resolver == null) {
                if (current.parent == null) {
                    const handler = isRegisterInRequester(key) ? this : current;
                    return autoRegister ? this.jitRegister(key, handler) : null;
                }
                current = current.parent;
            } else {
                return resolver;
            }
        }
        return null;
    }
    has(key, searchAncestors = false) {
        return this.resolvers.has(key)
            ? true
            : searchAncestors && this.parent != null
            ? this.parent.has(key, true)
            : false;
    }
    get(key) {
        validateKey(key);
        if (key.$isResolver) {
            return key.resolve(this, this);
        }
        /* eslint-disable-next-line */
        let current = this;
        let resolver;
        while (current != null) {
            resolver = current.resolvers.get(key);
            if (resolver == null) {
                if (current.parent == null) {
                    const handler = isRegisterInRequester(key) ? this : current;
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
    getAll(key, searchAncestors = false) {
        validateKey(key);
        /* eslint-disable-next-line */
        const requestor = this;
        let current = requestor;
        let resolver;
        if (searchAncestors) {
            let resolutions = emptyArray;
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
    getFactory(Type) {
        let factory = factories.get(Type);
        if (factory === void 0) {
            if (isNativeFunction(Type)) {
                throw new Error(
                    `${Type.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`
                );
            }
            factories.set(
                Type,
                (factory = new FactoryImpl(Type, DI.getDependencies(Type)))
            );
        }
        return factory;
    }
    registerFactory(key, factory) {
        factories.set(key, factory);
    }
    createChild(config) {
        return new ContainerImpl(
            null,
            Object.assign({}, this.config, config, { parentLocator: () => this })
        );
    }
    jitRegister(keyAsValue, handler) {
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
                registrationResolver.resolve == null
            ) {
                const newResolver = handler.resolvers.get(keyAsValue);
                if (newResolver != void 0) {
                    return newResolver;
                }
                throw new Error(
                    "A valid resolver was not returned from the static register method"
                );
            }
            return registrationResolver;
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
const cache = new WeakMap();
function cacheCallbackResult(fun) {
    return function (handler, requestor, resolver) {
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
    instance(key, value) {
        return new ResolverImpl(key, 0 /* instance */, value);
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
    singleton(key, value) {
        return new ResolverImpl(key, 1 /* singleton */, value);
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
    transient(key, value) {
        return new ResolverImpl(key, 2 /* transient */, value);
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
    callback(key, callback) {
        return new ResolverImpl(key, 3 /* callback */, callback);
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
    cachedCallback(key, callback) {
        return new ResolverImpl(key, 3 /* callback */, cacheCallbackResult(callback));
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
    aliasTo(originalKey, aliasKey) {
        return new ResolverImpl(aliasKey, 5 /* alias */, originalKey);
    },
});
/** @internal */
export function validateKey(key) {
    if (key === null || key === void 0) {
        throw new Error(
            "key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?"
        );
    }
}
function buildAllResponse(resolver, handler, requestor) {
    if (resolver instanceof ResolverImpl && resolver.strategy === 4 /* array */) {
        const state = resolver.state;
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
/* eslint-disable-next-line */
function isObject(value) {
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
    const lookup = new WeakMap();
    let isNative = false;
    let sourceText = "";
    let i = 0;
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (fn) {
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
const isNumericLookup = {};
function isArrayIndex(value) {
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
