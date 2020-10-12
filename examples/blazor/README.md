# Blazing FAST

A simple demo of Blazor and Fluent UI Web Components (built on FAST) working together. To see it in action, navigate to the Counter page and click the button. The button is a `fluent-button` with a Blazor event handler. The counter is displayed using a `fluent-badge`. Blazor provides the content of the button. It also binds the `appearance` attribute of the `fluent-badge` to a C# field which toggles between two `fluent-badge` `appearance` values depending on whether the field value is odd or even.

## FAST Integration

The core component library is referenced with a single script tag in the `index.html` file. It looks like this:

```html
<script type="module" src="https://unpkg.com/@fluentui/web-components"></script>
```

Additionally, we configure the design system in the `index.html` so that it applies to the entire application. That is done with this markup:

```html
<fluent-design-system-provider use-defaults>
    <app>Loading...</app>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="" class="reload">Reload</a>
        <a class="dismiss">🗙</a>
    </div>
</fluent-design-system-provider>
```

With this in place, the Fluent UI Web Components can be used throughout all Blazor views. Here's what the Counter page markup looks like:

```html
<h1>Counter</h1>

<p>
    Current count: 
    <fluent-badge appearance="@badgeAppearance">@currentCount</fluent-badge>
</p>

<fluent-button appearance="accent" @onclick="IncrementCount">Click me</fluent-button>
```

## Mac Debug with VS Code

Sometimes stopping the debugger leaves orphaned processes behind that prevent additional debug sessions from starting. To fix this, kill the process with the following command:

```shell
lsof -t -i tcp:5001 | xargs kill
```