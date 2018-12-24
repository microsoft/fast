# Label

*Label* is a replacement for the [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) or [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend) element. It can be used alone or grouped with other related components. Some components have the *label* built-in, but most do not. *Labels* cannot exceed one line of text. Use *label* to inform the user of information about one or more visually co-located components. For example, use *label* to tell the user what they should enter into an adjacent input component, or to group a set of related components. It is possible use *label* to display instructional text near a group of related components, but there are better choices such as caption or paragraph.

## Usage

Use sentence case (e.g. "Last name"), but avoid punctuation such as colons. *Label* text should be short and succinct, not a full sentence. When labeling components, write the *label* text as a noun or a concise noun phrase, without using full sentences. Using commas to separate list items is an exception to this rule.

## Behavioral guidance

When instructional text is needed near a group of controls, consider using caption instead. *Labels* are only intended for identification purposes, not as instructional text.

## Accessibility

Input elements inside a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) element must be associated with corresponding [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) elements, either by using *label* as a wrapper element for the form input, or by associating the [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#Attributes) attribute of the *label* with the input element’s [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute.

A meaningful [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) element is still required for input elements with implicit visual labels (e.g. a search input flagged by a background “search” icon). In these cases, the `hidden` prop should be passed as `true`.
