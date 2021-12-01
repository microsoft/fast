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

## Getting Started with the FluentUI Web Components

FAST has special Blazor support for Microsoft's FluentUI Web Components. To get started using the Fluent UI Web Components for Blazor, you will first need to install [the official Nuget package for Fluent UI](https://www.nuget.org/packages/Microsoft.Fast.Components.FluentUI/). You can use the following command:

```shell
dotnet add package Microsoft.Fast.Components.FluentUI
```

Next, you need to add the web components script. You can either add the script from CDN directly, or you can install it with NPM, whichever you prefer.

To add the script from CDN use the following markup:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@fluentui/web-components/dist/web-components.min.js"></script>
```

The markup above always references the latest release of the components. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@fluentui/web-components@2.0.2/dist/web-components.min.js"></script>
```

The best place to put the script tag is typically in your index.html file in the script section at the bottom of the `<body>`.

If you wish to leverage NPM instead, run the following command:

```html
npm install --save @fluentui/web-components
```

You can locate the single file script build in the following location:

```html
node_modules/@fluentui/web-components/dist/web-components.min.js
```

Copy this to your `wwwroot/script` folder and reference it with a script tag as described above.

:::note
If you are setting up Fluent UI Web Components on a Blazor Server project, you will need to escape the `@` character by repeating it in the source link. For more information check out the [Razor Pages syntax documentation](/aspnet/core/mvc/views/razor).
:::

### Using the FluentUI Web Components

With the package installed and the script configured, you can begin using the Fluent UI Web Components in the same way as any other Blazor component. Just be sure to add the following using statement to your views:

```html
@using Microsoft.Fast.Components.FluentUI
```

Here's a small example of a `FluentCard` with a `FluentButton` that uses the Fluent "Accent" appearance:

```html
@using Microsoft.Fast.Components.FluentUI

<FluentCard>
    <h2>Hello World!</h2>
    <FluentButton Appearance="@Appearance.Accent">Click Me</FluentButton>
</FluentCard>
```

If you are using the .NET CLI, you can run your project with the following command from the project folder:

```shell
dotnet watch run
```

Congratulations! You're now set up to use the Fluent UI Web Components with Blazor!

### Configuring the Design System

The Fluent UI Web Components are built on FAST's Adaptive UI technology, which enables design customization and personalization, while automatically maintaining accessibility. This is accomplished through setting various "design tokens". The easiest way to accomplish this in Blazor is to wrap the entire UI in a `FluentDesignSystemProvider`. This special element has a number of properties you can set to configure the tokens to your desired settings. Here's an example of changing the "accent base color" and switching the system into dark mode:

```html
<FluentDesignSystemProvider AccentBaseColor="#6264A7" BaseLayerLuminance="0">
    <Router AppAssembly="@typeof(App).Assembly">
        <Found Context="routeData">
            <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
        </Found>
        <NotFound>
            <PageTitle>Not found</PageTitle>
            <LayoutView Layout="@typeof(MainLayout)">
                <p role="alert">Sorry, there's nothing at this address.</p>
            </LayoutView>
        </NotFound>
    </Router>
</FluentDesignSystemProvider>
```

:::note
Provider token attributes can be changed on-th-fly like any other Blazor component attribute.
:::

If you are attempting to configure the components for integration into a specific Microsoft product, the following table provides `AccentBaseColor` values you can use:

Product | AccentBaseColor
------- | ---------------
| Office | #D83B01 |
| Word | #185ABD |
| Excel | #107C41 |
| PowerPoint | #C43E1C |
| Teams | #6264A7 |
| OneNote | #7719AA |
| SharePoint | #03787C |
| Stream | #BC1948 |

For a list of all available token attributes, [see here](https://github.com/microsoft/fast-blazor/blob/main/src/Microsoft.Fast.Components.FluentUI/Components/FluentDesignSystemProvider.razor#L69). More examples for other components can be found in the `examples` folder [of this repository](https://github.com/microsoft/fast-blazor).

## Getting Started with the FAST Components

The FAST team also produces a second set of components with a more configurable design system, called FAST Frame. At this time, there isn't special Blazor support for these components, but they can still be used as normal HTML. To get started using the FAST Frame, you will first need to add a CDN script for `fast-components` use the following markup:

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

:::note
If you are setting up Fluent UI Web Components on a Blazor Server project, you will need to escape the `@` character by repeating it in the source link. For more information check out the [Razor Pages syntax documentation](/aspnet/core/mvc/views/razor).
:::

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