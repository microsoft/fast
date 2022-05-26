# FAST Router

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-router.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-router)

The `fast-router` package contains a history-based navigation and routing solution designed around web components. By using `fast-router`, you can create multi-page and full application experiences.

## Installation

### From NPM

To install the `fast-router` library, use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-router
```

```shell
yarn add @microsoft/fast-router
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { FASTRouter } from '@microsoft/fast-router';
```

Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](https://fast.design/docs/integrations/introduction).

### From CDN

A pre-bundled script that contains all APIs needed to use FAST Router and FAST Element is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module">
          import { FASTRouter } from "https://cdn.jsdelivr.net/npm/@microsoft/fast-router/dist/fast-router.min.js";

          // your code here
        </script>
    </head>
    <!-- ... -->
</html>
```

The markup above always references the latest release. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-router@0.2.11/dist/fast-router.min.js"></script>
```

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::

## Configuration at a Glance

#### A Sample Route Configuration

```ts
import { RouterConfiguration, Route } from '@microsoft/fast-router';
import { HomeScreen } from './home';
import { AccountLogin } from './account/login';
import { AccountSignup } from './account/signup';
import { ConfirmEmail } from './account/confirm-email';
import { Session } from './account/session';
import { AccountSettings } from './account/settings';
import { StoreArea } from './store/store-area';
import { NotFound } from './not-found';
import { pageLayout } from './layouts/page-layout';
import { anonymousLayout } from './layouts/anonymous-layout';

type RouteSettings = {
  public?: boolean
};

export class AppRouterConfiguration extends RouterConfiguration<RouteSettings> {
  public configure() {
    this.title = 'My App';
    this.defaultLayout = pageLayout;
    this.routes.map(
      { path: '', redirect: 'home' },
      { path: 'home', title: 'Home', element: HomeScreen },
      { 
        path: 'account', 
        layout: anonymousLayout, 
        title: 'Account',
        settings: { public: true }, 
        children: [
          { path: "login", title: 'Login', element: AccountLogin, name: 'login' },
          { path: 'signup' title: 'Signup', element: AccountSignup },
          { path: 'confirm/{confirmation:Confirmation}', title: 'Confirm', element: ConfirmEmail },
          { path: 'settings', title: 'Settings', element: AccountSettings, layout: pageLayout, settings: { public: false } },
        ] 
      },
      { path: 'store', title: 'Store', element: StoreArea, childRouters: true },
      { path: 'not-found', title: 'Not Found', element: NotFound }
    );

    this.routes.fallback(
      () => Session.isLoggedIn
        ? { redirect: 'not-found' }
        : { redirect: 'login' }
    );

    this.routes.converter("Confirmation", async (confirmationId) => {
      // ...fetch confirmation from web service...
      return confirmation;
    });

    this.contributors.push({
      navigate(phase) {
        const settings = phase.route.settings;
  
        if (settings && settings.public) {
          return;
        }
  
        if (Session.loggedIn) {
          return;
        }
  
        phase.cancel(() => {
          Session.returnUrl = Route.path.current;
          Route.name.replace(phase.router, 'login');
        });
      }
    });
  }
}
```

#### Using the Configuration with a Router

```ts
import { FASTElement, customElement, html, css } from '@microsoft/fast-element';
import { FASTRouter } from '@microsoft/fast-router';
import { AppRouterConfiguration } from './routes';

FASTRouter;

const template = html<MainApplication>`
    <fast-router :config=${x => x.routerConfiguration}></fast-router>
`;

const styles = css`
  :host {
    contain: content;
  }

  :host, fast-router {  
    display: block;
    width: 100%;
    height: 100%;
  }
`;

@customElement({
  name: 'main-application',
  template,
  styles
})
export class MainApplication extends FASTElement {
  routerConfiguration = new AppRouterConfiguration();
}
```