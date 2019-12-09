---
id: modifying-components
title: Modifying components
sidebar_label: Modifying components
---

# Modifying components

## Using Props
<!-- Basic details about what props are and our principle on delivering stateless components. Consider linking off to React documentation here. -->
Each component will have its own set of [props](https://reactjs.org/docs/components-and-props.html#rendering-a-component) corresponding to the functionality needed for that component.

```jsx
<AccentButton disabled={true}>
    Hello World
</AccentButton>
```
## Unhandled props
FAST components implement a model of props know as *handled* and *unhandled* props. *Handled* props can be thought of as first-class props explicitly used or expected by the component. *Unhandled* props are all other props. In general, all *unhandled* props will be passed along to the root element of the component, and are generally used to address instance accessibility requirements, custom event listeners, and add telemetry meta-data.

```jsx
/*
 * aria-label is an unhandled prop, so it gets
 * applied to the root of the Button component
 */
<AccentButton aria-label={"Custom accessible label"}>
    Hello world
</AccentButton>
```

## Changing style

### Using classes
```jsx
<AccentButton
    className={"my-custom-class"}
>
    Hello World
</AccentButton>
```

### Using props
Instance style overrides can be applied using the `jssStyleSheet` property and targetting properties of the [class-name contract](#class-name-contracts).

```jsx
let styles = {
    button: {
        margin: "0 auto"
    }
};

<AccentButton
    jssStyleSheet={styles}
>
    Hello World
</AccentButton>
```

### Using inline-styles
Additionally, you can always use inline-styles. This will be treated as a *unhandled* prop and 
applied to the root element of the component.

```jsx
<AccentButton style={{margin: "0 auto"}}>
    Hello World
</AccentButton>
```
