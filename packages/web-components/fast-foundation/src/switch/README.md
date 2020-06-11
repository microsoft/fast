---
id: fast-switch
title: fast-switch
sidebar_label: fast-switch
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/switch/README.md
---

An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected web-component.

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Switch, SwitchTemplate as template } from "@microsoft/fast-foundation";
import { SwitchStyles as styles } from "./switch.styles";

@customElement({
    name: "fast-switch",
    template,
    styles,
})
export class FASTSwitch extends Switch {}
```

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-switch>
        Theme
        <span slot="checked-message">Dark</span>
        <span slot="unchecked-message">Light</span>
    </fast-switch>
</fast-design-system-provider>
```