/**
 * Export all custom element definitions
 */
import type { Container } from "@microsoft/fast-foundation";
import { fastAccordion, fastAccordionItem } from "./accordion/index";
import { fastAnchor } from "./anchor/index";
import { fastAnchoredRegion } from "./anchored-region/index";
import { fastAvatar } from "./avatar/index";
import { fastBadge } from "./badge/index";
import { fastBreadcrumbItem } from "./breadcrumb-item/index";
import { fastBreadcrumb } from "./breadcrumb/index";
import { fastButton } from "./button/index";
import { fastCard } from "./card/index";
import { fastCheckbox } from "./checkbox/index";
import { fastCombobox } from "./combobox/index";
import { fastDataGrid, fastDataGridCell, fastDataGridRow } from "./data-grid/index";
import { fastDesignSystemProvider } from "./design-system-provider/index";
import { fastDialog } from "./dialog/index";
import { fastDisclosure } from "./disclosure/index";
import { fastDivider } from "./divider/index";
import { fastFlipper } from "./flipper/index";
import { fastHorizontalScroll } from "./horizontal-scroll/index";
import { fastOption } from "./listbox-option/index";
import { fastListbox } from "./listbox/index";
import { fastMenuItem } from "./menu-item/index";
import { fastMenu } from "./menu/index";
import { fastNumberField } from "./number-field/index";
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

// Don't delete these. They're needed so that API-extractor doesn't add import types
// with improper pathing
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Anchor } from "./anchor/index";
import type { Button } from "./button/index";
import type { Card } from "./card/index";
import type { DesignSystemProvider } from "./design-system-provider/index";
import type { Disclosure } from "./disclosure/index";
import type { HorizontalScroll } from "./horizontal-scroll/index";
import type { SliderLabel } from "./slider-label/index";
import type { TextArea } from "./text-area/index";
import type { TextField } from "./text-field/index";
import type { Toolbar } from "./toolbar/index";
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
    register(container?: Container) {
        if (!container) {
            // preserve backward compatibility with code that loops through
            // the values of this object and calls them as funcs with no args
            return;
        }

        for (const key in this) {
            if (key === "register") {
                continue;
            }

            this[key]().register(container);
        }
    },
};
