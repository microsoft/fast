---
id: working-without-decorators
title: Working without Decorators
sidebar_label: Working without Decorators
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
  currentCount = 42;
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
  currentCount = 42;
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