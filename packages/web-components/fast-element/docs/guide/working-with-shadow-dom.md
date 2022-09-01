---
id: working-with-shadow-dom
title: Working with Shadow DOM
sidebar_label: Working with Shadow DOM
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/guide/working-with-shadow-dom.md
description: See how our custom elements can be composed together with standard HTML or other custom elements.
---

So far we've looked at how to define elements, how to define attributes on those elements, and how to control element rendering through declarative templates. However, we haven't yet seen how our custom elements can be composed together with standard HTML or other custom elements.

## The default slot

To enable composition, `FASTElement` leverages the Shadow DOM standard. Previously, we've seen how `FASTElement` automatically attaches a `ShadowRoot`, and when your element declares a template, it renders that template into the Shadow DOM. To enable element composition, all we need to do is make use of the standard `<slot>` element within our template.

Let's return to our original `name-tag` element example and see how we can use a `slot` to compose the person's name.

**Example: Using Slots in a `FASTElement`**

```ts
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

```html
<name-tag>John Doe<name-tag>
```

**Example: Rendered Output for `name-tag` with a  Default Slot**

```html
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

:::note
If you find the terms "Light DOM" and "Shadow DOM" unintuitive, you're not alone. Another way to think of "Light DOM" is as the "Semantic DOM". It represents your semantic content model, without any concern for rendering. Another way to think of "Shadow DOM" is as the "Render DOM". It represents how your element is rendered, independent of content, or semantics.
:::

With slots at our disposal, we now unlock the full compositional model of HTML for use in our own elements. However, there's even more that slots can do.

## Named slots

In the example above, we use a single `slot` element to render *all* content placed between the start and end tags of the `name-tag`. However, we're not limited to only having a default slot. We can also have *named slots* that declare other locations to which we can render content. To demonstrate this, let's add a named slot to our `name-tag`'s template where we can display the person's avatar.

**Example: `name-tag` with a Named Slot**

```ts
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

```html
<name-tag>
  John Doe
  <img slot="avatar" src="...">
</name-tag>
```

**Example: Rendered Output for `name-tag` with a Named Slot**

```html
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
* You can only place `slot` attributes on the direct content of the containing element.
  ```html
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
  ```html
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

## Fallback content

There are several scenarios for using slots in your elements. So far, we've been showing how to use slots for content projection. However, another major use case is to enable various parts of your element's rendering to be replaced by the software using your element. To enable this, you can provide *fallback content* for any slot. This content will render if the element consumer provides no content for that slot, but if they do, their own content will override the fallback content.

**Example: Fallback Slot Content**

```html
<div class="my-slider-template">
  <slot name="thumb">
    <span class="thumb"></span>
  </slot>
</div>
```

In the example above, the author of the `my-slider` custom element provides default HTML for the slider's "thumb", ensuring that the element will always render and function properly. However, this design leaves open the option to the component's consumer, to replace the thumb with their own HTML by simply providing HTML and assigning the proper slot name.

## Slot APIs

In addition to the declarative means of using slots described so far, the browser offers a number of slot-specific APIs you can use directly in JavaScript code. Below is a summary of what is available to you.

| API | Description |
| ------------- |-------------|
| `slotchange` | By adding an event listener for the `slotchange` event on a `slot` element, you can receive notifications any time the slotted nodes of a particular slot change. |
| `assignedNodes()` | The `slot` element provides an `assignedNodes()` method that can be called to get a list of all nodes that a particular slot currently renders. You can pass an options object with `{ flatten: true }` if you wish to also see fallback content nodes. |
| `assignedSlot` | The `assignedSlot` property is present on any element that has been projected to a slot so that you can determine where it is projected. |

:::tip
Remember that you can use the templating system's event support to respond to `slotchange` events with `<slot @slotchange=${...}></slot>`. You can also obtain a reference to any slot with the `ref` directive, making it easy to call APIs like `assignedNodes()` or manually add/remove event listeners.
:::

## Events

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

### Custom events

In various scenarios, it may be appropriate for a custom element to publish its own element-specific events. To do this, you can use the `$emit` helper on `FASTElement`. It's a convenience method that creates an instance of `CustomEvent` and uses the `dispatchEvent` API on `FASTElement` with the `bubbles: true` and `composed: true` options. It also ensures that the event is only emitted if the custom element is fully connected to the DOM. Here's an example:

**Example: Custom Event Dispatch**

```ts
customElement('my-input')
export class MyInput extends FASTElement {
  @attr value: string = '';

  valueChanged() {
    this.$emit('change', this.value);
  }
}
```

:::tip
When emitting custom events, ensure that your event name is always lower-case, so that your Web Components stay compatible with various front-end frameworks that attach events through DOM binding patterns (the DOM is case insensitive).
:::

## Shadow DOM configuration

In all the examples we've seen so far `FASTElement` automatically creates a Shadow Root for your element and attaches it in `open` mode. However, if desired, you can specify `closed` mode or make the element render into the Light DOM instead. These choices can be made by using the `shadowOptions` setting with your `@customElement` decorator.

**Example: Shadow DOM in Closed Mode**

```ts
@customElement({
  name: 'name-tag',
  template,
  shadowOptions: { mode: 'closed' }
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

:::tip
Avoid using `closed` mode since it affects event propagation and makes custom elements less inspectable.
:::

**Example: Render to Light DOM**

```ts
@customElement({
  name: 'name-tag',
  template,
  shadowOptions: null
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

:::important
If you choose to render to the Light DOM, you will not be able to compose the content, use slots, or leverage encapsulated styles. Light DOM rendering is not recommended for reusable components. It may have some limited use as the root component of a small app.
:::

In addition to the Shadow DOM mode, `shadowOptions` exposes all the options that can be set through the standard `attachShadow` API. This means that you can also use it to specify new options such as `delegatesFocus: true`. You only need to specify options that are different from the defaults mentioned above.

## Shadow DOM and the element lifecycle

It is during the constructor that `FASTElement` attaches the Shadow DOM for an element. The `shadowRoot` is then available directly as a property on your Custom Element, assuming that the element uses `open` mode.