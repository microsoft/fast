---
id: radio-group
title: fast-radio-group
sidebar_label: radio-group
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/radio-group/README.md
---

An implementation of a [radio-group](https://w3c.github.io/aria-practices/#radiobutton). While any DOM content is permissible as a child of the radiogroup, only `fast-radio`'s and slotted content with a role of `radio` will receive keyboard support.

## Usage

```html
<fast-design-system-provider use-defaults>
    <label id="radiogroup">Preset selected-value</label>
    <fast-radio-group value="maverick" aria-labelledby="radiogroup" name="best-pilot">
        <fast-radio value="ice-man">Ice Man</fast-radio>
        <fast-radio value="maverick">Maverick</fast-radio>
        <fast-radio value="viper">Viper</fast-radio>
        <fast-radio value="jester">Jester</fast-radio>
    </fast-radio-group>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { RadioGroup, RadioGroupTemplate as template } from "@microsoft/fast-foundation";
import { RadioGroupStyles as styles } from "./radio-group.styles";

@customElement({
    name: "fast-radio-group",
    template,
    styles,
})
export class FASTRadioGroup extends RadioGroup {}
```