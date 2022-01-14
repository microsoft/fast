import { FormCategoryDictionary } from "@microsoft/fast-tooling-react/dist/form/form.props";
import fastAccordionItemDefinition from "@microsoft/fast-components/dist/esm/accordion-item/accordion-item.vscode.definition.json";
import fastAnchorDefinition from "@microsoft/fast-components/dist/esm/anchor/anchor.vscode.definition.json";
import fastAnchoredRegionDefinition from "@microsoft/fast-components/dist/esm/anchored-region/anchored-region.vscode.definition.json";
import fastButtonDefinition from "@microsoft/fast-components/dist/esm/button/button.vscode.definition.json";
import fastCheckboxDefinition from "@microsoft/fast-components/dist/esm/checkbox/checkbox.vscode.definition.json";
import fastDataGridDefinition from "@microsoft/fast-components/dist/esm/data-grid/data-grid.vscode.definition.json";
import fastDataGridCellDefinition from "@microsoft/fast-components/dist/esm/data-grid/data-grid-cell.vscode.definition.json";
import fastDataGridRowDefinition from "@microsoft/fast-components/dist/esm/data-grid/data-grid-row.vscode.definition.json";
import fastDialogDefinition from "@microsoft/fast-components/dist/esm/dialog/dialog.vscode.definition.json";
import fastFlipperDefinition from "@microsoft/fast-components/dist/esm/flipper/flipper.vscode.definition.json";
import fastListboxDefinition from "@microsoft/fast-components/dist/esm/listbox/listbox.vscode.definition.json";
import fastListboxOptionDefinition from "@microsoft/fast-components/dist/esm/listbox-option/listbox-option.vscode.definition.json";
import fastNumberFieldDefinition from "@microsoft/fast-components/dist/esm/number-field/number-field.vscode.definition.json";
import fastRadioDefinition from "@microsoft/fast-components/dist/esm/radio/radio.vscode.definition.json";
import fastRadioGroupDefinition from "@microsoft/fast-components/dist/esm/radio-group/radio-group.vscode.definition.json";
import fastSelectDefinition from "@microsoft/fast-components/dist/esm/select/select.vscode.definition.json";
import fastSkeletonDefinition from "@microsoft/fast-components/dist/esm/skeleton/skeleton.vscode.definition.json";
import fastSliderDefinition from "@microsoft/fast-components/dist/esm/slider/slider.vscode.definition.json";
import fastSwitchDefinition from "@microsoft/fast-components/dist/esm/switch/switch.vscode.definition.json";
import fastTabsDefinition from "@microsoft/fast-components/dist/esm/tabs/tabs.vscode.definition.json";
import fastTextAreaDefinition from "@microsoft/fast-components/dist/esm/text-area/text-area.vscode.definition.json";
import fastTextFieldDefinition from "@microsoft/fast-components/dist/esm/text-field/text-field.vscode.definition.json";
import fastTooltipDefinition from "@microsoft/fast-components/dist/esm/tooltip/tooltip.vscode.definition.json";
import fastVirtualListDefinition from "@microsoft/fast-components/dist/esm/virtual-list/virtual-list.vscode.definition.json";

export const componentCategories: FormCategoryDictionary = {
    [fastAccordionItemDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["heading-level", "id"],
            },
        ],
    },
    [fastAnchorDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [
                    "download",
                    "hreflang",
                    "ping",
                    "referrerpolicy",
                    "rel",
                    "target",
                    "type",
                ],
            },
        ],
    },
    fastDesignTokens: {
        "": [
            {
                title: "Color",
                dataLocations: [
                    "base-layer-luminance",
                    "fill-color",
                    "accent-base-color",
                ],
            },
            {
                title: "Style",
                dataLocations: [
                    "control-corner-radius",
                    "stroke-width",
                    "focus-stroke-width",
                    "disabled-opacity",
                ],
            },
            {
                title: "Advanced",
                expandByDefault: false,
                dataLocations: [
                    "theme",
                    "design-unit",
                    "direction",
                    "type-ramp-minus-2-font-size",
                    "type-ramp-minus-2-line-height",
                    "type-ramp-minus-1-font-size",
                    "type-ramp-minus-1-line-height",
                    "type-ramp-base-font-size",
                    "type-ramp-base-line-height",
                    "type-ramp-plus-1-font-size",
                    "type-ramp-plus-1-line-height",
                    "type-ramp-plus-2-font-size",
                    "type-ramp-plus-2-line-height",
                    "type-ramp-plus-3-font-size",
                    "type-ramp-plus-3-line-height",
                    "type-ramp-plus-4-font-size",
                    "type-ramp-plus-4-line-height",
                    "type-ramp-plus-5-font-size",
                    "type-ramp-plus-5-line-height",
                    "type-ramp-plus-6-font-size",
                    "type-ramp-plus-6-line-height",
                    "accent-fill-rest-delta",
                    "accent-fill-hover-delta",
                    "accent-fill-active-delta",
                    "accent-fill-focus-delta",
                    "accent-fill-selected-delta",
                    "accent-foreground-rest-delta",
                    "accent-foreground-hover-delta",
                    "accent-foreground-active-delta",
                    "accent-foreground-focus-delta",
                    "neutral-fill-rest-delta",
                    "neutral-fill-hover-delta",
                    "neutral-fill-active-delta",
                    "neutral-fill-focus-delta",
                    "neutral-fill-selected-delta",
                    "neutral-fill-input-rest-delta",
                    "neutral-fill-input-hover-delta",
                    "neutral-fill-input-active-delta",
                    "neutral-fill-input-focus-delta",
                    "neutral-fill-input-selected-delta",
                    "neutral-fill-stealth-rest-delta",
                    "neutral-fill-stealth-hover-delta",
                    "neutral-fill-stealth-active-delta",
                    "neutral-fill-stealth-focus-delta",
                    "neutral-fill-stealth-selected-delta",
                    "neutral-fill-toggle-hover-delta",
                    "neutral-fill-toggle-active-delta",
                    "neutral-fill-toggle-focus-delta",
                    "neutral-fill-card-delta",
                    "neutral-foreground-hover-delta",
                    "neutral-foreground-active-delta",
                    "neutral-foreground-focus-delta",
                    "neutral-divider-rest-delta",
                    "neutral-outline-rest-delta",
                    "neutral-outline-hover-delta",
                    "neutral-outline-active-delta",
                    "neutral-outline-focus-delta",
                    "neutral-contrast-fill-rest-delta",
                    "neutral-contrast-fill-hover-delta",
                    "neutral-contrast-fill-active-delta",
                    "neutral-contrast-fill-focus-delta",
                    "Slot",
                ],
            },
        ],
    },
    [fastAnchoredRegionDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [
                    "viewport",
                    "horizontal-threshold",
                    "horizontal-scaling",
                    "vertical-threshold",
                    "vertical-scaling",
                    "fixed-placement",
                ],
            },
        ],
    },
    [fastButtonDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [
                    "autofocus",
                    "name",
                    "type",
                    "value",
                    "form",
                    "formaction",
                    "formenctype",
                    "formmethod",
                    "formnovalidate",
                    "formtarget",
                ],
            },
        ],
    },
    [fastCheckboxDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["name"],
            },
        ],
    },
    [fastDataGridDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [],
            },
        ],
    },
    [fastDataGridCellDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["cell-type", "grid-column"],
            },
        ],
    },
    [fastDataGridRowDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["row-type", "grid-template-columns"],
            },
        ],
    },
    [fastDialogDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [
                    "aria-label",
                    "aria-describedby",
                    "aria-labelledby",
                    "hidden",
                    "trap-focus",
                ],
            },
        ],
    },
    [fastFlipperDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["aria-hidden"],
            },
        ],
    },
    [fastListboxDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["role"],
            },
        ],
    },
    [fastNumberFieldDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["autofocus", "value", "list"],
            },
        ],
    },
    [fastRadioDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["name"],
            },
        ],
    },
    [fastRadioGroupDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["name", "value"],
            },
        ],
    },
    [fastSelectDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["name"],
            },
        ],
    },
    [fastSliderDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["name", "value"],
            },
        ],
    },
    [fastSwitchDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["name"],
            },
        ],
    },
    [fastTabsDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["activeid"],
            },
        ],
    },
    [fastTextAreaDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [
                    "autofocus",
                    "form",
                    "list",
                    "spellcheck",
                    "name",
                    "value",
                ],
            },
        ],
    },
    [fastTextFieldDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [
                    "value",
                    "autofocus",
                    "list",
                    "pattern",
                    "spellcheck",
                    "name",
                ],
            },
        ],
    },
    [fastTooltipDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["anchor"],
            },
        ],
    },
    [fastVirtualListDefinition.tags[0].name]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [],
            },
        ],
    },
};
