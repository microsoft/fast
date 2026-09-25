# Progress

## Overview

*Progress* and *progress ring* are used to display the length of time a process will take or to visualize percentage value (referred to as a **determinate** state) and to represent an unspecified wait time (referred to as an **indeterminate** state). *Progress* components are typically visually represented by a circular or linear animation. When the `value` attribute is passed the state is **determinate**, otherwise it is **indeterminate**.

### Use Cases

- Jim is building a dashboard to track fulfillment for his online store, he uses progress ring to visualize various metrics.

- Susan is downloading a large collection of music onto her hard-drive. She sees a linear progress displaying the percentage complete for the currently downloading song and indeterminate linear progress for those songs in queue.

- Fin is scrolling a large list of continuously loading data as he scrolls he sees a indeterminate progress ring to let him know that data is loading.

### Types
*Progress* can be visually represented in 2 ways.
- Linear - A straight horizontal line. `fast-progress`
- Circular - A circular ring shape. `fast-progress-ring`

### Features

A progress should allow the following attributes:
- `value`, the value of the progress, if not passed the progress will be put into its "indeterminate" state.
- `min`, the minimum value.
- `max`, the maximum value.
- `paused`, whether the progress is paused or not.

### Prior Art/Examples
- [FAST Progress (React)](https://www.npmjs.com/package/@microsoft/fast-components-react-msft)
- [Material UI](https://material-ui.com/components/progress/)
- [Lightning Design / Linear](https://www.lightningdesignsystem.com/components/progress-bar/)
- [Lightning Design / Circular](https://www.lightningdesignsystem.com/components/progress-ring/)
- [Ant Design](https://ant.design/components/progress/)
- [Atlassian / Linear](https://atlaskit.atlassian.com/packages/server/progress-bar)
- [Atlassian / Circular](https://atlaskit.atlassian.com/packages/core/spinner)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/progress-controls)

---

### API

*Component names:*
- `fast-progress`
- `fast-progress-ring`

*Attributes:*
- `value`: number
- `min`: number
- `max`: number
- `paused`: boolean

*Slots:*
- `indeterminate`

### Anatomy and Appearance

*Parts:*
- background
- determinate
- indeterminate-indicator-1
- indeterminate-indicator-2
- progress

*Progress Ring Determinate Template:*
```
<fast-progress-ring
    role="progressbar"
    aria-valuenow=50
    aria-valuemin=0
    aria-valuemax=100
>
    <svg class="progress" part="progress" viewBox="0 0 16 16" slot="determinate">
        <circle class="background" part="background" cx="8px" cy="8px" r="7px" />
        <circle class="determinate" part="determinate" style="stroke-dasharray: 22px 44px" cx="8px" cy="8px" r="7px" />
    </svg>
</fast-progress-ring>
```

*Progress Ring Indeterminate Template:*
```
<fast-progress-ring role="progressbar">
    <slot name="indeterminate" slot="indeterminate">
        <svg class="progress" part="progress" viewBox="0 0 16 16">
            <circle class="background" part="background" cx="8px" cy="8px" r="7px" />
            <circle class="indeterminate-indicator-1" part="indeterminate-indicator-1" cx="8px" cy="8px" r="7px" />
        </svg>
    </slot>
</fast-progress-ring>
```

*Progress Determinate Template:*
```
<fast-progress
    role="progressbar"
    aria-valuenow=50
    aria-valuemin=0
    aria-valuemax=100
>
    <div class="progress" part="progress" slot="determinate">
        <div class="determinate" part="determinate" style="width: 50%"/>
    </div>
</fast-progress>
```

*Progress Indeterminate Template:*
```
<fast-progress role="progressbar">
    <div class="progress" part="progress" slot="indeterminate">
        <slot class="indeterminate" name="indeterminate">
            <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"/>
            <span class="indeterminate-indicator-2" part="indeterminate-indicator-2"/>
        </slot>
    </div>
</fast-progress>
```


## Implementation

```
<fast-progress
    value=50
    min=0
    max=100
/>
```

```
<fast-progress-ring
    value=50
    min=0
    max=100
/>
```

### States

*Progress* and *progress ring* can either be **determinate** or **indeterminate** depending on whether the `value` attribute is passed. *Progress* renders in linear style progress and *progress ring* renders a circular style progress.

### Accessibility

If the *progress* or *progress ring* is describing the loading progress of a particular region of a page, the author **SHOULD** use [aria-describedby](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-describedby) to point to the status, and set the [aria-busy](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-busy) attribute to true on the region until it is finished loading. It is not possible for the user to alter the value of a *progress* or *progress ring* because it is always readonly.

Consult the current [W3C WAI-ARIA documentation](https://www.w3.org/WAI/PF/aria/roles#progressbar) for best practices.

### Globalization

*Progress* and *progress ring* should mirror in RTL languages, meaning the determinate progression and indeterminate animations should be mirrored.

### Dependencies

No dependencies outside of fast-element itself.
