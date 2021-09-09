import { fluentUIComponentExtendedSchemas } from "@microsoft/site-utilities";
import { WebComponentDefinition, WebComponentLibraryDefinition } from "../typings";
import {
    fluentAnchorExample,
    fluentBadgeExample,
    fluentButtonExample,
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
export const fluentUIComponentId = "fluent-ui-components";

export const fluentUIComponentLibrary: WebComponentLibraryDefinition = {
    id: fluentUIComponentId,
    displayName: "Fluent UI Components",
    optional: true,
    import: async () => {
        await import("./library.fluent-ui.import");
    },
    register: async () => {
        (await import("./library.fluent-ui.registry")).registerFluentUIComponents();
    },
    componentDictionary: {
        ...Object.values(fluentUIComponentExtendedSchemas as { [key: string]: any })
            .map(
                (schema: any): WebComponentDefinition => {
                    return {
                        displayName: schema.title,
                        schema,
                        example: {
                            schemaId: schema.$id,
                            data: {},
                        },
                    };
                }
            )
            .reduce(
                (
                    accum: { [key: string]: any },
                    elementDefinition: WebComponentDefinition
                ): { [key: string]: any } => {
                    return {
                        ...accum,
                        [elementDefinition.example.schemaId]: elementDefinition,
                    };
                },
                {}
            ),
        [fluentUIComponentExtendedSchemas[fluentAnchorTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentAnchorTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentAnchorTag],
            example: fluentAnchorExample,
        },
        [fluentUIComponentExtendedSchemas[fluentButtonTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentButtonTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentButtonTag],
            example: fluentButtonExample,
        },
        [fluentUIComponentExtendedSchemas[fluentBadgeTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentBadgeTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentBadgeTag],
            example: fluentBadgeExample,
        },
        [fluentUIComponentExtendedSchemas[fluentCheckboxTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentCheckboxTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentCheckboxTag],
            example: fluentCheckboxExample,
        },
        [fluentUIComponentExtendedSchemas[fluentDialogTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentDialogTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentDialogTag],
            example: fluentDialogExample,
        },
        [fluentUIComponentExtendedSchemas[fluentDividerTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentDividerTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentDividerTag],
            example: fluentDividerExample,
        },
        [fluentUIComponentExtendedSchemas[fluentFlipperTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentFlipperTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentFlipperTag],
            example: fluentFlipperExample,
        },
        [fluentUIComponentExtendedSchemas[fluentMenuTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentMenuTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentMenuTag],
            example: fluentMenuExample,
        },
        [fluentUIComponentExtendedSchemas[fluentMenuItemTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentMenuItemTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentMenuItemTag],
            example: fluentMenuItemExample,
        },
        [fluentUIComponentExtendedSchemas[fluentProgressTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentProgressTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentProgressTag],
            example: fluentProgressExample,
        },
        [fluentUIComponentExtendedSchemas[fluentProgressRingTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentProgressRingTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentProgressRingTag],
            example: fluentProgressRingExample,
        },
        [fluentUIComponentExtendedSchemas[fluentRadioGroupTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentRadioGroupTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentRadioGroupTag],
            example: fluentRadioGroupExample,
        },
        [fluentUIComponentExtendedSchemas[fluentRadioTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentRadioTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentRadioTag],
            example: fluentRadioExample,
        },
        [fluentUIComponentExtendedSchemas[fluentSliderTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentSliderTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentSliderTag],
            example: fluentSliderExample,
        },
        [fluentUIComponentExtendedSchemas[fluentSliderLabelTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentSliderLabelTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentSliderLabelTag],
            example: fluentSliderLabelExample,
        },
        [fluentUIComponentExtendedSchemas[fluentSwitchTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentSwitchTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentSwitchTag],
            example: fluentSwitchExample,
        },
        [fluentUIComponentExtendedSchemas[fluentTabsTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentTabsTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentTabsTag],
            example: fluentTabsExample,
        },
        [fluentUIComponentExtendedSchemas[fluentTabTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentTabTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentTabTag],
            example: fluentTabExample,
        },
        [fluentUIComponentExtendedSchemas[fluentTabPanelTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentTabPanelTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentTabPanelTag],
            example: fluentTabPanelExample,
        },
        [fluentUIComponentExtendedSchemas[fluentTextAreaTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentTextAreaTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentTextAreaTag],
            example: fluentTextAreaExample,
        },
        [fluentUIComponentExtendedSchemas[fluentTextFieldTag].$id]: {
            displayName: fluentUIComponentExtendedSchemas[fluentTextFieldTag].title,
            schema: fluentUIComponentExtendedSchemas[fluentTextFieldTag],
            example: fluentTextFieldExample,
        },
    },
};
