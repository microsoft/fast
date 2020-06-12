---
id: blazor
title: Blazor
sidebar_label: Blazor
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/docs/guide/blazor.doc.md
---

FAST-DNA works seamlessly with Blazor, including integration with Blazor's binding engine and components. Let's take a look at how to set things up.

## Setting up the Blazor Project

First, you'll need to make sure that you have the .NET SDK installed. You can learn more and download that [on the official site](https://dotnet.microsoft.com/download).

With the SDK installed, you have access to the `dotnet` command line interface. This can be used to create a new Blazor project. For example, to create a new Blazor App named "fast-blazor", you would use the following command:

```shell
dotnet new blazorwasm -o fast-blazor
```

Create a project using the command above if you don't already have one. When the CLI completes, you should have a basic runnable Blazor application. For more information on setting up and using Blazor, [see the official Blazor Getting Started guide](https://docs.microsoft.com/en-us/aspnet/core/blazor/get-started).

## Configuring Scripts

Now that we've got our basic project setup, we need to add our web components script and update Blazor accordingly. You can either add the script from our CDN directly, or you can install it with NPM and then add that.

To add a CDN script for `fast-components` use the following markup:

```html
<script type="module" src="...TODO..."></script>
```

The best place to put this is typically in your `index.html` file in the script section at the bottom of the `<body>`.

If you wish to leverage NPM instead, run the following command:

```shell
npm install --save @microsoft/fast-components
```

You can locate the single file script build in the following location:

```shell
node_modules/@microsoft/fast-components/dist/fast-components.min.js
```

Copy this to your `wwwroot/script` folder and reference it with a script tag as described above.

## Using the Components

Regardless of which path you've chosen above, you should be all set to start using the components. The first component we want to set up is the `<fast-design-system-provider>` component. This configures the design system that will govern the appearance of all of the components. The best place to put this is at the root of your app, wrapping all your HTML. Here's an example of what your `index.html` `<body>` might look like:

```html
<body>
  <fast-design-system-provider use-defaults>
    <app>Loading...</app>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="" class="reload">Reload</a>
        <a class="dismiss">🗙</a>
    </div>
  </fast-design-system-provider>

  <script src="_framework/blazor.webassembly.js"></script>
  <script type="module" src="script/fast-components.min.js"></script>
</body>
```

With this in place, you can use any component in any of your views. For example, you could put something like this in your `Index.razor` file:

```html
@page "/"

<fast-card>
  <h2>Hello World!</h2>
  <fast-button appearance="accent">Click Me</fast-button>
</fast-card>
```

For a splash of style, add the following to your `wwwroot/css/app.css` file:

```css
fast-design-system-provider {
  display: inline-block;
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

Congratulations! You're now setup to use FAST-DNA with Blazor!
