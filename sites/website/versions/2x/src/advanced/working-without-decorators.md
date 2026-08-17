---
id: working-without-decorators
title: Working without Decorators
layout: 2x
eleventyNavigation:
  key: working-without-decorators2x
  parent: advanced2x
  title: Working without Decorators
navigationOptions:
  activeKey: working-without-decorators2x
keywords:
  - decorators
---

Most of our documented examples include the use of TypeScript decorators. However, as decorators are an unimplemented feature in JavaScript, using them may not be right for your project. See [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/decorators.html) for details on our implementation.

When defining your component, you may pass in attributes in the same configuration object as the name, template, and styles:

```javascript
import { FASTElement, html, css } from '@microsoft/fast-element';

export class MyElement extends FASTElement {
  // component logic
}

MyElement.define({
    name: 'my-element',
    template: html`<div>${(x) => x.count}</div>`,
    styles: css`div { background: red }`,
    attributes: ['count'],
});
```

```html
<my-element count="42">
```

This accepts the same configuration options as the `@attr` so for example to bind a property name that is different from an attribute name:

```javascript
import { FASTElement, html, css } from '@microsoft/fast-element';

export class MyElement extends FASTElement {
  constructor() {
    super();

    this.currentCount = 42;
  }
}

MyElement.define({
  name: 'my-element',
  template: html`<div>${(x) => x.currentCount}</div>`,
  styles: css`div { background: red }`,
  attributes: [
    {
      attribute: 'current-count',
      property: 'currentCount'
    },
  ],
});
```

```html
<my-element current-count="42">
```

:::note
In the above example we are setting the `currentCount` in the constructor and not as a class initializer, this is due to a difference in how decorators are elevated and initialized.

If you need to add a converter to your attribute:

```javascript
import { FASTElement, html, css } from '@microsoft/fast-element';

const converter = {
  toView: (value) => {
    return value / 2;
  },
  fromView: (value) => {
    return value / 2;
  },
};

export class MyElement extends FASTElement {
  constructor() {
    super();

    this.currentCount = 42;
  }
}

MyElement.define({
  name: 'my-element',
  template: html`<div>${(x) => x.currentCount}</div>`,
  styles: css`div { background: red }`,
  attributes: [
    {
      attribute: 'current-count',
      property: 'currentCount',
      converter
    },
  ],
});
```