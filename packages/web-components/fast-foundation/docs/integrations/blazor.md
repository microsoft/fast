---
id: blazor
title: Blazor
sidebar_label: Blazor
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/blazor.md
description: FAST works seamlessly with Blazor, including integration with Blazor's binding engine and components. Let's take a look at how to set things up.
keywords:
  - blazor
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

If you are setting up Fluent UI Web Components on a Blazor Server project, you will need to escape the `@` character by repeating it in the source link. For more information check out the [Razor Pages syntax documentation](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor?view=aspnetcore-6.0).

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

:::tip
 
You can add `@using Microsoft.Fast.Components.FluentUI` to the namespace collection in `_Imports.razor`, so that you can avoid repeating it in every single razor page.
 
:::

If you are using the .NET CLI, you can run your project with the following command from the project folder:

```shell
dotnet watch run
```

Congratulations! You're now set up to use the Fluent UI Web Components with Blazor!
### Configuring the Design System

The Fluent UI Web Components are built on FAST's Adaptive UI technology, which enables design customization and personalization, while automatically maintaining accessibility. This is accomplished through setting various "Design Tokens". As of version 1.4 you can use all of the (160) individual Design Tokens, both from code as in a declarative way in your `.razor` pages. See https://docs.microsoft.com/en-us/fluent-ui/web-components/design-system/design-tokens for more information on how Design Tokens work

#### Option 1: Using Design Tokens from C# code

Given the following `.razor` page fragment:
```html
<FluentButton @ref="ref1" Appearance="Appearance.Filled">A button</FluentButton>
<FluentButton @ref="ref2" Appearance="Appearance.Filled">Another button</FluentButton>
<FluentButton @ref="ref3" Appearance="Appearance.Filled">And one more</FluentButton>
<FluentButton @ref="ref4" Appearance="Appearance.Filled" @onclick=OnClick>Last button</FluentButton>

```
You can use Design Tokens to manipulate the styles from C# code as follows:

```csharp
[Inject]
private BaseLayerLuminance BaseLayerLuminance { get; set; } = default!;

[Inject]
private AccentBaseColor AccentBaseColor { get; set; } = default!;

[Inject]
private BodyFont BodyFont { get; set; } = default!;

[Inject]
private StrokeWidth StrokeWidth { get; set; } = default!;

[Inject]
private ControlCornerRadius ControlCornerRadius { get; set; } = default!;

private FluentButton? ref1;
private FluentButton? ref2;
private FluentButton? ref3;
private FluentButton? ref4;

protected override async Task OnAfterRenderAsync(bool firstRender)
{
	if (firstRender)
	{
		//Set to dark mode
		await BaseLayerLuminance.SetValueFor(ref1!.Element, (float)0.15);

		//Set to Excel color
		await AccentBaseColor.SetValueFor(ref2!.Element, "#185ABD".ToColor());

		//Set the font
		await BodyFont.SetValueFor(ref3!.Element, "Comic Sans MS");

		//Set 'border' width for ref4
		await StrokeWidth.SetValueFor(ref4!.Element, 7);
		//And change conrner radius as well
		await ControlCornerRadius.SetValueFor(ref4!.Element, 15);

		StateHasChanged();
	}

}

public async Task OnClick()
{
	//Remove the wide border
	await StrokeWidth.DeleteValueFor(ref4!.Element);
}
```
As can be seen in the code above (with the `ref4.Element`), it is posible to apply multiple tokens to the same component. 

For Design Tokens that work with a color value, it is needed to add the `ToColor()` extension method on the string value. This converts the string into a RGB value that the Design Token can operate with. Internally we are using the `System.Drawing.Color` struct for this and this means you can use all the available methods, operators, etc from that namespace in your code too.

:::important

The Design Tokens are manipulated through JavaScript interop working with an `ElementReference`. There is no JavaScript element until after the component is rendered. This means you can only work with the Design Tokens from code after the component has been rendered in `OnAfterRenderAsync` and not in any earlier lifecycle methods. 

:::

#### Option 2: Using Design Tokens as components
The Design Tokens can also be used as components in a `.razor` page directely. It looks like this:

```html
<BaseLayerLuminance Value="(float?)0.15">
	<FluentCard BackReference="@context">
		<div class="contents">
			Dark
			<FluentButton Appearance="Appearance.Accent">Accent</FluentButton>
			<FluentButton Appearance="Appearance.Stealth">Stealth</FluentButton>
			<FluentButton Appearance="Appearance.Outline">Outline</FluentButton>
			<FluentButton Appearance="Appearance.Lightweight">Lightweight</FluentButton>
		</div>
	</FluentCard>
</BaseLayerLuminance>
```

To make this work, a link needs to be created between the Design Token component and its child components. This is done with the `BackReference="@context"` construct. 

:::note
 
Only one Design Token component at a time can be used this way. If you need to set more tokens, use the code approach as described in Option 1 above.

:::


#### Option 3: Using the `<FluentDesignSystemProvider>`
The third way to customize the design in Blazor is to wrap the entire block you want to manipulate in a `<FluentDesignSystemProvider>`. This special element has a number of properties you can set to configure a subset of the tokens. **Not all tokens are available/supported** and we recommend this to only be used as a fall-back mechanism. The preferred mehod of working with the desgn tokens is to manipulate them from code as described in option 1. 

Here's an example of changing the "accent base color" and switching the system into dark mode (in the file `app.razor`):

```html
<FluentDesignSystemProvider AccentBaseColor="#464EB8" BaseLayerLuminance="0">
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

Provider token attributes can be changed on-the-fly like any other Blazor component attribute.

:::

#### Colors for integration with specific Microsoft products
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

##  Web components / Blazor components mapping, implementation status and remarks
Web component | Blazor component | Status | Remarks
----------------- | -------------- | ------ | -------
|[`<fluent-accordion>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/accordion)|`<FluentAccordion>`|✔️|-|
|`<fluent-accordion-item>`|`<FluentAccordionItem>`|✔️|-|
|[`<fluent-anchor>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/anchor)|`<FluentAnchor>`|✔️|-|
|[`<fluent-anchored-region>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/anchored-region)|`<FluentAnchoredRegion>`|✔️|-|
|[`<fluent-badge>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/badge)|`<FluentBadge>`|✔️|-|
|[`<fluent-breadcrumb>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/breadcrumb)|`<FluentBreadcrumb>`|✔️|-|
|`<fluent-breadcrumb-item>`|`<FluentBreadcrumbItem>`|✔️|-|
|[`<fluent-button>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/button)|`<FluentButton>`|✔️|-|
|[`<fluent-card>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/card)|`<FluentCard>`|✔️|-|
|[`<fluent-checkbox>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/checkbox)|`<FluentCheckbox>`|✔️|-|
|[`<fluent-combobox>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/combobox)|`<FluentCombobox>`|✔️|-|
|[`<fluent-data-grid>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/grid)|`<FluentDataGrid>`|✔️|-|
|`<fluent-data-grid-cell>`|`<FluentDataGridCell>`|✔️|-|
|`<fluent-data-grid-row>`|`<FluentDataGridRow>`|✔️|-|
|[`<fluent-design-system-provider>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/provider)|`<FluentDesignSystemProvider>`|✔️|-|
|[`<fluent-dialog>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/dialog)|`<FluentDialog>`|✔️|-|
|[`<fluent-divider>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/divider)|`<FluentDivider>`|✔️|-|
|[`<fluent-flipper>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/flipper)|`<FluentFlipper>`|✔️|-|
|[`<fluent-horizontal-scroll>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/horizontal-scroll)|`<FluentHorizontalScroll>`|✔️|-|
|No web component|`<FluentIcon>`|✔️|-|
|[`<fluent-listbox>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/listbox)|`<FluentListbox>`|✔️|-|
|[`<fluent-menu>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/menu)|`<FluentMenu>`|✔️|-|
|`<fluent-menu-item>`|`<FluentMenuItem>`|✔️|-|
|[`<fluent-number-field>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/number-field)|`<FluentNumberField>`|✔️|-|
|`<fluent-option>`|`<FluentOption>`|✔️|-|
|[`<fluent-progress>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/progress)|`<FluentProgress>`|✔️|-|
|[`<fluent-progress-ring>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/progress-ring)|`<FluentProgressRing>`|✔️|-|
|[`<fluent-radio>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/radio-group)|`<FluentRadio>`|✔️|-|
|[`<fluent-radio-group>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/radio-group)|`<FluentRadioGroup>`|✔️|-|
|[`<fluent-select>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/select)|`<FluentSelect>`|✔️|-|
|[`<fluent-skeleton>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/skeleton)|`<FluentSkeleton>`|✔️|-|
|[`<fluent-slider>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/slider)|`<FluentSlider>`|✔️|-|
|`<fluent-slider-label>`|`<FluentSliderLabel>`|✔️|-|
|[`<fluent-switch>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/switch)|`<FluentSwitch>`|✔️|-|
|[`<fluent-tabs>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/tabs)|`<FluentTabs>`|✔️|-|
|`<fluent-tab>`|`<FluentTab>`|✔️|-|
|`<fluent-tab-panel>`|`<FluentTabPanel>`|✔️|-|
|[`<fluent-text-area>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/text-area)|`<FluentTextArea>`|✔️|-|
|[`<fluent-text-field>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/text-field)|`<FluentTextField>`|✔️|-|
|[`<fluent-toolbar>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/toolbar)|`<FluentToolbar>`|✔️|-|
|[`<fluent-tooltip>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/tooltip)|`<FluentTooltip>`|✔️|-|
|[`<fluent-tree-view>`](https://docs.microsoft.com/en-us/fluent-ui/web-components/components/tree-view)|`<FluentTreeView>`|✔️|-|
|`<fluent-tree-item>`|`<FluentTreeItem>`|✔️|-|
