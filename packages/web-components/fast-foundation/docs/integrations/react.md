---
id: react
title: React
sidebar_label: React
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/react.md
---

FAST can be used in React applications. Let's take a look at how you can set up an Project project, starting from scratch.

## Setting up the React project

First, you'll need to make sure that you have Node.js >= 8.2 and npm >= 5.6 are installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can use [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) to create a new React project.

```shell
npx create-react-app fast-app
```

## Configuring packages

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element lodash-es
```

## Configure create-react-app
[create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) ships with a [eslint](https://eslint.org/) rule that makes working with FAST components difficult. There are two changes that will need to be made in the `package.json`:

**Set the EXTEND_ESLINT environment variable in start, build, and test scripts**
```json
{
    //...
    "scripts": {
        "start": "EXTEND_ESLINT=true react-scripts start",
        "build": "EXTEND_ESLINT=true react-scripts build",
        "test": "EXTEND_ESLINT=true react-scripts test"
    }
    // ...
}
```

**Override the `eslintConfig` field to turn off the 'no-unused-expressions' rule**
```json
{
    //..
    "eslintConfig": {
        "extends": "react-app",
        "rules": {
            "no-unused-expressions": "off"
        }
    },
    //..
}
```
See [configuring eslint](https://create-react-app.dev/docs/setting-up-your-editor#experimental-extending-the-eslint-config) for more information.

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm start`. Right now, it displays the React logo and some editing instructions, since we haven't added any code or interesting HTML.Let's change that.

First, open your `src/app.js` file and add the following code:

```ts
import { 
  FASTDesignSystemProvider, 
  FASTCard, 
  FASTButton 
} from '@microsoft/fast-components';

/*
 * Ensure that tree-shaking doesn't remove these components from the bundle.
 * There are multiple ways to prevent tree shaking, of which this is one.
 */
FASTDesignSystemProvider;
FASTCard;
FASTButton;
```

This code imports the `<fast-design-system-provider>` component as well as the `<fast-card>`, and `<fast-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the App component in your `src/app.js` file with the following:

```jsx
function App() {
  return (
    <fast-design-system-provider use-defaults>
      <fast-card>
        <h2>FAST React</h2>
        <fast-button appearance="accent" onClick={() => console.log("clicked")}>Click Me</fast-button>
      </fast-card>
    </fast-design-system-provider>
  );
}
```

To add a splash of style, add the following to the `src/App.css`:

```css
fast-design-system-provider {
  display: block;
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

Congratulations! You're now set up to use FAST and React!
