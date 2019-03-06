# Badge

The *badge* component is a short inline [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span) element call-out used to attract attention or flag status, such as “New”, “Sale”, or other short phrases. It is not interactive, however, it generally overlays interactive content or is positioned close to a commanding component.

## Usage

Keep the *badge* label short and succinct &ndash; it should not be a sentence or a long phrase (recommend 2-3 words). Short phrases are work well, such as “App of the day,” but keep in mind that they will generally become longer when localized. Keep the text to nouns and adjectives if possible (e.g. “New” or “New today”), so the user won’t think it is an actionable element.

## Style guidance

Use the small or large size best suited for the specific *badge* usage. The `filled` prop adds a backplate to the badge with default styling. Additional styling can be modified by applying CSS `color` and `background` using the `jssStyleSheet` prop.
