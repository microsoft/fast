---
id: dependency-injection
title: Dependency Injection
sidebar_label: Dependency Injection
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/apps-and-experiences/dependency-injection.md
description: FAST introduces the concept of a dependency injection container.
keywords:
    - dependency injection
    - container
    - createContainer
    - getOrSetDOMContainer
---

## Introduction

Dependency injection is a flexible & modular design pattern for passing functionality to the parts of an app that need it. If you need your project to be more maintainable and testable, this might be a good solution for you to use. The `@microsoft/fast-element` package has dependency injection utilities for regular use in JavaScript, and for injecting dependencies into web components.

### Basic Example

The first step to dependency injection is the creation of a container, this is where dependencies will be injected and resolved. There are two available ways to create a container, you can either use `createContainer()` or `getOrCreateDOMContainer()`. You can have as many containers as you like, however they will only resolve dependencies registered within their container.

```ts
import { DI } from "@microsoft/fast-element/di.js";

const container = DI.createContainer();
```

Now that your container is created, let's create a few dependencies to host from it.

First let's define an interface for the dependency which we'll call `MyServiceConfig`, and create a `ContextDecorator` of the same name which will take the interface as it's generic type:

```ts
import { DI } from "@microsoft/fast-element/di.js";

export interface MyServiceConfig {
    get: () => Promise<Response>;
}

export const MyServiceConfig = DI.createContext();
```

Next let's define our implementation of the service:

```ts
export class MyService implements MyServiceConfig {
    private serviceUrl: string = "http://localhost:7776";

    async get(): Promise<Response> {
        return await fetch(this.serviceUrl, { method: "GET" });
    }
}
```

Now that we have our service defined, let's add it as a dependency to our application `App` class. Note the use of the `ContextDecorator` injected into the constructor as `@MyServiceConfig`. This will attach it to the instance with the same name.

```ts
export class App implements AppConfig {
    constructor(
        @MyServiceConfig private readonly myService: MyServiceConfig
    ) {
        return;
    }

    public async getMyServiceStatus(): Promise<number> {
        return (await this.myService.get()).status;
    }
}
```

Finally, let's update our container by registering `MyService` with the dependency injection container. We will use the `MyServiceConfig` as the key, this will allow `App` to resolve the dependency. Note the use of `transient`, this is a utility for creating an instance each time the service is fetched. Other utilities are available, refer to the `di` API documentation for details.

```ts
import { DI, Registration } from "@microsoft/fast-element/di.js";

const { transient } = Registration;

const container = DI.createContainer();

container.register(transient(MyServiceConfig, MyService));

const responseStatus = await container.get(App).getMyServiceStatus();

console.log("Server Status:", responseStatus);
```

### Using Dependency Injection with Web Components

#### Register Dependencies Before Defining Web Components

When using dependency injection with web components, ensure you define your container **before** you define your web components. Otherwise your web components may be initialized before the dependencies can be resolved.

#### Use `getOrCreateDOMContainer()`

The `getOrCreateDOMContainer()` must be used for web components to resolve dependencies. Pass in a node to create the container for, in this example we will use `document.body`.

```ts
import { DI, Registration } from "@microsoft/fast-element/di.js";

const { transient } = Registration;

const container = DI.getOrCreateDOMContainer(document.body);

container.register(transient(MyServiceConfig, MyService));
```

#### Access Dependencies in the `connectedCallback`

Once the web component has reached the `connectedCallback` hook, you will be able to access any injected dependencies.

```ts
import { FASTElement, html, observable } from "@microsoft/fast-element";

export class MyComponent extends FASTElement {
    @MyServiceConfig myService!: MyServiceConfig;

    @observable
    status: number;

    connectedCallback() {
        super.connectedCallback();

        this.myService.get().then((value: Response) => {
            this.status = value.status;
        });
    }
}

MyComponent.define({
    name: "my-component",
    template: html`<div>${x => x.status}</div>`
});
```