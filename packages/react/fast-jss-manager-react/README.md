# FAST JSS manager React

`fast-jss-manager-react` is a React higher order component (HOC) library for managing component JSS stylesheets. It facilitates using JSS with your React components by controlling when to add, update, and remove a JSS stylesheets. It also allows top-down variable injection into JSS stylesheet functions using the exported `DesignSystemProvider`.

## Installation

`npm i --save @microsoft/fast-jss-manager-react`

## Usage

### Create a react component

`manageJss` is a HOC that handles stylesheet management for a component. When the HOC renders, it will generate class names for the managed component and pass them to the wrapped component as a `managedClasses` prop. For every top level property of your stylesheet, the `managedClasses` prop of the wrapped component will have a generated class name at a key by the same name.

```jsx
// button.jsx
import React from "react";

class Button extends React.Component {
    render() {
        return (
            <button className={this.props.managedClasses.button}>
                {this.props.children}
            </button>
        );
    }
}
```

### Create a JSS stylesheet

You should also create a JSS stylesheet - for detailed information please reference [https://github.com/cssinjs/jss](https://github.com/cssinjs/jss). The JSS instance used by the manager uses [jss-preset-default](https://github.com/cssinjs/jss-preset-default) so feel free to use any syntaxes supported by those plugins.

```js
// buttonSyles.js
const buttonStyles = {
    button: {
        color: "white",
        background: "blue",
        border: "none",
    },
};
```

### Create a Higher Order Component (HOC)

Import the `manageJss` function and use it to create a new, styled `Button` component:

```jsx
import manageJss from "@microsoft/fast-jss-manager-react";
import buttonStyles from "./buttonStyles";
import Button from "./button";

const StyledButton = manageJss(buttonStyles)(Button);

// Render
<StyledButton>Hello world</StyledButton>;
```

### Instance stylesheet

There is a good chance you will need to customize some CSS properties for a styled component instance. To do this, the styled component created by `manageJss` supports a `jssStyleSheet` prop. Assigning a JSS stylesheet to this prop will generate a stylesheet that applies only to that instance of the component.

```jsx
const stylesheetOverride = {
    button: {
        color: "green",
        background: "gray",
    },
};

<StyledButton jssStyleSheet={stylesheetOverride}>Hello world</StyledButton>;
```

### Design System Provider

One of the biggest benefits to JSS is the ability to generate styles dynamically by assigning a property in a JSS stylesheet a function value. Going even further, JSS provides a mechanism for providing input data as the sole argument to these functions - we call this input data the "design system".

The `DesignSystemProvider` provides a mechanism to set the design system a component's stylesheet is generated with. This is done by assigning a `designSystem` property to the `DesignSystemProvider`:

```jsx
const designSystem = {
    backgroundColor: "#FFF",
    fontFamily: "Comic Sans",
};

<DesignSystemProvider designSystem={designSystem}>
    <StyledButton>Hello world</StyledButton>
</DesignSystemProvider>;
```

The `DesignSystemProvider` can also be nested within other `DesignSystemProvider`s. When nested, the `designSystem` value is merged with it's parent `designSystem`. This allows simple overrides of specific values while inheriting all other parent values.

```jsx
const designSystem = {
    backgroundColor: "#FFF",
    fontFamily: "Comic Sans",
};

const designSystemOverrides = {
    backgroundColor: "#EEE",
};

// Each StyledButton here is generated with a different backgroundColor property, but both of them
// see a fontFamily property of "Comic Sans".

<DesignSystemProvider designSystem={designSystem}>
    <StyledButton>My backgroundColor is #FFF</StyledButton>

    <DesignSystemProvider designSystem={designSystemOverrides}>
        <StyledButton>My backgroundColor is #EEE</StyledButton>
    </DesignSystemProvider>
</DesignSystemProvider>;
```

### Design System Consumer

The design system value provided by the `DesignSystemProvider` can be accessed inside of a React component using the `DesignSystemConsumer`. This is a simple React context consumer and can be used just like any context consumer - it accepts a function as `children` where the function accepts the design system as it's only argument:

```jsx
<DesignSystemConsumer>
    {designSystem => {
        /* do stuff and return a React.ReactNode */
    }}
</DesignSystemConsumer>
```

### Notifications
It is sometimes useful to know when stylesheets are added, removed, or updated. The `subscribe` and `unsubscribe` methods of the `JSSManager` allows you to do that.

#### Subscriber
A SheetManagerSubscriber is a function that accepts a single object argument with `"type"` and `"sheet"` properties. The `"type"` field will match `"add"`, `"remove"` or `"update"` and the `"sheet"` is a reference to the JSSStyleSheet object.

```js
import { JSSManager } from "@microsoft/fast-jss-manager-react"`

function subscriber(data) {
    if (data.type === "add") {
        console.log("added classes", Object.values(data.sheet.classes));
    }
}

const unsubscribe = JSSManager.subscribe(subscriber)

// ...

unsubscribe(); // or JSSManager.unsubscribe(subscriber);
```

It is important to note that when multiple components are using the same stylesheet / design-system pair, the "add" event will only fire for the *first* element using the pair and the "remove" event will only fire when all components using the pair are removed.

## Server-side compiling

Server side compiling is achieved through the use of a JSS [https://github.com/cssinjs/jss/blob/master/docs/js-api.md#style-sheets-registry](style-sheet-registry). Once the app is run server-side, all stylesheets will be stored in a single registry (`stylesheetRegistry`) for easy output:

```jsx
import { stylesheetRegistry } from "@microsoft/fast-jss-manager-react";

// run code that renders the app

// Compiled CSS can be accessed via the `toString` method
const serverSideCss = stylesheetRegistry.toString();
```

## Configuration

### JSS instance

The JSS instance used by the JSSManager can be configured globally by assigning the JSSManager constructor a JSS instance. The JSSManager will use this instance for all sheet generation.

```js
import { JSSManager } from "@microsoft/fast-jss-manager-react";
import { create } from "jss";

const jssInstance = create();

JSSManager.jss = jssInstance;
```

### Class name generation

The JSSManager can be assigned a `createGenerateClassName` function to provide a class name generation function to JSS. The function will be applied to JSS in the options object, meaning it will override the `generateClassName` function on the JSS instance itself. When invoked, `JSSManager.createGenerateClassName` will be provided the current `DesignSystem` context object, and expects the return value to be a function which will return the string class name value.

```js
import { JSSManager } from "@microsoft/fast-jss-manager-react";
import { uniqueId } from "lodash-es";

JSSManager.createGenerateClassName = (designSystem) => (rule, sheet) => "my-class-name" + uniqueId()
```

## Optimizing performance

### Stylesheet memoization

To improve performance of rendering a component multiple times, the `manageJss` HOC implements a mechanism for memoizing stylesheets - only generating the stylesheet once and providing subsequent instances with class names from the first instance of the component. This makes subsequent component instances render much more quickly.

To determine if a stylesheet can be re-used by a subsequent component, the HOC determines if a given style object provided to the HOC has been previously generated _with its given design system_. It is important to note that the HOC compares both the style object and the design system object _by identity_ - if both the style object and the design system object share identity with objects previously used to generate a stylesheet, then the HOC will **not** generate a new stylesheet.

```jsx
// These two components use the same style object and are genereated in the same design system context.
// This means the manageJss HOC will only generate the componet stylesheet once.

<DesignSystemProvider designSystem={designSystem}>
    <FancyButton />
    <FancyButton />
</DesignSystemProvider>
```

```jsx
// These two components use the same style object but are genereated in different design system contexts.
// Becase the design systems are different, the resulting styles could be different and the stylesheet
// cannot safely be re-used - this means these components will have different stylesheets and different class names.

<DesignSystemProvider designSystem={designSystem}>
    <FancyButton />
    <DesignSystemProvider designSystem={designSystemOverrides}>
        <FancyButton />
    </DesignSystemProvider>
</DesignSystemProvider>
```

### Stylesheet updates

Because style objects can be generated with input data, we know whenever that input data changes that we need to update our stylesheet. This means that whenever a `manageJss` component receives a **different** design system than it had during the previous render cycle it will update the stylesheet and generate new class names. The HOC determines if the design system is different using object _identity_. A common mistake that results in needless re-generation of stylesheets is to provide the `DesignSystemProvider` with a _new_ object every render cycle:

```jsx
<DesignSystemProvider designSystem={{ backgroundColor: "#FFF" }}>
    <FancyButton />
</DesignSystemProvider>
```

Note above how the `designSystem` prop is assigned a **new** object every render cycle - this will cause the `designSystem` provided to a `manageJss` component to be **new** every render cycle, forcing it to update ever render. To avoid this, the `designSystem` should be stored so the object can be reused:

```jsx
const designSystem = { backgroundColor: "#FFF" }

// ...
<DesignSystemProvider designSystem={designSystem}>
    <FancyButton />
</DesignSystemProvider>
```

This same issue can surface with the `jssStyleSheet` prop - if the object provided to that property is **new** every render, the `manageJss` HOC will tear down the previous `jssStyleSheet` stylesheet and replace it with one generated from the new prop:

```jsx
// The prop is assigned a **new** object every render, preventing re-use of the style object across renders
<FancyButton jssStyleSheet={{ fancyButton: { color: "red" } }} />
```

```jsx
// The stylesheet reference is maintained across renders, meaning the stylesheet can be reused across render cycles
const instanceStyles = { fancyButton: { color: "red" } };

// ...
<FancyButton jssStyleSheet={instanceStyles} />;
```

### Specificity and style element order

Style element order is determined by rendering order, where components higher in the React tree will have style elements defined later in the DOM (giving them higher specificity). In general, parent components will have a style element defined later in the DOM than a child component, giving the parent component greater specificity than a child.

While in general this works, there is a known issue being tracked [here](https://github.com/microsoft/fast/issues/1279) where parents can lose their ability to override child components. This is an unintended side-effect of memozing stylesheets. While not ideal, specificity can usually be added to the selector to mitigate the issue, as the issue only manifests when document order is determining selector specificity.

### Custom JSS instance

The JSSManager can be configured to use a custom JSS instance for all instances of the JSSManager. To ensure all components in your app use the same JSS instance to generate stylesheets, you should assign the new JSS instance prior to rendering any components.

For more information on how JSS instances can be created, see [https://cssinjs.org/jss-api/?v=v10.0.0-alpha.24#create-an-own-jss-instance](https://cssinjs.org/jss-api/?v=v10.0.0-alpha.24#create-an-own-jss-instance)

```js
import { create } from "jss";
import { JSSManager } from "@microsoft/fast-jss-manager-react";

JSSManager.jss = create(); // Assign a custom JSS instance. This instance will be used for *all* components created by the `manageJss` HOC.
```
