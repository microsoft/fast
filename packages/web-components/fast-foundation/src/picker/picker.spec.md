# Picker

## Overview

The 'picker' component enables users to select a list of items from a searchable list of options.  A basic implemetation could be selecting  pizza toppings from a relatively short local list, while a more advanced one could be selecting recients for an e-mail by querying a large directory of recipients on a remote server as the user types.

### Background

The picker component 

### Use Cases

- Choosing a list of recipients for an e-mail.
- Choosing a list of pizza toppings.

### Non-goals
- Managing asynchronous data loading: Managing loading states and updating data should be left to components derived from `picker`.  The component should enable the display of loading states to make it easy for derived components to do create good experiences around async data loading, but otherwise not involved.

### Prior Art/Examples

- Outlook.com mail recipient picker 
- The existing MGT people picker https://mgt.dev/?path=/story/components-mgt-people-picker--people-picker

## Design

The 'picker' component is actually composed of three web components:
- The top-level 'picker' component which wraps the other two.
- The 'picker-list' component which hosts a text input box and displays the items that have already been selected.
- The 'picker-menu' component which displays the available options based on current user input.

Most end-user developers will simply deal with the top level 'picker'  (ie. "people-picker", "topping-picker", etc...) and the 'picker-list' and 'picker-menu' sub-components should mostly only be a concern for developers creating these derived types.

Management of loading states is largely left to the derived types

### API

**Picker**

*Component name:*
- `picker`

Picker is the top level container which hosts both a `picker-list` component to display the selected items and a `picker-menu` component for the list of currently available choices.

*Attributes:*
- `default-selection`: Items pre-selected when component is first connected. Comma delineated string ie. "apples,oranges".  (NOTE: I'm wondering if we even need this in the base class?)
- `selection`: List of currently selected items. Comma delineated string ie. "apples,oranges".
- `options`: Currently available options. Comma delineated string ie. "apples,oranges".
- `max-selected`: The maximum number of items that can be selected.  Unset by default (ie. no maximum).
- `no-suggestions-text`: The text to present when no suggestions are available.
- `suggestions-available-text`: The text to present when suggestions are available.
- `loading-text`: The text to present when suggestions are loading. 

*Properties:*
- `menuConfig`: (AnchoredRegionConfig)  Allows alternate flyout menu configurations.
- `itemTemplate`: (ViewTemplate) Template to use for selected items.
- `defaultItemTemplate`: (ViewTemplate) Default template to use for selected items (usually specified in the component template).
- `optionTemplate`: (ViewTemplate) Template to use for available options.
- `defaultOptionTemplate`: (ViewTemplate) Default template to use for available options(usually specified in the template).

*Slots:*
- `list-region`: The slot where the list of currently selected items and the input element are placed by the picker component.
- `menu-region`:  The slot where the flyout menu is placed. Authors can place a customized menu here, for example in order to add a header or footer.  If no custom menu is added the component will generate a default one.
- `no-options-region`: The slot where the ui that displays in the flyout when there are no options available is placed.  The default shows the `no-suggestions-text`.
- `loading-region`: The slot where the ui that displays in the flyout when options are loading is placed.  The default shows the `loading-text`.

*Events*
`selectionchange`

*Protected functions:*
`toggleFlyout(open:boolean)`: Invoked when flyout is toggled (note that this can be invoked when the flyout is already in the desired state).  

`handleTextInput(e: InputEvent)`: Invoked when text is entered into the input element.

**Picker-List**

The `picker-list` sub-component encapulates the display of selected items as well as the text input box.  It is rendered to the light dom and has a role of "list".

*Component name:*
- `picker-list`

**Picker-Menu**

The `picker-menu` sub-component is displayed in a flyout and shows the available choices (or alternate messages like "loading" or "no choices available") based on user input.  It is rendered to the light dom and has a role of "list".

*Component name:*
- `picker-menu`

*Attributes:*

*Slots:*
- `header-region`: Authors can add a custom menu header here.  Elements with a role of 'listitem' will be added to the menu navigation.
- `footer-region`: Authors can add a custom menu footer here.  Elements with a role of 'listitem' will be added to the menu navigation.

*Events*
- `optionsupdated`: Emitted when the available options change.

## Implementation

### Accessibility
Picker should apply all the appropriate aria attributes and roles to properly support assistive technologies.