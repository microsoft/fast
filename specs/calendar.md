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

I've been working primarily off of the calendar used in the FluentUI date picker component. However, the calendar component is highly customizable. So it should accomidate most any style.

TBD

### API

*Component Name*
- `fast-calendar`

*Attributes:*
- `month`: number - default: current month 
- `year`: number - default: current year
- `locale`: string - a locale string which can include the market(country and language), calendar type and numbering system.
- `weekday-format`: `long` | `narrow` | `short` - default: `short` - Labeling format for the names of the weekdays.
- `month-format`: `long` | `narrow` | `short` - default: `long` - Labeling format for the month name.
- `min-weeks`: number - default: 0 - Minimum number of weeks to show.
- `disabled-dates`: string - A comma separated list of dates to show as disabled.
- `selected-dates`: string - a comma separated list of dates to show as highlighted.

*Slots*
- The calendar component will generate dynamic slots for each date to slot content onto the calendar. Example <slot name="1-1-2021"></slot>
- `default`: Content in the default slot will show up between the title and the weekday labels.
- `end`: Content shows up after the calendar days.
- `start`: Content shows up before the title slot.
- `title`: Replaces the title content with custom slotted content.

### Anatomy and Appearance

*Screenshots and/or description of the basic appearance of the component. Outline its structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

*Slot Names*
Dynamically generated slots with the date as the name in the template.

- *Host Classes*

*Slotted Content/Slotted Classes*

*CSS Parts*
- `title`: the month name and year
- `month`: the month name in the title
- `year`: the year in the title
- `week-days`: the row for the weekday labels
- `week-day`: each individual weekday label
- `days`: each week of numbered days
- `day`: each numbered day container in the calendar
- `date`: the number in the day container
- `today`: the current dates number in it's day container

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

*Keyboard Navigation and Focus*
- Users can tab to the first date in the calendar.
- The underlying markup uses a form of data-grid so that you can arrow around the calendar.

### Globalization
*Special RTL handling*
- RTL initiated when using 'ar' or 'he' language codes, 'arabic' or 'arabext' numbering, 'hebrew' or 'islamic' calendars.
- Loads numbering in reverse for each week.

*Localization*
- Localization of year, month and weekday labels and day numbering handled by Intl js library when setting the language.
- 

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
