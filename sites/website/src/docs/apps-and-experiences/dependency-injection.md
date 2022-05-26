---
id: dependency-injection
title: Dependency Injection
sidebar_label: Dependency Injection
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/apps-and-experiences/dependency-injection.md
description: FAST introduces the concept of a dependency injection container.
keywords:
    - dependency injection container
---

An important principle of object oriented programming (OOP) is to favor a compositional approach to systems over an inheritance-based approach. In such systems, complex problems are broken down into small, single-purpose objects that collaborate with one another. However, this approach is not a panacea, and introduces its own set of challenges:

- How do we instantiate a set of collaborating objects, particularly when there is a complex arrangement of dependencies between the objects?
- How do we avoid tight coupling between an object and the implementation details of its dependencies?
- How do we manage memory and control the lifetimes of objects in such a system?
- How does our user interface, often controlled by a different engine, gain access to our composed system capabilities?

To address these challenges, FAST introduces the concept of a *dependency injection container*. A DI Container is a sub-system with the responsibilities of understanding dependency relationships, constructing objects with their dependencies, delivering dependencies to components, and managing lifetimes.

## Creating a DI Container

DI Containers can exist in a hierarchy, allowing child containers to override the dependencies of the parent, but typically there is one root container in which all the system's services are registered. In a typical FAST application, you will want this container to be associated with the `document.body` so that all UI component children can gain access to its capabilities. Here's how you would create that root container:

```ts
import { DI } from "@microsoft/fast-foundation";

const container = DI.getOrCreateDOMContainer();
```

You'll want to create and configure your root container as early as possible in your application lifecycle, typically in your application's entry point module. If you are using FAST's Design System features or its components, we've integrated them with DI, so that you can configure everything with a unified API. Instead of calling `DI.getOrCreateDOMContainer()` you can simply import the Design System Provider function and use that. Here's some code that you may have seen in other parts of our documentation, that does just that:

```ts
provideFASTDesignSystem()
    .register(
        fastButton()
    );
```

The `register` method of the `DesignSystem` actually delegates directly to the DI container. As a result, you can register your Web Components and all your application dependencies in the same place, following the same patterns.

### Example Scenario

Once you have a container, you can use it to register and retrieve system dependencies. This is best demonstrated with a typical scenario. Imagine that we have a `NewAccountScreen` web component in our app. Users navigate to this screen to create a new account. This screen is dependent on an `AccountService`, which is able to create accounts and login new users. The `AccountService` itself is dependent on a `UserSession` and an `HTTPClient`. The `HTTPClient` is dependent on a `ServiceBaseURL` string. Let's set this up, working from the inside out.

## Creating DI Keys

The FAST DI can handle any kind of dependency, including primitive values like strings. Simply register a `ServiceBaseURL` with the container and any HTTP service that needs it can simply request it by key. This allows for a centralized configuration, making it easy to swap out in different environments. Here's how you define a strongly typed *key* that symbolizes an interface to a dependency.

```ts
import { DI } from "@microsoft/fast-foundation";

export const ServiceBaseURL = DI.createInterface<string>();
```

## Registering Dependencies

Once an interface key is defined, you'll want to register a concrete value with the root container. That can be done like so:

```ts
container.register(
    Registration.instance(ServiceBaseURL, "https://www.fast.design/")
);
```

Or through the design system like this:

```ts
provideFASTDesignSystem()
    .register(
        Registration.instance(ServiceBaseURL, "https://www.fast.design/")
    );
```

The container (and the Design System) has a `register` method that takes a variable number of `Registry` instances. The `Registration` object is a helper for creating registrations with various behaviors. Here is a summary of what's available on the `Registration` object:

- `instance` - Configures an existing object instance. Every request with the key will return this exact instance.
- `singleton` - Configures a class that is instantiated when the Key is first requested. All successive requests with the same key will return the cached instance.
- `transient` - Configures a class that is instantiated for each request with the Key. This means that each requestor gets a new instance.
- `callback` - Configures a function callback. Every time the Key is requested, the callback will be run, allowing custom code to dynamically return values.
- `cachedCallback` - Configures a function callback. The first time the Key is requested, the callback will be run to return a value. Successive calls return the cached value without invoking the callback again.
- `aliasTo` - Configures a Key to act as an alias to another Key.

:::note
Component functions like `fastButton()` actually return an instance of `Registry` that is responsible for obtaining contextual information from the DI container and using it to register the Web Component with FAST. You can follow this same pattern not only with your own components but with any configurable, shared dependency.
:::

## Constructor Injection

The above code defines a key for the `ServiceBaseURL` and configures a value for the container, but how do we get that value to the `HTTPClient`? Since `HTTPClient` is a plain class (as opposed to a web component), we'll leverage constructor injection. To do so, we declare that our constructor is dependent on `ServiceBaseURL` as follows:

```ts
export class HTTPClient {
    constructor(@ServiceBaseURL serviceBaseURL: string) {}
    public get<T>(url: string): Promise<T> { ... }
}
```

Notice that in TypeScript, we can use the key as a decorator for the constructor parameter. This tells the DI container that when it creates an instance of `HTTPClient` it should first resolve `ServiceBaseURL` since it will need to provide that as the first parameter when constructing `HTTPClient`.

## DI Key and Inject Patterns

Our `ServiceBaseURL` represented a simple string. So, how do we handle something more complex like `HTTPClient`? After all, we want that to be injected into the `AccountService`. A common pattern is to create an interface for `HTTPClient` and a key with the same name. TypeScript allows these to be named the same, which works to our advantage here.

```ts
export interface HTTPClient {
    get<T>(url: string): Promise<T>;
}

export const HTTPClient = DI.createInterface<HTTPClient>();

export class DefaultHTTPClient implements HTTPClient {
    constructor(@ServiceBaseURL serviceBaseURL: string) {}
    public get<T>(url: string): Promise<T> { ... }
}
```

We could follow the same pattern for the `UserSession` as well, but let's look at a different approach. Sometimes, you may find that having the extra interface/implementation with interface key abstraction is an over-complication for your use case. You don't have to create a custom key if you just want to inject a concrete class. The `AccountService` could declare its dependencies using the generic `inject` decorator like so:

```ts
export class AccountService {
    constructor(
        @HttpClient http: HttpClient, 
        @inject(UserSession) session: UserSession
    ) {}
}
```

Better yet, if you are using the `tsconfig.json` setting `"emitDecoratorMetadata": true` then you can even do this:

```ts
export class AccountService {
    constructor(
        @HttpClient http: HttpClient, 
        @inject() session: UserSession
    ) {}
}
```

## Other DI Registration Approaches

Above, we saw that `ServiceBaseURL` had to be explicitly registered with the container. Otherwise, how else would we know what string to resolve? However, explicit registration with the container is not always needed. 

### Auto-registration

In the case of `UserSession` above, the container will use `UserSession` directly as the key. However, since we have not explicitly registered `UserSession` in the container, it will attempt to use the key itself as the registration. As a result, it will instantiate `UserSession` and then register the instance. Another way of thinking of this is that auto-registered classes are treated as singletons by default.

### Default Registration

We've seen how we can explicitly register dependencies with the container and also how classes can be auto-registered. A third approach is to have the key itself define a default registration. If defined, this registration will be used if no other registration for the same key is configured with the container. We could set the `AccountService` up to work this way if we desired. Here's what that would look like:

```ts
export interface AccountService {
    ...
}

class DefaultAccountService implements AccountService {
    constructor(
        @HttpClient http: HttpClient, 
        @inject() session: UserSession
    ) {}
}

export const AccountService = DI.createInterface<AccountService>(
    x => x.singleton(DefaultAccountService)
);
```

## Injecting into Web Components

Ultimately, our `NewAccountScreen` web component needs our `AccountService`. Unfortunately, web components must have parameterless constructors. To complicate matters further, the constructor is usually called by the web browser's runtime itself while parsing HTML, so our DI container is completely blocked from the process.

To address this, the FAST DI supports property injection on web components. Here's how we would declare the dependency:

```ts
export class NewAccountScreen extends FASTElement {
    @AccountService accountService!: AccountService;
}
```

With the property defined as above, the `accountService` property will be available to access from the `connectedCallback` lifecycle hook forward.

Alternatively, like with constructor injection, you can also use the `inject` decorator directly with concrete types. Here's what that looks like:

```ts
export class NewAccountScreen extends FASTElement {
    @inject(MyService) accountService!: MyService;
}
```