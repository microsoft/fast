---
id: switch
title: fast-switch
sidebar_label: switch
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/switch/README.md
---

An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected web-component.

## Usage

```html
<fast-switch>
    Theme
    <span slot="checked-message">Dark</span>
    <span slot="unchecked-message">Light</span>
</fast-switch>
```

## Applying custom styles

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