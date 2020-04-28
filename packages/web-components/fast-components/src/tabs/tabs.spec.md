# Tabs

## Overview

*Tabs* are a set of layered sections of content that display one panel of content at a time. Each tab panel has an associated tab element, that when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel.

### Use Cases

- Steve is researching for an upcoming vacation for him and his family. He opens his web browser and opens a new tab to make a rental car reservation and another for his flight information. Steve can quickly switch back and fourth between tabs to get the information he needs for the rental car reservation.

- Monika visits a website to learn how to fix her leaky sink. The website displays a vertical tab interface with each step. Monika can jump ahead steps or go back to previous steps by selecting various tabs.
  
### Features

- **Orientation:** Allows the tab list to be oriented horizontally above the tab content or vertically to the left or right (depending on language region) of the tab content.
- **Supplemental content:** Offers a way to add content via start and end to the left and/or right (depending on language region) of the the tab list.
- **ActiveIndicator:** Offers a way to add or remove an active indicator that highlights the currently active tab and animates to the next active tab. Defaults to true.
- **ActiveTab:** Provides a reference to the currently active tab vis the `change` event.
- **ActiveId:** Provides a way to set the active tab.

### Risks and Challenges

*Tabs* has specific guidance on DOM structure by the [WC3](https://w3c.github.io/aria-practices/examples/tabs/tabs-2/tabs.html). This structure lacks logical groupings by separating the tab from its content. Some component libraries compensate for this by creating some kind of intermediary grouping that makes it easier for app authors to implement. Even though the DOM structure disassociates that logical grouping. While other component libraries stick to the DOM structure model. 

Some scenarios require an indicator that highlights the currently active tab then animates to the next activated tab. Most solutions rely on finding active tab's position on screen and then preforming some math to get the position. This works for most cases but if the tab list repositions itself either by window resizing or other layout changes the active indicator is no longer aligned properly.

### Prior Art/Examples
- [FAST-DNA Pivot (React)](https://explore.fast.design/components/pivot)
- [Material UI](https://material-ui.com/components/tabs/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/tabs/)
- [Ant Design](https://ant.design/components/tabs/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/tabs)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/tab-view)

---

### API

*The key elements of the component's public API surface:*

**Tabs**
*Component names:*
- `fast-tabs`

*Attributes:*
- `orientation` - enum
  - horizontal - default
  - vertical
- `activeid` - string
- `activeindicator` - boolean, defaults to true

*Events:*
- `change` - fires when component `activetab` updates

*Parts:*
- tabs
- tablist
- tab
- tabpanel
- activeindicator

*Slot Names*
- start
- end

**Tab**
*Component names:*
- `fast-tab`

*Attributes:*
- `id` - string

*Slot Names*
- start
- end

**Tab Panel**
*Component names:*
- `fast-tab-panel`

*Attributes:*
- `id` - string

### Anatomy and Appearance

*Template:*
```HTML
<div class="tabs" class="tabs">
    <slot class="start" name="start" part="start"></slot>
    <div class="tablist" part="tablist" role="tablist" aria-label="Sample Tabs">
        <button class="tab" part="tab" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">
            Tab One
        </button>
        <button class="tab" part="tab" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">
            Tab Two
        </button>
        <button class="tab" part="tab" role="tab" aria-selected="false" aria-controls="panel-3" id="tab-3" tabindex="-1">
            Tab Three
        </button>
        <div class="activeindicator" part="activeindicator"></div>
    </div>
    <slot class="end" name="end" part="end"></slot>
    <div class="tabpanel" part="tabpanel" id="panel-1" role="tabpanel" tabindex="0" aria-labelledby="tab-1">
        Content of the first tab
    </div>
    <div class="tabpanel" part="tabpanel" id="panel-2" role="tabpanel" tabindex="0" aria-labelledby="tab-2" hidden>
        Content of the second tab
    </div>
    <div class="tabpanel" part="tabpanel" id="panel-3" role="tabpanel" tabindex="0" aria-labelledby="tab-3" hidden>
        Content of the third tab
    </div>
</div>
```

## Implementation

```HTML
<fast-tabs>
    <fast-tab id="tab-1">Tab One</fast-tab>
    <fast-tab id="tab-2">Tab Two</fast-tab>
    <fast-tab id="tab-3">Tab Three</fast-tab>
    <fast-tab-panel id="panel-1">Content of the first tab</fast-tab-panel>
    <fast-tab-panel id="panel-2">Content of the Second tab</fast-tab-panel>
    <fast-tab-panel id="panel-3">Content of the Third tab</fast-tab-panel>
    <div slot="before-content">
        Before content
    </div>
    <div slot="after-content">
        Before content
    </div>
</fast-tabs>
```

### States

*Tabs* can either be controlled or uncontrolled, meaning if `activeid` is passed the app author is taking control of the selected tab. When the `change` event fires it updates the `activeid` and pass a refrence to the `activetab`.

### Globalization

*Tabs* should mirror in RTL languages, meaning the tabs and tab content should flip direction.

### Dependencies

No dependencies outside of fast-element itself.

---

## Resources
- [WC3](https://w3c.github.io/aria-practices/#tabpanel)
- [MDN tab role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role)