---
id: aspnet
title: ASP.NET
sidebar_label: ASP.NET
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/aspnet.md
---

FAST works naturally with ASP.NET server-side development, by simply adding a script tag and using the custom HTML elements. Let's take a look at how to set things up.

## Setting up the ASP.NET project

First, you'll need to make sure that you have the .NET SDK installed. You can learn more and download that [on the official site](https://dotnet.microsoft.com/download).

With the SDK installed, you have access to the `dotnet` command-line interface. This can be used to create a new ASP.NET project. For example, to create a new ASP.NET Core MVC Web App named "fast-aspnet", you would use the following command:

```shell
dotnet new mvc -o fast-aspnet
```

Create a project using the command above if you don't already have one. When the CLI completes, you should have a basic runnable ASP.NET Core MVC application.

## Configuring scripts

Now that we've got our basic project setup, we need to add our web components script and update ASP.NET accordingly. You can either add the script from our CDN directly, or you can install it with NPM and then add that.

To add a CDN script for `fast-components` use the following markup:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components/dist/fast-components.min.js"></script>
```

The markup above always references the latest release of the components. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components@2.16.0/dist/fast-components.min.js"></script>
```

The best place to put this is typically in your `_Layout.cshtml` file in the script section at the bottom of the `<body>`.

If you wish to leverage NPM instead, run the following command:

```shell
npm install --save @microsoft/fast-components
```

You can locate the single file script build in the following location:

```shell
node_modules/@microsoft/fast-components/dist/fast-components.min.js
```

Copy this to your `wwwroot/js` folder and reference it with a script tag as described above.

Should you wish to go one step further and leverage a client-side bundler, such as Webpack, there is some additional setup to integrate with ASP.NET that is beyond the scope of this tutorial. Basic Webpack instructions for FAST can be found [here](./webpack). The most important detail with respect to FAST is that you'll want to install a few more packages. Use the following command if this is your preferred setup:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element
```

In this case, because Webpack can tree-shake unused components, you'll also want to be sure to register the components you want to use somewhere in your own JavaScript code. See [our Webpack guide](./webpack) for an example.

## Using the components

With your script tag added (or your client bundle in place), you can use any component in any of your views. For example, you could put something like this in your `Index.cshtml` file:

```html
@{
    ViewData["Title"] = "Home Page";
}

<fast-card>
  <h2>@ViewData["Title"]</h2>
  <fast-button id="button" appearance="accent">Click Me</fast-button>
</fast-card>
```

For a splash of style, add the following to your `wwwroot/css/site.css` file:

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
  font-size: var(--type-ramp-plus-5-font-size);
  line-height: var(--type-ramp-plus-5-line-height);
}

#button {
  align-self: flex-end;
}
```

Congratulations! You're now set up to use FAST with ASP.NET. You can use more components, build your own components, and when you are ready, build and deploy your website or app to production.
