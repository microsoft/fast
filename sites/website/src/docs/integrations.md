---
id: integrations
title: Integrations
sidebar_label: Integrations
keywords:
  - integrations
  - angular
  - asp.net
  - aurelia 2
  - ember
  - react
  - rollup
  - svelte
  - vite
  - vue
  - webpack
  - web components
---

# Integrations

If your project includes one of the popular frameworks below, we've included some helpful tips.

Natively supported, no additional configuration needed:

- ASP.NET
- Ember
- Svelte
- Vite
- Vue
- Webpack

## Angular

[Angular](https://angular.io/) works well with web components, 

To work with typings within Angular, check out their documentation on [custom typings](https://angular.io/guide/elements#typings-for-custom-elements).

## Aurelia 2

FAST works flawlessly with Aurelia 2, with full integration into the binding engine and component model.

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

## React

See the [React documentation](https://react.dev/reference/react-dom/components#custom-html-elements) on including custom elements.

## Rollup

In your `rollup.config.js` file in the root of your project folder can look something like this:

```js
import transformTaggedTemplate from 'rollup-plugin-transform-tagged-template';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    name: 'bundle',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    transformTaggedTemplate({
      tagsToProcess: ['html','css'],
      parserOptions: {
        sourceType: "module",
        plugins: [
            "typescript",
            [
                "decorators",
                { decoratorsBeforeExport: true }
            ]
        ]
      },
      transformer(data) {
          data = data.replace(/\s([{}()>~+=^$:!;])\s/gm, '$1');
          data = data.replace(/([",[]])\s+/gm, '$1');
          data = data.replace(/\s{2,}/gm, ' ');
          return data.trim();
      }
    }),
    typescript(),
    resolve(),
    cleaner({
      targets: [
      'dist'
      ]
    }),
    copy({
      targets: [
        { src: 'index.html', dest: 'dist' },
      ]
    }),
    serve({
      open: true,
      contentBase: 'dist'
    }),
    terser(),
  ]
};
```

Let's go over a few of the plugins we would suggest using:
- `transformTaggedTemplate` minifies content within tagged templates (e.g. html and css)
- `typescript` allows us to write our source files in TypeScript.
- `resolve` allows us to import modules installed from npm, like `@microsoft/fast-element`.

## TypeScript

Here's an example starter `taconfig.json` that you can use:

```json
{
  "compilerOptions": {
    "pretty": true,
    "target": "ES2015",
    "module": "ES2015",
    "moduleResolution": "node",
    "importHelpers": true,
    "experimentalDecorators": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmitOnError": true,
    "strict": true,
    "outDir": "dist/build",
    "rootDir": "src",
    "lib": [
      "dom",
      "esnext"
    ]
  },
  "include": [
    "src"
  ]
}
```

Note the inclusion of `"dom"` and `"experimentalDecorators"`.

You can learn more about `tsconfig.json` options in [the official TypeScript documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

:::note
Do not set `useDefineForClassFields` to `true` in your `tsconfig.json` if you are using decorators (e.g. `ExperimentalDecorators`). These two features conflict at present. This will be resolved in future versions of TypeScript and FAST.
:::