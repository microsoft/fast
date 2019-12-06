---
id: design-system
title: Design system
sidebar_label: Design system
---

# Design System

## Working with the design system provider
The `DesignSystemProvider` is a React component that provides, via [React context](https://reactjs.org/docs/context.html), the *design-system* object to descendent context consumers.

It accepts a `designSystem` property:
```jsx
<DesignSystemProvider designSystem={{backgroundColor: "#FFF"}}>
    /* children */
</DesignSystemProvider>
```

The `DesignSystemProvider` is designed to apply scoped changes to the *design-system* object, so it will merge the applied *design-system* with any upstream *design-system* object:

```jsx
<DesignSystemProvider designSystem={{backgroundColor: "#FFF", density: 3}}>
    /* Stylesheet generated with {backgroundColor: "#FFF", density: 3} */
    <StyledButton>I'm a styled button</StyledButton>
    
    <DesignSystemProvider designSystem={{backgroundColor: "#AAA"}>
        /* Stylesheet generated with {backgroundColor: "#AAA", density: 3} */
        <StyledButton>I'm another styled button</StyledButton>
    </DesignSystemProvider>
</DesignSystemProvider>
```