---
id: vite
title: Vite
sidebar_label: Vite
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/integrations/vite.md
description: FAST works great with TypeScript and Vite, using a fairly standard setup. Let's take a look at how you can set up a FAST+Vite+TypeScript project, starting from scratch.
keywords:
  - vite
---

FAST works great with Vite and TypeScript, using a fairly standard setup. Let's take a look at how you can set up a FAST+TypeScript+Vite project, starting from scratch.
## Setting up the Vite project

First, you'll need to make sure that you have Node.js version >=12.2.0 installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can use [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) to scaffold a new Vite project.

```shell
npm create vite@latest
```

Follow the prompts, answering each question in turn. Enter `fast-vite` as the project name, select `vanilla` as the framework, and `vanilla-ts` as the variant. When the CLI completes, you should have a basic runnable Vite application.

Next, we'll move into the project directory, where we'll set up our project.

```shell
cd fast-vite
```

## Configuring packages

Let's install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-foundation @microsoft/fast-element
```

## Adding configuration and source

Now that we have a Vite project scaffolded, let's get things configured. 

In the root of your project folder, you will see a `tsconfig.js` file.  Replace the contents of the file with the following markup:

```js
{
  "compilerOptions": {
    "module": "esnext",
    "lib": ["es2017", "dom"],
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noImplicitAny": false,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": false
  },
  "include": ["src/*/.ts"]
}
```

Then, create a new file at the root of your project folder called `vite.config.js` and add the following code:

```js
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^@microsoft\/fast-(element|components)/
    }
  }
})
```
## Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm run dev`. The Vite CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and replace the contents of the file with the following code:

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

This code uses the FAST Design System to register the `<fast-card>` and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to update the HTML that uses our components. Replace the HTML template at the root of your folder with the following markup:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>FAST Vite</title>
    <script type="module" src="/src/main.ts"></script>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <fast-card>
      <h2>Hello World!</h2>
      <fast-button appearance="accent">Click Me</fast-button>
    </fast-card>
  </body>
</html>
```

Next, replace the contents of your `src/style.css` file with the following code:

```css
:not(:defined) {
  visibility: hidden;
}

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
```

After saving your `style.css` file, your browser will automatically refresh and you should see a card with text and a button.

Congratulations! You're now set up to use FAST, TypeScript, and Vite. You can import and use more components, build your own components, and when you are ready, build and deploy your website or app to production.

See a FAST+Vite+TypeScript starter project [here](../../../../examples/vite-starters/vite-fast-typescript-starter/README.md).