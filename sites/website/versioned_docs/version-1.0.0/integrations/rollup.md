---
id: rollup
title: Rollup
sidebar_label: Rollup
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/integrations/rollup.md
description: FAST works great with Rollup and TypeScript, using a standard setup. Let's take a look at how you can set up a FAST+Rollup+TypeScript project, starting from scratch.
keywords:
  - rollup
  - typescript
---

FAST works great with Rollup and TypeScript, using a standard setup. Let's take a look at how you can set up a FAST+Rollup+TypeScript project, starting from scratch.

## Setting up the package

First, let's make a directory for our new project. From the terminal:

```shell
mkdir fast-rollup
```

Next, let's move into that directory, where we'll set up our project:

```shell
cd fast-rollup
```

From here, we'll initialize npm:

```shell
npm init
```

Follow the prompts from npm, answering each question in turn. You can always accept the defaults at first and then make changes later in the `package.json` file.

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command:

```shell
npm install @microsoft/fast-components @microsoft/fast-element tslib --save
```

We also need to install the Rollup build tooling:

```shell
npm install rollup typescript @rollup/plugin-typescript @rollup/plugin-node-resolve rollup-plugin-cleaner rollup-plugin-copy rollup-plugin-serve rollup-plugin-terser --save-dev
```

## Adding configuration and source

Now that we've got our basic package and dependencies set up, let's create some source files and get things configured. Since we're going to be writing a bit of code, now is a great time to involve a code editor in the process. If you're looking for a great editor for TypeScript and front-end in general, we highly recommend [VS Code](https://code.visualstudio.com/).

Open the `fast-rollup` folder in your favorite editor. You should see your `package.json` along with a `package-lock.json` and a `node_modules` folder.

First, let's create a `src` folder where we'll put all our TypeScript code. In the `src` folder, add a `main.ts` file. You can leave the file empty for now. We'll come back to it in a bit.

Then, in the root of your project folder, add a `tsconfig.json` file to configure the TypeScript compiler. Here's an example starter config that you can put into that file:

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

You can learn more about `tsconfig.json` options in [the official TypeScript documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

:::note
Do not set `useDefineForClassFields` to `true` in your `tsconfig.json` if you are using decorators (e.g. `ExperimentalDecorators`). These two features conflict at present. This will be resolved in future versions of TypeScript and FAST.
:::

Next, create a `rollup.config.js` file in the root of your project folder with the following source:

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

Let's go over our config file:

- `input` specifies the entrypoint of our application.
- `output` defines the configuration for the JavaScript bundle that Rollup generates.
     - This is the script that gets loaded by our `index.html` file; in our case, it is `bundle.js`.
- `plugins` is where you can add additional functionality to Rollup.

Let's go over the plugins we're using:
- `transformTaggedTemplate` minifies content within tagged templates (e.g. html and css)
- `typescript` allows us to write our source files in TypeScript.
- `resolve` allows us to import modules installed from npm, like `@microsoft/fast-components`.
- `cleaner` will delete the `dist` folder before rebuilding.
     - This ensures `dist` remains up-to-date with our source code.
     - Without this plugin, Rollup would only add or overwrite files in the `dist` folder, but never delete them.
- `copy` will copy source files to our `dist` folder, ensuring everything we need for deploying our app is in one place.
- `serve` provides a development server that will open our application in the browser for us.
- `terser` will minify the generated es bundle.

Let's add some helpful commands to our `package.json` file. Find the `scripts` section of your `package.json` file and add the following lines:

```json
{
  "scripts": {
    "build": "rollup --config",
    "dev": "rollup --config --watch"
  }
}
```

- `npm run build`: running this command in the terminal will build our application into the `dist` folder, allowing us to run it locally or deploy it.

- `npm run dev`: running this command in the terminal does the same as `build`, except it will keep a process running that rebuilds our app whenever our source files change. Rollup will watch our entrypoint `main.ts` and any files that get imported from there.

To complete our setup, we need to add an `index.html` file to the root of our project. We'll start with some basic content as follows:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>FAST Rollup</title>
  </head>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
```

There's nothing special about the HTML yet, other than the `script` tag in the `body` that references the `bundle.js` file that our Rollup build will produce.

## Using the components

With all the basic pieces in place, let's run our app with `npm run build`. 

Rollup should build your project and open your default browser with your `index.html` page. Right now, it should be blank, since we haven't added any code or interesting HTML. Let's change that.

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

This code uses the FAST Design System to register the `<fast-card>` and `<fast-button>` components. To get some UI showing, we need to write some HTML that uses our components. 

Replace the contents of the `<body>` in your `index.html` file with the following markup:

```html
<body>
  <fast-card>
    <h2>Hello World!</h2>
    <fast-button appearance="accent">Click Me</fast-button>
  </fast-card>
  <style>
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
  </style>
  <script src="/bundle.js"></script>
</body>
```

After saving your `index.html` file, run `npm run build` again, and you should see a card with text and a button.

Congratulations! You're now set up to use FAST, Rollup, and TypeScript. You can import and use more components, build your own components, and when you are ready, build and deploy your website or app to production.