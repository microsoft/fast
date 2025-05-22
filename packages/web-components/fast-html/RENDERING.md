# Non-browser HTML rendering

1. [Initial State](#initial-state)
2. [Hydrating Comments and Datasets](#hydration-comments-and-datasets)

This document details information on rendering hydratable content and includes some pointers on how Dependency Injection can be used to create services that hydrate a custom elements state.

## Initial State

To create initial state this should be added somewhere accessible by your service, in this example a `<script>` tag can be used to provide a global initial state.

Example:
```html
<script>
    window.__INITIAL_STATE__ = {
        text: "Hello world"
    }
</script>
```

Add a Dependency Injection service in your bundle to access properties in your state.

Simple example (`initial-state.ts`):
```typescript
import { DI } from "@microsoft/fast-element/di.js";

interface InitialState {
    text: string;
}

export interface IInitialStateService {
  init(): InitialState;
}

export class InitialStateService implements IInitialStateService {
    private initialState: any;

    constructor() {
        this.initialState = window.__INITIAL_STATE__;
    }

    public init(...keys: Array<string>): InitialState {
        const config: any = {};

        for (let key of keys) {
            config[key] = this.initialState[key];
        }

        return config;
    }
}

export const initialStateFactory = DI.createContext<IInitialStateService>(
  'i-initial-state-service',
  (x) => x.singleton(InitialStateService)
);
```

Include the DI service to your component.

Example:
```typescript
import { attr, FASTElement, Observable } from "@microsoft/fast-element";
import {
    initialStateFactory,
    InitialStateService,
    type IInitialStateService,
} from "./initial-state.js";
import { inject } from '@microsoft/fast-element/di.js';

export class MyComponent extends FASTElement {
    @inject(initialStateFactory) initialStateService!: InitialStateService;

    @attr
    text: string = "";

    @attr({
        attribute: "defer-hydration",
        mode: "boolean"
    })
    deferHydration?: boolean;

    service!: IInitialStateService;

    private shadowOptions = false;
    public initialState = false;

    connectedCallback() {
        super.connectedCallback();

        Observable.defineProperty(this.$fastController.definition, "shadowOptions");

        Observable.getNotifier(this.$fastController.definition).subscribe(
            {
                handleChange: (value) => {
                    if (value.shadowOptions) {
                        this.shadowOptions = true;
                        this.hasStateAndShadowOptions();
                    }
                },
            },
            "shadowOptions"
        );

        this.loadItemFromInitialState();
    }

    hasStateAndShadowOptions() {
        if (this.shadowOptions && this.initialState) {
            this.deferHydration = false;
        }
    }

    loadItemFromInitialState(): void {
        const initialState = this.initialStateService.init(["text"]);

        this.text = initialState.text;

        this.initialState = true;

        this.hasStateAndShadowOptions();
    }
}

MyComponent.define({
    name: "my-component",
    shadowOptions: null
});
```

Notice that there is a `defer-hydration` attribute that gets removed once initial state has been applied and `shadowOptions` has also been defined. This allows us to ensure that the template has been found and parsed to the component and the initial state has been applied before we connect the component to the rendered HTML.

Depending on your application structure it might be more maintainable to create an abstract class that extends `FASTElement` to re-use the service logic and the removal of `defer-hydration`.

## Setting shadow options

You may notice in the example above we have set the `shadowOptions` to `null`, when using `define` on a `FASTElement` you must set your `shadowOptions` to `null` if you intend to set them later - they can only be set once. This way `FASTElement` will delay the creation of a shadowRoot so your declarative shadow DOM will not immediately get overwritten causing a FOUC (Flash of Unstyled Content). Then, when initializing the `TemplateElement` from `@microsoft/fast-html`, be sure to pass `shadowOptions` as a part of the component options so they can be set correctly and the `defer-hydration` can be removed.

Example:
```typescript
import { FASTElement } from "@microsoft/fast-element";

class MyComponent extends FASTElement {}

MyComponent.define({
    name: "my-component",
    shadowOptions: null
});

TemplateElement.options({
    "my-component": {
        shadowOptions: {
            mode: "open"
        }
    }
}).define({
    name: "f-template",
});
```

## Hydration Comments and Datasets

When hydrating the HTML FAST uses the `HydratableElementController` which can be included in your bundle like so:

```typescript
import "@microsoft/fast-element/install-element-hydration.js";
```

The `HydratableElementController` will take over from the `ElementController` to use hydration "markers" such as comments and dataset attributes to rationalize bindings with existing HTML.

### Bindings

#### Syntax

A content binding syntax can be broken into parts:
- `fe-b` - declares this as a FASTElement Binding.
- `start|end` - indicates the start or end of the binding.
- `number` - the number in order in the template of bindings, these increment for every binding.
- `UUID` - a unique string identifying the binding. The examples shown here have been generated from a 10 character long string used in the [FAST SSR package](https://github.com/microsoft/fast/blob/main/packages/web-components/fast-ssr/src/template-parser/id-generator.ts).

Separator:
- `$$` - a separator string between the parts.

An attribute binding is tracked using a dataset attribute with the name `data-fe-b` followed by the binding number.

#### Examples

**Simple content example**

Content bindings such as:
```html
<h1>{{text}}</h1>
```

When combined with state such as:
```json
{
    "text": "Hello world"
}
```

Should result in:
```html
<h1><!--fe-b$$start$$0$$ZJEYduCZlM$$fe-b-->Hello world<!--fe-b$$end$$0$$ZJEYduCZlM$$fe-b--></h1>
```

**Simple attribute example**

Attribute binding such as:
```html
<h1 text="{{text}}"></h1>
```

Should result in:

```html
<h1 data-fe-b="0" text="Hello world"></h1>
```

If multiple attribute bindings exist on the same element, these will be separated by a space.

Example:
```html
<h1 text="{{text}}" subtitle="{{subtitle}}"></h1>
```

Expected result:
```html
<h1 data-fe-b="0 1" text="Hello" subtitle="world"></h1>
```

**Mixed attribute and content example**

Multiple attributes and content bindings such as:
```html
<div show="{{show}}" appearance="{{appearance}}">
    <h1>{{text}}</h1>
    <span>{{subtitle}}</span>
</div>
```

Should result in:
```html
<div data-fe-b="0 1" show appearance="large">
    <h1><!--fe-b$$start$$2$$ZJEYduCZlM$$fe-b-->Hello<!--fe-b$$end$$2$$ZJEYduCZlM$$fe-b--></h1>
    <span><!--fe-b$$start$$3$$t01oHhokPY$$fe-b-->world<!--fe-b$$end$$3$$t01oHhokPY$$fe-b--></span>
</div>
```

### Directives

Directives are treated differently from bindings as they include a template. This means that in addition to the binding used to determine the logic for the directive FAST also requires a separate marker for the directive itself to demarkate the beginning and end of the template.

#### Repeat

Example repeat binding:
```html
<f-repeat value="{item in list}">
    <span>{{item}}</span>
</f-repeat>
```

Combined with state:
```json
[
    "Bob",
    "Alice",
    "Sue"
]
```

Should result in:
```html
<!--fe-b$$start$$0$$t01oHhokPY$$fe-b-->
<!--fe-repeat$$start$$0$$fe-repeat-->
<span>
    <!--fe-b$$start$$0$$BJtvnvqlxr$$fe-b-->Bob<!--fe-b$$end$$0$$BJtvnvqlxr$$fe-b-->
</span>
<!--fe-repeat$$end$$0$$fe-repeat-->
<!--fe-repeat$$start$$1$$fe-repeat-->
<span>
    <!--fe-b$$start$$0$$BJtvnvqlxr$$fe-b-->Alice<!--fe-b$$end$$0$$BJtvnvqlxr$$fe-b-->
</span>
<!--fe-repeat$$end$$1$$fe-repeat-->
<!--fe-repeat$$start$$2$$fe-repeat-->
<span>
    <!--fe-b$$start$$0$$BJtvnvqlxr$$fe-b-->Sue<!--fe-b$$end$$0$$BJtvnvqlxr$$fe-b-->
</span>
<!--fe-repeat$$end$$2$$fe-repeat-->
<!--fe-b$$end$$0$$t01oHhokPY$$fe-b-->
```

You may notice that the same UUID was used within the repeat markers, this is because they are templates and each UUID only needs to be unique to that template. The same is true for the binding number.

#### When

The when directive is either present in the DOM or not, and therefore does not need an extra marker for the template.

Example when binding:
```html
<f-when value="{show}">
    <span>{{text}}</span>
</f-when>
```

Combined with state:
```json
{
    "show": true,
    "text": "Hello world"
}
```

Should result in:
```html
<!--fe-b$$start$$0$$t01oHhokPY$$fe-b-->
<span>
    <!--fe-b$$start$$0$$BJtvnvqlxr$$fe-b-->Hello world<!--fe-b$$end$$0$$BJtvnvqlxr$$fe-b-->
</span>
<!--fe-b$$end$$0$$t01oHhokPY$$fe-b-->
```

If the when is evaluated to `falsy` then we can safely leave the binding markers only.

Example state:
```json
{
    "show": false,
    "text": "Hello world"
}
```

Should result in:
```html
<!--fe-b$$start$$0$$t01oHhokPY$$fe-b-->
<!--fe-b$$end$$0$$t01oHhokPY$$fe-b-->
```