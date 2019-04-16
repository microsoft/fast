# FAST App Shell React

`@microsoft/fast-app-shell-react` is a library intended to composite small applications into a ecosystem of experiences. It provides a shell UI and route management between registered applications.

## Usage

The package exports a single `AppShell` react component that can be used to register applications under a root domain:

```ts
const myAppConfig: AppShellApp = {
    name: "My application",
    id: "my-application",
    icon: <svg /*...*/ />
    rootPath: "my-application",
    render: <MyApplication />
}

function render(): JSX.Element {
    return <AppShell apps={[myAppConfig]} />
}
```

### Color mode

The color mode of the app can be set to either a *light-mode* or *dark-mode* by supplying a `colorMode` property to the `AppShell`:

```ts
import { AppShell, AppShellColorModes } from "@microsoft/fast-app-shell-react";

function render(): JSX.Element {
    return <AppShell apps={[/* ... */]} colorMode={AppShellColorModes.light} />
}

```
