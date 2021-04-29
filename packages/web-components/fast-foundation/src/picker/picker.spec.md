# Picker

## Overview

The 'picker' component enables users to select a list of items from a searchable list of options.  A basic implemetation could be selecting  pizza toppings from a relatively short local list, while a more advanced one could be selecting recients for an e-mail by querying a large directory of recipients as the user types.

### Use Cases

- Choosing a list of recipients for an e-mail.
- Choosing a list of pizza toppings.

### Non-goals

### Prior Art/Examples

## Design

The 'picker' component is actually composed of three web components:
- The top-level 'picker' component which wraps the other two.
- The 'picker-list' component which hosts a text input box and displays the items that have already been selected.
- The 'picker-menu' component which displays the available options based on current user input.

Most end-user developers will simply deal with the top level 'picker'  (ie. "people-picker", "topping-picker", etc...) and the 'picker-list' and 'picker-menu' sub-components should mostly only be a concern for developers creating these derived types. 

### API

**Picker**

*Component name:*
- `picker`

Picker is the top level container which hosts both a `picker-list` component to display the selected items and a `picker-menu` component for the list of currently available choices.

*Attributes:*
- `default-selection`: Items pre-selected when component is first connected. Comma delineated string ie. "apples,oranges".  (NOTE: I'm wondering if we even need this in the base class?)
- `selection`: List of currently selected items. Comma delineated string ie. "apples,oranges".
- `options`: Currently available options. Comma delineated string ie. "apples,oranges".
- `max-selected`: The maximum number of items that can be selected.
- `no-suggestions-text`: The text to present to assistive technolgies when no suggestions are available.
- `suggestions-available-text`: The text to present to assistive technolgies when suggestions are available.
- `loading-text`: The text to present to assistive technologies when suggestions are loading. (TODO: revisit if we need all three strings)

*Properties:*
- `menuConfig`: (AnchoredRegionConfig)  Allows alternate flyout menu configurations.
- `itemTemplate`: (ViewTemplate) Template to use for selected items.
- `defaultItemTemplate`: (ViewTemplate) Default template to use for selected items (usually specified in the component template).
- `optionTemplate`: (ViewTemplate) Template to use for available options.
- `defaultOptionTemplate`: (ViewTemplate) Default template to use for available options(usually specified in the template).

*Slots:*
- `list-region`
- `menu-region`

*Events*
`selectionchange`

**Picker-List**

The `picker-list` sub-component encapulates the display of selected items as well as the text input box.  It is rendered to the light dom and has a role of "list".

*Component name:*
- `picker-list`

*Attributes:*

*Slots:*

*Events*


**Picker-Menu**

The `picker-menu` sub-component is displayed in a flyout and shows the available choices (or alternate messages like "loading" or "no choices available") based on user input.  It is rendered to the light dom and has a role of "list".

*Component name:*
- `fast-picker`

*Attributes:*

*Slots:*

*Events*



## Implementation