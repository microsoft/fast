# Breadcrumb

## Accessibility

Follows the [breadcrumb](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/breadcrumb/index.html) pattern.

Set the `label` prop to identify the structure as a breadcrumb trail, which renders an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) on the [navigation section](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav) root element.

The last child will get an `aria-current` attribute set to "page" to indicate that it represents the current page.

## Style

Set the optional `separator` prop to customize what is rendered between navigation elements.

## Implementing

Accepts any children, but built to work with [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) elements.
