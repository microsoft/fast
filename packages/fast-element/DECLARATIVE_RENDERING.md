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
import { inject } from "@microsoft/fast-element/di.js";

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
    template: declarativeTemplate(),
});
```

When the element connects, `ElementController` automatically detects the
existing shadow root from SSR and sets `isPrerendered = true`.
`declarativeTemplate()` keeps the definition template concrete before
registration completes, so the element can hydrate the prerendered shadow root
immediately. The `defer-hydration` and `needs-hydration` attributes are no
longer needed.

## Hydration Comments and Datasets

When hydrating the HTML, FAST uses `ElementController` which detects an
existing shadow root (from SSR or declarative shadow DOM) and sets
`isPrerendered = true`. It then uses `template.hydrate()` to create a
`HydrationView` that maps existing DOM nodes to binding targets using hydration
"markers" such as comments and dataset attributes. By default the declarative
runtime in `@microsoft/fast-element` assumes component hydration will occur, so
rendering hydratable markup is required.

### Bindings

#### Content Bindings

Content binding markers are represented using HTML comments. These comments are used to indicate where dynamic content exists in the template. Markers carry no embedded data — they are fixed strings matched by string equality (not regex).

* Start binding: `<!--fe:b-->`
* End binding: `<!--fe:/b-->`

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
<h1><!--fe:b-->Hello world<!--fe:/b--></h1>
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
    <h1><!--fe:b-->Hello<!--fe:/b--></h1>
    <span><!--fe:b-->world<!--fe:/b--></span>
    <span><!--fe:b-->!<!--fe:/b--></span>
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
<!--fe:b-->
<!--fe:r-->
<span>
    <!--fe:b-->Bob<!--fe:/b-->
</span>
<!--fe:/r-->
<!--fe:r-->
<span>
    <!--fe:b-->Alice<!--fe:/b-->
</span>
<!--fe:/r-->
<!--fe:r-->
<span>
    <!--fe:b-->Sue<!--fe:/b-->
</span>
<!--fe:/r-->
<!--fe:/b-->
```

Note that the repeat markers are data-free — they carry no index or ID. Pairing uses balanced depth counting. Additionally, a binding wraps the repeat markers; even if the array is empty, this binding must be rendered.

Example result of an empty array:
```html
<!--fe:b-->
<!--fe:/b-->
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
<!--fe:b-->
<span>
    <!--fe:b-->Hello world<!--fe:/b-->
</span>
<!--fe:/b-->
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
<!--fe:b-->
<!--fe:/b-->
```

### Client Side Bindings

Client side bindings are bindings which the client needs, but they are not necessary as part of an initial render. These must still be accounted for when creating hydration comments however, as the template needs to know which elements to attach these bindings to. There are two types of client side bindings, events and attribute directives. These do not require state as they are bound to class methods or properties.

#### Event Bindings

Event bindings such as `@keydown` and `@click` can be represented with hydration comments.

Example event binding:
```html
<button @click="{handleClick($e)}">Button</button>
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
<!--fe:b-->
<span>
    <!--fe:b-->Hello world<!--fe:/b-->
</span>
    <!--fe:b-->
    <span>
        <!--fe:b-->Hello pluto<!--fe:/b-->
    </span>
    <!--fe:/b-->
<!--fe:/b-->
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
<!--fe:b-->
    <!--fe:r-->
    <div>
        <span><!--fe:b-->Bob<!--fe:/b--></span>
        <!--fe:b--><!--fe:/b-->
    </div>
    <!--fe:/r--><!--fe:r-->
    <div>
        <span><!--fe:b-->Alice<!--fe:/b--></span>
        <!--fe:b--><!--fe:/b-->
    </div>
    <!--fe:/r--><!--fe:r-->
    <div>
        <span><!--fe:b-->Sue<!--fe:/b--></span>
        <!--fe:b-->
            <ul>
                <!--fe:b-->
                <!--fe:r-->
                <li>
                    <!--fe:b-->Amy<!--fe:/b-->
                </li>
                <!--fe:/r-->
                <!--fe:r-->
                <li>
                    <!--fe:b-->Clarice<!--fe:/b-->
                </li>
                <!--fe:/r-->
                <!--fe:r-->
                <li>
                    <!--fe:b-->Lawrence<!--fe:/b-->
                </li>
                <!--fe:/r-->
                <!--fe:/b-->
            </ul>
        <!--fe:/b-->
    </div>
    <!--fe:/r-->
<!--fe:/b-->
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
        <!--fe:b-->
        <my-button data-fe="1" appearance="fancy">
            <template shadowrootmode="open" shadowroot="open">
                <button class="default" data-fe="1">
                    <slot></slot>
                </button>
            </template>
            <!--fe:b-->Hello world<!--fe:/b-->
        </my-button>
        <!--fe:/b-->
    </template>
</nested-components>
```

## Rendering Lifecycle

For information about the declarative rendering lifecycle inside
`@microsoft/fast-element`, see
[DECLARATIVE_RENDERING_LIFECYCLE.md](./DECLARATIVE_RENDERING_LIFECYCLE.md).
