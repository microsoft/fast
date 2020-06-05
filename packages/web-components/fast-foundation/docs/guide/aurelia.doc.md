---
id: aurelia
title: Aurelia
sidebar_label: Aurelia
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/docs/guide/aurelia.doc.md
---

FAST-DNA works flawlessly with both Aurelia 1 and Aurelia 2, with full integration into the binding engine and component model. Let's take a look at how you can set up an Aurelia project, starting from scratch.

## Aurelia 2

### Setting up the Aurelia 2 Project

First, you'll need to make sure that you have Node.js installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can run the following command to create a new Aurelia 2 project:

```shell
npx makes Aurelia
```

Follow the prompts, answering each question in turn. It is recommended that you select the "Default TypeScript Aurelia 2 App" when prompted, unless you have previous experience with the CLI. Be sure to choose to install dependencies when asked.

When the CLI completes, you should have a basic runnable Aurelia 2 application.

### Configuring Packages

Next, we'll install the FAST-DNA packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element lodash-es
```

## Using the Components

With all the basic pieces in place, let's run our app in dev mode with `npm start`. Webpack should build your project and open your default browser with your `index.html` page. Right now, it should only have a hello message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:

```ts
import { 
  FASTDesignSystemProvider, 
  FASTCard, 
  FASTButton 
} from '@microsoft/fast-components';

FASTDesignSystemProvider;
FASTCard;
FASTButton;
```

This code imports the `<fast-design-system-provider>` component as well as the `<fast-card>`, and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace your `my-app.html` file with the following markup:

```html
<fast-design-system-provider use-defaults>
  <fast-card>
    <h2>${message}</h2>
    <fast-button appearance="accent" click.trigger="onClick()">Click Me</fast-button>
  </fast-card>
</fast-design-system-provider>
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
fast-design-system-provider {
  display: inline-block;
  color: var(--neutral-foreground-rest);
}

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

Congratulations! You're now setup to use FAST-DNA and Aurelia 2!

## Aurelia 1

### Setting up the Aurelia 1 Project

First, you'll need to make sure that you have Node.js installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can run the following command to install the Aurelia 1 CLI:

```shell
npm install -g aurelia-cli
```

And then use the CLI like this:

```shell
au new fast-aurelia
```

Follow the prompts, answering each question in turn. It is recommended that you select the "Default TypeScript App" when prompted, unless you have previous experience with the CLI. Be sure to choose to install dependencies when asked.

When the CLI completes, you should have a basic runnable Aurelia 1 application.

### Configuring Packages

Next, we'll install the FAST-DNA packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element lodash-es
```

## Using the Components

With all the basic pieces in place, let's run our app in dev mode with `npm start`. Webpack should build your project and make it available at `http://localhost:8080/`. If you visit this address it should only have a hello message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:

```ts
import { 
  FASTDesignSystemProvider, 
  FASTCard, 
  FASTButton 
} from '@microsoft/fast-components';

FASTDesignSystemProvider;
FASTCard;
FASTButton;
```

This code imports the `<fast-design-system-provider>` component as well as the `<fast-card>`, and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace your `app.html` file with the following markup:

```html
<template>
  <fast-design-system-provider use-defaults>
    <fast-card>
      <h2>${message}</h2>
      <fast-button appearance="accent" click.trigger="onClick()">Click Me</fast-button>
    </fast-card>
  </fast-design-system-provider>
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
  fast-design-system-provider {
    display: inline-block;
    color: var(--neutral-foreground-rest);
  }

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

Congratulations! You're now setup to use FAST-DNA and Aurelia 1!