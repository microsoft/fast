import { get, omit } from "lodash-es";
import { MenuItem } from "@microsoft/fast-tooling-react";
import { createBrowserHistory } from "history";
import {
    accentButtonSchema2,
    actionToggleSchema2,
    actionTriggerSchema2,
    autoSuggestOptionSchema2,
    autoSuggestSchema2,
    badgeSchema2,
    breadcrumbSchema2,
    buttonSchema2,
    callToActionSchema2,
    captionSchema2,
    cardSchema2,
    carouselSchema2,
    checkboxSchema2,
    contextMenuItemSchema2,
    contextMenuSchema2,
    dialogSchema2,
    dividerSchema,
    flipperSchema2,
    headingSchema2,
    hypertextSchema2,
    imageSchema,
    labelSchema2,
    lightweightButtonSchema2,
    metatextSchema2,
    neutralButtonSchema2,
    outlineButtonSchema2,
    paragraphSchema2,
    pivotSchema2,
    progressSchema2,
    radioSchema2,
    selectOptionSchema2,
    selectSchema2,
    sliderLabelSchema2,
    sliderSchema2,
    stealthButtonSchema2,
    subheadingSchema2,
    textActionSchema2,
    textAreaSchema,
    textFieldSchema,
    toggleSchema2,
    treeViewItemSchema2,
    treeViewSchema2,
    typographySchema2,
} from "@microsoft/fast-components-react-msft";
import { SchemaDictionary } from "@microsoft/fast-tooling";
import { designSystemSchema } from "@microsoft/fast-components-styles-msft";
import { glyphSchema } from "./components/glyph";
import textSchema from "./msft-component-helpers/text.schema";

const schemaDictionary: SchemaDictionary = {
    [accentButtonSchema2.id]: accentButtonSchema2,
    [actionToggleSchema2.id]: actionToggleSchema2,
    [actionTriggerSchema2.id]: actionTriggerSchema2,
    [autoSuggestOptionSchema2.id]: autoSuggestOptionSchema2,
    [autoSuggestSchema2.id]: autoSuggestSchema2,
    [badgeSchema2.id]: badgeSchema2,
    [breadcrumbSchema2.id]: breadcrumbSchema2,
    [buttonSchema2.id]: buttonSchema2,
    [callToActionSchema2.id]: callToActionSchema2,
    [captionSchema2.id]: captionSchema2,
    [cardSchema2.id]: cardSchema2,
    [carouselSchema2.id]: carouselSchema2,
    [checkboxSchema2.id]: checkboxSchema2,
    [contextMenuItemSchema2.id]: contextMenuItemSchema2,
    [contextMenuSchema2.id]: contextMenuSchema2,
    [designSystemSchema.id]: designSystemSchema,
    [dialogSchema2.id]: dialogSchema2,
    [dividerSchema.id]: dividerSchema,
    [flipperSchema2.id]: flipperSchema2,
    [glyphSchema.id]: glyphSchema,
    [headingSchema2.id]: headingSchema2,
    [hypertextSchema2.id]: hypertextSchema2,
    [imageSchema.id]: imageSchema,
    [labelSchema2.id]: labelSchema2,
    [lightweightButtonSchema2.id]: lightweightButtonSchema2,
    [metatextSchema2.id]: metatextSchema2,
    [neutralButtonSchema2.id]: neutralButtonSchema2,
    [outlineButtonSchema2.id]: outlineButtonSchema2,
    [paragraphSchema2.id]: paragraphSchema2,
    [pivotSchema2.id]: pivotSchema2,
    [progressSchema2.id]: progressSchema2,
    [radioSchema2.id]: radioSchema2,
    [selectOptionSchema2.id]: selectOptionSchema2,
    [selectSchema2.id]: selectSchema2,
    [sliderLabelSchema2.id]: sliderLabelSchema2,
    [sliderSchema2.id]: sliderSchema2,
    [stealthButtonSchema2.id]: stealthButtonSchema2,
    [subheadingSchema2.id]: subheadingSchema2,
    [textSchema.id]: textSchema,
    [textActionSchema2.id]: textActionSchema2,
    [textAreaSchema.id]: textAreaSchema,
    [textFieldSchema.id]: textFieldSchema,
    [toggleSchema2.id]: toggleSchema2,
    [treeViewItemSchema2.id]: treeViewItemSchema2,
    [treeViewSchema2.id]: treeViewSchema2,
    [typographySchema2.id]: typographySchema2,
};

const history: any = createBrowserHistory();
/* eslint-disable @typescript-eslint/no-use-before-define */
const menu: MenuItem[] = generateMenu(
    omit(schemaDictionary, [textSchema.id, glyphSchema.id, designSystemSchema.id])
);
/* eslint-enable @typescript-eslint/no-use-before-define */
const initialComponentRoute: string = get(menu, "[0].location", "");

function getRouteFromSchemaId(schemaId: string): string {
    const matchedRegex: RegExpMatchArray | null = schemaId.match(/\/(?:.(?!\/))+$/);
    return Array.isArray(matchedRegex) ? `/components${matchedRegex[0]}` : "";
}

function generateMenu(componentSchemas: SchemaDictionary): MenuItem[] {
    return [
        ...Object.entries(componentSchemas).map(
            ([id]: [string, any]): MenuItem => {
                return {
                    displayName: componentSchemas[id].title,
                    location: getRouteFromSchemaId(id),
                };
            }
        ),
    ];
}

export { history, initialComponentRoute, menu, schemaDictionary };
