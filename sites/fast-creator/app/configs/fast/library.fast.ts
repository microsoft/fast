import { fastComponentSchemas } from "@microsoft/site-utilities";
import { WebComponentLibraryDefinition } from "../typings";
import {
    fastAnchorExample,
    fastBadgeExample,
    fastButtonExample,
    fastCardExample,
    fastCheckboxExample,
    fastDialogExample,
    fastDividerExample,
    fastFlipperExample,
    fastMenuExample,
    fastMenuItemExample,
    fastProgressExample,
    fastProgressRingExample,
    fastRadioExample,
    fastRadioGroupExample,
    fastSliderExample,
    fastSliderLabelExample,
    fastSwitchExample,
    fastTabExample,
    fastTabPanelExample,
    fastTabsExample,
    fastTextAreaExample,
    fastTextFieldExample,
} from "./library.fast.examples";
import {
    fastAnchorTag,
    fastBadgeTag,
    fastButtonTag,
    fastCardTag,
    fastCheckboxTag,
    fastDialogTag,
    fastDividerTag,
    fastFlipperTag,
    fastMenuItemTag,
    fastMenuTag,
    fastProgressRingTag,
    fastProgressTag,
    fastRadioGroupTag,
    fastRadioTag,
    fastSliderLabelTag,
    fastSliderTag,
    fastSwitchTag,
    fastTabPanelTag,
    fastTabsTag,
    fastTabTag,
    fastTextAreaTag,
    fastTextFieldTag,
} from "./library.fast.tags";
import { registerFASTComponents } from "./library.fast.registry";
export const fastComponentId = "fast-components";

export const fastComponentLibrary: WebComponentLibraryDefinition = {
    id: fastComponentId,
    displayName: "FAST Components",
    optional: true,
    import: async () => {
        await import("./library.fast.import");
    },
    register: registerFASTComponents,
    componentDictionary: {
        [fastComponentSchemas[fastAnchorTag].$id]: {
            displayName: fastComponentSchemas[fastAnchorTag].title,
            schema: fastComponentSchemas[fastAnchorTag],
            example: fastAnchorExample,
        },
        [fastComponentSchemas[fastButtonTag].$id]: {
            displayName: fastComponentSchemas[fastButtonTag].title,
            schema: fastComponentSchemas[fastButtonTag],
            example: fastButtonExample,
        },
        [fastComponentSchemas[fastBadgeTag].$id]: {
            displayName: fastComponentSchemas[fastBadgeTag].title,
            schema: fastComponentSchemas[fastBadgeTag],
            example: fastBadgeExample,
        },
        [fastComponentSchemas[fastCardTag].$id]: {
            displayName: fastComponentSchemas[fastCardTag].title,
            schema: fastComponentSchemas[fastCardTag],
            example: fastCardExample,
        },
        [fastComponentSchemas[fastCheckboxTag].$id]: {
            displayName: fastComponentSchemas[fastCheckboxTag].title,
            schema: fastComponentSchemas[fastCheckboxTag],
            example: fastCheckboxExample,
        },
        [fastComponentSchemas[fastDialogTag].$id]: {
            displayName: fastComponentSchemas[fastDialogTag].title,
            schema: fastComponentSchemas[fastDialogTag],
            example: fastDialogExample,
        },
        [fastComponentSchemas[fastDividerTag].$id]: {
            displayName: fastComponentSchemas[fastDividerTag].title,
            schema: fastComponentSchemas[fastDividerTag],
            example: fastDividerExample,
        },
        [fastComponentSchemas[fastFlipperTag].$id]: {
            displayName: fastComponentSchemas[fastFlipperTag].title,
            schema: fastComponentSchemas[fastFlipperTag],
            example: fastFlipperExample,
        },
        [fastComponentSchemas[fastMenuTag].$id]: {
            displayName: fastComponentSchemas[fastMenuTag].title,
            schema: fastComponentSchemas[fastMenuTag],
            example: fastMenuExample,
        },
        [fastComponentSchemas[fastMenuItemTag].$id]: {
            displayName: fastComponentSchemas[fastMenuItemTag].title,
            schema: fastComponentSchemas[fastMenuItemTag],
            example: fastMenuItemExample,
        },
        [fastComponentSchemas[fastProgressTag].$id]: {
            displayName: fastComponentSchemas[fastProgressTag].title,
            schema: fastComponentSchemas[fastProgressTag],
            example: fastProgressExample,
        },
        [fastComponentSchemas[fastProgressRingTag].$id]: {
            displayName: fastComponentSchemas[fastProgressRingTag].title,
            schema: fastComponentSchemas[fastProgressRingTag],
            example: fastProgressRingExample,
        },
        [fastComponentSchemas[fastRadioGroupTag].$id]: {
            displayName: fastComponentSchemas[fastRadioGroupTag].title,
            schema: fastComponentSchemas[fastRadioGroupTag],
            example: fastRadioGroupExample,
        },
        [fastComponentSchemas[fastRadioTag].$id]: {
            displayName: fastComponentSchemas[fastRadioTag].title,
            schema: fastComponentSchemas[fastRadioTag],
            example: fastRadioExample,
        },
        [fastComponentSchemas[fastSliderTag].$id]: {
            displayName: fastComponentSchemas[fastSliderTag].title,
            schema: fastComponentSchemas[fastSliderTag],
            example: fastSliderExample,
        },
        [fastComponentSchemas[fastSliderLabelTag].$id]: {
            displayName: fastComponentSchemas[fastSliderLabelTag].title,
            schema: fastComponentSchemas[fastSliderLabelTag],
            example: fastSliderLabelExample,
        },
        [fastComponentSchemas[fastSwitchTag].$id]: {
            displayName: fastComponentSchemas[fastSwitchTag].title,
            schema: fastComponentSchemas[fastSwitchTag],
            example: fastSwitchExample,
        },
        [fastComponentSchemas[fastTabsTag].$id]: {
            displayName: fastComponentSchemas[fastTabsTag].title,
            schema: fastComponentSchemas[fastTabsTag],
            example: fastTabsExample,
        },
        [fastComponentSchemas[fastTabTag].$id]: {
            displayName: fastComponentSchemas[fastTabTag].title,
            schema: fastComponentSchemas[fastTabTag],
            example: fastTabExample,
        },
        [fastComponentSchemas[fastTabPanelTag].$id]: {
            displayName: fastComponentSchemas[fastTabPanelTag].title,
            schema: fastComponentSchemas[fastTabPanelTag],
            example: fastTabPanelExample,
        },
        [fastComponentSchemas[fastTextAreaTag].$id]: {
            displayName: fastComponentSchemas[fastTextAreaTag].title,
            schema: fastComponentSchemas[fastTextAreaTag],
            example: fastTextAreaExample,
        },
        [fastComponentSchemas[fastTextFieldTag].$id]: {
            displayName: fastComponentSchemas[fastTextFieldTag].title,
            schema: fastComponentSchemas[fastTextFieldTag],
            example: fastTextFieldExample,
        },
    },
};
