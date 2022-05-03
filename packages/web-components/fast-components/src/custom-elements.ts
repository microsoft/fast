// Don't delete these. They're needed so that API-extractor doesn't add import types
// with improper pathing
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Anchor } from "@microsoft/fast-foundation";
import type { Button } from "@microsoft/fast-foundation";
import type { Card } from "@microsoft/fast-foundation";
import type { Container } from "@microsoft/fast-foundation";
import type { Disclosure } from "@microsoft/fast-foundation";
import type { HorizontalScroll } from "@microsoft/fast-foundation";
import type { Listbox } from "@microsoft/fast-foundation";
import type { ListboxElement } from "@microsoft/fast-foundation";
import type { Search } from "@microsoft/fast-foundation";
import type { SliderLabel } from "@microsoft/fast-foundation";
import type { TextArea } from "@microsoft/fast-foundation";
import type { TextField } from "@microsoft/fast-foundation";
import type { Toolbar } from "@microsoft/fast-foundation";
import type { VirtualList } from "@microsoft/fast-foundation";

/**
 * Export all custom element definitions
 */
import { fastAccordion, fastAccordionItem } from "./accordion/index.js";
import { fastAnchor } from "./anchor/index.js";
import { fastAnchoredRegion } from "./anchored-region/index.js";
import { fastAvatar } from "./avatar/index.js";
import { fastBadge } from "./badge/index.js";
import { fastBreadcrumbItem } from "./breadcrumb-item/index.js";
import { fastBreadcrumb } from "./breadcrumb/index.js";
import { fastButton } from "./button/index.js";
import { fastCalendar } from "./calendar/index.js";
import { fastCard } from "./card/index.js";
import { fastCheckbox } from "./checkbox/index.js";
import { fastCombobox } from "./combobox/index.js";
import { fastDataGrid, fastDataGridCell, fastDataGridRow } from "./data-grid/index.js";
import { fastDesignSystemProvider } from "./design-system-provider/index.js";
/**
 * Don't remove. This is needed to prevent api-extractor errors.
 */
import type { DesignSystemProvider } from "./design-system-provider/index.js";
import { fastDialog } from "./dialog/index.js";
import { fastDisclosure } from "./disclosure/index.js";
import { fastDivider } from "./divider/index.js";
import { fastFlipper } from "./flipper/index.js";
import { fastHorizontalScroll } from "./horizontal-scroll/index.js";
import { fastOption } from "./listbox-option/index.js";
import { fastListbox } from "./listbox/index.js";
import { fastMenuItem } from "./menu-item/index.js";
import { fastMenu } from "./menu/index.js";
import { fastNumberField } from "./number-field/index.js";
import {
    fastPicker,
    fastPickerList,
    fastPickerListItem,
    fastPickerMenu,
    fastPickerMenuOption,
} from "./picker/index";
import { fastProgressRing } from "./progress-ring/index";
import { fastProgress } from "./progress/index";
import { fastRadioGroup } from "./radio-group/index";
import { fastRadio } from "./radio/index";
import { fastSearch } from "./search/index";
import { fastSelect } from "./select/index";
import { fastSkeleton } from "./skeleton/index";
import { fastSliderLabel } from "./slider-label/index";
import { fastSlider } from "./slider/index";
import { fastSwitch } from "./switch/index";
import { fastTab, fastTabPanel, fastTabs } from "./tabs/index";
import { fastTextArea } from "./text-area/index";
import { fastTextField } from "./text-field/index";
import { fastToolbar } from "./toolbar/index";
import { fastTooltip } from "./tooltip/index";
import { fastTreeItem } from "./tree-item/index";
import { fastTreeView } from "./tree-view/index";
import { fastVirtualList, fastVirtualListItem } from "./virtual-list/index";

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
    fastVirtualList,
    fastVirtualListItem,
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
    fastVirtualList,
    fastVirtualListItem,
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
