---
id: switch
title: fast-switch
sidebar_label: switch
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/switch/README.md
---

An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected web-component.

## Setup

### Basic setup

```ts
import {
    provideFASTDesignSystem,
    fastSwitch
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSwitch()
    );
```

### Customizing the Indicator

```ts
import {
    provideFASTDesignSystem,
    fastSwitch
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSwitch({
            switch: `...your switch indicator...`
        })
    );
```

## Usage

```html live
<fast-switch>
    Theme
    <span slot="checked-message">Dark</span>
    <span slot="unchecked-message">Light</span>
</fast-switch>
```

## Create your own design

```ts
import {
    Switch,
    SwitchOptions,
    switchTemplate as template,
} from "@microsoft/fast-foundation";
import { switchStyles as styles } from "./my-switch.styles";

export const mySwitch = Switch.compose<SwitchOptions>({
    baseName: "switch",
    template,
    styles,
    switch: `...default switch indicator...`,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-switch)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/switch/switch.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#switch)
* [Open UI Analysis](https://open-ui.org/components/switch)