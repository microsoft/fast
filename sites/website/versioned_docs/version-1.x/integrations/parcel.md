---
id: parcel
title: Parcel
sidebar_label: Parcel
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/integrations/parcel.md
description: FAST works great with TypeScript and Parcel, using a fairly standard setup. Let's take a look at how you can set up a FAST+Parcel+TypeScript project, starting from scratch.
keywords:
    - parcel
---

FAST works great with [Parcel][1] and TypeScript, using a fairly standard setup. Let's take a look at how you can set up a FAST+TypeScript+Parcel project, starting from scratch.

## Setting up the Parcel project

First, you'll need to make sure that you have **Node.js** version >=16.0.0 installed. You can learn more and download that [on the official site][2].

With Node.js installed, you should create a new folder, init a NPM project & install Parcel:

```shell
mkdir -p ~/Desktop/FAST-TypeScript-Parcel/src
cd ~/Desktop/FAST-TypeScript-Parcel
npm init -y
npm i parcel -D
```

Then, add an `src/index.html` file in the root of your project folder as following:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>FAST TypeScript Parcel</title>
    </head>
    <body></body>
</html>
```

In the end, just use one command, you should have a basic runnable Parcel application:

```shell
npx parcel src/index.html
```

## Configuring packages

Let's install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm i @microsoft/fast-components @microsoft/fast-foundation @microsoft/fast-element
```

## Adding configuration and source

Now that we have a Parcel project scaffolded, let's get things configured.

In the root of your project folder, you should create a `tsconfig.json` file with the following markup:

```json
{
    "compilerOptions": {
        "target": "ES6",
        "module": "ESNext",
        "moduleResolution": "Node",
        "useDefineForClassFields": true,
        "jsx": "react-jsx",
        "jsxImportSource": "dom-renderer",
        "lib": ["ESNext", "DOM"]
    },
    "include": ["src/**/*"]
}
```

some options above are optional:

-   `useDefineForClassFields`: only for [ES decorator][3] stage-3 syntax, such as [MobX][4] 6.11+
-   `jsx`: only for JSX engines, such React
-   `jsxImportSource`: only for non-React JSX engines, such as [WebCell][5]

If you use **ES decorator** stage-3 syntax, you must roll back from SWC to TSC for TS compiling nowadays. Just create a new file at the root of your project folder called `.parcelrc` with the following code:

```json
{
    "extends": "@parcel/config-default",
    "transformers": {
        "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
    }
}
```

then install Parcel plugins above manually:

```shell
npm i @parcel/config-default @parcel/transformer-typescript-tsc -D
```

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `npx parcel src/index.html`. The Parcel CLI should install required compilers/plugins, build your project and make it available on `http://localhost:1234`. Right now, it displays a blank page since we haven't added any code or interesting HTML. Let's change that.

First, create a `src/index.ts` file with the following code:

```ts
import {
    provideFASTDesignSystem,
    fastCard,
    fastButton,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(fastCard(), fastButton());
```

This code uses the FAST Design System to register the `<fast-card />` and `<fast-button />` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to update the HTML that uses our components. Replace the HTML template at the root of your folder with the following markup:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>FAST TypeScript Parcel</title>
        <link rel="stylesheet" href="src/index.less" />
        <script type="module" src="src/index.ts"></script>
    </head>
    <body>
        <fast-card>
            <h2>Hello World!</h2>
            <fast-button appearance="accent">Click Me</fast-button>
        </fast-card>
    </body>
</html>
```

Next, create a `src/index.less` file with the following code:

```less
:not(:defined) {
    visibility: hidden;
}

fast-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    h2 {
        color: white;
        font-size: var(--type-ramp-plus-5-font-size);
        line-height: var(--type-ramp-plus-5-line-height);
    }
    fast-button {
        align-self: flex-end;
    }
}
```

After saving your `src/index.less` file, your browser will automatically refresh and you should see a card with text and a button.

Congratulations! You're now set up to use FAST, TypeScript, and Parcel. You can import and use more components, build your own components, and when you are ready, build and deploy your website or app to production.

## Using tags in Markdown

As FAST tags are Web components, it's so easy to use them in Markdown files.

### Pure Markdown

You can transform the page content above into a new `index.md` file:

```markdown
# FAST TypeScript Parcel

<fast-card>
  <h2>Hello World!</h2>
  <fast-button appearance="accent">Click Me</fast-button>
</fast-card>
```

then update `src/index.ts` with the following code to import all the FAST tags:

```js
import { allComponents, provideFASTDesignSystem } from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);
```

and update `.parcelrc` to install [Parcel MDX transformer][6] plugin:

```json
{
    "extends": "@parcel/config-default",
    "transformers": {
        "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"],
        "*.{md,mdx}": ["parcel-transformer-mdx"]
    }
}
```

at the end, rename `src/index.ts` to `src/index.tsx` for rendering JSX:

```jsx
import { DOMRenderer } from "dom-renderer";
import { allComponents, provideFASTDesignSystem } from "@microsoft/fast-components";

import IndexPage from "./index.md";

provideFASTDesignSystem().register(allComponents);

const renderer = new DOMRenderer();

window.onload = () => renderer.render(<IndexPage />);
```

### Markdown with JSX (MDX)

If you want to only import needed tags in Markdown files, [MDX][7] is fit for you.

Just rename `src/index.md` to `src/index.mdx`, then update it with the follow code:

```mdx
import {
    provideFASTDesignSystem,
    fastCard,
    fastButton,
} from "@microsoft/fast-components";

export const _ = provideFASTDesignSystem().register(fastCard(), fastButton());

# FAST TypeScript Parcel

<fast-card>
    <h2>Hello World!</h2>
    <fast-button appearance="accent">Click Me</fast-button>
</fast-card>
```

[1]: https://parceljs.org/
[2]: https://nodejs.org/
[3]: https://github.com/tc39/proposal-decorators
[4]: https://mobx.js.org/
[5]: https://github.com/EasyWebApp/WebCell
[6]: https://github.com/EasyWebApp/Parcel-transformer-MDX
[7]: https://mdxjs.com/
