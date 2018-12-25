# Flipper

Use the *flipper* component to page through content blocks one at a time or to scroll through content.

## Accessibility

In a majority of use cases, *flipper* should be hidden from assistive technologies as it typically is a secondary method of navigation which can be confusing for users. *Flipper* is hidden from screen readers by default, but can be exposed by passing the `visibleToAssistiveTechnologies` prop. When exposing *flipper* to screen readers, be sure to also pass the `label` prop. Correct and precise labeling of a component that is purely visual and has no textual context is needed to give proper context to assistive technologies. When exposed to screen readers, be sure to label each *flipper* clearly by describing what it will do. When a *flipper* does not have a valid action, it should be hidden &ndash; removing it from interaction.