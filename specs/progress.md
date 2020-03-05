# Progress

## Overview

*Progress* is used to display the length of time a process will take (referred to as a **determinate** state) or to represent an unspecified wait time (referred to as an **indeterminate** state). *Progress* is typically visually represented by a circular or linear animation. When the `value` attribute is passed the state is **determinate**, otherwise it is **indeterminate**.

### Use Cases

The *progress* component should be used for an element that displays the progress status for a task that takes a more than a few seconds or consists of several steps. Typical use cases include loading elements or status of a download. 
  
### Features

A progress should allow the following attributes:
- `value`, the value of the progress, if not passed the progress will be put into its "indeterminate" state.
- `min-value`, the minimum value.
- `max-value`, the maximum value.
- `paused`, whether the progress is paused or not.

### Prior Art/Examples
- [FAST-DNA (React)](https://explore.fast.design/components/progress)
- [Material UI](https://material-ui.com/components/progress/)
- [Lightning Design / Linear](https://www.lightningdesignsystem.com/components/progress-bar/)
- [Lightning Design / Circular](https://www.lightningdesignsystem.com/components/progress-ring/)
- [Ant Design](https://ant.design/components/progress/)
- [Atlassian / Linear](https://atlaskit.atlassian.com/packages/server/progress-bar)
- [Atlassian / Circular](https://atlaskit.atlassian.com/packages/core/spinner)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/progress-controls)

---

### API

*Component name:*
- `fast-progress`

*Attributes:*
- `value`: number
- `min-value`: number
- `max-value`: number
- `paused`: boolean

### Anatomy and Appearance

*Parts:*
- determinate
- indeterminate
- circular-container
- circular-background
- circular-determinate
- circular-indeterminate
- linear-determinate
- linear-indeterminate-indicator-1
- linear-indeterminate-indicator-2

*Circular Determinate Template:*
```
<div
    role="progressbar"
    aria-valuenow={50}
    aria-valuemin={0}
    aria-valuemax={100}
>
    <div part="determinate" slot={"determinate"}>
        <svg part="circular-container" viewBox="0 0 16 16">
            <circle part="circular-background" cx="8px" cy="8px" r="7px" />
            <circle part="circular-determinate" style={{stroke-dasharray: "22px 44px"}} cx="8px" cy="8px" r="7px" />
        </svg>
    </div>
</div>
```

*Circular Indeterminate Template:*
```
<div role="progressbar">
    <div part="indeterminate" slot={"indeterminate"}>
        <svg part="circular-container" viewBox="0 0 16 16">
            <circle part="circular-background" cx="8px" cy="8px" r="7px" />
            <circle part="circular-indeterminate" cx="8px" cy="8px" r="7px" />
        </svg>
    </div>
</div>
```

*Linear Determinate Template:*
```
<div
    role="progressbar"
    aria-valuenow={50}
    aria-valuemin={0}
    aria-valuemax={100}
>
    <div part="determinate" slot={"determinate"}>
        <div part="linear-determinate" style={{ width: 50% }}/>
    </div>
</div>
```

*Linear Indeterminate Template:*
```
<div role="progressbar">
    <div part="indeterminate" slot={"indeterminate"}>
        <span part="linear-indeterminate-indicator-1"/>
        <span part="linear-indeterminate-indicator-2"/>
    </div>
</div>
```


## Implementation

```
<fast-progress
    value={50}
    min-value={0}
    max-value={100}
    circular={true}
/>
```

### States

*Progress* can either be **determinate** or **indeterminate** depending on whether the `value` attribute is passed. *Progress* can render as a linear or circular progress depending on whether `true` or `false` is passed to the the `circular` attribute.

### Accessibility

If the progressbar is describing the loading progress of a particular region of a page, the author **SHOULD** use [aria-describedby](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-describedby) to point to the status, and set the [aria-busy](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-busy) attribute to true on the region until it is finished loading. It is not possible for the user to alter the value of a progressbar because it is always readonly.

Consult the current [W3C WAI-ARIA documentation](https://www.w3.org/WAI/PF/aria/roles#progressbar) for best practices.

### Globalization

*Progress* should mirror in RTL languages, meaning the determinate progression and indeterminate animations should be mirrored.

### Dependencies

No dependencies outside of fast-element itself.

### Documentation

*Progress* is used to display the length of a process or to represent an unspecified wait time. *Progress* can either be circular or linear. *Progress* can either me in an **indeterminate** state or **determinate** state this is determined by whether `value` attribute is passed to the component. 
