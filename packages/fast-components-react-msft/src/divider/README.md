# Divider

The *divider* component can be an [`<hr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr) element.

## Usage

Use the *divider* to show a change in the content between two blocks of information, that may not otherwise have a clear beginning or end, and to separate information blocks where the context or continuity changes between the blocks.

## Accessibility

The *divider* is intrinsically set as `role="separator"`, and therefore is not necessary to explicitly include in the markup. When  usage involves changing the look of the page but does not have all the functional, interactive, or structural relevance implied by the hr element, [`role="presentation"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_presentation_role) can be applied from the prop interface.