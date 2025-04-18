---
id: aurelia
title: Aurelia
sidebar_label: Aurelia
custom_edit_url: https://github.com/microsoft/fast/edit/main/sites/website/versioned_docs/version-legacy/integrations/aurelia.md
description: FAST works flawlessly with both Aurelia 1 and Aurelia 2, with full integration into the binding engine and component model. Let's take a look at how you can set up an Aurelia project, starting from scratch.
keywords:
  - aurelia
---

FAST works flawlessly with both Aurelia 1 and Aurelia 2, with full integration into the binding engine and component model. Let's take a look at how you can set up an Aurelia project, starting from scratch.

## Aurelia 2

### Setting up the Aurelia 2 project

First, you'll need to make sure that you have Node.js installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can run the following command to create a new Aurelia 2 project:

```shell
npx makes Aurelia
```

Follow the prompts, answering each question in turn. It is recommended that you select the "Default TypeScript Aurelia 2 App" when prompted unless you have previous experience with the CLI. Be sure to choose to install dependencies when asked.

When the CLI completes, you should have a basic runnable Aurelia 2 application.

### Configuring packages

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element
```

### Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm start`. Webpack should build your project and open your default browser with your `index.html` page. Right now, it should only have a hello message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:

```ts
import { 
  provideFASTDesignSystem, 
  fastCard, 
  fastButton
} from '@microsoft/fast-components';

provideFASTDesignSystem()
    .register(
        fastCard(),
        fastButton()
    );
```

This code uses the FAST Design System to register the `<fast-card>` and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace your `my-app.html` file with the following markup:

```html
<fast-card>
  <h2>${message}</h2>
  <fast-button appearance="accent" click.trigger="onClick()">Click Me</fast-button>
</fast-card>
```

Replace your `my-app.ts` with this:

```ts
export class MyApp {
  public message = 'Hello World!';

  onClick() {
    console.log('clicked!');
  }
}
```

To add a splash of style, replace your `my-app.css` content with this:

```css
fast-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: var(--type-ramp-plus-5-font-size);
  line-height: var(--type-ramp-plus-5-line-height);
}

fast-card > fast-button {
  align-self: flex-end;
}
```

### Enabling two-way bindings

Aurelia knows by default how to listen for changes in native elements. Now we need to teach it how to listen for changes in FAST elements. You can do so by [extending its templating syntax](https://docs.aurelia.io/examples/integration/ms-fast). 

You can either use a [wrapper](https://www.npmjs.com/package/aurelia-fast-adapter) developed by the community or teach Aurelia manually:

### Import and register `aurelia-fast-adapter`

Start by installing the adapter

```ts
npm install aurelia-fast-adapter
```

and then simply register it from your `src/main.ts`:

```ts
// src/main.ts

import { FASTAdapter } from 'aurelia-fast-adapter';

Aurelia
  .register(FASTAdapter) // add this line
  // other registrations...
  .start();
```

If you use FAST in its default configuration that's all you need to do. But if you changed the prefix of your components to something else, you can customize the adapter as such:

```ts
// src/main.ts

import { FASTAdapter } from 'aurelia-fast-adapter';

Aurelia
  .register(FASTAdapter.customize({withPrefix: 'my-custom-prefix'}) // customized with prefix
  .start();
```

Also, in case you have local components that require two-way binding, you can adjust the adapter before to register it as such:

```ts
// src/main.ts

import { FASTAdapter } from 'aurelia-fast-adapter';

// this line will tell the adapter that it must use two-way binding on the <my-custom-prefix-date-field> component and use this two-way binding on the `value` property. It's possible to add several properties at once if necessary
FASTAdapter.tags['DATE-FIELD'] = ['value'];

Aurelia
  .register(FASTAdapter.customize({withPrefix: 'my-custom-prefix'})
  .start();
```

Congratulations! You're now set up to use FAST and Aurelia 2!

### Manually teach Aurelia 2 about two-way binding:

If the example doesn't seem obvious, the following prerequisite reads are recommended:

* [extending Aurelia templating syntax](https://docs.aurelia.io/app-basics/extending-templating-syntax)

The following is a code example of how to teach Aurelia to work seamlessly with Microsoft FAST.

```typescript
import { AppTask, IContainer, IAttrMapper, NodeObserverLocator } from 'aurelia';

Aurelia.register(AppTask.beforeCreate(IContainer, container => {
  const attrMapper = container.get(IAttrMapper);
  const nodeObserverLocator = container.get(NodeObserverLocator);
  attrMapper.useTwoWay((el, property) => {
    switch (el.tagName) {
      case 'FAST-SLIDER':
      case 'FAST-TEXT-FIELD':
      case 'FAST-TEXT-AREA':
        return property === 'value';
      case 'FAST-CHECKBOX':
      case 'FAST-RADIO':
      case 'FAST-RADIO-GROUP':
      case 'FAST-SWITCH':
        return property === 'checked';
      case 'FAST-TABS':
        return property === 'activeid';
      default:
        return false;
    }
  });

  // Teach Aurelia what events to use to observe properties of elements.
  // Because FAST components all use a single change event to notify,
  // we can use a single common object
  const valuePropertyConfig = { events: ['input', 'change'] };
  nodeObserverLocator.useConfig({
    'FAST-CHECKBOX': {
      checked: valuePropertyConfig
    },
    'FAST-RADIO': {
      checked: valuePropertyConfig
    },
    'FAST-RADIO-GROUP': {
      value: valuePropertyConfig
    },
    'FAST-SLIDER': {
      value: valuePropertyConfig
    },
    'FAST-SWITCH': {
      checked: valuePropertyConfig
    },
    'FAST-TABS': {
      activeid: valuePropertyConfig
    },
    'FAST-TEXT-FIELD': {
      value: valuePropertyConfig
    },
    'FAST-TEXT-AREA': {
      value: valuePropertyConfig
    }
  });
}))
```

## Aurelia 1

### Setting up the Aurelia 1 project

First, you'll need to make sure that you have Node.js installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can run the following command to install the Aurelia 1 CLI:

```shell
npm install -g aurelia-cli
```

And then use the CLI like this:

```shell
au new fast-aurelia
```

Follow the prompts, answering each question in turn. It is recommended that you select the "Default TypeScript App" when prompted unless you have previous experience with the CLI. Be sure to choose to install dependencies when asked.

When the CLI completes, you should have a basic runnable Aurelia 1 application.

### Configuring packages

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element
```

### Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm start`. Webpack should build your project and make it available at `http://localhost:8080/`. If you visit this address it should only have a hello message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:

```ts
import { 
  provideFASTDesignSystem, 
  fastCard, 
  fastButton
} from '@microsoft/fast-components';

provideFASTDesignSystem()
    .register(
        fastCard(),
        fastButton()
    );
```

This code uses the FAST Design System to register the `<fast-card>` and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace your `app.html` file with the following markup:

```html
<template>
  <fast-card>
    <h2>${message}</h2>
    <fast-button appearance="accent" click.trigger="onClick()">Click Me</fast-button>
  </fast-card>
</template>
```

Replace your `app.ts` with this:

```ts
export class App {
  public message: string = 'Hello World!';

  onClick() {
    console.log('clicked!');
  }
}
```

To add a splash of style, add the following to your `app.html` template:

```html
<style>
  fast-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: var(--type-ramp-plus-5-font-size);
    line-height: var(--type-ramp-plus-5-line-height);
  }

  fast-card > fast-button{
    align-self: flex-end;
  }
</style>
```

Congratulations! You're now set up to use FAST and Aurelia 1!
