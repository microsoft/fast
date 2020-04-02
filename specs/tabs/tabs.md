# Tabs

## Overview

*Tabs* are a set of layered sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an associated tab element, that when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel.

### Use Cases

- Steve is researching for an upcoming vacation for him and his family. He opens his web browser and opens a new tab to make a rental car reservation and another for his flight information. Steve can quickly switch back and fourth between tabs to get the information he needs for the rental car reservation.

- Monika visits a website to learn how to fix her leaky sink. The website displays a vertical tab interface with each step. Monika can jump ahead steps or go back to previous steps by selecting various tabs.
  
### Features

- **Orientation:** Allows the tab list to be oriented vertically to the left or right (depending on language region) of the tab content or horizontally above the content.
- **Tab activation:** Offers a way to activate a tab and it's content by either focusing a tab or by key press (Space or Enter).
- **Supplemental content:** Offers a way to add content to the left and/or right of the the tab list.

### Risks and Challenges

*Tabs* has specific guidance on DOM structure by the [WC3](https://w3c.github.io/aria-practices/examples/tabs/tabs-2/tabs.html). This structure lacks logical groupings by separating the tab from its content. Some component libraries compensate for this by creating some kind of intermediary grouping that makes it easier for app authors to implement. Even though the DOM structure disassociates that logical grouping. While other component libraries stick to the DOM structure model. 

### Prior Art/Examples
- [FAST-DNA Pivot (React)](https://explore.fast.design/components/pivot)
- [Material UI](https://material-ui.com/components/tabs/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/tabs/)
- [Ant Design](https://ant.design/components/tabs/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/tabs)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/tab-view)

---

### API

*Component name:*
- `fast-tabs`

*Attributes:*
- `orientation` - enum
  - horizontal - default
  - vertical
- `activeId` - string
- `tab-activation` - enum 
  - auto - default
  - manual

*Events:*
- `change` - fires when component `activeId` updates

### Anatomy and Appearance

*Parts:*
- tabs
- tablist
- tab
- tabpanel

*Slot Names*
- before-content
- after-content

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

*Logical grouping option 1:*
```HTML
<fast-tabs>
    <fast-tab-pane tab="Tab One" key="1">
        Content of the first tab
    </fast-tab-pane>
    <fast-tab-pane tab="Tab Two" key="2">
        Content of the second tab
    </fast-tab-pane>
    <fast-tab-pane tab="Tab Three" key="3">
        Content of the third tab
    </fast-tab-pane>
    <div slot="before-content">
        Before content
    </div>
    <div slot="after-content">
        Before content
    </div>
</fast-tabs>
```

*Logical grouping option 2:*
```HTML
<fast-tabs>
    <fast-tab-item>
        <fast-tab>Tab One</fast-tab>
        <fast-tab-panel>Content of the first tab</fast-tab-panel>
    </fast-tab-item>
    <fast-tab-item>
        <fast-tab>Tab Two</fast-tab>
        <fast-tab-panel>Content of the Second tab</fast-tab-panel>
    </fast-tab-item>
    <fast-tab-item>
        <fast-tab>Tab Three</fast-tab>
        <fast-tab-panel>Content of the Third tab</fast-tab-panel>
    </fast-tab-item>
    <div slot="before-content">
        Before content
    </div>
    <div slot="after-content">
        Before content
    </div>
</fast-tabs>
```

*DOM grouping:*
```HTML
<fast-tabs>
    <fast-tab-list>
        <fast-tab>Tab One</fast-tab>
        <fast-tab>Tab Two</fast-tab>
        <fast-tab>Tab Three</fast-tab>
    </fast-tab-list>
    <fast-tab-panel>Content of the first tab</fast-tab-panel>
    <fast-tab-panel>Content of the Second tab</fast-tab-panel>
    <fast-tab-panel>Content of the Third tab</fast-tab-panel>
    <div slot="before-content">
        Before content
    </div>
    <div slot="after-content">
        Before content
    </div>
</fast-tabs>
```

### States

*Tabs* can either be controlled or uncontrolled, meaning if `activeId` is passed the app author is taking control of the selected tab. The `change` event fires differently depending on the `tab-activation` attribute, on tab focus if `tab-activation` is set to `"focus"` or on mouse click or "spacebar" press if `tab-activation` is set to `"key-press"`.

### Globalization

*Tabs* should mirror in RTL languages, meaning the tabs and tab content should flip direction.

### Dependencies

No dependencies outside of fast-element itself.

---

## Resources
- [WC3](https://w3c.github.io/aria-practices/#tabpanel)
- [MDN tab role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role)
