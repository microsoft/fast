---
id: ember
title: Ember
sidebar_label: Ember
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/ember.md
description: FAST and Ember work great together. Let's take a look at how you can set up an Ember project, starting from scratch.
keywords:
  - ember
---

FAST and Ember work great together. Let's take a look at how you can set up an Ember project, starting from scratch.

## Setting up the Ember project

First, you'll need to make sure that you have Node.js installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can run the following command to install the Ember CLI:

```shell
npm install -g ember-cli
```

With the CLI installed, you have access to the `ember` command-line interface. This can be used to create a new Ember project. For example, to create a new Ember App named "fast-ember", you would use the following command:

```shell
ember new fast-ember --lang en
```

When the CLI completes, you should have a basic runnable Ember application.

## Configuring packages

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element
```

## Using the components

With all the basic pieces in place, let's run our app with `npm start`. The Ember CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `app/app.js` file and add the following code:

```ts
import { 
  provideFASTDesignSystem, 
  fastCard, 
  fastButton,
  fastTextField
} from '@microsoft/fast-components';

provideFASTDesignSystem()
    .register(
        fastCard(),
        fastButton(),
        fastTextField()
    );
```

This code uses the FAST Design System to register `<fast-card>`, `<fast-button>` and `<fast-text-field>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. Open your `application.hbs` file and replace the `<WelcomePage />` component with the following HTML and then save again.

```html
<fast-card>
  <h2>FAST Ember</h2>
  <fast-text-field placeholder="Enter Some Text"></fast-text-field>
  <fast-button appearance="accent">Click Me</fast-button>
</fast-card>
```

Now you should see the FAST web components displayed in your Ember application. 

Next, let's improve this by refactoring this code into a component. Stop the CLI and run the following command to scaffold an Ember component.

```shell
ember generate component fast-demo
```

Copy the the HTML above and use it to replace the HTML in your `app/components/fast-demo.hbs` file. Next replace the same HTML in your `templates/application.hbs` file with the following Ember component use:

```html
<FastDemo/>
```

Run `npm start` again and you should see the same output, but now we have moved our web components into a `FastDemo` Ember component.

Let's go a little further. Create a `fast-demo.js` file in the same folder as your `fast-demo.hbs` file and paste the following code:

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FastDemoComponent extends Component {
  @tracked exampleTextField = '';

  @action
  onClick() {
    console.log(this.exampleTextField);
  }

  @action
  onInput(event) {
    this.exampleTextField = event.target.value;
  }
}
```

Next, update the `fast-demo.hbs` file with the following HTML:

```html
<fast-card>
  <h2>FAST Ember</h2>
  <fast-text-field placeholder="Enter Some Text"
                   value="{{this.exampleTextField}}"
                   {{on "input" this.onInput}}
  ></fast-text-field>
  <fast-button appearance="accent" {{on "click" this.onClick}}>Click Me</fast-button>
</fast-card>
```

With this code in place, you now have FAST Web Components fully binding to data and handling user interactions, all from inside an Ember component.

Congratulations! You're now set up to use FAST and Ember!
