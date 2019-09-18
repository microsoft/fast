# Image

## Accessibility

Renders as an [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) or [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) element. A picture element can be created by passing one or more [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source) elements as children with a prop of `slot="source"`.

Learn more about [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

An image **must** have a descriptive [`alt`](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML#Alternative_text) attribute to give the image meaning for non-sighted users or display if the image fails to load.

If the *image* is purely for visual decoration and does not convey any meaningful information, such as an icon to reinforce adjacent text, then you should set the [`alt`](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML#Alternative_text) attribute to an empty string: `alt=""`.
