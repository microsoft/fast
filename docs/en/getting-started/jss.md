---
id: jss
title: JSS (JavaScript Style Sheets)
sidebar_label: JSS (JavaScript Style Sheets)
---

# Working with JSS
For info on how to write JSS stylesheets, visit [https://cssinjs.org/jss-syntax?v=v10.0.0](https://cssinjs.org/jss-syntax?v=v10.0.0)

## Accessing the design system in JSS
The `JSSManager` allows us to access the current contextual design system by assigning a function value to a JSS rule. The only argument to this callback will be the current design system. For more information on the providing a design system object to the styles, see the documentation for [fast-jss-manager-react](https://www.fast.design/docs/en/packages/fast-jss-manager-react/).

```js
// This code assumes a property `backgroundProperty` exists on the design system
const styles = {
    button: {
        backgroundColor: (designSystem) => designSystem.backgroundColor
    }
}
```