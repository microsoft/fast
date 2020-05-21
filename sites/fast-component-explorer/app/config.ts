import { get, omit } from "lodash-es";
import { MenuItem } from "@microsoft/fast-tooling-react";
import { createBrowserHistory } from "history";
import { SchemaDictionary } from "@microsoft/fast-tooling";
import textSchema from "./utilities/text.schema";
import { webComponentSchemas } from "./fast-components";
import { labelSchema, imageSchema } from "./utilities";
import { fastMenuItemId } from "./fast-components/configs/fast-menu";
import { fastSliderLabelId } from "./fast-components/configs/fast-slider";
import { fastTabId, fastTabPanelId } from "./fast-components/configs/fast-tabs";

const schemaDictionary: SchemaDictionary = {
    ...webComponentSchemas,
    [labelSchema.id]: labelSchema,
    [imageSchema.id]: imageSchema,
    [textSchema.id]: textSchema,
};

const history: any = createBrowserHistory();
/* eslint-disable @typescript-eslint/no-use-before-define */
const menu: MenuItem[] = generateMenu(
    omit(schemaDictionary, [
        textSchema.id,
        imageSchema.id,
        labelSchema.id,
        fastMenuItemId,
        fastSliderLabelId,
        fastTabId,
        fastTabPanelId,
        "fast-design-system-provider",
    ])
);
/* eslint-enable @typescript-eslint/no-use-before-define */
const initialComponentRoute: string = get(menu, "[0].location", "");

function generateMenu(componentSchemas: SchemaDictionary): MenuItem[] {
    return [
        ...Object.entries(componentSchemas).map(
            ([id]: [string, any]): MenuItem => {
                return {
                    displayName: componentSchemas[id].mapsToTagName,
                    location: `/components/${id}`,
                };
            }
        ),
    ];
}

export { history, initialComponentRoute, menu, schemaDictionary };
