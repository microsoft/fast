import { fluentUIComponentSchemas, textSchema } from "@microsoft/site-utilities";
import { uniqueId } from "lodash-es";
import {
    heading2Example,
    imageExample,
    paragraphExample,
} from "../native/library.native.examples";
import { longExampleText, shortExampleText } from "../constants";
import {
    fluentAnchorTag,
    fluentBadgeTag,
    fluentButtonTag,
    fluentCardTag,
    fluentCheckboxTag,
    fluentDialogTag,
    fluentDividerTag,
    fluentFlipperTag,
    fluentMenuItemTag,
    fluentMenuTag,
    fluentProgressRingTag,
    fluentProgressTag,
    fluentRadioGroupTag,
    fluentRadioTag,
    fluentSliderLabelTag,
    fluentSliderTag,
    fluentSwitchTag,
    fluentTabPanelTag,
    fluentTabsTag,
    fluentTabTag,
    fluentTextAreaTag,
    fluentTextFieldTag,
} from "./library.fluent-ui.tags";

export const fluentAnchorExample = {
    schemaId: fluentUIComponentSchemas[fluentAnchorTag].id,
    data: {
        href: "#",
    },
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "Anchor",
            dataLocation: "Slot",
        },
    ],
};
export const fluentButtonExample = {
    schemaId: fluentUIComponentSchemas[fluentButtonTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "Button",
            dataLocation: "Slot",
        },
    ],
};
export const fluentBadgeExample = {
    schemaId: fluentUIComponentSchemas[fluentBadgeTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};
export const fluentCardExample = {
    schemaId: fluentUIComponentSchemas[fluentCardTag].id,
    data: {
        style: "width: 320px",
    },
    dataLocation: "Slot",
    linkedData: [
        imageExample,
        {
            ...fluentBadgeExample,
            data: {
                style:
                    "margin: 5px 10px; --badge-fill-fill: #3278cd; --badge-color-color: white;",
                fill: "fill",
                color: "color",
            },
        },
        {
            ...heading2Example,
            data: {
                style: "margin: 5px 10px",
            },
        },
        {
            ...paragraphExample,
            data: {
                style: "margin: 0 10px",
            },
        },
        {
            ...fluentButtonExample,
            data: {
                style: "margin: 10px",
            },
        },
    ],
};
export const fluentCheckboxExample = {
    schemaId: fluentUIComponentSchemas[fluentCheckboxTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};
export const fluentDialogExample = {
    schemaId: fluentUIComponentSchemas[fluentDialogTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentDividerExample = {
    schemaId: fluentUIComponentSchemas[fluentDividerTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentFlipperExample = {
    schemaId: fluentUIComponentSchemas[fluentFlipperTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentMenuItemExample = {
    schemaId: fluentUIComponentSchemas[fluentMenuItemTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};
export const fluentMenuExample = {
    schemaId: fluentUIComponentSchemas[fluentMenuTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [fluentMenuItemExample, fluentMenuItemExample, fluentMenuItemExample],
};
export const fluentProgressExample = {
    schemaId: fluentUIComponentSchemas[fluentProgressTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentProgressRingExample = {
    schemaId: fluentUIComponentSchemas[fluentProgressRingTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentRadioGroupExample = {
    schemaId: fluentUIComponentSchemas[fluentRadioGroupTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentRadioExample = {
    schemaId: fluentUIComponentSchemas[fluentRadioTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentSliderExample = {
    schemaId: fluentUIComponentSchemas[fluentSliderTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentSliderLabelExample = {
    schemaId: fluentUIComponentSchemas[fluentSliderLabelTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentSwitchExample = {
    schemaId: fluentUIComponentSchemas[fluentSwitchTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentTabExample = {
    schemaId: fluentUIComponentSchemas[fluentTabTag].id,
    data: {
        id: uniqueId("Tab"),
    },
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};
export const fluentTabPanelExample = {
    schemaId: fluentUIComponentSchemas[fluentTabPanelTag].id,
    data: {
        id: uniqueId("TabPanel"),
    },
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: longExampleText,
            dataLocation: "Slot",
        },
    ],
};
export const fluentTabsExample = {
    schemaId: fluentUIComponentSchemas[fluentTabsTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        { ...fluentTabExample, data: { id: uniqueId("Tab") } },
        { ...fluentTabExample, data: { id: uniqueId("Tab") } },
        { ...fluentTabExample, data: { id: uniqueId("Tab") } },
        { ...fluentTabPanelExample, data: { id: uniqueId("Tabpanel") } },
        { ...fluentTabPanelExample, data: { id: uniqueId("Tabpanel") } },
        { ...fluentTabPanelExample, data: { id: uniqueId("Tabpanel") } },
    ],
};
export const fluentTextAreaExample = {
    schemaId: fluentUIComponentSchemas[fluentTextAreaTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fluentTextFieldExample = {
    schemaId: fluentUIComponentSchemas[fluentTextFieldTag].id,
    data: {},
    dataLocation: "Slot",
};
