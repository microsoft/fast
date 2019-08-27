# Select

Select one value from a list of options.

## Accessibility

Follows the [listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) pattern.

## Implementing

A `displayString` is generated based on the `value` of the current selection. If there are no selected items, the `placeholder` prop is used instead. If custom formatting is desired you can provide an alternate function to the `displayStringFormatter` prop.
