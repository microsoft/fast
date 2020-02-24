# Building Components

The `fast-element` library is a lightweight solution for easily building performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework.

## Defining an Element

To define a custom element, begin by creating a class that extends `FastElement` and decorate it with the `@customElement` decorator, providing the element name.

```TypeScript
import { FastElement, customElement } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FastElement {

}
```

With this in place, you can now use your `name-tag` element anywhere in HTML with the following markup:

```HTML
<name-tag></name-tag>
```

> **IMPORTANT:** Web Component names must contain a `-`, in order to prevent future conflicts with built-in elements and to namespace components from different libraries. For more information on the basics of web components [see this set of articles](https://developers.google.com/web/fundamentals/web-components).

We've got a basic web component in place, but it doesn't do much. So, let's add an attribute and make it render something. 

```TypeScript
import { FastElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FastElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
```

To add attributes to your HTML element, create properties decorated by the `@attr` decorator. All attributes defined this way will be automatically registered with the platform so that they can be updated through the browser's native `setAttribute` API as well as the property. You can optionally add a method with the naming convention *propertyName*Changed to your class (e.g. `greeting` and `greetingChanged()`), and this method will be called whenever your property changes, whether it changes through the property or the attribute API.

> **NOTE:** All properties decorated with `@attr` are also *observable*. See the templating section below for information about how observables enable efficient rendering.

By default, anything extending from `FastElement` will automatically have a *shadow root* attached in order to enable encapsulated rendering. The example above references the `shadowRoot` to set its `innerHTML` any time the `greeting` property changes.

To see it in action, you can use the same HTML as above, or change the default `greeting` with the following:

```HTML
<name-tag greeting="Hola"></name-tag>
```

### The Element Lifecycle

All Web Components support a series of lifecycle events that you can tap into to execute custom code at specific points in time. `FastElement` implements several of these callbacks automatically, in order to enable features of its templating engine (described below). However, you can override them to provide your own code. Here's an example of how you would execute custom code when your element is inserted into the DOM.

```TypeScript
import { FastElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FastElement {
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
| constructor | Runs when the element is created or upgraded. `FastElement` will attach the shadow DOM at this time and hydrate it with the HTML template, if one was provided. |
| connectedCallback | Runs when the element is inserted into the DOM. `FastElement` will connect template bindings in order to finalize the initial render at this time. |
| disconnectedCallback | Runs when the element is removed from the DOM. `FastElement` will remove template bindings and clean up resources at this time. |
| attributeChangedCallback(attrName, oldVal, newVal) | Runs any time one of the element's custom attributes changes. `FastElement` uses this to sync the attribute with its property. When the property updates, a render update is also queued, if there was a template dependency. |
| adoptedCallback | Runs if the element was moved from its current `document` into a new `document` via a call to the `adoptNode(...)` API. |

## Declaring a Template

While you can create and update nodes in the Shadow DOM manually, `FastElement` provides a streamlined templating system for the most common rendering scenarios. To create an HTML template for an element, import and use the `html` tagged template helper and pass the template to the `@customElement` decorator.

Here's how we would add a template for our `name-tag` component that renders some basic structure as well as our `greeting`:

```TypeScript
import { FastElement, customElement, attr, html } from '@microsoft/fast-element';

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
export class NameTag extends FastElement {
  @attr greeting: string = 'Hello';
}
```

There are several important details in the above example, so let's break them down one-by-one.

First we create a template by using a [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). The tag, `html`, provides special processing for the HTML string that follows, returning an instance of `HTMLTemplate`. Your templates can be *typed* to the data model that they are rendering over. In TypeScript, we simply provide the type as part of the tag: `html<NameTag>`.

Within a template, we provide *expressions* that declare the *dynamic parts* of our template. These expressions are declared with [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). Because the template is typed, the input to your arrow function will be an instance of the data model you delcared in your `html` tag. When the `html` tag processes your template, it identifies these dynamic expressions and builds up an optimized model, capable of high-performance rendering, and efficient, incremental batched updates.

Finally, we associate the template with our custom element by using a different from of the `@customElement` decorator, which allows us to pass more options. In this configuration, we pass an options object specifying the `name` and the `template`.

With this in place, we now have a `name-tag` element that will render its template into the Shadow DOM and automatically update the `h3` content whenever the name tag's `greeting` attribute changes. Give it a try!

### Understanding Template Expressions

We've seen how arrow functions can be used to declare dynamic parts of templates. Let's look at a few more examples to see the breadth of what is available to you.

#### Dynamic Content

To bind the content of an element, simply provide the expression within the start and end tags of the element. It can be the sole content of the element, or interwoven with other elements and text.

**Example 1: Basic Text Content**

```HTML
<h3>${x => x.greeting.toUpperCase()}</h3>
```

**Example 2: Interpolated Text Content**

```HTML
<h3>${x => x.greeting}, my name is ${x => x.name}.</h3>
```

**Example 3: Heterogeneous Content**

```HTML
<h3>
  ${x => x.greeting}, my name is
  <span class="name">${x => x.name}</span>.
</h3>
```

> **NOTE:** Dynamic content is set via the `textContent` HTML property. You *cannot* set HTML content this way. See below for the explicit, opt-in mechanism for setting HTML.

#### Dynamic Properties

You can also use an expression to set a property on an HTML element. Simply place the expression where the value of the HTML attribute would normal go. The template engine will map your attribute to the element's property and set it with the value of your expression.

**Example 1: Basic Property Values**

```HTML
<a href=${x => x.aboutLink}>About</a>
```

**Example 2: Interpolated Property Values**

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

```HTML
<span style="text-decoration: ${x => x.done ? 'line-through' : ''}">
  ${x => x.description}
</span>
```

**Example 3: Inner HTML**

```HTML
<div innerhtml=${x => sanitize(x.someDangerousHTMLContent)}></div>
```

> **WARNING:** Avoid scenarios that require you to directly set HTML, especially when the content is coming from an external source. If you must do this, always sanitize the HTML content using a robust HTML sanitizer library, represented by the use of the `sanitize` function above.

#### Dynamic Attributes

Most HTML attributes have a corresponding property on the HTML element itself, so the method of property binding described above will be the most common mechanism used. However, there are some scenarios, such as with [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), where there is no corresponding element property. For these scenarios, prepend a `$` to the attribute name, and the value will be set with the `setAttribute` API instead of through a property. Additionally, some attributes are known as [boolean attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#Boolean_Attributes)  (e.g. required, readonly, disabled). These attributes behave differently form normal attributes, and need special value handling. The templating engine will handle this for you if you prepend the attribute name with a `?`.

**Example 1: ARIA Attributes**

```HTML
<div role="progressbar"
     $aria-valuenow="${x => x.value}"
     $aria-valuemin="${x => x.min}"
     $aria-valuemax="${x => x.max}">
</div>
```

**Example 2: Boolean Attributes**

```HTML
<button type="submit" ?disabled="${x => !x.enabled}">Submit</button>
```

#### Events

Besides rendering content, properties, and attributes, you'll often want to add event listeners and execute code when events fire. To do that, prepend the event name with `@` and provide the expression to be called when that event fires. Within an event expression, you also have access to a special *context* argument from which you can access the event args.

**Example 1: Basic Events**

```HTML
<button @click="${x => x.remove()}">Remove</button>
```

**Example 2: Accessing Event Details**

```HTML
<input type="text"
       value="${x => x.description}"
       @input="${(x, c) => x.onDescriptionChange(c.event)}">
```

> **IMPORTANT:** The templating engine only supports *unidirectional data flow* (model => view). It does not support *two-way data binding* (model <=> view). As shown above, pushing data from the view back to the model should be handled with explicit events that call into your model's API.

### Using Directives

In addition to declaring dynamic parts of templates with expressions, you also have access to several powerful *directives*, which aid in common scenarios.

#### The Ref Directive

Sometimes you need a direct reference to a DOM node from your template. This might be because you want to control playback of a `video` element, use the drawing context of a `canvas` element, or pass an element to a 3rd party library. Whatever the reason, you can get a reference to the DOM node by using the `ref` directive.

**Example 1: Referencing an Element**

```TypeScript
import { FastElement, customElement, attr, html } from '@microsoft/fast-element';
import { ref } from '@microsoft/fast-element/directives/ref';

const template = html<MP4Player>`
  <video ${ref('video')}>
    <source src=${x => x.src} type="video/mp4">
  </video>
`;

@customElement({
  name: 'mp4-player',
  template
})
export class MP4Player extends FastElement {
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

#### The When Directive

The `when` directive enables you to conditionally render blocks of HTML. When you provide an expression to `when` it will render the child template into the DOM when the expression evaluates to `true` and remove the child template when it evaluates to `false` (or if it is never `true`, the rendering will be skipped entirely).

**Example 1: Conditional Rendering**

```TypeScript
import { FastElement, customElement, observable, html } from '@microsoft/fast-element';
import { when } from '@microsoft/fast-element/directives/when';

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
export class MyApp extends FastElement {
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

> **IMPORTANT:** You may have noticed the use of the `@observable` decorator on the `ready` property above. The `@observable` decorator creates a property that the template system can watch for changes. It is simlar to `@attr`, but the property is not surfaced as an HTML attribute on the element itself. While `@attr` can only be used in a `FastElement`, `@observable` can be used in any class. You can learn more about observation and incremental template updates below in the section "Observables and Rendering".

> **NOTE**: Additional features are planned for `when` which would enable `elseif` and `else` conditional rendering. Today, you need multiple, separate `when` blocks to achieve the same end result.

#### The Repeat Directive

To render a list of data, use the `repeat` directive, providing the list to render and a template to use in rendering each item.

**Example 1: List Rendering**

```TypeScript
import { FastElement, customElement, observable, html } from '@microsoft/fast-element';
import { repeat } from '@microsoft/fast-element/directives/repeat';

const template = html<FriendList>`
  <h1>Friends</h1>

  <form @submit=${x => x.addFriend()}>
    <input type="text" value=${x => x.name} @input=${(x, c) => x.onNameChanged(c.event)}>
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
export class FriendList extends FastElement {
  @observable friends: string[] = [];
  @observable name: string = '';

  addFriend() {
    if (!this.name) {
      return;
    }

    this.friends.push(this.name);
    this.name = '';
  }

  onNameChanged(event: Event) {
    this.name = (event.target! as HTMLInputElement).value;
  }
}
```

#### Composing Templates

The `HTMLTemplate` returned from the `html` tag helper is also a directive itself. As a result, you can create templates and compose them into other templates.

**Example 1: Composing Templates**

```TypeScript
import { FastElement, customElement, observable, html } from '@microsoft/fast-element';
import { repeat } from '@microsoft/fast-element/directives/repeat';
import { when } from '@microsoft/fast-element/directives/when';

class Person {
  @observable name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const nameTemplate = html<{ name: string }>`
  <span class="name">${x => x.name}</span>
`;

const template = html<FriendList>`
  <h1>Friends</h1>

  <form @submit=${x => x.addFriend()}>
    <input type="text" value=${x => x.name} @input=${(x, c) => x.onNameChanged(c.event)}>

    ${when(x => x.name, html`
      <div>Name: ${nameTemplate}</div>
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
export class FriendList extends FastElement {
  @observable friends: Person[] = [];
  @observable name: string = '';

  addFriend() {
    if (!this.name) {
      return;
    }

    this.friends.push(new Person(this.name));
    this.name = '';
  }

  onNameChanged(event: Event) {
    this.name = (event.target! as HTMLInputElement).value;
  }
}
```

### Observables and Rendering

The arrow function expressions and directives allow the `fast-element` templating engine to intelligently update only the parts of the DOM that actually change, with no need for a virtual DOM, VDOM diffing, or DOM reconcilliation algorithms. This approach enables top-tier initial render time, industry-leading incremental DOM updates, and ulta-low memory allocation.

When an expression is used within a template, the underlying engine uses a technique to capture which properties are accessed in that expression. With the list of properties captured, it then subscribes to changes in their values. Any time a value changes, a task is scheduled on the DOM update queue. When the queue is processed, all updates run as a batch, updating precisely the aspects of the DOM that have changed.

To enable expression tracking and change notification, properties must be decorated with either `@attr` or `@observable`. These decorators are a means of meta-programming the properties on your class, such that they include all the implementation needed to support tracking and observation. You can access any property within your template, but if it hasn't been decorated with one of these two decorators, its value will not update after the initial render.

In addition to observing properties, the templating system can also observe arrays. The `repeat` directive is able to efficient respond to array change records, updating the DOM based on changes in the collection.

#### Features of @attr and @observable

* **Tracking** - Provides property access tracking for the templating engine.
* **Observation** - Provides an ability to subscribe to changes in the property. The templating engine uses this, but you can also directly subsribe as well. Here's how you would subscribe to changes in the `Person`'s `name` property:
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

## Working with Shadow DOM

So far we've looked at how to define elements, how to define attributes on those elements, and how to control element rendering through declarative templates. However, we haven't yet seen how our custom elements can be composed together with standard HTML or other custom elements.

To enable composition, `FastElement` leverages the Shadow DOM standard. Previously, we've seen how `FastElement` automatically attaches a `ShadowRoot`, and when your element declares a template, it renders that template into the Shadow DOM. To enable element composition, all we need to do is make use of the standard `<slot>` element within our template.

Let's return to our original `name-tag` element example and see how we can use a `slot` to compose the person's name.

```TypeScript
import { FastElement, customElement, attr, html } from '@microsoft/fast-element';

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
export class NameTag extends FastElement {
  @attr greeting: string = 'Hello';
}
```

Inside the body `div`, we've placed a `slot` element. This is referred to as the "default slot" for the component because, by default, all content placed between the element's opening and closing tags will be *rendered* at this location.

To make this clear, let's look at how the `name-tag` element would be used with content and then see how the browser would composite the final rendered output.

**Example 1: Using `name-tag` with a default slot**

```HTML
<name-tag>John Doe<name-tag>
```

**Example 2: Rendered Output for `name-tag` with a  default slot**

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

  John Doe
</name-tag>
```

The text "John Doe" exists in the "Light DOM", but it gets *projected* into the location of the `slot` within the "Shadow DOM".

> **NOTE:** If you find the terms "Light DOM" and "Shadow DOM" unintuitive, you're not alone. Another way to think of "Light DOM" is as the "Semantic DOM". It represents your semantic content model, without any concern for rendering. Another way to think of "Shadow DOM' is as the "Render DOM". It represents how your element is rendered, independent of content or semantics.

With slots at our disposal, we now unlock the full compositional model of HTML for use in our own elements. However, there's even more that slots can do.

### Named Slots

In the example above, we use a single `slot` element to render *all* content placed between the start and end tags of the `name-tag`. However, we're not limited to only having a default slot. We can also have *named slots* that declare other locations to which we can render content. To demonstrate this, let's add a named slot to our `name-tag`'s template where we can display the person's avatar.

**Example 1: `name-tag` with a named slot**

```TypeScript
import { FastElement, customElement, attr, html } from '@microsoft/fast-element';

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
export class NameTag extends FastElement {
  @attr greeting: string = 'Hello';
}
```

**Example 2: Using `name-tag` with a named slot**

```HTML
<name-tag>
  John Doe
  <img slot="avatar" src="...">
</name-tag>
```

**Example 3: Rendered Output for `name-tag` with a named slot**

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
      <img slot="avatar"> <!--Ignored!-->
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

// TODO

### Slot APIs

// TODO

## Defining CSS

- shadow dom styling
  - :host
  - ::slotted()
  - CSS contain
- CSS properties
- Composing styles