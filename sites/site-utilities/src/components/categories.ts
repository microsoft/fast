import { FormCategoryDictionary } from "@microsoft/fast-tooling-react/dist/form/form.props";
import { fastAccordionItemDefinition } from "@microsoft/fast-components/dist/esm/accordion-item/accordion-item.definition.js";
import { fastAnchorDefinition } from "@microsoft/fast-components/dist/esm/anchor/anchor.definition.js";
import { fastAnchoredRegionDefinition } from "@microsoft/fast-components/dist/esm/anchored-region/anchored-region.definition.js";
import { fastButtonDefinition } from "@microsoft/fast-components/dist/esm/button/button.definition.js";
import { fastCheckboxDefinition } from "@microsoft/fast-components/dist/esm/checkbox/checkbox.definition.js";
import { fastDataGridDefinition } from "@microsoft/fast-components/dist/esm/data-grid/data-grid.definition.js";
import { fastDataGridCellDefinition } from "@microsoft/fast-components/dist/esm/data-grid/data-grid-cell.definition.js";
import { fastDataGridRowDefinition } from "@microsoft/fast-components/dist/esm/data-grid/data-grid-row.definition.js";
import { fastDialogDefinition } from "@microsoft/fast-components/dist/esm/dialog/dialog.definition.js";
import { fastFlipperDefinition } from "@microsoft/fast-components/dist/esm/flipper/flipper.definition.js";
import { fastListboxDefinition } from "@microsoft/fast-components/dist/esm/listbox/listbox.definition.js";
import { fastListboxOptionDefinition } from "@microsoft/fast-components/dist/esm/listbox-option/listbox-option.definition.js";
import { fastNumberFieldDefinition } from "@microsoft/fast-components/dist/esm/number-field/number-field.definition.js";
import { fastRadioDefinition } from "@microsoft/fast-components/dist/esm/radio/radio.definition.js";
import { fastRadioGroupDefinition } from "@microsoft/fast-components/dist/esm/radio-group/radio-group.definition.js";
import { fastSelectDefinition } from "@microsoft/fast-components/dist/esm/select/select.definition.js";
import { fastSkeletonDefinition } from "@microsoft/fast-components/dist/esm/skeleton/skeleton.definition.js";
import { fastSliderDefinition } from "@microsoft/fast-components/dist/esm/slider/slider.definition.js";
import { fastSwitchDefinition } from "@microsoft/fast-components/dist/esm/switch/switch.definition.js";
import { fastTabsDefinition } from "@microsoft/fast-components/dist/esm/tabs/tabs.definition.js";
import { fastTextAreaDefinition } from "@microsoft/fast-components/dist/esm/text-area/text-area.definition.js";
import { fastTextFieldDefinition } from "@microsoft/fast-components/dist/esm/text-field/text-field.definition.js";
import { fastTooltipDefinition } from "@microsoft/fast-components/dist/esm/tooltip/tooltip.definition.js";

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
};
