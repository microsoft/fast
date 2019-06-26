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
import { createBrowserHistory } from "history";

const schemas: any[] = [
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
];

function getRouteFromSchemaId(schemaId: string): string {
    const matchedRegex: RegExpMatchArray | null = schemaId.match(/\/(?:.(?!\/))+$/);
    return Array.isArray(matchedRegex) ? `/components${matchedRegex[0]}` : "";
}

function generateMenu(schemas: any[]): MenuItem[] {
    return [
        {
            displayName: "Components",
            items: schemas.map(
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

const history = createBrowserHistory();
const menu: MenuItem[] = generateMenu(schemas);

export { history, menu };
