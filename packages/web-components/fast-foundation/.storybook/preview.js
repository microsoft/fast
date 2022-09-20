import { useArgs } from "@storybook/client-api";

import "@microsoft/fast-element/polyfills";
import "../src/anchor/stories/anchor.register.js";
import "../src/anchored-region/stories/anchored-region.register.js";
import "../src/avatar/stories/avatar.register.js";
import "../src/badge/stories/badge.register.js";
import "../src/button/stories/button.register.js";
import "../src/card/stories/card.register.js";
import "../src/checkbox/stories/checkbox.register.js";
import "../src/dialog/stories/dialog.register.js";
import "../src/disclosure/stories/disclosure.register.js";
import "../src/divider/stories/divider.register.js";
import "../src/flipper/stories/flipper.register.js";
import "../src/number-field/stories/number-field.register.js";
import "../src/picker/stories/picker.register.js";
import "../src/progress-ring/stories/progress-ring.register.js";
import "../src/progress/stories/progress.register.js";
import "../src/radio/stories/radio.register.js";
import "../src/search/stories/search.register.js";
import "../src/skeleton/stories/skeleton.register.js";
import "../src/switch/stories/switch.register.js";
import "../src/text-area/stories/text-area.register.js";
import "../src/text-field/stories/text-field.register.js";
import "../src/tooltip/stories/tooltip.register.js";

import "../src/data-list/stories/data-list-item.register";
import "../src/data-list/stories/data-list.register";

import "../src/data-grid/stories/data-grid-cell.register.js";
import "../src/data-grid/stories/data-grid-row.register.js";
import "../src/data-grid/stories/data-grid.register.js";

import "../src/calendar/stories/calendar.register.js";

import "../src/slider-label/stories/slider-label.register.js";
import "../src/slider/stories/slider.register.js";

import "../src/accordion-item/stories/accordion-item.register.js";
import "../src/accordion/stories/accordion.register.js";

import "../src/breadcrumb-item/stories/breadcrumb-item.register.js";
import "../src/breadcrumb/stories/breadcrumb.register.js";

import "../src/listbox-option/stories/listbox-option.register.js";

import "../src/combobox/stories/combobox.register.js";
import "../src/listbox/stories/listbox.register.js";
import "../src/select/stories/select.register.js";

import "../src/tab-panel/stories/tab-panel.register.js";
import "../src/tab/stories/tab.register.js";
import "../src/tabs/stories/tabs.register.js";

import "../src/horizontal-scroll/stories/horizontal-scroll.register.js";
import "../src/radio-group/stories/radio-group.register.js";
import "../src/toolbar/stories/toolbar.register.js";

import "../src/menu-item/stories/menu-item.register.js";
import "../src/menu/stories/menu.register.js";

import "../src/tree-item/stories/tree-item.register.js";
import "../src/tree-view/stories/tree-view.register.js";

import "../src/virtual-list/stories/virtual-list-item.register";
import "../src/virtual-list/stories/virtual-list.register";

export const decorators = [
    (Story, context) => {
        const [_, updateArgs] = useArgs();
        return Story({ ...context, updateArgs });
    },
];
