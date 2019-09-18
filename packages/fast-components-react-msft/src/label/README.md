# Label

## Accessibility

Renders as a [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) or [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend) element.

Input elements inside a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) element must be associated with corresponding [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) elements, either by using *label* as a wrapper element for the form input, or by associating the [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#Attributes) attribute of the *label* with the input element’s [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute.

A meaningful [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) element is still required for input elements with implicit visual labels (e.g. a search input flagged by a background “search” icon). In these cases, the `hidden` prop should be set to `true`.
