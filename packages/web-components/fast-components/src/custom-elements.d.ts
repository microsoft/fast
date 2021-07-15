/**
 * Export all custom element definitions
 */
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
import type { Anchor } from "./anchor/index";
import type { Button } from "./button/index";
import type { Card } from "./card/index";
import type { Disclosure } from "./disclosure/index";
import type { SliderLabel } from "./slider-label/index";
import type { TextArea } from "./text-area/index";
import type { TextField } from "./text-field/index";
import type { Toolbar } from "./toolbar/index";
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
 */
export declare const allComponents: {
    fastAccordion: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Accordion
    >;
    fastAccordionItem: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").AccordionItemOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").AccordionItemOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastAnchor: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof Anchor
    >;
    fastAnchoredRegion: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").AnchoredRegion
    >;
    fastAvatar: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").AvatarOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").AvatarOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastBadge: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Badge
    >;
    fastBreadcrumb: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Breadcrumb
    >;
    fastBreadcrumbItem: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").BreadcrumbItemOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").BreadcrumbItemOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastButton: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof Button
    >;
    fastCard: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof Card
    >;
    fastCheckbox: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").CheckboxOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").CheckboxOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastCombobox: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").ComboboxOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").ComboboxOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastDataGrid: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").DataGrid
    >;
    fastDataGridCell: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").DataGridCell
    >;
    fastDataGridRow: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").DataGridRow
    >;
    fastDialog: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Dialog
    >;
    fastDisclosure: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof Disclosure
    >;
    fastDivider: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Divider
    >;
    fastFlipper: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FlipperOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FlipperOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastHorizontalScroll: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").HorizontalScrollOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").HorizontalScrollOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastListbox: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Listbox
    >;
    fastOption: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").ListboxOption
    >;
    fastMenu: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Menu
    >;
    fastMenuItem: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").MenuItemOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").MenuItemOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastNumberField: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").NumberFieldOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").NumberFieldOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastProgress: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").ProgressOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").ProgressOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastProgressRing: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").ProgressRingOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").ProgressRingOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastRadio: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").RadioOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").RadioOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastRadioGroup: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").RadioGroup
    >;
    fastSelect: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").SelectOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").SelectOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastSkeleton: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Skeleton
    >;
    fastSlider: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").SliderOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").SliderOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastSliderLabel: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof SliderLabel
    >;
    fastSwitch: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").SwitchOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").SwitchOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
    fastTabs: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Tabs
    >;
    fastTab: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Tab
    >;
    fastTabPanel: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").TabPanel
    >;
    fastTextArea: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof TextArea
    >;
    fastTextField: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof TextField
    >;
    fastTooltip: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").Tooltip
    >;
    fastToolbar: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof Toolbar
    >;
    fastTreeView: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").FoundationElementDefinition
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").FoundationElementDefinition,
        typeof import("@microsoft/fast-foundation").TreeView
    >;
    fastTreeItem: (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            import("@microsoft/fast-foundation").TreeItemOptions
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<
        import("@microsoft/fast-foundation").TreeItemOptions,
        import("@microsoft/fast-element").Constructable<
            import("@microsoft/fast-foundation").FoundationElement
        >
    >;
};
