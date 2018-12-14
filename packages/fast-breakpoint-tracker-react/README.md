# React Breakpoint Tracker
`fast-breakpoint-tracker-react` is a React component for managing viewport breakpoints. Given a set of breakpoints, this component will monitor the width of the browser window and track the current active breakpoint.

## Installation
`npm i --save @microsoft/fast-breakpoint-tracker-react`

## Breakpoints
`Breakpoints` are expected as an array. Six default breakpoint values are provided for convenience:

```jsx
const defaultBreakpoints = [0, 540, 768, 1084, 1400, 1779];
```

### Set custom breakpoint values
Custom breakpoint values can be set by setting the `breakpoints` value on the BreakpointTracker class with new key:value pairs. Custom keys are supported, but the values must be numbers.

```jsx
// Set the public static value to your custom breakpoints
BreakpointTracker.breakpoints = [0, 800, 1024, 1559];
```

## Usage
```jsx
import React from "react";
import BreakpointTracker from "@microsoft/fast-breakpoint-tracker-react";

export interface AppProps {}

class App extends React.Component<AppProps, {}> {
    render() {
        return (
            <BreakpointTracker
                render={breakpoint => (
                    <p>The current breakpoint is {breakpoint}</p>
                )}
            />
        );
    }
}
```
