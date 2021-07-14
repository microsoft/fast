# Date Picker

## Process

- [ ] **Checkpoint 1** - Schedule a spec review meeting to cover the Overview section before proceeding to work on the Design section. Be sure to include relevant stakeholders such as members of the tools team.

- [ ] **Checkpoint 2** - Schedule a spec review meeting before beginning the implementation work. Be sure to invite relevant stakeholders such as design system owners.

- [ ] **Checkpoint 3** - Submit the component PR and schedule a component code review meeting or present the component in one of our Engineering Open Mic sessions. Address feedback from the review, obtain final approvals through GitHub, and merge.

## Overview

As defined by the W3C:
>The date state represents a control for setting the element's value to a string representing a specific date.
>

### Background

This is a community requested component.

### Use Cases

- John is booking a room online and needs to enter a date of arrival. Clicking on the calendar icon in the date field, brings up a calendar where John can select a check-in date.

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component.*
  
### Features

- **Date validation:** Verifies that the entered string is a valid date.

- **Calendar view:** Opens a calendar view for selecting a date.

- **Localization:** Formats that date for the local market. MM--DD-YYYY, DD--MM-YYYY, etc.

### Risks and Challenges

*Notable risks or challenges associated with implementing the component. Would we need to make any breaking changes in order to achieve this component's goals?*



### Prior Art/Examples
- [W3C](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html)
- [FluentUI](https://developer.microsoft.com/en-us/fluentui#/controls/web/datepicker)

---

## Design

*Describe the design of the component, thinking through several perspectives:*

- *A customer using the component on a web page.*
- *A developer building an app with the component and interacting through HTML/CSS/JavaScript.*
- *A designer customizing the component.*

### API
*Component Name*
- `fast-date-picker`

*Props/Attrs*
- `value` - A predefined date.
= `locale` - Market and language
- `placeholder` - Text to appear when a date isn't present.
- `name` - the name of the control
- `appearance` - enum
    - outline (default)
    - filled
- `readonly` - If the date is editable.
- 'disabled` - If the control is disabled.
- `required` - The date field is required or optional.
- `min` - Earliest allowed date.
- `max` - Latest allowed date.cx
- `list` - A list of predefined options for the user to pick from.
- `step` - 

*Methods*


*Events*

- `change` - callback fired when the entered date has changed.

### Anatomy 

**Structure:**

```html
<div class="date-picker">
  <div class="label"></div>
  <div class="date-input">
    <input type="text" placeholder="${x => x.placeholder}" value=${x => x.value} />
    <span class="calendar-icon"
      @click=${x => x.openCalendar()}
    >
      <slot name="calendar-icon" aria-label="Choose date">&#128197;</slot>
    </span>
  </div>
  <div class="calendar ${x => x.calendarOpen ? '' : 'hide'}">
    <slot name="calendar" @mouseover=${x => x.overCalendar = true} @mouseout=${x => x.overCalendar = false} @click=${(x, c) => x.handleCalendarClick(c.event)}>
      <fast-calendar monthFormat="short" weekdayFormat="narrow" month="${x => x.calendarMonth}" year="${x => x.calendarYear}">
        <div class="calendar-change" slot="start">
          <div class="arrow" @click="${x => x.stepDownCalendar()}">&darr;</div>
          <div class="arrow" @click="${x => x.stepUpCalendar()}">&uarr;</div>
        </div>
      </fast-calendar>
    </slot>
  </div>
</div>
```


*Slot Names*
- `calendar` - Defaults to fast-calendar. Can be populated with the users own calendar.
- `calendar-icon` - The calendar icon used to open the calendar view.

- *Host Classes*
- *Slotted Content/Slotted Classes*
- *CSS Parts*

*Work closely with the visual design partner to co-develop the API and anatomy along side the visual design.

### Visual Appearance

*Provide Figma files and other design assets. Be sure to account for the various component states, including hover, active, etc. as well as validity, and appearance variants. Focus primarily on the officially supported design system as well as known community scenarios as appropriate. Consider other popular design systems during this process and, where possible, ensure that common design features that may not be part of the officially supported design system can be accommodated. Work closely with engineering to co-develop the visual design along side the API and anatomy.*

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

```html
    <fast-date-picker></fast-date-picker>
```

### States

*Key component states, valid state transitions, and how interactions trigger a state transition.*

### Accessibility

*Keyboard Navigation and Focus*
Should be able to tab to the date control and arrow over to the calendar icon.
Enter and space keys should open the calendar view.
Esc key should close the calendar view.
Focus should be set to either a selected date (the current date), or the first of the month if the current date is not on the current month.
Should be able to navigate between the months.
Should be able to arrow around the month to pick a specific date.
Should be able to arrow to the next and previous months.

*Form Input*

*Use with Assistive Technology*
Aria labeling for the calendar icon will say 'Choose date'. Upon picking a date, the aria labeling will change to 'Change date'.

### Globalization

*Consider whether the component has any special globalization needs such as:*

*Special RTL handling*
Calendar icon will appear on the right for LTR languages and on the left for RTL.

*Swapping of internal icons/visuals*
Is using the calendar icon good enough? The icon will be in a slot with the html entity for calendar as the default.

*Localization*
Different date formatting for different markets. This will be obtained through the browser built in localization for dates.

### Security

Not applicable.

This is a form field. Any required security will be handled by the developer using the component such as form injection.

### Performance

Performance should be pretty straight forward. Any perf considerations would occur in the calendar component. The date picker itself is primarily a shell that will includ validation.

### Dependencies

Needs to use the fast-calendar component.
Will need to be able to use the defined defaults in vNext.

### Test Plan

This will use standard unit tests and examples in Storybook for end-to-end tests.

### Tooling

*Are there any special considerations for tooling? Will tooling changes need to be made? Is there a special way to light up this component in our tooling that would be compelling for developers/designers?*

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---
## Appendix

### Resources

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
[W3 Examples](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html)
[W3 wiki](https://www.w3.org/wiki/HTML/Elements/input/date)
[Localized month and day names](https://www.abeautifulsite.net/posts/getting-localized-month-and-day-names-in-the-browser/)
[FluentUI date picker](https://developer.microsoft.com/en-us/fluentui#/controls/web/datepicker)

### Next Steps

- *Week view* - An option to pick the week of the year.
- *Weekday view* - Selection of the day of the week. Monday, Tuesday, Wednesday, etc.
- *Time picker* - A method for selecting a specific time.
- *Date and time view* - Option to include both date and time picking.
