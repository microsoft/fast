import { get, omit } from "lodash-es";
import { MenuItem } from "@microsoft/fast-tooling-react";
import { createBrowserHistory } from "history";
import { reactComponentSchemaDictionary } from "@microsoft/site-utilities";
import { SchemaDictionary } from "@microsoft/fast-tooling";
import { designSystemSchema } from "@microsoft/fast-components-styles-msft";
import { glyphSchema } from "./components/glyph";
import textSchema from "./msft-component-helpers/text.schema";

const schemaDictionary: SchemaDictionary = {
    ...reactComponentSchemaDictionary,
    [designSystemSchema.id]: designSystemSchema,
    [glyphSchema.id]: glyphSchema,
    [textSchema.id]: textSchema,
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
