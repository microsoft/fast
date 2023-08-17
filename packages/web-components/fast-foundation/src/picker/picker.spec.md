# Picker

## Overview

NOTE: `picker` is an alpha version of the component.  Developers should expect API changes until the component is stable.

The 'picker' component enables users to select a list of items from a searchable list of options.  A basic implemetation could be selecting  pizza toppings from a relatively short local list, while a more advanced one could be selecting recients for an e-mail by querying a large directory of recipients on a remote server as the user types.

### Use Cases

- Choosing a list of recipients for an e-mail.
- Choosing a list of pizza toppings.

### Non-goals
- Managing asynchronous data loading: Managing loading states and updating data should be left to components that wrap a `picker`.  The component should enable the display of loading states to make it easy for authors to do create good experiences around async data loading, but otherwise not get involved.

### Prior Art/Examples

- Outlook.com mail recipient picker 
- The existing MGT people picker https://mgt.dev/?path=/story/components-mgt-people-picker--people-picker

## Design

The 'picker' component is actually composed of five web components:
- The top-level 'picker' component.
- The 'picker-list' component which hosts a text input box and displays the items that have already been selected.
- The 'picker-list-item' component which displays a single selected item.
- The 'picker-menu' component which displays the currently available options.
- The 'picker-menu-option' component which displays a single option in the menu.

Most end-user developers will simply deal with the top level 'picker'  (ie. "people-picker", "topping-picker", etc...) and the 'picker-list' and 'picker-menu' sub-components should mostly only be a concern for developers creating these styled variations.

### API

**Picker**

*Component name:*
- `picker`

Picker is the top level container which hosts both a `picker-list` component to display the selected items and a `picker-menu` component for the list of currently available choices.

*Attributes:*
- `selection`: List of currently selected items. Comma delineated string ie. "apples,oranges".
- `options`: Currently available options. Comma delineated string ie. "apples,oranges".
- `max-selected`: The maximum number of items that can be selected.  Unset by default (ie. no maximum).  If the value is "0" selecting an item updates the query instead.
- `no-suggestions-text`: The text to present when no suggestions are available.
- `suggestions-available-text`: The text to present when suggestions are available.
- `loading-text`: The text to present when suggestions are loading. 
- `label`: The text applied to the `aria-label` attribute of the internal input element.
- `labelledby`: The text applied to the `aria-labelledby` attribute of the internal input element.  
- `placeholder`: The text used as the `placeholder` value for the internal input element.
- `filter-selected`:  Whether to remove selected elements from the option list (default=true)
- `filter-query`:  Whether to remove elements that don't match the query string (default=true)
- `menu-placement`: Controls the placement of the menu relative to the input element.
(default="bottom-fill")


*Properties:*
- `showLoading`:  Whether to display a loading state if the menu is opened.
- `listItemTemplate`: (ViewTemplate) Template used to generate listItems, used as part of a repeat directive.
- `defaultListItemTemplate`: (ViewTemplate) Default template used to generate list items, used as part of a repeat directive.
- `menuOptionTemplate`: (ViewTemplate) Template used to generate menu options, used as part of a repeat directive.
- `defaultMenuOptionTemplate`: (ViewTemplate) Template used to generate menu options, used as part of a repeat directive.
- `listItemContentsTemplate`: (ViewTemplate) Template used for the internals of a list item.  The built in default template simply renders the string.
- `menuItemContentsTemplate`: (ViewTemplate) Template used for the internals of a list item.  The built in default template simply renders the string
- `optionsList`: (string[])  Array of currently available menu options.
- `query`:  (string)  The text currently in the input text box, essentially the search term.

*Slots:*
- `list-region`: The slot where the list of currently selected items and the input element are placed by the picker component.  
- `menu-region`:  The slot where the flyout menu is placed. Authors can place a customized menu here, for example in order to add a header or footer.  If no custom menu is added the component will generate a default one.
- `no-options-region`: The slot where the ui that displays in the flyout when there are no options available is placed.  The default shows the `no-suggestions-text`.
- `loading-region`: The slot where the ui that displays in the flyout when options are loading is placed.  The default shows the `loading-text` and an animated progress spinner.

*Events*
`selectionchange`: (bubbles: false) emitted when the selection has changed.
`querychange`: (bubbles: false) The query has changed.
`menuopening`:(bubbles: false)  Menu is opening.
`menuclosing`:(bubbles: false) menu is closing.
`menuloaded`: (bubbles: false)  The menu is loaded and present in the DOM.


**Picker-List**

The `picker-list` sub-component encapulates the display of selected items as well as the text input box.  It is rendered to the light dom and has a role of "list".

*Component name:*
- `picker-list`

*Attributes:*
- `label`: The text applied to the `aria-label` attribute of the internal input element.  Usually set by the parent picker component.
- `labelledby`: The text applied to the `aria-labelledby` attribute of the internal input element.  Usually set by the parent picker component.

**Picker-Menu**

The `picker-menu` sub-component is displayed in a flyout and shows the available choices (or alternate messages like "loading" or "no choices available") based on user input.  It is rendered to the light dom and has a role of "list".

*Component name:*
- `picker-menu`

*Attributes:*

*Slots:*
- default: Options generated from data are inserted here.
- `header-region`: Authors can add a custom menu header here.  Elements with a role of 'listitem' will be added to the menu navigation.  Typically authors will need to handle invocation of custom items themselves.
- `footer-region`: Authors can add a custom menu footer here.  Elements with a role of 'listitem' will be added to the menu navigation.  Typically authors will need to handle invocation of custom items themselves.

*Events*
- `optionsupdated`: Emitted when the available options change.

## Implementation

### Accessibility
Picker should apply all the appropriate aria attributes and roles to properly support assistive technologies.

## Next Steps
- support picker as a form element