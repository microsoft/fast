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

*Attributes:*
- `no-suggestions-text`
- `suggestions-available-text`
- `loading-text`
- `menu-position`
- `dynamic-menu-positioning`
- `fixed-menu-placement`



*Slots:*

*Events*


**Picker-List**

*Component name:*
- `picker-list`

*Attributes:*

*Slots:*

*Events*


**Picker-Menu**

*Component name:*
- `fast-picker`

*Attributes:*

*Slots:*

*Events*



## Implementation