# React Breakpoint Tracker
`fast-breakpoint-tracker-react` is a React component for managing viewport breakpoints. Given a set of breakpoints, this component will monitor the width of the browser window and track the current active breakpoint.

## Installation
`npm i --save @microsoft/fast-breakpoint-tracker-react`

## Breakpoints
Six default breakpoint values are provided for convenience:

```jsx
const defaultBreakpoints = {
    vp1: 0,
    vp2: 540,
    vp3: 768,
    vp4: 1084,
    vp5: 1400,
    vp6: 1779
};
```

### Set custom breakpoint values
Custom breakpoint values can be set by setting the `breakpoints` value on the BreakpointTracker class with new key:value pairs. Custom keys are supported, but the values must be numbers.

```jsx
const customBreakpoints = {
    mobile: 0,
    tablet: 800,
    desktop: 1024
};

// Set the public static value to your custom breakpoints
BreakpointTracker.breakpoints = customBreakpoints;
```

## Usage
<!-- 
```jsx
// button.jsx
import React from "react";
import BreakpointTracker from "@microsoft/fast-breakpoint-tracker-react";

export interface AppProps {
    activeBreakpoint: string;
}

class App extends React.Component<AppProps, {}> {
    generateApplication() {
        if (this.props.activeBreakpoint) {
            
        }
    }

    render() {
        return (
            <BreakpointTracker
                render={this.generateApplication()}
            />
        );
    }
}
``` -->
