# Dialog

## Accessibility

A *dialog* must include one focusable control. When the dialog appears on the screen, keyboard focus should move to the first focusable element.

A *dialog* should include a label. This can be applied as an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) using the `label` prop, or by referencing a child within the dialog with the [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) attribute using the `labelledby` prop. Optionally, additional context can be provided to assistive technologies by including an [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) attribute using the `describedby` prop.

Learn more about [dialog accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role).

## Style

Set `contentWidth` and `contentHeight` to control the size of the content area. Defaults to 640px by 480px.
