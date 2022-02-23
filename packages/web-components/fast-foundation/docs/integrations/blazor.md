---
id: blazor
title: Blazor
sidebar_label: Blazor
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/blazor.md
---

FAST works seamlessly with Blazor, including integration with Blazor's binding engine and components. Let's take a look at how to set things up.

## Setting up the Blazor project

First, you'll need to make sure that you have the .NET SDK installed. You can learn more and download that [on the official site](https://dotnet.microsoft.com/download).

With the SDK installed, you have access to the `dotnet` command-line interface. This can be used to create a new Blazor project. For example, to create a new Blazor App named "fast-blazor", you would use the following command:

```shell
dotnet new blazorwasm -o fast-blazor
```

Create a project using the command above if you don't already have one. When the CLI completes, you should have a basic runnable Blazor application. For more information on setting up and using Blazor, [see the official Blazor Getting Started guide](https://docs.microsoft.com/en-us/aspnet/core/blazor/get-started).

## Getting Started with the FAST Components

The FAST team produces a set of components with a configurable design system, called FAST Frame. At this time, there isn't special Blazor support for these components, but they can still be used as normal HTML. To get started using the FAST Frame, you will first need to add a CDN script for `fast-components` use the following markup:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components@2.16.0/dist/fast-components.min.js"></script>
```

The markup above always references the latest release of the components. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components/dist/fast-components.min.js"></script>
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
### Using the FAST Web Components

With your script tag added, you can use any component in any of your views. For example, you could put something like this in your `Index.razor` file:

```html
@page "/"

<fast-card>
  <h2>Hello World!</h2>
  <fast-button appearance="accent">Click Me</fast-button>
</fast-card>
```

For a splash of style, add the following to your `wwwroot/css/app.css` file:

```css
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

If you are using the .NET CLI, you can run your project with the following command from the project folder:

```shell
dotnet watch run
```

Congratulations! You're now set up to use FAST Components with Blazor!