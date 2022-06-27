---
id: svelte
title: Svelte
sidebar_label: Svelte
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/integrations/svelte.md
description: FAST works great with Svelte, Vite, and TypeScript, using a standard setup. Let's take a look at how you can set up a FAST+Svelte+Vite+TypeScript project, starting from scratch.
keywords:
  - svelte
  - vite
  - typescript
---

FAST works great with `Svelte`, `Vite`, and `TypeScript`, using a standard setup. Let's take a look at how you can set up a FAST+Svelte+Vite+TypeScript project, starting from scratch.

## Setting up the Svelte project

First, you'll need to make sure that you have `Node.js` version >=12.2.0 installed. You can learn more and download that [on the official site](https://nodejs.org/).

With `Node.js` installed, you can use [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) to scaffold a new Svelte project.

```shell
npm create vite@latest fast-svelte --template svelte-ts
```

Follow the prompts, answering each question in turn. Select `svelte` as the framework and `svelte-ts` as the variant. When the CLI completes, you should have a basic runnable Svelte application.

Let's move into the project directory, where we'll set up our project.

```shell
cd fast-svelte
```

## Configuring packages

From your new project folder, run this command to install the FAST packages, along with supporting libraries.


```shell
npm install --save @microsoft/fast-components @microsoft/fast-foundation @microsoft/fast-element
```

## Adding configuration and source

Now that we have a Svelte project scaffolded, let's get things configured. 

In the root of your project folder, you will see a `tsconfig.js` file.  Replace the contents of the file with the following markup:

```js
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": false,
    "module": "esnext",
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "baseUrl": ".",
    /**
     * Typecheck JS in `.svelte` and `.js` files by default.
     * Disable checkJs if you'd like to use dynamic types in JS.
     * Note that setting allowJs false does not prevent the use
     * of JS in `.svelte` files.
     */
    "allowJs": true,
    "checkJs": true,
    "isolatedModules": true
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.js", "src/**/*.svelte"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Using the components

Open your `main.ts` file and replace the contents of the file with the following code:

```ts
import App from './App.svelte'

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

const app = new App({
  target: document.getElementById('app')
})

export default app
```

This code uses the FAST Design System to register the `<fast-card>` and `<fast-button>` components. Let's update our App.svelte file to use our components. Replace the contents of the file with the following markup:

```html
<main>
  <fast-card>
    <h2>Hello World!</h2>
    <fast-button appearance="accent">Click Me</fast-button>
  </fast-card>

</main>

<style>
  fast-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  h2 {
    color: white;
    font-size: var(--type-ramp-plus-5-font-size);
    line-height: var(--type-ramp-plus-5-line-height);
  }

  fast-card > fast-button {
    align-self: flex-end;
  }
</style>
```

With all the basic pieces in place, let's run our app in dev mode with `npm run dev`. The Svelte CLI should build your project and make it available on localhost.

Congratulations! You're now set up to use FAST, Svelte, Vite, and TypeScript. You can import and use more components, build your own components, and when you are ready, build and deploy your website or app to production.

See a FAST+Svelte+Vite+TypeScript starter project [here](../../../../../examples/vite-starters/vite-fast-typescript-starter/README.md).