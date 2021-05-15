# Calendar

## Overview

A 1 month calendar view. This will include the month name as the title and column headers with the weekday names.

### Background

*Relevant historical or background information, related existing issues, etc.*

### Use Cases

Will be used for a date-picker component.
Can be used for a schedule.

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component*
  
### Features

- A calendar month view.
- Coloring - fonts, borders, backgrounds, buttons.
- Callback function for returning the clicked date.


### Risks and Challenges

Time zone. Should this be done on the client or the server? How does the control deal with each? Should it be normalized internally or retain the time zome? A difference in time zone can cause the calendar to render the wrong labeling, date or the calendar entirely when using the new Date() method.
Accessibility. How does tabbing and arrow keys work?
Action. Clicking a date should execute a user defined script. How should this be applied? As a property, attached as an event and clicking will emit the custom event?

There are 13 calendar types. most have different years than the gregorian calendar. (Example: Buddhist = 2564, Hindu = 1943, Japanese = Raiwa 3)
Some don't start on our January 1st. (Example: The Hindu calendar starts on March 22nd.)
Not all months have the same number of days. (Example: The Hindu calendar is 31 days the first month, five months have 30 days and the last 6 months have 31 days.)
Some calendars don't have 365 days. (Example: Hindu has 354 days in a normal year, 355 days in a short leap year and 385 days in big leap year.)
Not all browser calendar codes match real calendars. (Example indian = hindu calendar)
- Calendars: buddhist, chinese, coptic, ethiopia, ethiopic, gregory, hebrew, indian, islamic, iso8601, japanese, persian, roc

There are 22 numbering systems. 
- Numbering systems: arab, arabext, bali, beng, deva, fullwide, gujr, guru, hanidec, khmr, knda, laoo, latn, limb, mlym, mymr, orya, tamldec, telu, thai, tibt

Calculating date/times can run into timezone issues.
- Hour cycles: h11, h12, h23, h24

Click handler
Currently I'm using a function that takes the event and finds the date on the clicked element. The developer can attach a method to the calendar that uses the event to extract the date clicked.
Is this the best way? I looked at attaching a method as a callback but would rely on something like the eval() function which isn't ideal.

### Prior Art/Examples

*Screenshots and/or links to existing, canonical, or exemplary implementations of the component.*
Prototype: https://codepen.io/kungfukarl/pen/dcc7a25c745706ca71419db805936e44


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
- `weekdayLabels`: string - comma separated list of week day labels (sun, mon, tue, etc.)
- `locale`: string - a locale string which can include the market(country and language), calendar type and numbering system.

*Slots*
- The calendar component will generate dynamic slots for each date to slot content onto the calendar.


*Consider high and low-level APIs. Attempt to design a powerful and extensible low-level API with a high-level API for developer/designer ergonomics and simplicity.*

### Anatomy and Appearance

*Screenshots and/or description of the basic appearance of the component. Outline its structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

*Slot Names*
Dynamically generated slots with the date as the name in the template.

- *Host Classes*

*Slotted Content/Slotted Classes*

*CSS Parts*
- `title` - the month name
- `today` - the current day

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

```html
<fast-calendar month="1" year="2025" action="datePicked" locale="th-TH-u-ca-bhuddist-nu-thai">
  <div slot="1-1-2022">Happy New Year!</div>
</fast-calendar>
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

- Localization of year, month and weekday labels and day numbering handled by Intl js library when setting the language.
- RTL initiated when using 'ar' or 'he' language codes, 'arabic' or 'arabext' numbering, 'hebrew' or 'islamic' calendars. 'persian' calendars?
- RTL, is it just reversed?

### Test Plan

*What is the plan for testing the component, if different from the normal path?*
Need to figure out how to test the different markets.
How do I know what calendar and numbering systems to use with which market?

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
