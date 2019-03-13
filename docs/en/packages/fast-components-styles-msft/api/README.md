---
id: index
---


FAST Components styles MSFT
===========================

A collection of JSS (JavaScript Style Sheets) objects and style utilities that power MSFT components in the FAST ecosystem. The component styles are intended to be compiled with [JSS](https://github.com/cssinjs/jss) and used with base components such as `@microsoft/fast-components-base-react`, for the styled components see the `@microsoft/fast-components-msft-react` package. The package can also be applied to a custom component.

Installation
------------

`npm i --save @microsoft/fast-components-styles-msft`

Usage
-----

An example of using the `manageJss` from `@microsoft/fast-jss-manager-react` higher order component to export a component with a JSS style using the package.

```
import React from "react";
import { ButtonStyles } from "@microsoft/fast-components-styles-msft";
import manageJss from "@microsoft/fast-jss-manager-react";

class Button extends React.Component {
    render() {
        return (
            <button className={this.props.managedClasses.button}>
                {this.props.children}
            </button>
        );
    }
}

export default manageJss(ButtonStyles)(Button);
```

## Index

### External modules

* ["action-toggle/index"](modules/_action_toggle_index_.md)
* ["action-trigger/index"](modules/_action_trigger_index_.md)
* ["badge/index"](modules/_badge_index_.md)
* ["breadcrumb/index"](modules/_breadcrumb_index_.md)
* ["button/index"](modules/_button_index_.md)
* ["call-to-action/index"](modules/_call_to_action_index_.md)
* ["caption/index"](modules/_caption_index_.md)
* ["card/index"](modules/_card_index_.md)
* ["carousel/index"](modules/_carousel_index_.md)
* ["checkbox/index"](modules/_checkbox_index_.md)
* ["context-menu-item/index"](modules/_context_menu_item_index_.md)
* ["context-menu/index"](modules/_context_menu_index_.md)
* ["design-system/index"](modules/_design_system_index_.md)
* ["dialog/index"](modules/_dialog_index_.md)
* ["divider/index"](modules/_divider_index_.md)
* ["flipper/index"](modules/_flipper_index_.md)
* ["heading/index"](modules/_heading_index_.md)
* ["hypertext/index"](modules/_hypertext_index_.md)
* ["image/index"](modules/_image_index_.md)
* ["index"](modules/_index_.md)
* ["label/index"](modules/_label_index_.md)
* ["metatext/index"](modules/_metatext_index_.md)
* ["number-field/index"](modules/_number_field_index_.md)
* ["paragraph/index"](modules/_paragraph_index_.md)
* ["patterns/input-field"](modules/_patterns_input_field_.md)
* ["patterns/outline"](modules/_patterns_outline_.md)
* ["patterns/switch-field"](modules/_patterns_switch_field_.md)
* ["patterns/typography"](modules/_patterns_typography_.md)
* ["pivot/index"](modules/_pivot_index_.md)
* ["progress/index"](modules/_progress_index_.md)
* ["radio/index"](modules/_radio_index_.md)
* ["select-option/index"](modules/_select_option_index_.md)
* ["select/index"](modules/_select_index_.md)
* ["subheading/index"](modules/_subheading_index_.md)
* ["text-action/index"](modules/_text_action_index_.md)
* ["text-area/index"](modules/_text_area_index_.md)
* ["text-field/index"](modules/_text_field_index_.md)
* ["toggle/index"](modules/_toggle_index_.md)
* ["typography/index"](modules/_typography_index_.md)
* ["utilities/acrylic"](modules/_utilities_acrylic_.md)
* ["utilities/breakpoints"](modules/_utilities_breakpoints_.md)
* ["utilities/colors"](modules/_utilities_colors_.md)
* ["utilities/density"](modules/_utilities_density_.md)
* ["utilities/elevation"](modules/_utilities_elevation_.md)
* ["utilities/fonts"](modules/_utilities_fonts_.md)
* ["utilities/height"](modules/_utilities_height_.md)
* ["utilities/keyof-to-type"](modules/_utilities_keyof_to_type_.md)
* ["utilities/typography"](modules/_utilities_typography_.md)

---

