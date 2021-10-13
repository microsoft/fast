---
id: vue
title: Vue
sidebar_label: Vue
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/vue.md
---

FAST works great with Vue. Let's take a look at how you can set up a Vue project, starting from scratch.

## Setting up the Vue project

First, you'll need to make sure that you have Node.js installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can run the following command to install the Vue CLI:

```shell
npm install -g @vue/cli
```

With the CLI installed, you have access to the `vue` command-line interface. This can be used to create a new Vue project. For example, to create a new Vue App named "fast-vue", you would use the following command:

```shell
vue create fast-vue
```

When prompted to select options, choose "Manually select features". Follow the prompts, answering each question in turn. It is recommended that you select "TypeScript" when prompted.

When the CLI completes, you should have a basic runnable Vue application.

## Configuring packages

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element
```

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm run serve`. The Vue CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML. Let's change that.

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

This code uses the FAST Design System to register the `<fast-card>` and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the HTML template in your  `components/HelloWorld.vue` file with the following markup:

```html
<template>
  <fast-card>
    <h2>{{msg}}</h2>
    <fast-button appearance="accent" v-on:click="onClick">Click Me</fast-button>
  </fast-card>
</template>
```

Replace your script tag with this:

```html
<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    onClick: function () {
      console.log('clicked!');
    }
  }
}
</script>
```

To add a splash of style, replace the `style` tag with this:

```html
<style scoped>
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
</style>
```

Congratulations! You're now set up to use FAST and Vue!
