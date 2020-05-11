# Progress

## Accessibility

Renders as a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) element with the [`progressbar`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_progressbar_role) role.

## Style

When the component abuts its parent frame, its outer corner radius should be removed by overwriting the `progress_indicator` classname `border-radius` property to be `"0"`.

For the indeterminate animation to work correctly, define the `width` of the *progress* component.

For a circular style, set the `circular` prop to `true`.
