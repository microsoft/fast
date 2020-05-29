---
id: fast-tabs
title: fast-tabs
sidebar_label: fast-tabs
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/tabs/README.md
---

## Applying Custom Styles

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

## Usage

```html
<fast-tabs activeId="entrees">
    <fast-tab id="apps">Appetizers</fast-tab>
    <fast-tab id="entrees">Entrees</fast-tab>
    <fast-tab id="desserts">Desserts</fast-tab>
    <fast-tab-panel id="appsPanel">
        <a href="#">Stuffed artichokes</a>
        <a href="#">Bruschetta</a>
        <a href="#">Oven-baked polenta</a>
        <a href="#">Salami and Fig Crostini with Ricotta</a>
        <a href="#">Rosemary-Potato Focaccia with Goat Cheese</a>
    </fast-tab-panel>
    <fast-tab-panel id="entreesPanel">
        <a href="#">Mushroom-Sausage Ragù</a>
        <a href="#">Tomato Bread Soup with Steamed Mussels</a>
        <a href="#">Grilled Fish with Artichoke Caponata</a>
        <a href="#">Celery Root and Mushroom Lasagna</a>
        <a href="#">Osso Buco with Citrus Gremolata</a>
    </fast-tab-panel>
    <fast-tab-panel id="dessertsPanel">
        <a href="#">Tiramisu</a>
        <a href="#">Spumoni</a>
        <a href="#">Limoncello and Ice Cream with Biscotti</a>
    </fast-tab-panel>
</fast-tabs>
```