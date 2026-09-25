# FAST Router

The `@microsoft/fast-router` package contains a history-based navigation and routing solution designed around Web Components. By using `fast-router`, you can create multi-page and full application experiences. The router works with any Web Components, but has special support for Web Components built on FAST.

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

## Configuration at a Glance

The router is currently in `alpha` while we address a few bugs, finish up some final polish, and write the full documentation. Below is a quick sample of how to configure the router, to help get you going while we complete the full documentation.

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