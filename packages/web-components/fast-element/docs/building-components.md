# Building Components

The `fast-element` library is a lightweight means to easily building performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework.

## Defining an Element

To define a custom element, begin by creating a class that extends `FASTElement` and decorate it with the `@customElement` decorator, providing the element name.

**Example: A Basic `FASTElement` Definition**

```TypeScript
import { FASTElement, customElement } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {

}
```

With this in place, you can now use your `name-tag` element anywhere in HTML with the following markup:

**Example: Using a Web Component**

```HTML
<name-tag></name-tag>
```

> **IMPORTANT:** Web Component names must contain a `-`, in order to prevent future conflicts with built-in elements and to namespace components from different libraries. For more information on the basics of Web Components [see this set of articles](https://developers.google.com/web/fundamentals/web-components).

We've got a basic Web Component in place, but it doesn't do much. So, let's add an attribute and make it render something. 

**Example: Adding Attributes to a `FASTElement`**

```TypeScript
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
```

To add attributes to your HTML element, create properties decorated by the `@attr` decorator. All attributes defined this way will be automatically registered with the platform so that they can be updated through the browser's native `setAttribute` API as well as the property. You can optionally add a method with the naming convention *propertyName*Changed to your class (e.g. `greeting` and `greetingChanged()`), and this method will be called whenever your property changes, whether it changes through the property or the attribute API.

> **NOTE:** All properties decorated with `@attr` are also *observable*. See the templating section below for information about how observables enable efficient rendering.

By default, anything extending from `FASTElement` will automatically have a `ShadowRoot` attached in order to enable encapsulated rendering. The example above references the `shadowRoot` to set its `innerHTML` any time the `greeting` property changes.

To see it in action, you can use the same HTML as above, or change the default `greeting` with the following:

**Example: Using a Web Component with Attributes**

```HTML
<name-tag greeting="Hola"></name-tag>
```

### Customizing Attributes

By default, any attribute created with `@attr` will perform no explicit type coercion other than when it reflects its value to the HTML DOM via the `setAttribute` API. However, you can convert DOM attribute string values to and from arbitrary types as well as control the `mode` that is used to reflect property values to the DOM. There are three modes available through the `mode` property of the attribute configuration:

* `reflect` - The *default* mode that is used if none is specified. This reflects property changes to the DOM. If a `converter` is supplied, it will invoke the converter before calling the `setAttribute` DOM API.
* `boolean` - This mode causes your attribute to function using the HTML boolean attribute behavior. When your attribute is present in the DOM or equal to its own name, the value will be true. When the attribute is absent from the DOM, the value of the property will be false. Setting the property will also update the DOM by adding/removing the attribute.
* `fromView` - This mode skips reflecting the value of the property back to the HTML attribute, but does receive updates when changed through `setAttribute`.

In addition to setting the `mode`, you can also supply a custom `ValueConverter` by setting the `converter` property of the attribute configuration. The converter must implement the following interface:

```TypeScript
interface ValueConverter {
    toView(value: any): string;
    fromView(value: string): any;
}
```

Here's how it works:

* When the DOM attribute value changes, the converter's `fromView` method will be called, allowing custom code to coerce the value to the proper type expected by the property.
* When the property value changes, the converter's `fromView` method will also be called, ensuring that the type is correct. After this, the `mode` will be determined. If the mode is set to `reflect` then the converter's `toView` method will be called to allow the type to be formatted before writing to the attribute using `setAttribute`.

> **NOTE:** When the `mode` is set to `boolean`, a built-in `booleanConverter` is automatically used to ensure type correctness so that manual configuration of the converter is not needed in this common scenario.

**Example: An Attribute in Reflect Mode with No Special Conversion**

```TypeScript
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

**Example: An Attribute in Boolean Mode with Boolean Conversion**

```TypeScript
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('my-checkbox')
export class MyCheckbox extends FASTElement {
  @attr({ mode: 'boolean' }) disabled: boolean = false;
}
```

**Example: An Attribute in Reflect Mode with Custom Conversion**

```TypeScript
import { FASTElement, customElement, attr, ValueConverter } from '@microsoft/fast-element';

const numberConverter: ValueConverter = {
  toView(value: any): string {
    // convert numbers to strings
  },

  fromView(value: string): any {
    // convert strings to numbers
  }
};

@customElement('my-counter')
export class MyCounter extends FASTElement {
  @attr({ converter: numberConverter }) count: number = 0;
}
```

### The Element Lifecycle

All Web Components support a series of lifecycle events that you can tap into to execute custom code at specific points in time. `FASTElement` implements several of these callbacks automatically, in order to enable features of its templating engine (described below). However, you can override them to provide your own code. Here's an example of how you would execute custom code when your element is inserted into the DOM.

**Example: Tapping into the Custom Element Lifecycle**

```TypeScript
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('name-tag is now connected to the DOM');
  }
}
```

The full list of available lifecyle callbacks is:

| Callback | Description |
| ------------- |-------------|
| constructor | Runs when the element is created or upgraded. `FASTElement` will attach the shadow DOM at this time and hydrate it with the HTML template, if one was provided. |
| connectedCallback | Runs when the element is inserted into the DOM. `FASTElement` will connect template bindings in order to finalize the initial render at this time. |
| disconnectedCallback | Runs when the element is removed from the DOM. `FASTElement` will remove template bindings and clean up resources at this time. |
| attributeChangedCallback(attrName, oldVal, newVal) | Runs any time one of the element's custom attributes changes. `FASTElement` uses this to sync the attribute with its property. When the property updates, a render update is also queued, if there was a template dependency. |
| adoptedCallback | Runs if the element was moved from its current `document` into a new `document` via a call to the `adoptNode(...)` API. |

## Declaring a Template

While you can create and update nodes in the Shadow DOM manually, `FASTElement` provides a streamlined templating system for the most common rendering scenarios. To create an HTML template for an element, import and use the `html` tagged template helper and pass the template to the `@customElement` decorator.

Here's how we would add a template for our `name-tag` component that renders some basic structure as well as our `greeting`:

**Example: Adding a Template to a `FASTElement`**

```TypeScript
import { FASTElement, customElement, attr, html } from '@microsoft/fast-element';

const template = html<NameTag>`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">TODO: Name Here</div>

  <div class="footer"></div>
`;

@customElement({
  name: 'name-tag',
  template
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

There are several important details in the above example, so let's break them down one-by-one.

First, we create a template by using a [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). The tag, `html`, provides special processing for the HTML string that follows, returning an instance of `HTMLTemplate`. Your templates can be *typed* to the data model that they are rendering over. In TypeScript, we simply provide the type as part of the tag: `html<NameTag>`.

Within a template, we provide *expressions* that declare the *dynamic parts* of our template. These expressions are declared with [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). Because the template is typed, the input to your arrow function will be an instance of the data model you declared in your `html` tag. When the `html` tag processes your template, it identifies these dynamic expressions and builds up an optimized model, capable of high-performance rendering, and efficient, incremental batched updates.

Finally, we associate the template with our custom element by using a different from of the `@customElement` decorator, which allows us to pass more options. In this configuration, we pass an options object specifying the `name` and the `template`.

With this in place, we now have a `name-tag` element that will render its template into the Shadow DOM and automatically update the `h3` content whenever the name tag's `greeting` attribute changes. Give it a try!

### Understanding Template Expressions

We've seen how arrow functions can be used to declare dynamic parts of templates. Let's look at a few more examples to see the breadth of what is available to you.

#### Dynamic Content

To bind the content of an element, simply provide the expression within the start and end tags of the element. It can be the sole content of the element, or interwoven with other elements and text.

**Example: Basic Text Content**

```HTML
<h3>${x => x.greeting.toUpperCase()}</h3>
```

**Example: Interpolated Text Content**

```HTML
<h3>${x => x.greeting}, my name is ${x => x.name}.</h3>
```

**Example: Heterogeneous Content**

```HTML
<h3>
  ${x => x.greeting}, my name is
  <span class="name">${x => x.name}</span>.
</h3>
```

> **NOTE:** Dynamic content is set via the `textContent` HTML property for security reasons. You *cannot* set HTML content this way. See below for the explicit, opt-in mechanism for setting HTML.

#### Dynamic Attributes

You can also use an expression to set an attribute value on an HTML Element. Simply place the expression where the value of the HTML attribute could go. The template engine will then use your expression to set the value using `setAttribute(...)`, whenever it needs to be updated. Additionally, some attributes are known as [boolean attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#Boolean_Attributes) (e.g. required, readonly, disabled). These attributes behave differently from normal attributes, and need special value handling. The templating engine will handle this for you if you prepend the attribute name with a `?`.

**Example: A Basic Attribute Values**

```HTML
<a href=${x => x.aboutLink}>About</a>
```

**Example: Interpolated Attribute Values**

```HTML
<a href="products/${x => x.id}">
  ${x => x.name}
</a>
```

```HTML
<li class="list-item ${x => x.type}">
  ...
</li>
```

> **NOTE:** When binding to `class`, the underlying engine will not over-write classes added to the element via other mechanisms. It only adds and removes classes that result directly from the binding. This "safe by default" behavior does come at a slight performance cost. To opt out of this feature and squeeze out every ounce of performance by always overwriting all classes, use a property binding (see below) on the `className` property. e.g. `:className="list-item ${x => x.type}"`.

```HTML
<span style="text-decoration: ${x => x.done ? 'line-through' : ''}">
  ${x => x.description}
</span>
```

**Example: ARIA Attributes**

```HTML
<div role="progressbar"
     aria-valuenow="${x => x.value}"
     aria-valuemin="${x => x.min}"
     aria-valuemax="${x => x.max}">
</div>
```

**Example: Boolean Attributes**

```HTML
<button type="submit" ?disabled="${x => !x.enabled}">Submit</button>
```

#### Dynamic Properties

Properties can also be set directly on an HTML element. To do so, prepend the property name with `:` to indicate a property binding. The template engine will then use your expression to assign the element's property value.

**Example: Basic Property Values**

```HTML
<my-element :myCustomProperty=${x => x.mySpecialData}>
  ...
</my-element>
```

**Example: Inner HTML**

```HTML
<div :innerHTML=${x => x.someDangerousHTMLContent}></div>
```

Avoid scenarios that require you to directly set HTML, especially when the content is coming from an external source. If you must do this, you should always sanitize the HTML. The best way to accomplish HTML sanitization is to configure [a trusted types policy](https://w3c.github.io/webappsec-trusted-types/dist/spec/) with FASTElement's template engine. FASTElement ensures that all HTML strings pass through the configured policy. Also, by leveraging the platform's trusted types capabilities, you get native enforcement of the policy through CSP headers. Here's an example of how to configure a custom policy to sanitize HTML:

```TypeScript
import { DOM } from '@microsoft/fast-element';

const myPolicy = trustedTypes.createPolicy('my-policy', {
  createHTML(html) {
    // TODO: invoke a sanitization library on the html before returning it
    return html;
  }
});

DOM.setHTMLPolicy(myPolicy);
```

> **IMPORTANT:** For security reasons, the HTML Policy can only be set once. For this reason, it should be set by application developers and not by component authors, and it should be done immediately during the startup sequence of the application.

#### Events

Besides rendering content, attributes, and properties, you'll often want to add event listeners and execute code when events fire. To do that, prepend the event name with `@` and provide the expression to be called when that event fires. Within an event expression, you also have access to a special *context* argument from which you can access the `event` object.

**Example: Basic Events**

```HTML
<button @click="${x => x.remove()}">Remove</button>
```

**Example: Accessing Event Details**

```HTML
<input type="text"
       :value="${x => x.description}"
       @input="${(x, c) => x.handleDescriptionChange(c.event)}">
```

In both examples above, after your event handler is executed, `preventDefault()` will be called on the event object by default. You can return `true` from your handler to opt out of this behavior.

The second example demonstrates an important characteristic of the templating engine: it only supports *unidirectional data flow* (model => view). It does not support *two-way data binding* (model <=> view). As shown above, pushing data from the view back to the model should be handled with explicit events that call into your model's API.

## Observables and Rendering

The arrow function expressions and directives allow the `fast-element` templating engine to intelligently update only the parts of the DOM that actually change, with no need for a virtual DOM, VDOM diffing, or DOM reconciliation algorithms. This approach enables top-tier initial render time, industry-leading incremental DOM updates, and ultra-low memory allocation.

When an expression is used within a template, the underlying engine uses a technique to capture which properties are accessed in that expression. With the list of properties captured, it then subscribes to changes in their values. Any time a value changes, a task is scheduled on the DOM update queue. When the queue is processed, all updates run as a batch, updating precisely the aspects of the DOM that have changed.

To enable expression tracking and change notification, properties must be decorated with either `@attr` or `@observable`. Use `@attr` for primitive properties (string, bool, number) that are intended to be surfaced on your element as HTML attributes. Use `@observable` for all other properties.  In addition to observing properties, the templating system can also observe arrays. The `repeat` directive (described below) is able to efficiently respond to array change records, updating the DOM based on changes in the collection.

These decorators are a means of meta-programming the properties on your class, such that they include all the implementation needed to support tracking and observation. You can access any property within your template, but if it hasn't been decorated with one of these two decorators, its value will not update after the initial render.

> **IMPORTANT:** The `@attr` decorator can only be used in a `FASTElement` but the `@observable` decorator can be used in any class.

> **IMPORTANT:** Properties with only a getter, that function as a computed property over other observables, should not be decorated with `@attr` or `@observable`.

#### Features of @attr and @observable

* **Tracking** - Provides property access tracking for the templating engine.
* **Observation** - Provides an ability to subscribe to changes in the property. The templating engine uses this, but you can also directly subscribe as well. Here's how you would subscribe to changes in the `Person`'s `name` property:
  ```TypeScript
    const person = new Person('John');
    const notifier = Observable.getNotifier(person);
    const handler = {
      handleChange(source: any, propertyName: string) {
        // respond to the change here
      }
    };

    notifier.subscribe(handler, 'name')
    notifier.unsubscribe(handler, 'name');
  ```
* **Self Observation** - On the class where the attr/observable is defined, you can optionally implement a *propertyName*Changed method to easily respond to changes.

## Using Directives

In addition to declaring dynamic parts of templates with expressions, you also have access to several powerful *directives*, which aid in common scenarios.

### Structural Directives

Structural directives change the shape of the DOM itself by adding and removing nodes based on the state of your element.

#### The When Directive

The `when` directive enables you to conditionally render blocks of HTML. When you provide an expression to `when` it will render the child template into the DOM when the expression evaluates to `true` and remove the child template when it evaluates to `false` (or if it is never `true`, the rendering will be skipped entirely).

**Example: Conditional Rendering**

```TypeScript
import { FASTElement, customElement, observable, html, when } from '@microsoft/fast-element';

const template = html<MyApp>`
  <h1>My App</h1>

  ${when(x => !x.ready, html<MyApp>`
    Loading...
  `)}
`;

@customElement({
  name: 'my-app',
  template
})
export class MyApp extends FASTElement {
  @observable ready: boolean = false;

  connectedCallback() {
    super.connectedCallback();

    fetch('some/resource').then(response => {
      // do something with response...
      this.ready = true;
    });
  }
}
```

> **REMINDER:** The `@observable` decorator creates a property that the template system can watch for changes. It is similar to `@attr`, but the property is not surfaced as an HTML attribute on the element itself. While `@attr` can only be used in a `FASTElement`, `@observable` can be used in any class.

> **NOTE**: Additional features are planned for `when` which will enable `elseif` and `else` conditional rendering. Today, you need multiple, separate `when` blocks to achieve the same end result.

#### The Repeat Directive

To render a list of data, use the `repeat` directive, providing the list to render and a template to use in rendering each item.

**Example: List Rendering**

```TypeScript
import { FASTElement, customElement, observable, html } from '@microsoft/fast-element';
import { repeat } from '@microsoft/fast-element/directives/repeat';

const template = html<FriendList>`
  <h1>Friends</h1>

  <form @submit=${x => x.addFriend()}>
    <input type="text" :value=${x => x.name} @input=${(x, c) => x.handleNameInput(c.event)}>
    <button type="submit">Add Friend</button>
  </form>
  <ul>
    ${repeat(x => x.friends, html<string>`
      <li>${x => x}</li>
    `)}
  </ul>
`;

@customElement({
  name: 'friend-list',
  template
})
export class FriendList extends FASTElement {
  @observable friends: string[] = [];
  @observable name: string = '';

  addFriend() {
    if (!this.name) {
      return;
    }

    this.friends.push(this.name);
    this.name = '';
  }

  handleNameInput(event: Event) {
    this.name = (event.target! as HTMLInputElement).value;
  }
}
```

Similar to event handlers, within a `repeat` block you have access to a special context object. Here is a list of the properties that are available on the context:

* `event` - The event object when inside an event handler.
* `parent` - The parent scope when inside a `repeat` block.
* `index` - The index of the current item when inside a `repeat` block (opt in).
* `length` - The length of the array when inside a `repeat` block (opt in).
* `even` - True if the index of the current item is even when inside a `repeat` block (opt in).
* `odd` - True if the index of the current item is odd when inside a `repeat` block (opt in).
* `first` - True if the current item is first in the array inside a `repeat` block (opt in).
* `middle` - True if the current item is somewhere in the middle of the the array inside a `repeat` block (opt in).
* `last` - True if the current item is last in the array inside a `repeat` block (opt in).

Some context properties are opt-in because they are more costly to update. So, for performance reasons, they are not available by default. To opt into the positioning properties, pass options to the repeat directive, with the setting `positioning: true`. For example, here's how we would use the `index` in our friends template from above:

**Example: List Rendering with Item Index**

```html
<ul>
  ${repeat(x => x.friends, html<string>`
    <li>${(x, c) => c.index} ${x => x}</li>
  `, { positioning: true })}
</ul>
```

#### Composing Templates

The `HTMLTemplate` returned from the `html` tag helper is also a directive itself. As a result, you can create templates and compose them into other templates.

**Example: Composing Templates**

```TypeScript
import { FASTElement, customElement, observable, html } from '@microsoft/fast-element';
import { repeat } from '@microsoft/fast-element/directives/repeat';
import { when } from '@microsoft/fast-element/directives/when';

interface Named {
  name: string;
}

class Person {
  @observable name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const nameTemplate = html<Named>`
  <span class="name">${x => x.name}</span>
`;

const template = html<FriendList>`
  <h1>Friends</h1>

  <form @submit=${x => x.addFriend()}>
    <input type="text" :value=${x => x.name} @input=${(x, c) => x.handleNameInput(c.event)}>

    ${when(x => x.name, html`
      <div>Next Name: ${nameTemplate}</div>
    `)}
    
    <div class="button-bar">
      <button type="submit">Add Friend</button>
    </div>
  </form>
  <ul>
    ${repeat(x => x.friends, html`
      <li>${nameTemplate}</li>
    `)}
  </ul>
`;

@customElement({
  name: 'friend-list',
  template
})
export class FriendList extends FASTElement {
  @observable friends: Person[] = [];
  @observable name: string = '';

  addFriend() {
    if (!this.name) {
      return;
    }

    this.friends.push(new Person(this.name));
    this.name = '';
  }

  handleNameInput(event: Event) {
    this.name = (event.target! as HTMLInputElement).value;
  }
}
```

### Referential Directives

Referential directives allow you to easily get references to DOM nodes in various scenarios.

#### The Ref Directive

Sometimes you need a direct reference to a single DOM node from your template. This might be because you want to control playback of a `video` element, use the drawing context of a `canvas` element, or pass an element to a 3rd party library. Whatever the reason, you can get a reference to the DOM node by using the `ref` directive.

**Example: Referencing an Element**

```TypeScript
import { FASTElement, customElement, attr, html, ref } from '@microsoft/fast-element';

const template = html<MP4Player>`
  <video ${ref('video')}>
    <source src=${x => x.src} type="video/mp4">
  </video>
`;

@customElement({
  name: 'mp4-player',
  template
})
export class MP4Player extends FASTElement {
  @attr src: string;
  video: HTMLVideoElement;

  connectedCallback() {
    super.connectedCallback();
    this.video.play();
  }
}
```

Place the `ref` directive on the element you want to reference and provide it with a property name to assign the reference to. Once the `connectedCallback` lifecycle event runs, your property will be set to the reference, ready for use.

> **NOTE:** If you provide a type for your HTML template, TypeScript will type check the property name you provide to ensure that it actually exists on your element.

#### The Children Directive

Besides using `ref` to reference a single DOM node, you can use `children` to get references to all child nodes of a particular element.

**Example: Referencing Child Nodes**

```TypeScript
import { FASTElement, customElement, html, children, repeat } from '@microsoft/fast-element';

const template = html<FriendList>`
  <ul ${children('listItems')}>
    ${repeat(x => x.friends, html<string>`
      <li>${x => x}</li>
    `)}
  </ul>
`;

@customElement({
  name: 'friend-list',
  template
})
export class FriendList extends FASTElement {
  @observable listItems: Node[];
  @observable friends: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    console.log(this.listItems);
  }
}
```

In the example above, the `listItems` property will be populated with all child nodes of the `ul` element. If `listItems` is decorated with `@observable` then it will be updated dynamically as the child nodes change. Like any observable, you can optionally implement a *propertyName*Changed method to be notified when the nodes change. Additionally, you can provide an `options` object to the `children` directive to specify customized configuration for the underlying [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

> **IMPORTANT:** Like `ref`, the child nodes are not available until the `connectedCallback` lifecycle event.

#### The Slotted Directive

Sometimes you may want references to all nodes that are assigned to a particular slot. To accomplish this, use the `slotted` directive. (For more on slots, see the section below on "Working with Shadow DOM".)

```TypeScript
import { FASTElement, customElement, html, slotted } from '@microsoft/fast-element';

const template = html<MyElement>`
  <div>
    <slot ${slotted('slottedNodes')}></slot>
  </div>
`;

@customElement({
  name: 'my-element',
  template
})
export class MyElement extends FASTElement {
  @observable slottedNodes: Node[];

  connectedCallback() {
    super.connectedCallback();
    console.log(this.slottedNodes);
  }
}
```

Similar to the `children` directive, the `slotted` directive will populate the `slottedNodes` property with nodes assigned to the slot. If `slottedNodes` is decorated with `@observable` then it will be updated dynamically as the assigned nodes change. Like any observable, you can optionally implement a *propertyName*Changed method to be notified when the nodes change. Additionally, you can provide an `options` object to the `slotted` directive to specify customized configuration for the underlying [assignedNodes() API call](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedNodes).

### Host Directives

In all the examples above, our bindings and directives have only affected elements within the Shadow DOM of the component. However, sometimes you want to affect the host element itself, based on property state. For example, a progress component might want to write various `aria` attributes to the host, based on the progress state. In order to facilitate scenarios like this, you can use a `template` element as the root of your template, and it will represent the host element. Any attribute or directive you place on the `template` element will be applied to the host itself.

**Example: Host Directive Template**

```JavaScript
const template = html<MyProgress>`
  <template (Represents my-progress element)
      role="progressbar"
      $aria-valuenow={x => x.value}
      $aria-valuemin={x => x.min}
      $aria-valuemax={x => x.max}>
    (template targeted at Shadow DOM here)
  </template>
`;
```

**Example: DOM with Host Directive Output**

```HTML
<my-progress
    min="0"              (from user)
    max="100"            (from user)
    value="50"           (from user)
    role="progressbar"   (from host directive)
    aria-valuenow="50"   (from host directive)
    aria-valuemin="0"    (from host directive)
    aria-valuemax="100"  (from host directive)>
</my-progress>
```

> **TIP:** Using the `children` directive on the `template` element will provide you with references to all Light DOM child nodes of your custom element, regardless of if or where they are slotted.

## Working with Shadow DOM

So far we've looked at how to define elements, how to define attributes on those elements, and how to control element rendering through declarative templates. However, we haven't yet seen how our custom elements can be composed together with standard HTML or other custom elements.

To enable composition, `FASTElement` leverages the Shadow DOM standard. Previously, we've seen how `FASTElement` automatically attaches a `ShadowRoot`, and when your element declares a template, it renders that template into the Shadow DOM. To enable element composition, all we need to do is make use of the standard `<slot>` element within our template.

Let's return to our original `name-tag` element example and see how we can use a `slot` to compose the person's name.

**Example: Using Slots in a `FASTElement`**

```TypeScript
import { FASTElement, customElement, attr, html } from '@microsoft/fast-element';

const template = html<NameTag>`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">
    <slot></slot>
  </div>

  <div class="footer"></div>
`;

@customElement({
  name: 'name-tag',
  template
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

Inside the body `div`, we've placed a `slot` element. This is referred to as the "default slot" for the component because, by default, all content placed between the element's opening and closing tags will be *rendered* at this location.

To make this clear, let's look at how the `name-tag` element would be used with content and then see how the browser would composite the final rendered output.

**Example: Using `name-tag` with a Default Slot**

```HTML
<name-tag>John Doe<name-tag>
```

**Example: Rendered Output for `name-tag` with a  Default Slot**

```HTML
<name-tag>
  #shadow-root
    <div class="header">
      <h3>HELLO</h3>
      <h4>my name is</h4>
    </div>

    <div class="body">
      <slot>John Doe</slot>
    </div>

    <div class="footer"></div>
  #shadow-root

  John Doe
</name-tag>
```

The text "John Doe" exists in the "Light DOM", but it gets *projected* into the location of the `slot` within the "Shadow DOM".

> **NOTE:** If you find the terms "Light DOM" and "Shadow DOM" unintuitive, you're not alone. Another way to think of "Light DOM" is as the "Semantic DOM". It represents your semantic content model, without any concern for rendering. Another way to think of "Shadow DOM" is as the "Render DOM". It represents how your element is rendered, independent of content or semantics.

With slots at our disposal, we now unlock the full compositional model of HTML for use in our own elements. However, there's even more that slots can do.

### Named Slots

In the example above, we use a single `slot` element to render *all* content placed between the start and end tags of the `name-tag`. However, we're not limited to only having a default slot. We can also have *named slots* that declare other locations to which we can render content. To demonstrate this, let's add a named slot to our `name-tag`'s template where we can display the person's avatar.

**Example: `name-tag` with a Named Slot**

```TypeScript
import { FASTElement, customElement, attr, html } from '@microsoft/fast-element';

const template = html<NameTag>`
  <div class="header">
    <slot name="avatar"></slot>
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">
    <slot></slot>
  </div>

  <div class="footer"></div>
`;

@customElement({
  name: 'name-tag',
  template
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

**Example: Using `name-tag` with a Named Slot**

```HTML
<name-tag>
  John Doe
  <img slot="avatar" src="...">
</name-tag>
```

**Example: Rendered Output for `name-tag` with a Named Slot**

```HTML
<name-tag>
  #shadow-root
    <div class="header">
      <slot name="avatar">
        <img slot="avatar" src="...">
      </slot>
      <h3>HELLO</h3>
      <h4>my name is</h4>
    </div>

    <div class="body">
      <slot>John Doe</slot>
    </div>

    <div class="footer"></div>
  #shadow-root

  John Doe
  <img slot="avatar" src="...">
</name-tag>
```

If an element declares named slots, its content can then leverage the `slot` *attribute* to indicate where it wants to be slotted. Anything without a `slot` attribute will be projected to the default slot. Anything with a `slot` attribute will be projected into its requested slot.

Here are a couple of quick notes on slots:

* You can have any number of content nodes project into the same slot.
* You can only place `slot` attributes on direct content of the containing element.
  ```HTML
  <name-tag>
    <div> <!--Projected to default slot-->
      <img slot="avatar"> <!--Slot Ignored!-->
    </div>
    <img slot="avatar"> <!--Projected to "avatar" slot-->
  </name-tag>
  ```
* If you have direct content elements in the Light DOM for which there is no corresponding Shadow DOM slot, it will not be rendered.
* Ordering is maintained when projecting to slots. So, if you have two elements projecting into the same slot, they will render in the slot in the same order as they appeared in the Light DOM.
* A `slot` element can also have a `slot` attribute if the slot element is the direct child of another custom element used in your template. In this case, it means that whatever content would be projected into that slot gets re-projected into the slot of the containing element.
  ```HTML
  <div class="uber-name-tag-template">
    ...
    <name-tag>
      <slot name="uber-avatar" slot="avatar">
        <!--uber-name-tag's "uber-avatar" content gets projected into name-tag's "avatar" slot-->
      </slot>
      <slot>
        <!--uber-name-tag's default content gets projected into name-tag's default slot-->
      </slot>
    </name-tag>
    ...
  </div>
  ```
* You do not need to provide content for every declared slot. In the above example, just because the `name-tag` has an "avatar" slot does not mean we must provide content for that slot. If no content is provided for a slot, then nothing will be rendered at that location, unless the slot declared fallback content...

### Fallback Content

There are several scenarios for using slots in your elements. So far, we've been showing how to use slots for content projection. However, another major use case is to enable various parts of your element's rendering to be replaced by the software using your element. To enable this, you can provide *fallback content* for any slot. This content will render if the element consumer provides no content for that slot, but if they do, their own content will override the fallback content.

**Example: Fallback Slot Content**

```HTML
<div class="my-slider-template">
  <slot name="thumb">
    <span class="thumb"></span>
  </slot>
</div>
```

In the example above, the author of the `my-slider` custom element provides default HTML for the slider's "thumb", ensuring that the element will always render and function properly. However, this design leaves open the option to the component's consumer, to replace the thumb with their own HTML by simply providing HTML and assigning the proper slot name.

### Slot APIs

In addition to the declarative means of using slots described so far, the browser offers a number of slot-specific APIs you can use directly in JavaScript code. Below is a summary of what is available to you.

| API | Description |
| ------------- |-------------|
| `slotchange` | By adding an event listener for the `slotchange` event on a `slot` element, you can receive notifications any time the slotted nodes of a particular slot change. |
| `assignedNodes()` | The `slot` element provides an `assignedNodes()` method that can be called to get a list of all nodes that a particular slot currently renders. You can pass an option object with `{ flatten: true }` if you wish to also see fallback content nodes. |
| `assignedSlot` | The `assignedSlot` property is present on any element that has been projected to a slot so that you can determine where it is projected. |

> **TIP:** Remember that you can use the templating system's event support to respond to `slotchange` events with `<slot @slotchange=${...}></slot>`. You can also obtain a reference to any slot with the `ref` directive, making it easy to call APIs like `assignedNodes()` or manually add/remove event listeners.

### Events

Events originating from within the Shadow DOM appear as if they originated from the custom element itself. In order for an event to propagate from within the Shadow DOM, it must be dispatched with the `composed: true` option. The following is a list of built-in events that compose:

* `blur`, `focus`, `focusin`, `focusout`
* `click`, `dblclick`, `mousedown`, `mouseenter`, `mousemove`, etc.
* `wheel`
* `beforeinput`, `input`
* `keydown`, `keyup`
* `compositionstart`, `compositionupdate`, `compositionend`
* `dragstart`, `drag`, `dragend`, `drop`, etc.

Here are some events which do not compose and are only visible from within the Shadow DOM itself:

* `mouseenter`, `mouseleave`
* `load`, `unload`, `abort`, `error`
* `select`
* `slotchange`

To get the fully composed event path from an event object, invoke the `composedPath()` method on the event itself. This will return an array of targets representing the path through which the event bubbled. If your custom element uses `closed` Shadow DOM mode, targets within the Shadow DOM will not be present in the composed path, and it will appear as if the custom element itself was the first target.

#### Custom Events

In various scenarios, it may be appropriate for a custom element to publish its own element-specific events. To do this, you can use the `$emit` helper on `FASTElement`. It's a convenience method that creates an instance of `CustomEvent` and uses the `dispatchEvent` API on `FASTElement` with the `bubbles: true` and `composed: true` options. It also ensures that the event is only emitted if the custom element is fully connected to the DOM. Here's an example:

**Example: Custom Event Dispatch**

```TypeScript
customElement('my-input')
export class MyInput extends FASTElement {
  @attr value: string = '';

  valueChanged() {
    this.$emit('change', this.value);
  }
}
```

> **TIP:** When emitting custom events, ensure that your event name is always lower-case, so that your Web Components stay compatible with various front-end frameworks that attach events through DOM binding patterns (the DOM is case insensitive).

### Shadow DOM Configuration

In all the examples we've seen so far `FASTElement` automatically creates a Shadow Root for your element and attaches it in `open` mode. However, if desired, you can specify `closed` mode or make the element render into the Light DOM instead. These choices can be made by using the `shadowOptions` setting with your `@customElement` decorator.

**Example: Shadow DOM in Closed Mode**

```TypeScript
@customElement({
  name: 'name-tag',
  template,
  shadowOptions: { mode: 'closed' }
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

> **TIP:** Avoid using `closed` mode since it affects event propagation and makes custom elements less inspectable.

**Example: Render to Light DOM**

```TypeScript
@customElement({
  name: 'name-tag',
  template,
  shadowOptions: null
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

> **IMPORTANT:** If you choose to render to the Light DOM, you will not be able to compose content, use slots, or leverage encapsulated styles. Light DOM rendering is not recommended for re-usable components. It may have some limited use as the root component of a small app.

In addition to the Shadow DOM mode, `shadowOptions` exposes all the options that can be set through the standard `attachShadow` API. This means that you can also use it to specify new options such as `delegatesFocus: true`. You only need to specify options that are different from the defaults mentioned above.

## Defining CSS

The final piece of our component story is CSS. Similar to HTML, `FASTElement` provides a `css` tagged template helper to allow creating and re-using CSS. Let's add some CSS for our `name-tag` component.

**Example: Adding CSS to a `FASTElement`**

```TypeScript
import { html, css, customElement, attr, FASTElement } from "@microsoft/fast-element";

const template = html<NameTag>`
  <div class="header">
    <slot name="avatar"></slot>
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">
    <slot></slot>
  </div>

  <div class="footer"></div>
`;

const styles = css`
  :host {
    display: inline-block;
    contain: content;
    color: white;
    background: var(--background-color);
    border-radius: var(--border-radius);
    min-width: 325px;
    text-align: center;
    box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0,0,0,.5);
  }

  :host([hidden]) { 
    display: none;
  }

  .header {
    margin: 16px 0;
    position: relative;
  }

  h3 {
    font-weight: bold;
    font-family: 'Source Sans Pro';
    letter-spacing: 4px;
    font-size: 32px;
    margin: 0;
	  padding: 0;
  }

  h4 {
    font-family: sans-serif;
    font-size: 18px;
    margin: 0;
	  padding: 0;
  }

  .body {
    background: white;
    color: black;
    padding: 32px 8px;
    font-size: 42px;
    font-family: cursive;
  }

  .footer {
    height: 16px;
    background: var(--background-color);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }
`;

@customElement({
  name: 'name-tag',
  template,
  styles
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

Using the `css` helper, we're able to create `ElementStyles`. We configure this with the element through the `styles` option of the decorator. Internally, `FASTElement` will leverage [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `ShadowRoot#adoptedStyleSheets` to efficiently re-use CSS across components. This means that even if we have 1k instances of our `name-tag` component, they will all share a single instance of the associated styles, allowing for reduced memory allocation and improved performance. Because the styles are associated with the `ShadowRoot`, they will also be encapsulated. This ensures that your styles don't affect other elements and other element styles don't affect your element.

> **NOTE:** We've used [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) throughout our CSS as well as [CSS Calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) in order to enable our component to be styled in basic ways by consumers. Additionally, consider adding [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) to your template, to enable even more powerful customization.

### Composing Styles

One of the nice features of `ElementStyles` is that it can be composed with other styles. Imagine that we had a CSS normalize that we wanted to use in our `name-tag` component. We could compose that into our styles like this:

**Example: Composing CSS Registries**

```TypeScript
import { normalize } from './normalize';

const styles = css`
  ${normalize}
  :host {
    display: inline-block;
    contain: content;
    color: white;
    background: var(--background-color);
    border-radius: var(--border-radius);
    min-width: 325px;
    text-align: center;
    box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0,0,0,.5);
  }

  ...
`;
```

Rather than simply concatenating CSS strings, the `css` helper understands that `normalize` is `ElementStyles` and is able to re-use the same Constructable StyleSheet instance as any other component that uses `normalize`. 

### Shadow DOM Styling

You may have noticed the `:host` selector we used in our `name-tag` styles. This selector allows us to apply styles directly to our custom element. Here are a few things to consider always configuring for your host element:

* **display** - By default, the `display` property of a custom element is `inline`, so consider whether you want your element's default display behavior to be different.
* **contain** - If your element's painting is contained within its bounds, consider setting the CSS `contain` property to `content`. The right containment model can positively affect your element's performance. [See the MDN docs](https://developer.mozilla.org/en-US/docs/web/css/contain) for more information on the various values of `contain` and what they do. 
* **hidden** - In addition to a default `display` style, add support for `hidden` so that your default `display` does not override this state. This can be done with `:host([hidden]) { display: none }`.

### Slotted Content

In addition to providing host styles, you can also provide default styles for content that gets slotted. For example, if we wanted to style all `img` elements that were slotted into our `name-tag`, we could do it like this:

**Example: Slotted Styles**

```TypeScript
const styles = css`
  ...

  ::slotted(img) {
    border-radius: 50%;
    height: 64px;
    width: 64px;
    box-shadow: 0 0 calc(var(--depth) / 2px) rgba(0,0,0,.5);
    position: absolute;
    left: 16px;
    top: -4px;
  }

  ...
`;
```

> **NOTE:** Both slotted and host styles can be overriden by the element user. Think of these as the *default* styles that you are providing, so that your elements look and function correctly out-of-the-box.

## Wrapping Up

We've seen how to use `FASTElement` to declaratively build Web Components. In addition to the basics of element and attribute definition, `FASTElement` also provides a way to declare templates capable of high-performance rendering, and efficient, incremental batched updates. Finally, CSS can easily be associated with an element in a way that leverages core platform optimizations for performance and low memory allocation.