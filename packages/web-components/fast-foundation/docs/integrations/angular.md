---
id: angular
title: Angular
sidebar_label: Angular
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/angular.md
---

FAST integrates nicely with Angular. Let's take a look at how you can set up an Angular project, starting from scratch.

## Setting up the Angular project

First, you'll need to make sure that you have Node.js installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can run the following command to install the Angular CLI:

```shell
npm install -g @angular/cli
```

With the CLI installed, you have access to the `ng` command-line interface. This can be used to create a new Angular project. For example, to create a new Angular App named "fast-angular", you would use the following command:

```shell
ng new fast-angular
```

Follow the prompts, answering each question in turn. When the CLI completes, you should have a basic runnable Angular application.

## Configuring packages

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element lodash-es
```

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `ng serve --open`. The Angular CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:

```ts
import { 
  FASTDesignSystemProvider, 
  FASTCard, 
  FASTButton 
} from '@microsoft/fast-components';

/*
 * Ensure that tree-shaking doesn't remove these components from the bundle.
 * There are multiple ways to prevent tree shaking, of which this is one.
 */
FASTDesignSystemProvider;
FASTCard;
FASTButton;
```

This code imports the `<fast-design-system-provider>` component as well as the `<fast-card>`, and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the HTML template in your `app/app.component.html` file with the following markup:

```html
<template>
  <fast-design-system-provider use-defaults>
    <fast-card>
      <h2>{{title}}</h2>
      <fast-button appearance="accent" (click)="onClick()">Click Me</fast-button>
    </fast-card>
  </fast-design-system-provider>
</template>
```

Replace the code in your `app/app.component.ts` file contents with this:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fast-angular';

  onClick() {
    console.log('clicked!');
  }
}
```

To add a splash of style, replace the `app/app.component.css` file contents with this:

```css
fast-design-system-provider {
  display: block;
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

Congratulations! You're now set up to use FAST and Angular!
