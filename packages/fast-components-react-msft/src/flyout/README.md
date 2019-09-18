# Flyout

## Accessibility

A *flyout* should include a label. This can be applied as an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) using the `label` prop, or by referencing a child within the flyout with the [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) attribute using the `labelledby` prop. Optionally, additional context can be provided to assistive technologies by including an [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) attribute using the `describedby` prop.

## Style

Set `width` and `height` to control the size of the content area. Defaults to 280px by 128px.
