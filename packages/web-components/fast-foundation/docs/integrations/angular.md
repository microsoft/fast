---
id: angular
title: Angular
sidebar_label: Angular
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/angular.md
description: FAST integrates nicely with Angular. Let's take a look at how you can set up an Angular project, starting from scratch.
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
npm install --save @microsoft/fast-components @microsoft/fast-element
```

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `ng serve --open`. The Angular CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:

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

This code uses the FAST Design System to register `<fast-card>`, `<fast-button>` and `<fast-text-field>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the HTML template in your `app/app.component.html` file with the following markup:

```html
<fast-card>
  <h2>{{title}}</h2>
  <fast-text-field [(ngModel)]='exampleTextField' name='exampleTextField' ngDefaultControl placeholder="Enter Some Text"></fast-text-field>
  <fast-button appearance="accent" (click)="onClick()">Click Me</fast-button>
</fast-card>
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
  
  exampleTextField = '';

  onClick() {
    console.log(this.exampleTextField);
  }
}
```

To allow an NgModule to contain Non-Angular element names, add the following code in your `app/app.module.ts` file:

```ts 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
}) 
```

Moreover the "[(ngModel)]" might give you warnings that "Event can't be assigned to String", this can be fixed by importing FormsModule in the `app/app.module.ts` file like below which contains the above Code too for completeness: 
```ts 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
```
To add a splash of style, replace the `app/app.component.css` file contents with this:

```css
fast-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

fast-text-field {
  margin-bottom: 12px;
}

h2 {
  font-size: var(--type-ramp-plus-5-font-size);
  line-height: var(--type-ramp-plus-5-line-height);
}

fast-card > fast-button {
  align-self: flex-end;
}
```

:::note

Third party controls require a ControlValueAccessor for writing a value and listening to changes on input elements. Add ngDefaultControl attribute to your component to have two-way binding working with FormControlDirective, FormControlName, or NgModel directives:

:::

```html
<fast-text-field placeholder="name" id="name" formControlName="name" ngDefaultControl></fast-text-field>
```

Congratulations! You're now set up to use FAST and Angular!
