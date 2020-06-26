---
id: the-basics
title: The basics
sidebar_label: The basics
---

# The basics

This document assumes a basic understanding of React. If you're unfamiliar, please read [React's getting started](https://reactjs.org/docs/getting-started.html) documentation first.

## Add a component to your page
<!-- Cross-link to package specific documentation regarding installation instructions?-->

An easy way to get started with FAST styled components is the `@microsoft/fast-components-react-msft` package which conforms to Microsoft style guidance.

To use a styled component, simply import it from the package:

```jsx
import { AccentButton } from "@microsoft/fast-components-react-msft";
```
And add the component to your markup:
```jsx
function render() {
    return <AccentButton>Hello world</AccentButton>
}
```

A full list of these components and their documentation can be found [here](https://explore.fast.design/).

---

## Core concepts

### Base components
At the heart of the FAST component system are *base* components. *Base* components are general purpose, unstyled React components designed to meet semantic and accessability requirements for common UI patterns. In general, *base* components implement [*roles*](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques) from the ARIA specification.

### Styled components
Styled components are implementations of the base components coupled with CSS styles to achieve visual design requirements. These can either be a simple styling layer over the *base* component, or components that extend *base* components with additional functionality or convenience features. These components tend to be more opinionated due the the nature of design implementation.

### Class name contracts
Each base component implements a *class-name contract* - an enumeration and implementation of all classes used by the component. Simple components such as `Hyperlink` may only expose a single class name in the *class-name contract*. More complicated components such as `Breadcrumb` will have multiple class names and will apply them to the appropriate elements. For instance, the `Breadcrumb` component implements the following *class-name contract*:

```typescript
interface BreadcrumbClassNameContract {
    breadcrumb: string;                 // Applied to the root of the component
    breadcrumb_item: string;            // Applied to each breadcrumb item
    breadcrumb_item__current: string;   // Applied to the item representing the location in the breadcrumb
    breadcrumb_itemsContainer: string;  // Applied to the container of all the breadcrumb items
    breadcrumb_separator: string;       // Applied to the element representing the separator of the breadcrumb items
}
```

When the base component renders, it will apply classes to elements from the *class-name contract* properties of the `managedClasses` prop:

```jsx
// Inside the Breadcrumb render function
<div className={props.managedClasses.breadcrumb}>
    <div className={props.managedClasses.breadcrum_itemsContainer}>
        /* ...etc */
    </div>
</div>
```

#### How are components styled?
Base components are styled using [JSS](https://cssinjs.org/?v=v10.0.0) - a tool for generating stylesheets from JavaScript objects. Each JSS stylesheet conforms the the class-name contract defined by the component. [@microsoft/fast-jss-manager-react](https://github.com/microsoft/fast/tree/master/packages/fast-jss-manager-react) is used to compose a component stylesheet with a base component, and will manage CSS creation, update, and removal processes during the component lifecycle.

#### What is the design system?
The *design-system* is all of the design data - it captures design thinking into a configuration object that informs components how to render. This can include information about color, font-weights, UI density, motion, and more. In practice, this object is provided to JSS stylesheets so that the resulting CSS is a product of the *design-system*.
