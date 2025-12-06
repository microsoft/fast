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

    public initialState = false;

    connectedCallback() {
        super.connectedCallback();

        this.loadItemFromInitialState();
    }

    checkInitialState() {
        if (this.initialState) {
            this.deferHydration = false;
        }
    }

    loadItemFromInitialState(): void {
        const initialState = this.initialStateService.init(["text"]);

        this.text = initialState.text;

        this.initialState = true;

        this.checkInitialState();
    }
}

MyComponent.defineAsync({
    name: "my-component",
    templateOptions: "defer-and-hydrate",
});
```

Notice that there is a `defer-hydration` attribute that gets removed once initial state has been applied. This allows us to ensure that the initial state has been applied before we connect the component to the rendered HTML.

Depending on your application structure it might be more maintainable to create an abstract class that extends `FASTElement` to re-use the service logic and the removal of `defer-hydration`.

## Hydration Comments and Datasets

When hydrating the HTML, FAST uses the `HydratableElementController` which will take over from the `ElementController` to use hydration "markers" such as comments and dataset attributes to rationalize bindings with existing HTML. By default the `@microsoft/fast-html` package will assume that component hydration will occur so rendering hydratable markup is required.

### Bindings

#### Content Bindings

Content binding markers are represented using HTML comments. These comments are used to indicate where dynamic content exists in the template.

A content binding syntax can be broken into parts:
- `fe-b` - declares this as a FASTElement Binding.
- `start|end` - indicates the start or end of the binding.
- `number` - the number in order in the template of bindings, these increment for every binding.
- `UUID` - a unique string identifying the binding. The examples shown here have been generated from a 10 character long string used in the [FAST SSR package](https://github.com/microsoft/fast/blob/main/packages/fast-ssr/src/template-parser/id-generator.ts).
- `fe-b` - closes the binding comment.

Bindings use `$$` as a separator string between the parts.

* Start binding: `<!--fe-b$$start$$0$$ZJEYduCZlM$$fe-b-->`
* End binding: `<!--fe-b$$end$$0$$ZJEYduCZlM$$fe-b-->`

##### Content Binding Marker Examples

**Note**
Examples shown below mostly skip the wrapping custom element and the internal template element with `shadowrootmode="open"`.

Typically along with the content from the examples below, the rendering should include:

```html
<my-component defer-hydration needs-hydration>
    <template shadowrootmode="open" shadowroot="open">
        <!-- hydratable content -->
    </template>
</my-component>
```

The `needs-hydration` attribute is controlled by the hydration logic once `defer-hydration` has been removed, there is no need to modify it manually but it must be included to indicate that this component has not yet been hydrated.

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

#### Attribute Bindings

Attribute bindings are tracked using dataset attributes. Three formats are supported:

**Space-separated format**: A single attribute `data-fe-b` with space-separated binding numbers (e.g., `data-fe-b="0 1 2"`).

**Enumerated format**: Individual attributes for each binding (e.g., `data-fe-b-0`, `data-fe-b-1`, `data-fe-b-2`). This format is preferred when the rendering system streams output inline, as it allows generated output to be inserted immediately without needing to count or combine binding instances.

**Compact format**: Attributes shaped like `data-fe-c-{index}-{count}` (e.g., `data-fe-c-4-3`). This format encodes a start index and count for consecutive bindings, reducing attribute noise for elements with many attribute bindings.

All formats are functionally equivalent and fully supported by the hydration system.

##### Examples

###### Single attribute example

Attribute binding such as:
```html
<h1 greeting="{{greeting}}"></h1>
```

When combined with state such as:
```json
{
    "greeting": "Hello"
}
```

Should result in any of the following formats:

```html
<!-- Space-separated format -->
<h1 data-fe-b="0" greeting="Hello world!"></h1>

<!-- Enumerated format -->
<h1 data-fe-b-0 greeting="Hello world!"></h1>

<!-- Compact format (not recommended for single bindings, but supported) -->
<h1 data-fe-c-0-1 greeting="Hello world!"></h1>
```

###### Multiple attribute bindings

When multiple attribute bindings exist on the same element:
```html
<h1 greeting="{{greeting}}" subtitle="{{subtitle}}" punctuation="{{punctuation}}"></h1>
```

When combined with state such as:
```json
{
    "greeting": "Hello",
    "subtitle": "world",
    "punctuation": "!"
}
```

Should result in any of the following formats:

```html
<!-- Space-separated format -->
<h1 data-fe-b="0 1 2" greeting="Hello" subtitle="world" punctuation="!"></h1>

<!-- Enumerated format -->
<h1 data-fe-b-0 data-fe-b-1 data-fe-b-2 greeting="Hello" subtitle="world" punctuation="!"></h1>

<!-- Compact format -->
<h1 data-fe-c-0-3 greeting="Hello" subtitle="world" punctuation="!"></h1>
```

**Mixed attribute and content example**

Multiple attributes and content bindings such as:
```html
<div show="{{show}}" appearance="{{appearance}}" punctuation="{{punctuation}}">
    <h1>{{text}}</h1>
    <span>{{subtitle}}</span>
    <span>{{punctuation}}</span>
</div>
```

Should result in:
```html
<!-- Space-separated format -->
<div data-fe-b="0 1 2" show appearance="large" punctuation="!">
    <h1><!--fe-b$$start$$3$$UniqueID1$$fe-b-->Hello<!--fe-b$$end$$3$$UniqueID1$$fe-b--></h1>
    <span><!--fe-b$$start$$4$$UniqueID2$$fe-b-->world<!--fe-b$$end$$4$$UniqueID2$$fe-b--></span>
    <span><!--fe-b$$start$$5$$UniqueID3$$fe-b-->!<!--fe-b$$end$$5$$UniqueID3$$fe-b--></span>
</div>

<!-- Enumerated format -->
<div data-fe-b-0 data-fe-b-1 data-fe-b-2 show appearance="large" punctuation="!">
    <h1><!--fe-b$$start$$3$$UniqueID1$$fe-b-->Hello<!--fe-b$$end$$3$$UniqueID1$$fe-b--></h1>
    <span><!--fe-b$$start$$4$$UniqueID2$$fe-b-->world<!--fe-b$$end$$4$$UniqueID2$$fe-b--></span>
    <span><!--fe-b$$start$$5$$UniqueID3$$fe-b-->!<!--fe-b$$end$$5$$UniqueID3$$fe-b--></span>
</div>

<!-- Compact format -->
<div data-fe-c-0-3 show appearance="large" punctuation="!">
    <h1><!--fe-b$$start$$3$$UniqueID1$$fe-b-->Hello<!--fe-b$$end$$3$$UniqueID1$$fe-b--></h1>
    <span><!--fe-b$$start$$4$$UniqueID2$$fe-b-->world<!--fe-b$$end$$4$$UniqueID2$$fe-b--></span>
    <span><!--fe-b$$start$$5$$UniqueID3$$fe-b-->!<!--fe-b$$end$$5$$UniqueID3$$fe-b--></span>
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

You may notice that the same UUID was used within the repeat markers, this is because they are templates and each UUID only needs to be unique to that template. The same is true for the binding number. Additionally, a binding wraps the repeat markers, even if the array is empty, this binding must be rendered.

Example result of an empty array:
```html
<!--fe-b$$start$$0$$t01oHhokPY$$fe-b-->
<!--fe-b$$end$$0$$t01oHhokPY$$fe-b-->
```

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

### Client Side Bindings

Client side bindings are bindings which the client needs, but they are not necessary as part of an initial render. These must still be accounted for when creating hydration comments however, as the template needs to know which elements to attach these bindings to. There are two types of client side bindings, events and attribute directives. These do not require state as they are bound to class methods or properties.

#### Event Bindings

Event bindings such as `@keydown` and `@click` can be represented with hydration comments.

Example event binding:
```html
<button @click="{handleClick(e)}">Button</button>
```

Should result in:
```html
<button data-fe-b-0>Button</button>
```

#### Attribute Directives

Attribute directives such as `f-slotted` and `f-ref` can be represented with hydration comments.

Example `f-ref` binding:
```html
<button f-ref="{button}">Button</button>
```

Should result in:
```html
<button data-fe-b-0>Button</button>
```

#### More Examples

##### Nested Whens

Example when binding:
```html
<f-when value="{show}">
    <span>{{text}}</span>
    <f-when value="{showInternal}">
        <span>{{internalText}}</span>
    </f-when>
</f-when>
```

Combined with state:
```json
{
    "show": true,
    "text": "Hello world",
    "showInternal": true,
    "internalText": "Hello pluto"
}
```

Should result in:
```html
<!--fe-b$$start$$0$$jrvV0wUQrP$$fe-b-->
<span>
    <!--fe-b$$start$$0$$CdUO4vHUmG$$fe-b-->Hello world<!--fe-b$$end$$0$$CdUO4vHUmG$$fe-b-->
</span>
    <!--fe-b$$start$$1$$CdUO4vHUmG$$fe-b-->
    <span>
        <!--fe-b$$start$$0$$dF9tRRuOjZ$$fe-b-->Hello pluto<!--fe-b$$end$$0$$dF9tRRuOjZ$$fe-b-->
    </span>
    <!--fe-b$$end$$1$$CdUO4vHUmG$$fe-b-->
<!--fe-b$$end$$0$$jrvV0wUQrP$$fe-b-->
```

##### Nested Repeats

Example when binding:
```html
<f-repeat value="{item in items}">
    <div>
        <span>{{item.name}}</span>
        <f-when value="{!!item.nested}">
            <ul>
                <f-repeat value="{person in item.nested}">
                    <li>{{person.name}}</li>
                </f-repeat>
            </ul>
        </f-when>
    </div>
</f-repeat>
```

Combined with state:
```json
{
    "items": [
        {
            "name": "Bob"
        },
        {
            "name": "Alice"
        },
        {
            "name": "Sue",
            "nested": [
                {
                    "name": "Amy"
                },
                {
                    "name": "Clarice"
                },
                {
                    "name": "Lawrence"
                }
            ]
        }
    ]
}
```

Should result in:
```html
<!--fe-b$$start$$0$$kk4YD4Dgs4$$fe-b-->
    <!--fe-repeat$$start$$0$$fe-repeat-->
    <div>
        <span><!--fe-b$$start$$0$$gNrHXYDXTx$$fe-b-->Bob<!--fe-b$$end$$0$$gNrHXYDXTx$$fe-b--></span>
        <!--fe-b$$start$$1$$gNrHXYDXTx$$fe-b--><!--fe-b$$end$$1$$gNrHXYDXTx$$fe-b-->
    </div>
    <!--fe-repeat$$end$$0$$fe-repeat--><!--fe-repeat$$start$$1$$fe-repeat-->
    <div>
        <span><!--fe-b$$start$$0$$gNrHXYDXTx$$fe-b-->Alice<!--fe-b$$end$$0$$gNrHXYDXTx$$fe-b--></span>
        <!--fe-b$$start$$1$$gNrHXYDXTx$$fe-b--><!--fe-b$$end$$1$$gNrHXYDXTx$$fe-b-->
    </div>
    <!--fe-repeat$$end$$1$$fe-repeat--><!--fe-repeat$$start$$2$$fe-repeat-->
    <div>
        <span><!--fe-b$$start$$0$$gNrHXYDXTx$$fe-b-->Sue<!--fe-b$$end$$0$$gNrHXYDXTx$$fe-b--></span>
        <!--fe-b$$start$$1$$gNrHXYDXTx$$fe-b-->
            <ul>
                <!--fe-b$$start$$0$$ZfcR5fBAPc$$fe-b-->
                <!--fe-repeat$$start$$0$$fe-repeat-->
                <li>
                    <!--fe-b$$start$$0$$gLPEVysLM5$$fe-b-->Amy<!--fe-b$$end$$0$$gLPEVysLM5$$fe-b-->
                </li>
                <!--fe-repeat$$end$$0$$fe-repeat-->
                <!--fe-repeat$$start$$1$$fe-repeat-->
                <li>
                    <!--fe-b$$start$$0$$gLPEVysLM5$$fe-b-->Clarice<!--fe-b$$end$$0$$gLPEVysLM5$$fe-b-->
                </li>
                <!--fe-repeat$$end$$1$$fe-repeat-->
                <!--fe-repeat$$start$$2$$fe-repeat-->
                <li>
                    <!--fe-b$$start$$0$$gLPEVysLM5$$fe-b-->Lawrence<!--fe-b$$end$$0$$gLPEVysLM5$$fe-b-->
                </li>
                <!--fe-repeat$$end$$2$$fe-repeat-->
                <!--fe-b$$end$$0$$ZfcR5fBAPc$$fe-b-->
            </ul>
        <!--fe-b$$end$$1$$gNrHXYDXTx$$fe-b-->
    </div>
    <!--fe-repeat$$end$$2$$fe-repeat-->
<!--fe-b$$end$$0$$kk4YD4Dgs4$$fe-b-->
```

##### Nested components with `<slot>`

This example shows the wrapping custom element tag as well as the template component with `shadowrootmode="open"` for the sake of illustrating an example that would exist in the DOM.

Example template of component "nested-component":
```html
<f-when value="{showButton}">
    <my-button appearance="{{appearance}}">{{text}}</my-button>
</f-when>
```

Example template of component "my-button":
```html
<button class="{{appearance}}">
    <slot></slot>
</button>
```

Combined with state:
```json
{
    "showButton": true,
    "text": "Hello world",
    "appearance": "fancy"
}
```

Should result in:
```html
<nested-components defer-hydration needs-hydration>
    <template shadowrootmode="open" shadowroot="open">
        <!--fe-b$$start$$0$$3oGiwLq7Ct$$fe-b-->
        <my-button data-fe-b-0 appearance="fancy" defer-hydration needs-hydration>
            <template shadowrootmode="open" shadowroot="open">
                <button class="default" data-fe-b-0>
                    <slot></slot>
                </button>
            </template>
            <!--fe-b$$start$$1$$SUBjh6rowl$$fe-b-->Hello world<!--fe-b$$end$$1$$SUBjh6rowl$$fe-b-->
        </my-button>
        <!--fe-b$$end$$0$$3oGiwLq7Ct$$fe-b-->
    </template>
</nested-components>
```

## Rendering Lifecycle

For information about the interaction between `@microsoft/fast-element` and `@microsoft/fast-html` packages and their rendering lifecycle, see [RENDERING_LIFECYCLE.md](./RENDERING_LIFECYCLE.md).