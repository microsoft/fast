/**
 * Export all custom element definitions
 */

import { fastAccordion, fastAccordionItem } from "./accordion/index.js";
import { fastDataGrid, fastDataGridCell, fastDataGridRow } from "./data-grid/index.js";
import {
    fastPicker,
    fastPickerList,
    fastPickerListItem,
    fastPickerMenu,
    fastPickerMenuOption,
} from "./picker/index.js";
import { fastTab, fastTabPanel, fastTabs } from "./tabs/index.js";

import type { Anchor } from "./anchor/index.js";
import type { Button } from "./button/index.js";
import type { Card } from "./card/index.js";
import type { Container } from "@microsoft/fast-foundation";
import type { DesignSystemProvider } from "./design-system-provider/index.js";
import type { Disclosure } from "./disclosure/index.js";
import { fastAnchor } from "./anchor/index.js";
import { fastAnchoredRegion } from "./anchored-region/index.js";
import { fastAvatar } from "./avatar/index.js";
import { fastBadge } from "./badge/index.js";
import { fastBreadcrumb } from "./breadcrumb/index.js";
import { fastBreadcrumbItem } from "./breadcrumb-item/index.js";
import { fastButton } from "./button/index.js";
import { fastCalendar } from "./calendar/index.js";
import { fastCard } from "./card/index.js";
import { fastCheckbox } from "./checkbox/index.js";
import { fastCombobox } from "./combobox/index.js";
import { fastDatePicker } from "./date-picker/index.js";
import { fastDesignSystemProvider } from "./design-system-provider/index.js";
import { fastDialog } from "./dialog/index.js";
import { fastDisclosure } from "./disclosure/index.js";
import { fastDivider } from "./divider/index.js";
import { fastFlipper } from "./flipper/index.js";
import { fastHorizontalScroll } from "./horizontal-scroll/index.js";
import { fastListbox } from "./listbox/index.js";
import { fastMenu } from "./menu/index.js";
import { fastMenuItem } from "./menu-item/index.js";
import { fastNumberField } from "./number-field/index.js";
import { fastOption } from "./listbox-option/index.js";
import { fastProgress } from "./progress/index.js";
import { fastProgressRing } from "./progress-ring/index.js";
import { fastRadio } from "./radio/index.js";
import { fastRadioGroup } from "./radio-group/index.js";
import { fastSearch } from "./search/index.js";
import { fastSelect } from "./select/index.js";
import { fastSkeleton } from "./skeleton/index.js";
import { fastSlider } from "./slider/index.js";
import { fastSliderLabel } from "./slider-label/index.js";
import { fastSwitch } from "./switch/index.js";
import { fastTextArea } from "./text-area/index.js";
import { fastTextField } from "./text-field/index.js";
import { fastToolbar } from "./toolbar/index.js";
import { fastTooltip } from "./tooltip/index.js";
import { fastTreeItem } from "./tree-item/index.js";
import { fastTreeView } from "./tree-view/index.js";
import type { HorizontalScroll } from "./horizontal-scroll/index.js";
import type { Listbox } from "./listbox/index.js";
import type { Search } from "./search/index.js";
import type { SliderLabel } from "./slider-label/index.js";
import type { TextArea } from "./text-area/index.js";
import type { TextField } from "./text-field/index.js";
import type { Toolbar } from "./toolbar/index.js";

// Don't delete these. They're needed so that API-extractor doesn't add import types
// with improper pathing
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-enable @typescript-eslint/no-unused-vars */

// When adding new components, make sure to add the component to the `allComponents` object
// in addition to exporting the component by name. Ideally we would be able to just add
// `export * as allComponents from "./custom-elements" from  src/index.ts but API extractor
// throws for `export * as` expressions. https://github.com/microsoft/rushstack/pull/1796S

export {
    fastAccordion,
    fastAccordionItem,
    fastAnchor,
    fastAnchoredRegion,
    fastAvatar,
    fastBadge,
    fastBreadcrumb,
    fastBreadcrumbItem,
    fastButton,
    fastCalendar,
    fastCard,
    fastCheckbox,
    fastCombobox,
    fastDataGrid,
    fastDataGridCell,
    fastDataGridRow,
    fastDatePicker,
    fastDesignSystemProvider,
    fastDialog,
    fastDisclosure,
    fastDivider,
    fastFlipper,
    fastHorizontalScroll,
    fastListbox,
    fastOption,
    fastMenu,
    fastMenuItem,
    fastNumberField,
    fastPicker,
    fastPickerList,
    fastPickerListItem,
    fastPickerMenu,
    fastPickerMenuOption,
    fastProgress,
    fastProgressRing,
    fastRadio,
    fastRadioGroup,
    fastSearch,
    fastSelect,
    fastSkeleton,
    fastSlider,
    fastSliderLabel,
    fastSwitch,
    fastTabs,
    fastTab,
    fastTabPanel,
    fastTextArea,
    fastTextField,
    fastTooltip,
    fastToolbar,
    fastTreeView,
    fastTreeItem,
};

/**
 * All Web Components
 * @public
 * @remarks
 * This object can be passed directly to the Design System's `register` method to
 * statically link and register all available components.
 */
export const allComponents = {
    fastAccordion,
    fastAccordionItem,
    fastAnchor,
    fastAnchoredRegion,
    fastAvatar,
    fastBadge,
    fastBreadcrumb,
    fastBreadcrumbItem,
    fastButton,
    fastCalendar,
    fastCard,
    fastCheckbox,
    fastCombobox,
    fastDataGrid,
    fastDataGridCell,
    fastDataGridRow,
    fastDatePicker,
    fastDesignSystemProvider,
    fastDialog,
    fastDisclosure,
    fastDivider,
    fastFlipper,
    fastHorizontalScroll,
    fastListbox,
    fastOption,
    fastMenu,
    fastMenuItem,
    fastNumberField,
    fastPicker,
    fastPickerList,
    fastPickerListItem,
    fastPickerMenu,
    fastPickerMenuOption,
    fastProgress,
    fastProgressRing,
    fastRadio,
    fastRadioGroup,
    fastSearch,
    fastSelect,
    fastSkeleton,
    fastSlider,
    fastSliderLabel,
    fastSwitch,
    fastTabs,
    fastTab,
    fastTabPanel,
    fastTextArea,
    fastTextField,
    fastTooltip,
    fastToolbar,
    fastTreeView,
    fastTreeItem,
    register(container?: Container, ...rest: any[]) {
        if (!container) {
            // preserve backward compatibility with code that loops through
            // the values of this object and calls them as funcs with no args
            return;
        }

        for (const key in this) {
            if (key === "register") {
                continue;
            }

            this[key]().register(container, ...rest);
        }
    },
};
