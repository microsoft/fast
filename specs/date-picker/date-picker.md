# Date Picker

## Overview

As defined by the W3C:
>The date state represents a control for setting the element's value to a string representing a specific date.
>

### Background

This is a community requested component. Adds a FAST version of the input[type=date] HTML element.

### Use Cases

- John is booking a room online and needs to enter a date of arrival. Clicking on the calendar icon in the date field, brings up a calendar where John can select a check-in date.

### Features

- **Date validation:** Verifies that the entered string is a valid date.

- **Calendar view:** Opens a calendar view for selecting a date.

- **Time view:** Opens time selection view with select boxes for selecting hour, minute and meridian.

- **Month view:** Opens a month selection view. Used for quickly changing the calendar view or for selecting a month when type="month".

- **Year view:** Opens a year selection view. Used for quickly changing the calendar view, month select view or for selecting a year when type="year".

- **Localization:** Formats that date for the local market. MM--DD-YYYY, DD--MM-YYYY, etc. It supports country, language, numbering type and calendar type.

### Risks and Challenges
- Many different calendar types, even within the same market.
- Time zone differences. These may be different between client and server.


### Prior Art/Examples
- [W3C](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html)
- [FluentUI](https://developer.microsoft.com/en-us/fluentui#/controls/web/datepicker)

---

### API
*Component Name*
- `fast-date-picker`

*Attributes*
- `value` - A predefined date or one picked by the user.
= `locale` - Market and language
- `placeholder` - Text to appear when a date isn't present.
- `name` - the name of the control
- `appearance` - enum
    - outline (default)
    - filled
- `readonly` - If the date is editable.
- `disabled` - If the control is disabled.
- `required` - The date field is required or optional.
- `min` - Earliest allowed date.
- `max` - Latest allowed date.
- `allow-text-input` - Whether the date-picker allows input of a date string directly or not.
- `aria-label` - Aria label for screen reader.
- `type` - Type of picker. Supports all of the HTML types. `date` | `month` | `week` | `time` | `datetime-local`
- `selected-dates` - Dates to be selected.
- `disabled-dates` - Dates that cannot be selected.
- `day-format` - Formatting for days. 'numeric' (default) | '2-digit'.
- `weekday-format` - Formatting for optional weekday. none (default) | 'long' | 'short' | 'narrrow'.
- `month-format` - Formatting for the month. 'numeric' (default) | '2-digit' | 'long' | 'short' | 'narrow'.
- `year-format` - Formatting for the year. 'numeric' (default) | '2-digit'.
- `hour-format` - Formatting for the hour in time or date-time pickers. 'numeric' (default) | '2-digit'.
- `minute-format` - Formatting for the minutes. 'numeric' (default) | '2-digit'.
- `hour-12` - If it should be 12 or 24 hour time formatting. Defaults to true.

*Methods*
- `resetCalendar()` - Resets the calendar to the current month and year view.
- `openFlyout(force: boolean = false)` - Opens the date/time picker.
- `closeFlyout(force: boolean = false)` - Closes the date/time picker.
- `toggleFlyout(force: boolean = false)` - Opens the flyout if closed and closes if it is open.

*Events*

- `change` - callback fired when picking a date or bubbled from text-field component.
- `input` - callback fired when picking a date or bubbled from text-field component.

### Anatomy 

**Structure:**

```html
<template>
  <fast-text-field>
    <slot slot="start" name="start"></slot>
    <slot></slot>
    <slot slot="end" name="end">
      &#128197;
    </slot>
  </fast-text-field>
  <fast-anchored-region>
    ${when(
        x => x.type === "datetime-local" || x.type === "time",
        html`
            ${x =>
                timePickerTemplate(
                    context,
                    x.getTimes(),
                    x.handleTimeKeydown.bind(x)
                )}
        `
    )}
    ${when(
      x => x.showCalendar,
      html`
      <fast-calendar monthFormat="short" weekdayFormat="narrow" month="${x => x.calendarMonth}" year="${x => x.calendarYear}">
        <div class="calendar-change" slot="start">
          <div class="arrow" @click="${x => x.stepDownCalendar()}">&darr;</div>
          <div class="arrow" @click="${x => x.stepUpCalendar()}">&uarr;</div>
        </div>
      </fast-calendar>
      `
    )}
    ${when(x => x.showMonthPicker,
    html`
      <div class="picker" part="picker">
          <div class="picker-title" part="picker-title">
              ${x =>
                  pickerTitleTemplate(
                      context,
                      x.dateFormatter.getYear(x.monthView),
                      true
                  )}
              ${x =>
                  pickerChangeControlsTemplate(
                      context,
                      definition,
                      x.handleMonthChange.bind(x)
                  )}
          </div>
          ${x => pickerGridTemplate(context, x.getMonths())}
          ${resetButton}
      </div>
    `
    )}
    ${when(
        x => x.showYearPicker,
        html`
            <div class="picker" part="picker">
                <div class="picker-title" part="picker-title">
                    ${x => {
                        const years = x.getYears();
                        return pickerTitleTemplate(
                            context,
                            `${years[0].text} - ${
                                years[years.length - 1].text
                            }`,
                            false
                        );
                    }}
                    ${x =>
                        pickerChangeControlsTemplate(
                            context,
                            definition,
                            x.handleYearsChange.bind(x)
                        )}
                </div>
                ${x => pickerGridTemplate(context, x.getMonths())}
                ${resetButton}
            </div>
        `
    )}
  </fast-anchored-region>
</div>
```


*Slot Names*
- `calendar` - Defaults to fast-calendar. Can be populated with the users own calendar.
- `calendar-icon` - The calendar icon used to open the calendar view.

- *Host Classes*
*CSS Parts*
- `text-field` - The date entry field.
- `start` - The start slot.
- `end` - The end slot.
- `flyout` - The anchored region containing the pickers.
- `calendar` - The calendar component used for picking a date.
- `calendar-title` - The title container of the calendar component.
- `picker` - Container for the month and year pickers.
- `arrow-previous` - The previous month or year button.
- `arrow-next` - The next month or year button.
- `picker-grid` - The grid holding the month and year pickers.
- `picker-row` - The rows for month and year pickers.
- `picker-cell` - The cells for month and year pickers.
- `time-picker` - The time picker container.
- `time-separator` - The colon between hour and minute time selector.
- `time-list` - The hour, minute and meridian select boxes.


### Visual Appearance
[FluentUI date picker](https://developer.microsoft.com/en-us/fluentui#/controls/web/datepicker)


---

## Implementation
*Basic date picker*

```html
    <fast-date-picker></fast-date-picker>
```

*Month picker*
```html
    <fast-date-picker type="month"></fast-date-picker>
```

*Year picker*
```html
    <fast-date-picker type="year"></fast-date-picker>
```

*Time picker*
```html
    <fast-date-picker type="time"></fast-date-picker>
```

*Date and time picker*
```html
    <fast-date-picker type="datetime-local"></fast-date-picker>
```

*Date picker with weekday - Saturday, 1/1/2022*
```html
    <fast-date-picker weekday-format="long"></fast-date-picker>
```

*Date picker with long month - January 1, 2022*
```html
    <fast-date-picker month-format="long"></fast-date-picker>
```

*Placeholder text*
```html
    <fast-date-picker placeholder="Pick a date"></fast-date-picker>
```

### States

*Key component states, valid state transitions, and how interactions trigger a state transition.*

### Accessibility

*Keyboard Navigation and Focus*
Should be able to tab to the date control and arrow over to the calendar icon.
Enter and space keys should open the calendar view.
Esc key should close the picker view.
Focus should be set to either a selected date (the current date), or the first of the month if the current date is not on the current month.
Should be able to navigate between the months.
Should be able to arrow around the month to pick a specific date.
Should be able to arrow to the next and previous months.

*Form Input*

*Use with Assistive Technology*
Aria labeling for the calendar icon will say 'Choose date'. Upon picking a date, the aria labeling will change to 'Change date'.

### Globalization
*Special RTL handling*
Calendar icon will appear on the right for LTR languages and on the left for RTL.

*Swapping of internal icons/visuals*
Is using the calendar icon good enough? The icon will be in a slot with the html entity for calendar as the default.

*Localization*
Different date formatting for different markets. This will be obtained through the browser built in localization for dates. Different languages and numbering is supported through a locale string.

### Security

Not applicable.

This is a form field. Any required security will be handled by the developer using the component such as form injection mitigation.

### Performance

Performance should be pretty straight forward. Any perf considerations would occur in the calendar component. The date picker itself is primarily a shell that will include validation.

### Dependencies

*fast-calendar* - Used for date picking
*fast-data-grid* - Used for month and year pickers
*fast-select* - Used for time selection
*fast-button* - Used for various controls, next and previous buttons in month and year pickers.

### Test Plan

This will use standard unit tests and examples in Storybook for end-to-end tests.

### Resources

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
[W3 Examples](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html)
[W3 wiki](https://www.w3.org/wiki/HTML/Elements/input/date)
[Localized month and day names](https://www.abeautifulsite.net/posts/getting-localized-month-and-day-names-in-the-browser/)
[FluentUI date picker](https://developer.microsoft.com/en-us/fluentui#/controls/web/datepicker)

### Next Steps

- *Week select* - An option to pick the week of the year.
- *Date range selection* - The ability to select more than a single date.
