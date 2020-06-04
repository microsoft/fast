import { get, omit } from "lodash-es";
import { MenuItem } from "@microsoft/fast-tooling-react";
import { createBrowserHistory } from "history";
import { SchemaDictionary } from "@microsoft/fast-tooling";
import { fastComponentSchemas, nativeElementSchemas } from "@microsoft/site-utilities";
import textSchema from "./utilities/text.schema";
import { fastMenuItemId } from "./fast-components/configs/fast-menu";
import { fastSliderLabelId } from "./fast-components/configs/fast-slider";
import { fastTabId, fastTabPanelId } from "./fast-components/configs/fast-tabs";

const schemaDictionary: SchemaDictionary = {
    ...fastComponentSchemas,
    ...nativeElementSchemas,
    [textSchema.id]: textSchema,
};

console.log("nativeElementSchemas", nativeElementSchemas);

const history: any = createBrowserHistory();
/* eslint-disable @typescript-eslint/no-use-before-define */
const menu: MenuItem[] = generateMenu(
    omit(schemaDictionary, [
        textSchema.id,
        fastMenuItemId,
        fastSliderLabelId,
        fastTabId,
        fastTabPanelId,
        ...Object.entries(nativeElementSchemas).map(
            ([, nativeElementSchema]: [string, any]) => {
                return nativeElementSchema.id;
            }
        ),
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
                    displayName: componentSchemas[id].title,
                    location: `/components/${id}`,
                };
            }
        ),
    ];
}

export { history, initialComponentRoute, menu, schemaDictionary };
