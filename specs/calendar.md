# Calendar

## Overview

A 1 month calendar view

### Background

*Relevant historical or background information, related existing issues, etc.*

### Use Cases

Will be used for a date-picker component. Can be used for a schedule.

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component*
  
### Features

- A calendar month view.
- The ability to change months.
- Coloring - fonts, borders, backgrounds, buttons.
- Callback function for returning the clicked date.


### Risks and Challenges

Localization. Who controls labeling of the month and days? Intl object contains localized months, week day names and date formatting for date picker.
Accessibility. How does tabbing and arrow keys work?
Action. Clicking a date should execute a user defined script. How should this be applied? As a property, attached as an event and clicking will emit the custom event?

### Prior Art/Examples

*Screenshots and/or links to existing, canonical, or exemplary implementations of the component.*

---

## Design

*Describe the design of the component, thinking through several perspectives:*

TBD

### API

*The key elements of the component's public API surface:*

*Component Name*
- `fast-calendar`

*Attributes:*
- `month`: number - default current month
- `year`: number - default current year
- `monthLabels`: string - comma separated list of months
- `dayLabels`: string - comma separated list of week day labels (sun, mon, tue, etc.)
- `minWeeks`: number - default 0. Setting to 5 will normalize the height of all months of the year
- `action`: function - callback function when a date is clicked. executes the function with the clicked date as an argument.

*Consider high and low-level APIs. Attempt to design a powerful and extensible low-level API with a high-level API for developer/designer ergonomics and simplicity.*

### Anatomy and Appearance

*Screenshots and/or description of the basic appearance of the component. Outline its structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

- *Slot Names*
- *Host Classes*
- *Slotted Content/Slotted Classes*

*CSS Parts*
- `title` - the month name
- `day` - the name of the day (ex: Sun, Mon, Tue, etc.)

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

```html
<fast-calendar month="1" year="2025" action="datePicked(date)"></fast-calendar>
```


### States

*Key component states, valid state transitions, and how interactions trigger a state transition.*


### Accessibility

*Consider the accessibility of the component, including:*

- *Keyboard Navigation and Focus*
- *Form Input*
- *Use with Assistive Technology*
  - e.g. The implications shadow dom might have on how roles and attributes are presented to the AT. Components which delegate focus require all global aria-* attributes to be enumerated.

- How does tabbing and navigation work?
- Contrast for current date and selected date(s)
- Manual input of dates

### Globalization

*Consider whether the component has any special globalization needs such as:*

- *Special RTL handling*
- *Swapping of internal icons/visuals*
- *Localization*

- Localization of the month names
- Localization of the week day names
- RTL, is it just reversed?
- RTL controls for changing the month

### Test Plan

*What is the plan for testing the component, if different from the normal path?*
TBD

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---

## Resources

*Any related resource links such as web standards, discussion threads, diagrams, etc.*
- W3 spec for date-picker: https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html
- Intl object used for formatting and getting localized month and day labels: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl

## Next Steps

*What next steps, if any, are there? Is there some functionality that would be a nice-to-have or a common feature in other implementations that could be added but is not considered part of the MVP?*

- Implement a date/date-picker component using the calendar component
- Views: year view, week view
- Add items to dates. On click or bound data. Slotted content?
