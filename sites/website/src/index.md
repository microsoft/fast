---
layout: frontpage
permalink: "/"
---
 ### Install the package

```bash
npm install @microsoft/fast-element
```
<br>

### Create a web component

```typescript
/*
 * import utilities from @microsoft/fast-element
 */
import { attr, css, FASTElement, html } from "@microsoft/fast-element";

/*
 * Define your component logic
 */
class HelloWorld extends FASTElement {
  @attr
  name: string;
}

/*
 * Define your component for the browser and
 * include your CSS styles and HTML template
 */
HelloWorld.define({
  name: "hello-world",
  template: html`<span>Hello ${x => x.name}!</span>`,
  styles: css`
    span {
      color: red;
    }
  `,
});
```
<br>

### Add it to your project

```html
<hello-world name="Earth"></hello-world>
```
