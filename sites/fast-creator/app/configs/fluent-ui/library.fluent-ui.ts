import { fluentUIComponentSchemas } from "@microsoft/site-utilities";
import { WebComponentLibraryDefinition } from "../typings";
import {
    fluentAnchorExample,
    fluentBadgeExample,
    fluentButtonExample,
    fluentCardExample,
    fluentCheckboxExample,
    fluentDialogExample,
    fluentDividerExample,
    fluentFlipperExample,
    fluentMenuExample,
    fluentMenuItemExample,
    fluentProgressExample,
    fluentProgressRingExample,
    fluentRadioExample,
    fluentRadioGroupExample,
    fluentSliderExample,
    fluentSliderLabelExample,
    fluentSwitchExample,
    fluentTabExample,
    fluentTabPanelExample,
    fluentTabsExample,
    fluentTextAreaExample,
    fluentTextFieldExample,
} from "./library.fluent-ui.examples";
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
import { registerFluentUIComponents } from "./library.fluent-ui.registry";
export const fluentUIComponentId = "fluent-ui-components";

export const fluentUIComponentLibrary: WebComponentLibraryDefinition = {
    id: fluentUIComponentId,
    displayName: "Fluent UI Components",
    optional: true,
    import: async () => {
        await import("./library.fluent-ui.import");
    },
    register: registerFluentUIComponents,
    componentDictionary: {
        [fluentUIComponentSchemas[fluentAnchorTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentAnchorTag].title,
            schema: fluentUIComponentSchemas[fluentAnchorTag],
            example: fluentAnchorExample,
        },
        [fluentUIComponentSchemas[fluentButtonTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentButtonTag].title,
            schema: fluentUIComponentSchemas[fluentButtonTag],
            example: fluentButtonExample,
        },
        [fluentUIComponentSchemas[fluentBadgeTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentBadgeTag].title,
            schema: fluentUIComponentSchemas[fluentBadgeTag],
            example: fluentBadgeExample,
        },
        [fluentUIComponentSchemas[fluentCardTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentCardTag].title,
            schema: fluentUIComponentSchemas[fluentCardTag],
            example: fluentCardExample,
        },
        [fluentUIComponentSchemas[fluentCheckboxTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentCheckboxTag].title,
            schema: fluentUIComponentSchemas[fluentCheckboxTag],
            example: fluentCheckboxExample,
        },
        [fluentUIComponentSchemas[fluentDialogTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentDialogTag].title,
            schema: fluentUIComponentSchemas[fluentDialogTag],
            example: fluentDialogExample,
        },
        [fluentUIComponentSchemas[fluentDividerTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentDividerTag].title,
            schema: fluentUIComponentSchemas[fluentDividerTag],
            example: fluentDividerExample,
        },
        [fluentUIComponentSchemas[fluentFlipperTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentFlipperTag].title,
            schema: fluentUIComponentSchemas[fluentFlipperTag],
            example: fluentFlipperExample,
        },
        [fluentUIComponentSchemas[fluentMenuTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentMenuTag].title,
            schema: fluentUIComponentSchemas[fluentMenuTag],
            example: fluentMenuExample,
        },
        [fluentUIComponentSchemas[fluentMenuItemTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentMenuItemTag].title,
            schema: fluentUIComponentSchemas[fluentMenuItemTag],
            example: fluentMenuItemExample,
        },
        [fluentUIComponentSchemas[fluentProgressTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentProgressTag].title,
            schema: fluentUIComponentSchemas[fluentProgressTag],
            example: fluentProgressExample,
        },
        [fluentUIComponentSchemas[fluentProgressRingTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentProgressRingTag].title,
            schema: fluentUIComponentSchemas[fluentProgressRingTag],
            example: fluentProgressRingExample,
        },
        [fluentUIComponentSchemas[fluentRadioGroupTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentRadioGroupTag].title,
            schema: fluentUIComponentSchemas[fluentRadioGroupTag],
            example: fluentRadioGroupExample,
        },
        [fluentUIComponentSchemas[fluentRadioTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentRadioTag].title,
            schema: fluentUIComponentSchemas[fluentRadioTag],
            example: fluentRadioExample,
        },
        [fluentUIComponentSchemas[fluentSliderTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentSliderTag].title,
            schema: fluentUIComponentSchemas[fluentSliderTag],
            example: fluentSliderExample,
        },
        [fluentUIComponentSchemas[fluentSliderLabelTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentSliderLabelTag].title,
            schema: fluentUIComponentSchemas[fluentSliderLabelTag],
            example: fluentSliderLabelExample,
        },
        [fluentUIComponentSchemas[fluentSwitchTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentSwitchTag].title,
            schema: fluentUIComponentSchemas[fluentSwitchTag],
            example: fluentSwitchExample,
        },
        [fluentUIComponentSchemas[fluentTabsTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentTabsTag].title,
            schema: fluentUIComponentSchemas[fluentTabsTag],
            example: fluentTabsExample,
        },
        [fluentUIComponentSchemas[fluentTabTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentTabTag].title,
            schema: fluentUIComponentSchemas[fluentTabTag],
            example: fluentTabExample,
        },
        [fluentUIComponentSchemas[fluentTabPanelTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentTabPanelTag].title,
            schema: fluentUIComponentSchemas[fluentTabPanelTag],
            example: fluentTabPanelExample,
        },
        [fluentUIComponentSchemas[fluentTextAreaTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentTextAreaTag].title,
            schema: fluentUIComponentSchemas[fluentTextAreaTag],
            example: fluentTextAreaExample,
        },
        [fluentUIComponentSchemas[fluentTextFieldTag].$id]: {
            displayName: fluentUIComponentSchemas[fluentTextFieldTag].title,
            schema: fluentUIComponentSchemas[fluentTextFieldTag],
            example: fluentTextFieldExample,
        },
    },
};
