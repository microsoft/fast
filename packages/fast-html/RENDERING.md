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

    service!: IInitialStateService;

    connectedCallback() {
        super.connectedCallback();

        this.loadItemFromInitialState();
    }

    loadItemFromInitialState(): void {
        const initialState = this.initialStateService.init(["text"]);

        this.text = initialState.text;
    }
}

MyComponent.define({
    name: "my-component",
    templateOptions: "defer-and-hydrate",
});
```

When the element connects, `ElementController` automatically detects the existing shadow root from SSR and sets `isPrerendered = true`. The template-pending guard in `ElementController.connect()` ensures the element waits for its template before hydrating. The `defer-hydration` and `needs-hydration` attributes are no longer needed — connection gating is handled internally by the template-pending guard.

## Hydration Comments and Datasets

When hydrating the HTML, FAST uses `ElementController` which detects an existing shadow root (from SSR or declarative shadow DOM) and sets `isPrerendered = true`. It then uses `template.hydrate()` to create a `HydrationView` that maps existing DOM nodes to binding targets using hydration "markers" such as comments and dataset attributes. By default the `@microsoft/fast-html` package will assume that component hydration will occur so rendering hydratable markup is required.

### Bindings

#### Content Bindings

Content binding markers are represented using HTML comments. These comments are used to indicate where dynamic content exists in the template. Markers carry no embedded data — they are fixed strings matched by string equality (not regex).

* Start binding: `<!--f:b-->`
* End binding: `<!--f:/b-->`

Binding pairs are matched using balanced depth counting: each start marker increments a depth counter and each end marker decrements it. When the counter returns to zero the pair is complete.

##### Content Binding Marker Examples

**Note**
Examples shown below mostly skip the wrapping custom element and the internal template element with `shadowrootmode="open"`.

Typically along with the content from the examples below, the rendering should include:

```html
<my-component>
    <template shadowrootmode="open" shadowroot="open">
        <!-- hydratable content -->
    </template>
</my-component>
```

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
<h1><!--f:b-->Hello world<!--f:/b--></h1>
```

#### Attribute Bindings

Attribute bindings are tracked using a single dataset attribute: `data-fe="N"` where `N` is the number of attribute bindings on the element.

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

Should result in:

```html
<h1 data-fe="1" greeting="Hello"></h1>
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

Should result in:

```html
<h1 data-fe="3" greeting="Hello" subtitle="world" punctuation="!"></h1>
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
<div data-fe="3" show appearance="large" punctuation="!">
    <h1><!--f:b-->Hello<!--f:/b--></h1>
    <span><!--f:b-->world<!--f:/b--></span>
    <span><!--f:b-->!<!--f:/b--></span>
</div>
```

### Directives

Directives are treated differently from bindings as they include a template. This means that in addition to the binding used to determine the logic for the directive FAST also requires a separate marker for the directive itself to demarkate the beginning and end of the template.

#### Repeat

Example repeat binding:
```html
<f-repeat value="{{item in list}}">
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
<!--f:b-->
<!--f:r-->
<span>
    <!--f:b-->Bob<!--f:/b-->
</span>
<!--f:/r-->
<!--f:r-->
<span>
    <!--f:b-->Alice<!--f:/b-->
</span>
<!--f:/r-->
<!--f:r-->
<span>
    <!--f:b-->Sue<!--f:/b-->
</span>
<!--f:/r-->
<!--f:/b-->
```

Note that the repeat markers are data-free — they carry no index or ID. Pairing uses balanced depth counting. Additionally, a binding wraps the repeat markers; even if the array is empty, this binding must be rendered.

Example result of an empty array:
```html
<!--f:b-->
<!--f:/b-->
```

#### When

The when directive is either present in the DOM or not, and therefore does not need an extra marker for the template.

Example when binding:
```html
<f-when value="{{show}}">
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
<!--f:b-->
<span>
    <!--f:b-->Hello world<!--f:/b-->
</span>
<!--f:/b-->
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
<!--f:b-->
<!--f:/b-->
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
<button data-fe="1">Button</button>
```

#### Attribute Directives

Attribute directives such as `f-slotted` and `f-ref` can be represented with hydration comments.

Example `f-ref` binding:
```html
<button f-ref="{button}">Button</button>
```

Should result in:
```html
<button data-fe="1">Button</button>
```

#### More Examples

##### Nested Whens

Example when binding:
```html
<f-when value="{{show}}">
    <span>{{text}}</span>
    <f-when value="{{showInternal}}">
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
<!--f:b-->
<span>
    <!--f:b-->Hello world<!--f:/b-->
</span>
    <!--f:b-->
    <span>
        <!--f:b-->Hello pluto<!--f:/b-->
    </span>
    <!--f:/b-->
<!--f:/b-->
```

##### Nested Repeats

Example when binding:
```html
<f-repeat value="{{item in items}}">
    <div>
        <span>{{item.name}}</span>
        <f-when value="{{!!item.nested}}">
            <ul>
                <f-repeat value="{{person in item.nested}}">
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
<!--f:b-->
    <!--f:r-->
    <div>
        <span><!--f:b-->Bob<!--f:/b--></span>
        <!--f:b--><!--f:/b-->
    </div>
    <!--f:/r--><!--f:r-->
    <div>
        <span><!--f:b-->Alice<!--f:/b--></span>
        <!--f:b--><!--f:/b-->
    </div>
    <!--f:/r--><!--f:r-->
    <div>
        <span><!--f:b-->Sue<!--f:/b--></span>
        <!--f:b-->
            <ul>
                <!--f:b-->
                <!--f:r-->
                <li>
                    <!--f:b-->Amy<!--f:/b-->
                </li>
                <!--f:/r-->
                <!--f:r-->
                <li>
                    <!--f:b-->Clarice<!--f:/b-->
                </li>
                <!--f:/r-->
                <!--f:r-->
                <li>
                    <!--f:b-->Lawrence<!--f:/b-->
                </li>
                <!--f:/r-->
                <!--f:/b-->
            </ul>
        <!--f:/b-->
    </div>
    <!--f:/r-->
<!--f:/b-->
```

##### Nested components with `<slot>`

This example shows the wrapping custom element tag as well as the template component with `shadowrootmode="open"` for the sake of illustrating an example that would exist in the DOM.

Example template of component "nested-component":
```html
<f-when value="{{showButton}}">
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
<nested-components>
    <template shadowrootmode="open" shadowroot="open">
        <!--f:b-->
        <my-button data-fe="1" appearance="fancy">
            <template shadowrootmode="open" shadowroot="open">
                <button class="default" data-fe="1">
                    <slot></slot>
                </button>
            </template>
            <!--f:b-->Hello world<!--f:/b-->
        </my-button>
        <!--f:/b-->
    </template>
</nested-components>
```

## Rendering Lifecycle

For information about the interaction between `@microsoft/fast-element` and `@microsoft/fast-html` packages and their rendering lifecycle, see [RENDERING_LIFECYCLE.md](./RENDERING_LIFECYCLE.md).