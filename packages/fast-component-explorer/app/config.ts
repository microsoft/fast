import { get } from "lodash-es";
import { MenuItem } from "@microsoft/fast-tooling-react";
import { FormChildOptionItem } from "@microsoft/fast-tooling-react/dist/form/types";
import { pascalCase } from "@microsoft/fast-web-utilities";
import { createBrowserHistory } from "history";
import * as testComponentViewConfigs from "./components";
import * as componentViewConfigs from "./utilities/configs";

const schemas: any[] = Object.keys(componentViewConfigs).map(
    (componentViewConfigKey: string) =>
        componentViewConfigs[componentViewConfigKey].schema
);
const history: any = createBrowserHistory();
/* eslint-disable @typescript-eslint/no-use-before-define */
const menu: MenuItem[] = generateMenu(schemas);
const childOptions: FormChildOptionItem[] = getComponentChildrenOptions().concat(
    getTestComponentChildrenOptions()
);
/* eslint-enable @typescript-eslint/no-use-before-define */
const initialComponentRoute: string = get(menu, "[0].location", "");

function getRouteFromSchemaId(schemaId: string): string {
    const matchedRegex: RegExpMatchArray | null = schemaId.match(/\/(?:.(?!\/))+$/);
    return Array.isArray(matchedRegex) ? `/components${matchedRegex[0]}` : "";
}

function generateMenu(componentSchemas: any[]): MenuItem[] {
    return [
        ...componentSchemas.map(
            (schema: any): MenuItem => {
                return {
                    displayName: schema.title,
                    location: getRouteFromSchemaId(schema.id),
                };
            }
        ),
    ];
}

function getComponentChildrenOptions(): FormChildOptionItem[] {
    return Object.keys(componentViewConfigs).map(
        (componentViewKey: string): FormChildOptionItem => {
            return {
                name: pascalCase(componentViewConfigs[componentViewKey].schema.title),
                component: componentViewConfigs[componentViewKey].component,
                schema: componentViewConfigs[componentViewKey].schema,
            };
        }
    );
}

function getTestComponentChildrenOptions(): FormChildOptionItem[] {
    return Object.keys(testComponentViewConfigs).map(
        (testComponentViewKey: string): FormChildOptionItem => {
            return {
                name: pascalCase(
                    testComponentViewConfigs[testComponentViewKey].schema.title
                ),
                component: testComponentViewConfigs[testComponentViewKey].component,
                schema: testComponentViewConfigs[testComponentViewKey].schema,
            };
        }
    );
}

export { childOptions, history, initialComponentRoute, menu };
