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