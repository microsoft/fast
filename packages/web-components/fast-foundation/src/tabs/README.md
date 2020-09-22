---
id: tabs
title: fast-tabs
sidebar_label: tabs
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/tabs/README.md
---

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-tabs activeId="entrees">
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
</fast-design-system-provider>
```

## Applying custom styles

### fast-tabs
```ts
import { customElement } from "@microsoft/fast-element";
import { Tabs, TabsTemplate as template } from "@microsoft/fast-foundation";
import { TabsStyles as styles } from "./tabs.styles";

@customElement({
    name: "fast-tabs",
    template,
    styles,
})
export class FASTTabs extends Tabs {}
```

### fast-tab

```ts
import { customElement } from "@microsoft/fast-element";
import { Tab, TabTemplate as template } from "@microsoft/fast-foundation";
import { TabStyles as styles } from "./tab.styles";

@customElement({
    name: "fast-tab",
    template,
    styles,
})
export class FASTTab extends Tab {}
```

### fast-tab-panel

```ts
import { customElement } from "@microsoft/fast-element";
import { TabPanel, TabPanelTemplate as template } from "@microsoft/fast-foundation";
import { TabPanelStyles as styles } from "./tab-panel.styles";

@customElement({
    name: "fast-tab-panel",
    template,
    styles,
})
export class FASTTabPanel extends TabPanel {}
```