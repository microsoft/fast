---
id: tabs
title: fast-tabs
sidebar_label: tabs
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/tabs/README.md
---

*Tabs* are a set of layered sections of content that display one panel of content at a time. Each tab panel has an associated tab element, that when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTab,
    fastTabPanel,
    fastTabs
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTab(),
        fastTabPanel(),
        fastTabs()
    );
```

## Usage

```html live
<fast-tabs activeid="entrees">
    <fast-tab id="apps">Appetizers</fast-tab>
    <fast-tab id="entrees">Entrees</fast-tab>
    <fast-tab id="desserts">Desserts</fast-tab>
    <fast-tab-panel id="appsPanel">
        <ol>
            <li><fast-anchor href="#" appearance="hypertext">Stuffed artichokes</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Bruschetta</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Oven-baked polenta</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Salami and Fig Crostini with Ricotta</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Rosemary-Potato Focaccia with Goat Cheese</fast-anchor></li>
        </ol>
    </fast-tab-panel>
    <fast-tab-panel id="entreesPanel">
        <ol>
            <li><fast-anchor href="#" appearance="hypertext">Mushroom-Sausage Ragù</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Tomato Bread Soup with Steamed Mussels</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Grilled Fish with Artichoke Caponata</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Celery Root and Mushroom Lasagna</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Osso Buco with Citrus Gremolata</fast-anchor></li>
        </ol>
    </fast-tab-panel>
    <fast-tab-panel id="dessertsPanel">
        <ol>
            <li><fast-anchor href="#" appearance="hypertext">Tiramisu</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Spumoni</fast-anchor></li>
            <li><fast-anchor href="#" appearance="hypertext">Limoncello and Ice Cream with Biscotti</fast-anchor></li>
        </ol>
    </fast-tab-panel>
</fast-tabs>
```

## Create your own design

### Tab

```ts
import { Tab, tabTemplate as template } from "@microsoft/fast-foundation";
import { tabStyles as styles } from "./my-tab.styles";

export const myTab = Tab.compose({
    baseName: "tab",
    template,
    styles,
});
```

### TabPanel

```ts
import { TabPanel, tabPanelTemplate as template } from "@microsoft/fast-foundation";
import { tabPanelStyles as styles } from "./my-tab-panel.styles";

export const myTabPanel = TabPanel.compose({
    baseName: "tab-panel",
    template,
    styles,
});
```

### Tabs

```ts
import { Tabs, tabsTemplate as template } from "@microsoft/fast-foundation";
import { tabsStyles as styles } from "./my-tabs.styles";

export const myTabs = Tabs.compose({
    baseName: "tabs",
    template,
    styles,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-tabs)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tabs/tabs.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tabpanel)
* [Open UI Analysis](https://open-ui.org/components/tabs.research)
