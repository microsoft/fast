import { MenuItem } from "@microsoft/fast-tooling-react";
import {
    actionToggleSchema,
    actionTriggerSchema,
    autoSuggestSchema,
    autoSuggestOptionSchema,
    badgeSchema,
    breadcrumbSchema,
    buttonSchema,
    callToActionSchema,
    captionSchema,
    cardSchema,
    carouselSchema,
    checkboxSchema,
    contextMenuSchema,
    contextMenuItemSchema,
    dialogSchema,
    dividerSchema,
    flipperSchema,
    headingSchema,
    hypertextSchema,
    imageSchema,
    labelSchema,
    metatextSchema,
    numberFieldSchema,
    paragraphSchema,
    pivotSchema,
    progressSchema,
    radioSchema,
    selectSchema,
    selectOptionSchema,
    sliderSchema,
    sliderLabelSchema,
    subheadingSchema,
    textActionSchema,
    textAreaSchema,
    textFieldSchema,
    toggleSchema,
    typographySchema,
} from "@microsoft/fast-components-react-msft";

function getRouteFromSchemaId(schemaId: string): string {
    const matchedRegex: RegExpMatchArray | null = schemaId.match(/\/(?:.(?!\/))+$/);
    return Array.isArray(matchedRegex) ? matchedRegex[0] : "";
}

function generateMenu(schema: any[]): MenuItem[] {
    return [
        {
            displayName: "Components",
            items: schema.map(
                (schema: any): MenuItem => {
                    return {
                        displayName: schema.title,
                        location: getRouteFromSchemaId(schema.id),
                    };
                }
            ),
        },
    ];
}

const menu: MenuItem[] = generateMenu([
    actionToggleSchema,
    actionTriggerSchema,
    autoSuggestSchema,
    autoSuggestOptionSchema,
    badgeSchema,
    breadcrumbSchema,
    buttonSchema,
    callToActionSchema,
    captionSchema,
    cardSchema,
    carouselSchema,
    checkboxSchema,
    contextMenuSchema,
    contextMenuItemSchema,
    dialogSchema,
    dividerSchema,
    flipperSchema,
    headingSchema,
    hypertextSchema,
    imageSchema,
    labelSchema,
    metatextSchema,
    numberFieldSchema,
    paragraphSchema,
    pivotSchema,
    progressSchema,
    radioSchema,
    selectSchema,
    selectOptionSchema,
    sliderSchema,
    sliderLabelSchema,
    subheadingSchema,
    textActionSchema,
    textAreaSchema,
    textFieldSchema,
    toggleSchema,
    typographySchema,
]);

export { menu };
