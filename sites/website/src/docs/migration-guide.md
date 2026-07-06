---
id: migration-guide
title: Migration Guide
sidebar_label: Migration Guide
keywords:
  - migrate
  - migration
  - web components
---

# Migrating from 1.x to 2.x

## Breaking Changes

### `cssPartial`

The `cssPartial` export no longer exists, in its place use `css.partial`.

1.x Example:
```ts
import { cssPartial } from "@microsoft/fast-element";

cssPartial`
:host {
  color: red;
}`;
```

2.x Example:
```ts
import { css } from "@microsoft/fast-element";

css.partial`
:host {
  color: red;
}`;
```

### `CSSDirective`

The `CSSDirective` has been updated to need to be defined. Additionally it cannot be extended from and must use `implements`.

1.x Example:
```ts
import { CSSDirective } from "@microsoft/fast-element"

class MyCSSDirective extends CSSDirective {
    createCSS() {
      return "color: red;"
    }
}

export const myCssDirective = new MyCSSDirective();
```

2.x Example:
```ts
import { CSSDirective } from "@microsoft/fast-element"

class MyCSSDirective implements CSSDirective {
    createCSS() {
      return "color: red;"
    }
}

CSSDirective.define(MyCSSDirective);

export const myCssDirective = new MyCSSDirective();
```

### `CSSDirective` with behaviors

Behaviors have been extracted from `CSSDirective` so that they can be used in a modular fashion. The API has also been updated to be more intuitive and re-use methods that are common for web components (see `connectedCallback` in the 2.x example below).

1.x Example:
```ts
import { CSSDirective } from "@microsoft/fast-element"

class MyCSSDirective extends CSSDirective {
  public cssProperty: string = "background";

  createCSS() {
    return `display: block; color: red;`
  }

  createBehavior() {
    var that = this;

    return {
      bind(el) {
        el.style.setProperty(that.cssProperty, "yellow")
      },
      unbind(el) {
        el.style.removeProperty(that.cssProperty);
      }
    }
  }
}

export const myCssDirective = new MyCSSDirective();
```

2.x Example:
```ts
import { css, CSSDirective, AddBehavior, HostBehavior } from "@microsoft/fast-element"

const cssProperty: string = "background";

const myCssBehavior: HostBehavior = {
  connectedCallback: (controller) => {
    controller.addStyles(css`:host {${cssProperty}: yellow }`)
  },
  disconnectedCallback: (controller) => {
    controller.removeStyles(css`:host {${cssProperty}: yellow }`)
  }
}

class MyCSSDirective implements CSSDirective {
  createCSS(add: AddBehavior) {
    add(myCssBehavior);
    return `display: block; color: red;`
  }
}

CSSDirective.define(MyCSSDirective);

export const myCssDirective = new MyCSSDirective();
```

## Suggested Changes

While some of the APIs remain available, we suggest going forward that certain patterns be updated.

### `@customElement`

We prefer using `FASTElement` and its `.define()` method over the `@customElement` decorator (which is still used under the hood). We believe this more closely matches with how you define custom elements using the native `customElements.define()`.

1.x Example:
```ts
import { FASTElement, customElement } from '@microsoft/fast-element';

@customElement('my-component')
export class MyComponent extends FASTElement {}
```

2.x Example:
```ts
import { FASTElement } from "@microsoft/fast-element";

class MyComponent extends FASTElement {}

MyComponent.define({
  name: "my-component"
});
```