# Calendar

## Overview

A 1 month calendar view. This will include the month name as the title and column headers with the weekday names.

### Background

There was a lot of requests for a date picker component. The calendar is key component that. It was broken out so that it can be
use on it's own or with the date picker to add some additional reuse.

### Use Cases

Will be used for a date-picker component.
Can be used for a schedule.

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component*
  
### Features

- A calendar month view.
- Localized text for a given market, language and numbering system.
- Coloring - fonts, borders, backgrounds, buttons.
- Custom event fired when selecting a date.


### Risks and Challenges

Time zone. Should this be done on the client or the server? How does the control deal with each? Should it be normalized internally or retain the time zome? A difference in time zone can cause the calendar to render the wrong labeling, date or the calendar entirely when using the new Date() method.
Accessibility. How does tabbing and arrow keys work?
Action. Clicking a date should execute a user defined script. How should this be applied? As a property, attached as an event and clicking will emit the custom event?

There are 13 calendar types. most have different years than the gregorian calendar. (Example: Buddhist = 2564, Hindu = 1943, Japanese = Raiwa 3)
Some don't start on our January 1st. (Example: The Hindu calendar starts on March 22nd.)
Not all months have the same number of days. (Example: The Hindu calendar is 31 days the first month, five months have 30 days and the last 6 months have 31 days.)
Some calendars don't have 365 days. (Example: Hindu has 354 days in a normal year, 355 days in a short leap year and 385 days in big leap year.)
Some calendars of the same type are different for different countries. Cambodia, Lao and Thailand use the Buddhist calendar and have the same number of days. Burma uses the Buddhist calendar but has a different
  number of days for one of it's leap years.
Not all browser calendar codes match real calendars. (Example indian = hindu calendar)
- Calendars: buddhist, chinese, coptic, ethiopia, ethiopic, gregory, hebrew, indian, islamic, iso8601, japanese, persian, roc

There are 22 numbering systems. 
- Numbering systems: arab, arabext, bali, beng, deva, fullwide, gujr, guru, hanidec, khmr, knda, laoo, latn, limb, mlym, mymr, orya, tamldec, telu, thai, tibt

Calculating date/times can run into timezone issues.
- Hour cycles: h11, h12, h23, h24

### Prior Art/Examples

Prototype: https://codepen.io/kungfukarl/pen/dcc7a25c745706ca71419db805936e44


---

## Design

It uses a light gray background and rounded corners for the interactive version of the calandear.
Non-interactive cells will have no background so that they don't appear as buttons.

### API

*Component Name*
- `fast-calendar`

*Attributes:*
- `month`: number - default current month
- `year`: number - default current year
- `locale`: string - a locale string which can include the market(country and language),
  calendar type and numbering system.
- `day-format`: enum - Day format used in calendar cells. 'numeric'(default) | '2-digit'
- `weekday-format`: enum - Format for weekday labels. 'short'(default) | 'long' | 'narrow'
- `month-format`: enum - Format for the month name in the title. 'long'(default) | '2-digit' | 'narrow' | 'numeric' | 'short'
- `year-format`: enum - Format for the year in the title. 'numeric'(default) | '2-digit'
- `min-weeks`: number - a minimum number of weeks to show. This allows for normalizing of 
  calendars so that they take up the same vertical space.
- `disabled-dates`: string - a comma separated list of dates to display as disabled.
- `selected-dates`: string - a comma separated list of dates to display as selected.
- `readonly`: boolean - readonly version of the calendar


*Slots*
- default - Slotted between the title and the calendar
- `start` - Before the title
- `end` - after the calendar
- The calendar component will generate dynamic slots for each date to slot content onto the calendar.


*Consider high and low-level APIs. Attempt to design a powerful and extensible low-level API with a high-level API for developer/designer ergonomics and simplicity.*

### Anatomy and Appearance

*Screenshots and/or description of the basic appearance of the component. Outline its structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

*Slot Names*
Dynamically generated slots with the date as the name in the template.

*Host Classes*

*Slotted Content/Slotted Classes*

*CSS Parts*
- `title` - the container that holds the month and year
  - `month` - the calendar month in the title
  - `year` - the calendar year in the title
- `days` - the container that holds the weekday labels and all of the days
- `week-days` - the row containing the week-day labels
- `week-day` - each weekday label
- `week` - each row of days
- `day` - each numbered day
- `date` - the number date in the day cell
- `today` - the number date for the current date

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

```html
<fast-calendar 
  month="1"
  year="2025"
  month-format="short"
  weekday-format="narrow"
  locale="th-TH-u-ca-bhuddist-nu-thai"
  disabled-dates="1-5-2022,1-6-2022,1-7-2022"
  selected-dates="1-20-2022,1-30-2022">
  <div slot="1-1-2022">Happy New Year!</div>
</fast-calendar>
```


### States

-`disabled-dates`: This is an attribute on the calendar passed as a comma separated list. A disabled attribute is passed
  through the date-selected event when clicking on the date.
-`selected-dates`: Like disabled-dates, this is an attribute on the calendar passed as a comma separated list. It also
  passes a selected attribute through the date-selected event when a date is clicked.

### Accessibility

*Consider the accessibility of the component, including:*
- Dates have an aria-label to denote the month and day for more semantic meaning rather than just the day number.

*Keyboard Navigation and Focus*
- Users can tab to the first date in the calendar.
- The underlying markup uses a form of data-grid so that you can arrow around the calendar.
*Use with Assistive Technology*
  - e.g. The implications shadow dom might have on how roles and attributes are presented to the AT. Components which delegate focus require all global aria-* attributes to be enumerated.

- Includes abbr (abbreviation) attribute for abbreviated weekday labels.
*Keyboard Navigation and Focus*

### Globalization
*Special RTL handling*
- RTL initiated when using 'ar' or 'he' language codes, 'arabic' or 'arabext' numbering, 'hebrew' or 'islamic' calendars.
- Loads numbering in reverse for each week.

*Consider whether the component has any special globalization needs such as:*

*Special RTL handling*
  Text in the title will be RTL [month] [year] -> [year] [month]
  Cells are rendered right-to-left

*Localization*
  locale attribute for capturing:
    - market: a language-country code
    - calendar type: a code representing the calendar type to use
    - numbering system: a code for the numbering system to use



### Test Plan

Tests include
- date-formatter
  - Setting props: locale, dayFormat, monthFormat, yearFormat, weekdayFormat & date
  - Defaults to current date
  - Setting specific dates
  - Defaults for formatting
  - Changing formats
  - Day formatting
  - Month formatting
  - Weekday formatting
  - Year formatting
  - Getting a list of weekdays
  - Localized strings
- calendar defaults
  - Defaults to current month and year
  - Returns the correct number of weeks
  - Highlights the current date
- month info
  - Correct number of days. 31 for January, 28 for Febuary, 29 for Febuary on a leap year
  - Month starts on the correct first day
- labels
  - Month labeling. Correct labeling in different formats
  - Weekday labeling in different formats
  - Day labeling in different formats
- localization
  - Correct language format for the month
  - Correct year for different calendar types
  - Correct weekday labeling for the month
  - Recognize RTL markets
- day states
  - Should not show dates as disabled by default
  - Should correctly show disabeld dates for a list
  - Should not show dates as selected by default
  - Should correctly show selected dates for a list


### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---

## Resources

*Any related resource links such as web standards, discussion threads, diagrams, etc.*
- W3 spec for date-picker: https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html
- Intl object used for formatting and getting localized month and day labels: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl

## Next Steps

*What next steps, if any, are there? Is there some functionality that would be a nice-to-have or a common feature in other implementations that could be added but is not considered part of the MVP?*

- Implement a date-picker component using the calendar component
