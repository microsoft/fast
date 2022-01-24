---
id: using-directives
title: Using Directives
sidebar_label: Using Directives
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/guide/using-directives.md
---

In addition to declaring dynamic parts of templates with expressions, you also have access to several powerful *directives*, which aid in common scenarios.

## Structural directives

Structural directives change the shape of the DOM itself by adding and removing nodes based on the state of your element.

### The `when` directive

The `when` directive enables you to conditionally render blocks of HTML. When you provide an expression to `when` it will render the child template into the DOM when the expression evaluates to `true` and remove the child template when it evaluates to `false` (or if it is never `true`, the rendering will be skipped entirely).

**Example: Conditional Rendering**

```ts
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
  @observable data: any = null;

  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  async loadData() {
    const response = await fetch('some/resource');
    const data = await response.json();
    
    this.data = data;
    this.ready = true;
  }
}
```

:::note
The `@observable` decorator creates a property that the template system can watch for changes. It is similar to `@attr`, but the property is not surfaced as an HTML attribute on the element itself. While `@attr` can only be used in a `FASTElement`, `@observable` can be used in any class.
:::

In addition to providing a template to conditionally render, you can also provide an expression that evaluates to a template. This enables you to dynamically change what you are conditionally rendering.

**Example: Conditional Rendering with Dynamic Template**

```ts
import { FASTElement, customElement, observable, html, when } from '@microsoft/fast-element';

const template = html<MyApp>`
  <h1>My App</h1>

  ${when(x => x.ready, x => x.dataTemplate)}
`;
```

### The `repeat` directive

To render a list of data, use the `repeat` directive, providing the list to render and a template to use in rendering each item.

**Example: List Rendering**

```ts
import { FASTElement, customElement, observable, html, repeat } from '@microsoft/fast-element';

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
* `parent` - The parent view-model when inside a `repeat` block.
* `parentContext` - The parent `ExecutionContext` when inside a `repeat` block. This is useful when repeats are nested and the inner-most repeat needs access to the root view-model.
* `index` - The index of the current item when inside a `repeat` block (opt-in).
* `length` - The length of the array when inside a `repeat` block (opt-in).
* `isEven` - True if the index of the current item is even when inside a `repeat` block (opt-in).
* `isOdd` - True if the index of the current item is odd when inside a `repeat` block (opt-in).
* `isFirst` - True if the current item is first in the array inside a `repeat` block (opt-in).
* `isInMiddle` - True if the current item is somewhere in the middle of the array inside a `repeat` block (opt-in).
* `isLast` - True if the current item is last in the array inside a `repeat` block (opt-in).

Some context properties are opt-in because they are more costly to update. So, for performance reasons, they are not available by default. To opt into the positioning properties, pass options to the repeat directive, with the setting `positioning: true`. For example, here's how we would use the `index` in our friends template from above:

**Example: List Rendering with Item Index**

```html
<ul>
  ${repeat(x => x.friends, html<string>`
    <li>${(x, c) => c.index} ${x => x}</li>
  `, { positioning: true })}
</ul>
```

Whether or not a repeat directive re-uses item views can be controlled with the `recycle` option setting. When `recycle: true`, which is the default value, the repeat directive may reuse views rather than create new ones from the template.  When `recycle: false` 
previously used views are always discarded and each item will always be assigned a new view. Recyling previously used views may improve performance in some situations but may also be "dirty" from the previously displayed item.

**Example: List Rendering without view recycling**

```html
<ul>
  ${repeat(x => x.friends, html<string>`
    <li>${(x, c) => c.index} ${x => x}</li>
  `, { recycle: false })}
</ul>
```

In addition to providing a template to render the items with, you can also provide an expression that evaluates to a template. This enables you to dynamically change what you are using to render the items. Each item will still be rendered with the same template, but you can use techniques from "Composing Templates" below to render a different template depending on the item itself.

### Composing templates

The `ViewTemplate` returned from the `html` tag helper has special handling when it is used inside of another template. This is done so that you can create templates and compose them into other templates.

**Example: Composing Templates**

```ts
import { FASTElement, customElement, observable, html, repeat, when } from '@microsoft/fast-element';

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

In the above example, we create an independent `nameTemplate` and then use it in two different places. First inside of a `when` template and then later inside of a `repeat` template.

But content composition is actually more powerful than that because you aren't limited to *static composition* of templates. You can also provide any expression that returns a template. As a result, when the `@observable` dependencies of the expression change, you can dynamically change which template is selected for rendering. If you don't want to render anything, you can also handle that by returning `null` or `undefined`. Here are a few examples of what you can do with content composition:

**Example: Dynamic Composition**

```ts
const defaultTemplate = html`...`;
const templatesByType = {
  foo: html`...`,
  bar: html`...`,
  baz: html`...`
};

const template = html<MyElement>`
  <div>${x => x.selectTemplate()}</div>
`;

@customElement({
  name: 'my-element',
  template
})
export class MyElement extends FASTElement {
  @observable data;

  selectTemplate() {
    return templatesByType[this.data.type] || defaultTemplate;
  }
}
```

**Example: Override Templates**

```ts
const myCustomTemplate = html`...`

@customElement({
  name: 'my-derived-element',
  template
})
export class MyDerivedElement extends MyElement {
  selectTemplate() {
    return myCustomTemplate;
  }
}
```

**Example: Complex Conditional**

```ts
const dataTemplate = html`...`;
const loadingTemplate = html`...`;

const template = html<MyElement>`
  <div>
    ${x => {
      if (x.ready) {
        return dataTemplate;
      }

      // Any logic can go here to determine which template to use.
      // Which template to use will be re-evaluated whenever @observable
      // properties from this method implementation change.

      return loadingTemplate;
    }}
  </div>
`;

@customElement({
  name: 'my-element',
  template
})
export class MyElement extends FASTElement {
  @observable ready: boolean = false;
  @observable data: any = null;

  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  async loadData() {
    const response = await fetch('some/resource');
    const data = await response.json();
    
    this.data = data;
    this.ready = true;
  }
}
```

**Example: Per Item List Types**

```ts
const defaultTemplate = html`...`;
const templatesByType = {
  foo: html`...`,
  bar: html`...`,
  baz: html`...`
};

const template = html<MyElement>`
  <ul>
    ${repeat(x => x.items, html`
      <li>
        ${(x, c) = c.parent.selectTemplate(x)}
      </li>
    `)}
  </ul>
`;

@customElement({
  name: 'my-element',
  template
})
export class MyElement extends FASTElement {
  @observable items: any[] = [];

  selectTemplate(item) {
    return templatesByType[item.type] || defaultTemplate;
  }
}
```

**Example: Custom Rendering Override**

```ts
const defaultTemplate = html`...`;
const template = html<MyElement>`
  <div>${x => x.selectTemplate()}</div>
`;

@customElement({
  name: 'my-element',
  template
})
export class MyElement extends FASTElement {
  selectTemplate() {
    return defaultTemplate;
  }
}

export class MyCustomTemplate implements SyntheticViewTemplate {
  create(): SyntheticView {
    // construct your own implementation of SyntheticView
    return customView;
  }
}

const customTemplate = new MyCustomTemplate();

@customElement({
  name: 'my-derived-element',
  template
})
export class MyDerivedElement extends MyElement {
  selectTemplate() {
    return customTemplate;
  }
}
```

:::important
When composing templates, extract the composed template to an external variable. If you define the template inline, within your method, property, or expression, then each time that is invoked, a new instance of the template will be created, rather than reusing the template. This will result in an unnecessary performance cost.
:::

**Example: The `when` Directive**

Now that we've explained how content composition works, you may find it interesting to know that `when` is actually just *syntax sugar* on top of the core composition system. Let's look at the implementation of `when` itself to see how it works:

```ts
export function when(condition, templateOrTemplateExpression) {
    const getTemplate = typeof templateOrTemplateExpression === "function"
      ? templateOrTemplateExpression
      : () => templateOrTemplateExpression;

    return (source, context) => 
      condition(source, context) 
        ? getTemplate(source, context) 
        : null;
}
```

As you can see, all that `when` does is compose a new function that checks your condition. If it's `true,` it invokes your template provider function; if `false`, it returns `null`, indicating nothing should be rendered.

## Referential directives

Referential directives allow you to easily get references to DOM nodes in various scenarios.

### The `ref` directive

Sometimes you need a direct reference to a single DOM node from your template. This might be because you want to control the playback of a `video` element, use the drawing context of a `canvas` element, or pass an element to a 3rd party library. Whatever the reason, you can get a reference to the DOM node by using the `ref` directive.

**Example: Referencing an Element**

```ts
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

:::tip
If you provide a type for your HTML template, TypeScript will type check the property name you provide to ensure that it actually exists on your element.
:::

### The `children` directive

Besides using `ref` to reference a single DOM node, you can use `children` to get references to all child nodes of a particular element.

**Example: Referencing Child Nodes**

```ts
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

In the example above, the `listItems` property will be populated with all child nodes of the `ul` element. If `listItems` is decorated with `@observable` then it will be updated dynamically as the child nodes change. Like any observable, you can optionally implement a *propertyName*Changed method to be notified when the nodes change. Additionally, you can provide an `options` object to the `children` directive to specify a customized configuration for the underlying [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

:::important
Like `ref`, the child nodes are not available until the `connectedCallback` lifecycle event.
:::

You can also provide a `filter` function to control which child nodes are synchronized to your property. As a convenience, we provide an `elements` filter that lets you optionally specify a selector. Taking the above example, if we wanted to ensure that our `listItems` array only included `li` elements (and not any text nodes or other potential child nodes), we could author our template like this:

**Example: Filtering Child Nodes**

```ts
import { FASTElement, customElement, html, children, repeat, elements } from '@microsoft/fast-element';

const template = html<FriendList>`
  <ul ${children({ property: 'listItems', filter: elements('li') })}>
    ${repeat(x => x.friends, html<string>`
      <li>${x => x}</li>
    `)}
  </ul>
`;
```

If using the `subtree` option for `children` then a `selector` is *required* in place of a `filter`. This enables more efficient collection of the desired nodes in the presence of a potential large node quantity throughout the subtree.

### The `slotted` directive

Sometimes you may want references to all nodes that are assigned to a particular slot. To accomplish this, use the `slotted` directive. (For more on slots, see [Working with Shadow DOM](./working-with-shadow-dom).)

```ts
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

  slottedNodesChanged() {
    // respond to changes in slotted node
  }
}
```

Similar to the `children` directive, the `slotted` directive will populate the `slottedNodes` property with nodes assigned to the slot. If `slottedNodes` is decorated with `@observable` then it will be updated dynamically as the assigned nodes change. Like any observable, you can optionally implement a *propertyName*Changed method to be notified when the nodes change. Additionally, you can provide an `options` object to the `slotted` directive to specify a customized configuration for the underlying [assignedNodes() API call](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedNodes) or specify a `filter`.

:::tip
It's best to leverage a change handler for slotted nodes rather than assuming that the nodes will be present in the `connectedCallback`.
:::

## Host directives

So far, our bindings and directives have only affected elements within the Shadow DOM of the component. However, sometimes you want to affect the host element itself, based on property state. For example, a progress component might want to write various `aria` attributes to the host, based on the progress state. In order to facilitate scenarios like this, you can use a `template` element as the root of your template, and it will represent the host element. Any attribute or directive you place on the `template` element will be applied to the host itself.

**Example: Host Directive Template**

```ts
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

```html
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

:::tip
Using the `children` directive on the `template` element will provide you with references to all Light DOM child nodes of your custom element, regardless of if or where they are slotted.
:::
