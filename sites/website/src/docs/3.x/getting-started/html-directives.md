---
id: html-directives
title: HTML Directives
layout: 3x
eleventyNavigation:
  key: html-directives3x
  parent: getting-started3x
  title: HTML Directives
navigationOptions:
  activeKey: html-directives3x
keywords:
  - ref
  - slotted
  - children
  - when
  - repeat
  - directives
  - web components
---

# HTML Directives

When working with a custom element's shadow DOM, you often need references to structural pieces within the template. FAST Element provides directives that reference and manipulate elements in the template and control rendering based on conditions or data.

## Rendering Directives

Rendering directives control what renders based on conditions or data. FAST Element provides two: `repeat` and `when`.

### The `repeat` Directive

The `repeat()` directive renders a list of items from an array, using a template to render each one. It accepts the array and an item template, plus an optional configuration object.

For a simple array, the item template renders each entry directly. Within the item template, the source (`x`) is the current item rather than the host component, so typing the template with `html<string>` makes `x` a `string`:

```ts
import { FASTElement, html, observable, repeat } from '@microsoft/fast-element';

const template = html<TagList>`
  <ul>
    ${repeat(x => x.tags, html<string>`
      <li>${x => x}</li>
    `)}
  </ul>
`;

class TagList extends FASTElement {
  @observable
  tags: string[] = ["new", "featured", "sale"];
}

TagList.define({
  name: "tag-list",
  template,
});
```

The same pattern works for arrays of objects. Typing the item template with the item's type gives type-checked access to its properties:

```ts
import { FASTElement, html, observable, repeat } from '@microsoft/fast-element';

interface Friend {
  name: string;
  age: number;
}

const template = html<FriendList>`
  <ul>
    ${repeat(x => x.friends, html<Friend>`
      <li>${x => x.name} is ${x => x.age} years old.</li>
    `)}
  </ul>
`;

class FriendList extends FASTElement {
  @observable
  friends: Friend[] = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
  ];
}

FriendList.define({
  name: "friend-list",
  template,
});
```

Here `html<Friend>` makes `x` a `Friend`, so references like `x.name` and `x.age` are type-checked.

#### Accessing the Parent Scope

Within an item template's expressions, the source (`x`) is the current item, so it has no direct reference to the component the `repeat()` is declared in. The execution context (`c`) provides that reference: `c.parent` is the source the directive is bound to, and `c.parentContext` is that source's execution context. For a top-level `repeat()`, `c.parent` is the host component, so an item template can access the host's properties and methods.

Typing the item template with `html<Friend, FriendList>` gives `c.parent` the host's type, so member access like `c.parent.removeFriend(x)` is type-checked:

```ts
import { FASTElement, html, observable, repeat } from '@microsoft/fast-element';

interface Friend {
  name: string;
}

const template = html<FriendList>`
  <ul>
    ${repeat(x => x.friends, html<Friend, FriendList>`
      <li>
        ${x => x.name}
        <button @click=${(x, c) => c.parent.removeFriend(x)}>Remove</button>
      </li>
    `)}
  </ul>
`;

class FriendList extends FASTElement {
  @observable
  friends: Friend[] = [{ name: "Alice" }, { name: "Bob" }];

  removeFriend(friend: Friend) {
    this.friends = this.friends.filter(f => f !== friend);
  }
}

FriendList.define({
  name: "friend-list",
  template,
});
```

Here `c.parent` is the `FriendList` instance, so each item's button can call the `removeFriend()` method. When `repeat()` directives are nested, `c.parent` is the item from the enclosing `repeat()` and `c.parentContext` is its execution context, so an item template can reach the scopes that surround it.

#### Positioning

By default, an item template has access to its item but not its position in the list. To use position-dependent values, pass a configuration object as the third argument with the `positioning` property set to `true`. This adds `index` and `length` to the execution context, along with the derived `isFirst`, `isLast`, `isEven`, `isOdd`, and `isInMiddle` properties.

```ts
const template = html<FriendList>`
  <ol>
    ${repeat(
      x => x.friends,
      html<Friend>`
        <li>${(x, c) => c.index + 1}. ${x => x.name}</li>
      `,
      { positioning: true }
    )}
  </ol>
`;
```

Positioning is opt-in because it has a cost: when the list changes, FAST must update the context of the affected items to keep `index` and `length` current. Enable it only when an item template uses position-dependent values.

#### Recycling Views

When the list changes, `repeat()` reuses existing item views by default rather than creating new ones, which avoids unnecessary allocation. A reused view keeps the DOM from the item it previously displayed, then re-binds it to the new item. Any transient state that a binding does not control, such as scroll position or focus, can carry over.

To give each item a fresh view instead, set `recycle: false`:

```ts
const template = html<FriendList>`
  <ol>
    ${repeat(
      x => x.friends,
      html<Friend>`
        <li>${x => x.name}</li>
      `,
      { recycle: false }
    )}
  </ol>
`;
```

Disabling recycling avoids stale state at the cost of recreating views, so reserve it for cases where reused DOM causes problems.

### The `when` Directive

The `when()` directive conditionally renders elements. It accepts a predicate function, a template to render when the predicate is true, and an optional template to render when it is false.

```ts
import { FASTElement, html, observable, when } from '@microsoft/fast-element';

class WhenExample extends FASTElement {
  @observable
  showContent: boolean = true;
}

const template = html<WhenExample>`
  <template>
    ${when(
      x => x.showContent,
      html<WhenExample>`<span>This nested template is rendered when showContent is true.</span>`,
      html<WhenExample>`<span>This nested template is rendered when showContent is false.</span>`,
    )}
  </template>
`;

WhenExample.define({
  name: "when-example",
  template,
});
```

## Reference Directives

Reference directives create references to elements in your template so you can manipulate them from your component's class. FAST Element provides three: `ref`, `slotted`, and `children`.

### The `ref` Directive

The `ref()` directive maps an element in the template to an observed property on the component class, so you can reach the element through the component instance.

In the following example, the `ref()` directive maps the `<video>` element to the `video` property on the `MP4Player` class.

```ts
import { attr, FASTElement, html, observable, ref } from '@microsoft/fast-element';

class MP4Player extends FASTElement {
  /**
   * The `src` attribute on the `<mp4-player>` element is
   * mapped to this property using the `@attr` decorator.
   */
  @attr
  src?: string;

  /**
   * The `<video>` element in the template is mapped to
   * this property using the `ref()` directive.
   */
  @observable
  video?: HTMLVideoElement;

  /**
   * The `videoChanged()` method is called whenever the `video` property changes.
   * In this case, we want to play the video when it is assigned.
   */
  videoChanged(_prev?: HTMLVideoElement, next?: HTMLVideoElement) {
    next?.play();
  }
}

const template = html<MP4Player>`
  <template>
    <video ${ref("video")}>
      <source src="${x => x.src}" type="video/mp4">
    </video>
  </template>
`;

MP4Player.define({
  name: "mp4-player",
  template
});
```

### The `slotted` Directive

The `slotted()` directive references the elements assigned to a `<slot>` in your component's shadow DOM, so you can work with slotted content from the component class.

```ts
import { FASTElement, html, observable, slotted } from '@microsoft/fast-element';

class SlottedExample extends FASTElement {
  /**
   * The `slottedElements` property is an array of elements that are assigned to the `<slot>` in the template. The `@observable` decorator allows us to react to changes in this property.
   */
  @observable
  slottedElements!: HTMLElement[];

  /**
   * The `slottedElementsChanged()` method is called whenever the collection assigned to the `slottedElements` property changes. In this case, we log the old and new values to the console.
   */
  slottedElementsChanged(oldValue: HTMLElement[], newValue: HTMLElement[]) {
    console.log("The collection of slotted elements has changed:", oldValue, newValue);
  }
}

const template = html<SlottedExample>`
  <template>
    <slot ${slotted("slottedElements")}></slot>
  </template>
`;

SlottedExample.define({
  name: "slotted-example",
  template
});
```

In the example above, the `slotted("slottedElements")` directive creates a reference to the elements assigned to the `<slot>` and maps them to the `slottedElements` property on the `SlottedExample` class. The `slottedElementsChanged` method is called whenever the collection of slotted elements changes.

#### Filtering Slotted Elements

The `slotted()` directive also accepts an optional configuration object to filter the assigned elements by tag name or CSS selector, so only matching element types reach the property:

```ts
import { elements, html, slotted } from "@microsoft/fast-element";

const template = html<SlottedExample>`
  <template>
    <slot ${slotted({
      property: "slottedElements",
      filter: elements("div")
    })}></slot>
  </template>
`;
```

#### Flattening

The configuration object also accepts a `flatten` option. By default, `slotted()` references the nodes directly assigned to the slot. Setting `flatten: true` references the slot's flattened assigned nodes instead, resolving any nested slots to their distributed content and falling back to the slot's default content when nothing is assigned. The option is passed through to the underlying [`assignedNodes()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedNodes) call.

```ts
import { html, slotted } from "@microsoft/fast-element";

const template = html<SlottedExample>`
  <template>
    <slot ${slotted({
      property: "slottedElements",
      flatten: true
    })}></slot>
  </template>
`;
```

### The `children` Directive

The `children()` directive references the child nodes of an element in your component's shadow DOM, so you can work with them from the component class.

```ts
import { children, FASTElement, html, observable } from '@microsoft/fast-element';

const template = html<ChildrenExample>`
  <ul ${children("listItems")}>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
`;

class ChildrenExample extends FASTElement {
  @observable
  listItems!: Node[];

  listItemsChanged(oldValue: Node[], newValue: Node[]) {
    console.log("The collection of child nodes has changed:", oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();

    console.log(this.listItems);
  }
}

ChildrenExample.define({
  name: "children-example",
  template
});
```

In the example above, the `children("listItems")` directive creates a reference to the child nodes of the `<ul>` and maps them to the `listItems` property on the `ChildrenExample` class. The `listItemsChanged` method is called whenever the collection of child nodes changes.

The `children()` directive works well with `repeat()` for dynamic lists: render the children with `repeat()`, then reference them through `children()`:

```ts
import { children, FASTElement, html, observable, repeat } from '@microsoft/fast-element';

interface Task {
  id: number;
  label: string;
}

const template = html<TaskList>`
  <ul ${children("listItems")}>
    ${repeat(x => x.tasks, html<Task>`
      <li>${x => x.label}</li>
    `)}
  </ul>
`;

class TaskList extends FASTElement {
  @observable
  tasks: Task[] = [
    { id: 1, label: "Write docs" },
    { id: 2, label: "Review PR" },
  ];

  @observable
  listItems!: Node[];

  listItemsChanged() {
    console.log(`The list now renders ${this.listItems.length} nodes.`);
  }
}

TaskList.define({
  name: "task-list",
  template,
});
```

Here `repeat()` owns the rendering: it creates and updates the `<li>` elements as the `tasks` array changes. The `children("listItems")` directive observes the same `<ul>` and keeps `listItems` in sync with whatever `repeat()` produces. Each time the rendered set of children changes, `listItemsChanged` runs with the current collection. This lets one directive drive the DOM while the other gives the component a live reference to the result.

#### Filtering Child Elements

Like `slotted()`, the `children()` directive accepts a configuration object in place of a property name. By default, the directive observes every child node, including the text and comment nodes between elements. Add a `filter` to narrow the collection. The `elements()` filter keeps only element nodes, or only the elements that match a selector when you pass one:

```ts
import { children, elements, html } from "@microsoft/fast-element";

const template = html<Menu>`
  <div role="menu" ${children({
    property: "menuItems",
    filter: elements("[role=menuitem]")
  })}>
    <div role="menuitem">New</div>
    <div role="menuitem">Open</div>
    <div role="separator"></div>
  </div>
`;
```

In this example, `menuItems` is populated only with the children that match `[role=menuitem]`, and the separator is ignored.

#### Observing the Subtree

By default, `children()` observes only the direct children of the element it is placed on. To observe deeper descendants as well, set `subtree: true`. In subtree mode a `selector` is required, because a subtree can contain many unrelated nodes and the selector indicates which of them to assign to the property.

```ts
import { children, html } from "@microsoft/fast-element";

const template = html<TreeView>`
  <div role="tree" ${children({
    property: "treeItems",
    subtree: true,
    selector: "[role=treeitem]"
  })}>
    <div role="group">
      <div role="treeitem">Item 1</div>
      <div role="treeitem">Item 2</div>
    </div>
  </div>
`;
```

With `subtree: true` and a `selector` in place, `treeItems` is populated with every matching `[role=treeitem]` descendant at any depth, and updated whenever the matching set changes. In direct-child mode the `filter` option decides which children to keep; in subtree mode the `selector` takes over that role and matches descendants throughout the tree.
